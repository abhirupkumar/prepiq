import { Storage } from '@google-cloud/storage';
import { SpeechClient, protos } from '@google-cloud/speech'
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import { AssemblyAI } from 'assemblyai';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {

    try {
        const { audioBlob, fileName } = await req.json();

        if (!audioBlob || !fileName) {
            return NextResponse.json({ success: false, error: 'Missing audio file' }, { status: 401 })
        }

        const supabase = createClient();

        const { data: storageData, error: storageError } = await supabase
            .storage.from('audio-files')
            .upload(fileName, audioBlob, {
                contentType: 'audio/mpeg',
                upsert: true,
            });
        console.log("File Uploaded!");

        if (storageError) {
            console.log("Error uploading file: ", storageError);
            return NextResponse.json({ success: false, error: 'Error uploading file' }, { status: 400 })
        }

        // Transcribe the audio file

        const { data: audioData } = supabase
            .storage
            .from('audio-files')
            .getPublicUrl(fileName, {
                download: true,
            })
        console.log(audioData);

        // const client = new AssemblyAI({
        //     apiKey: '15ac67dad483476386ad74457f2674b3',
        // });
        // console.log("Transcribing...");

        // const data = {
        //     audio_url: "https://pnthwcyarzebpdfikfwj.supabase.co/storage/v1/object/sign/audio-files/1721017576878_audio.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdWRpby1maWxlcy8xNzIxMDE3NTc2ODc4X2F1ZGlvLm1wMyIsImlhdCI6MTcyMTAxODY3MywiZXhwIjoxNzIxNjIzNDczfQ.hCPvQBkMU8644XzXkrng6a1KQvyBGoDh2kPjMLVxfOA&t=2024-07-15T04%3A44%3A33.707Z"
        // }

        // const transcript = await client.transcripts.transcribe(data);
        // console.log(transcript.text);

        // if (transcript.status === 'error') {
        //     console.log("Error: ", transcript.error);
        //     return NextResponse.json({ success: false, error: transcript.error }, { status: 400 })
        // }

        // await file.delete();
        // console.log("Deleting File...")
        return NextResponse.json({ success: true, transcription: "", message: 'File uploaded successfully' }, { status: 200 });

        // console.log("Result: ", transcript);
        // return NextResponse.json({ success: true, transcription: transcript.text }, { status: 200 });
    } catch (error) {
        console.log('Error transcribing audio:', error)
        return NextResponse.json({ success: false, error: 'Error transcribing audio' }, { status: 400 })
    }
}