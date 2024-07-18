import { NextRequest, NextResponse } from 'next/server';
import { AssemblyAI } from 'assemblyai';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {

    try {
        const formData = await req.formData();
        const audioBlob = formData.get('audioBlob') as Blob;

        if (!audioBlob) {
            return NextResponse.json({ success: false, error: 'Missing audio file' }, { status: 401 })
        }

        const fileName = `${Date.now()}_audio.mp3`;

        const supabase = createClient();

        const { data: storageData, error: storageError } = await supabase
            .storage.from('audio-files')
            .upload(fileName, audioBlob, {
                contentType: 'audio/mpeg',
            });
        console.log("File Uploaded!");

        if (storageError) {
            console.log("Error uploading file: ", storageError);
            return NextResponse.json({ success: false, error: 'Error uploading file' }, { status: 400 })
        }

        // Transcribe the audio file

        const client = new AssemblyAI({
            apiKey: process.env.ASSEMBLYAI_API_KEY!,
        });
        console.log("Transcribing...");

        const data = {
            audio_url: `https://pnthwcyarzebpdfikfwj.supabase.co/storage/v1/object/public/audio-files/${fileName}`
        }

        // const data = {
        //     audio_url: `https://pnthwcyarzebpdfikfwj.supabase.co/storage/v1/object/public/audio-files/1721017576878_audio.mp3`
        // }

        const transcript = await client.transcripts.transcribe(data);
        console.log(transcript.text);

        if (transcript.status === 'error') {
            console.log("Error: ", transcript.error);
            return NextResponse.json({ success: false, error: transcript.error }, { status: 400 })
        }

        await supabase.storage.from('audio-files').remove([fileName]);
        console.log("Deleting File...")

        return NextResponse.json({ success: true, transcription: transcript.text, message: 'File uploaded successfully' }, { status: 200 });

        // console.log("Result: ", transcript);
        // return NextResponse.json({ success: true, transcription: transcript.text }, { status: 200 });
    } catch (error) {
        console.log('Error transcribing audio:', error)
        return NextResponse.json({ success: false, error: 'Error transcribing audio' }, { status: 400 })
    }
}