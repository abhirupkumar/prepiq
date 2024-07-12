import { Storage } from '@google-cloud/storage';
import { SpeechClient, protos } from '@google-cloud/speech'
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB chunks

async function* streamToAsyncIterable(stream: Readable) {
    for await (const chunk of stream) {
        yield chunk;
    }
}

export async function POST(req: NextRequest) {

    try {
        const formData: FormData = await req.formData();
        const audioFile = formData.get('audio') as File;

        if (!audioFile) {
            return NextResponse.json({ success: false, error: 'Missing audio file' }, { status: 401 })
        }
        const storage = new Storage({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            projectId: process.env.GOOGLE_PROJECT_ID,
        });

        const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);
        const speechClient = new SpeechClient({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            projectId: process.env.GOOGLE_PROJECT_ID,
        });

        const fileName = `${uuidv4()}`
        const blob = bucket.file(fileName);

        const buffer: Uint8Array[] = [];
        for await (const chunk of (audioFile.stream() as any)) {
            buffer.push(chunk);
        }
        const fileBuffer = Buffer.concat(buffer);

        const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: audioFile.type || 'audio/mp3',
        });

        blobStream.on('error', (err) => {
            console.error(err);
            NextResponse.json({ error: 'Upload to GCS failed' }, { status: 500 });
        });

        blobStream.on('finish', async () => {
            const gcsUri = `gs://${process.env.GCS_BUCKET_NAME}/${fileName}`;
            const audio = { uri: gcsUri };
            const config = {
                encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.MP3,
                sampleRateHertz: 16000,
                languageCode: 'en-US',
            };

            const request = { audio, config };

            try {
                const [response]: any = await speechClient.recognize(request);
                const transcription = response.results
                    .map((result: any) => result.alternatives[0].transcript)
                    .join('\n');

                // Delete the file from the bucket after transcription
                await bucket.file(fileName).delete();
                console.log(transcription);
                NextResponse.json({ transcription }, { status: 200 });
            } catch (error) {
                console.error('ERROR:', error);
                NextResponse.json({ error: 'Transcription failed' }, { status: 500 });
            }
        });

        blobStream.end(fileBuffer);
        console.log('File uploaded to GCS')
        NextResponse.json({ error: 'Some thing happended' }, { status: 500 });
    } catch (error) {
        console.error('Error transcribing audio:', error)
        NextResponse.json({ success: false, error: 'Error transcribing audio' }, { status: 400 })
    }
}