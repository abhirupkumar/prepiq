import { NextRequest, NextResponse } from 'next/server';
import { AssemblyAI } from 'assemblyai';
import { createClient } from '@/utils/supabase/server';
import { Storage } from '@google-cloud/storage';

export async function POST(req: NextRequest) {

    try {
        const formData = await req.formData();
        const audioBlob = formData.get('audioBlob') as Blob;

        if (!audioBlob) {
            return NextResponse.json({ success: false, error: 'Missing audio file' }, { status: 401 })
        }

        const fileName = `${Date.now()}_audio.mp3`;

        const supabase = createClient();


        const storage = new Storage({
            projectId: process.env.GOOGLE_PROJECT_ID!,
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL!,
                private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
            }
        });

        const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET!);
        const file = bucket.file(fileName);

        await file.save(Buffer.from(await audioBlob.arrayBuffer()), {
            contentType: 'audio/mpeg',
        });

        // const { data: storageData, error: storageError } = await supabase
        //     .storage.from('audio-files')
        //     .upload(fileName, audioBlob, {
        //         contentType: 'audio/mpeg',
        //     });
        console.log("File Uploaded!");

        // if (storageError) {
        //     console.log("Error uploading file: ", storageError);
        //     return NextResponse.json({ success: false, error: 'Error uploading file' }, { status: 400 })
        // }

        // Transcribe the audio file

        const client = new AssemblyAI({
            apiKey: process.env.ASSEMBLYAI_API_KEY!,
        });
        console.log("Transcribing...");

        // const data = {
        //     audio_url: `https://storage.googleapis.com/prepiq_bucket_1/1721403875846_audio.mp3`
        // }

        const data = {
            audio_url: `https://storage.googleapis.com/prepiq_bucket_1/${fileName}`
        }

        const transcript = await client.transcripts.transcribe(data);
        console.log(transcript.text);

        if (transcript.status === 'error') {
            console.log("Error: ", transcript.error);
            return NextResponse.json({ success: false, error: transcript.error }, { status: 400 })
        }

        await file.delete()
        // await supabase.storage.from('audio-files').remove([fileName]);
        console.log("Deleting File...")

        return NextResponse.json({ success: true, transcription: transcript.text, message: 'File uploaded successfully' }, { status: 200 });
    } catch (error) {
        console.log('Error transcribing audio:', error)
        return NextResponse.json({ success: false, error: 'Error transcribing audio' }, { status: 400 })
    }
}