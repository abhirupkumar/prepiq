import { Storage } from '@google-cloud/storage';
import { SpeechClient, protos } from '@google-cloud/speech'
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';

export async function POST(req: NextRequest) {

    try {
        // const { audioBlob, fileName } = await req.json();

        // if (!audioBlob || !fileName) {
        //     return NextResponse.json({ success: false, error: 'Missing audio file' }, { status: 401 })
        // }

        // const storage = new Storage({
        //     credentials: {
        //         client_email: process.env.GOOGLE_CLIENT_EMAIL,
        //         private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        //     },
        //     projectId: process.env.GOOGLE_PROJECT_ID,
        // })


        // const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET!);

        // const buffer = Buffer.from(audioBlob, 'base64');

        // const file = bucket.file(fileName);
        // await file.save(buffer, {
        //     contentType: 'audio/pcm',
        // });
        // console.log("File Uploaded!");

        // const audioUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/audio-files/${fileName}`;
        const fileName = "1720966379651_audio.pcm";

        // Transcribe the audio file
        console.log("Transcribing...");

        const speechClient = new SpeechClient({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            projectId: process.env.GOOGLE_PROJECT_ID,
        });

        const [operation]: any = await speechClient.longRunningRecognize({
            audio: {
                uri: `gs://${process.env.GOOGLE_STORAGE_BUCKET!}/${fileName}`
            },
            config: {
                encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
                sampleRateHertz: 8000,
                languageCode: 'en-US',
                enableAutomaticPunctuation: true,
            },
        });
        console.log(`Transcription Completed. Url: gs://${process.env.GOOGLE_STORAGE_BUCKET!}/${fileName}`);

        const [response]: any = await operation.promise();

        const transcription = response.results
            .map((result: any) => result.alternatives[0].transcript)
            .join('\n');

        // await file.delete();
        // console.log("Deleting File...")

        console.log("Transcribed Text: ", transcription);
        return NextResponse.json({ success: true, transcription: transcription, operation, response }, { status: 200 });
    } catch (error) {
        console.log('Error transcribing audio:', error)
        return NextResponse.json({ success: false, error: 'Error transcribing audio' }, { status: 400 })
    }
}