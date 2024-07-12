import { Storage } from '@google-cloud/storage';
import { SpeechClient, protos } from '@google-cloud/speech'
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/utils/supabase/server';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB chunks

async function* streamToAsyncIterable(stream: Readable) {
    for await (const chunk of stream) {
        yield chunk;
    }
}

export async function POST(req: NextRequest) {

    try {
        const { audioBlob, fileName } = await req.json();

        if (!audioBlob || !fileName) {
            return NextResponse.json({ success: false, error: 'Missing audio file' }, { status: 401 })
        }

        const speechClient = new SpeechClient({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            projectId: process.env.GOOGLE_PROJECT_ID,
        });

        const supabase = createClient();
        const buffer = Buffer.from(audioBlob, 'base64');

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('audio-files')
            .upload(fileName, buffer, {
                contentType: 'audio/wav',
                upsert: true,
            });

        if (uploadError) {
            throw new Error(uploadError.message);
        }

        // const audioUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/audio-files/${fileName}`;

        // Transcribe the audio file
        const [response]: any = await speechClient.recognize({
            audio: {
                content: buffer
            },
            config: {
                encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
                sampleRateHertz: 16000,
                languageCode: 'en-US',
            },
        });

        const transcription = response.results
            .map((result: any) => result.alternatives[0].transcript)
            .join('\n');

        // Delete the audio file from Supabase Storage
        const { error: deleteError } = await supabase.storage
            .from('audio-files')
            .remove([fileName]);

        if (deleteError) {
            throw new Error(deleteError.message);
        }
        console.log(transcription);
        NextResponse.json({ success: true, transcription: transcription }, { status: 500 });
    } catch (error) {
        console.log('Error transcribing audio:', error)
        NextResponse.json({ success: false, error: 'Error transcribing audio' }, { status: 400 })
    }
}