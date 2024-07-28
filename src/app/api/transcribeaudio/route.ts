import { NextRequest, NextResponse } from 'next/server';
import { AssemblyAI } from 'assemblyai';
import { createClient } from '@/utils/supabase/server';
import axios from 'axios';
import { Storage } from '@google-cloud/storage';

export const maxDuration = 60;

export async function POST(req: NextRequest) {

    try {
        const formData = await req.formData();
        const audioBlob = formData.get('audioBlob') as Blob;
        const interviewId = formData.get('interview_id');
        const questionId = formData.get('question_id');
        console.log(questionId)
        if (!audioBlob) {
            return NextResponse.json({ success: false, error: 'Missing audio file' }, { status: 401 })
        }

        const supabase = createClient();

        const client = new AssemblyAI({
            apiKey: process.env.ASSEMBLYAI_API_KEY!,
        });

        // const arrayBuffer = await audioBlob.arrayBuffer();
        // const audioFileData = new Uint8Array(arrayBuffer);
        // const uploadResponse = await axios.post(`https://api.assemblyai.com/v2/upload`, audioFileData, {
        //     "headers": {
        //         "authorization": process.env.ASSEMBLYAI_API_KEY!,
        //         'Content-Type': 'application/octet-stream',
        //     },
        // })
        // const uploadUrl = uploadResponse.data.upload_url

        const storage = new Storage({
            projectId: process.env.GOOGLE_PROJECT_ID!,
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL!,
                private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
            }
        });

        const fileName = `${Date.now()}_audio.mp3`;

        const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET!);
        const file = bucket.file(fileName);

        await file.save(Buffer.from(await audioBlob.arrayBuffer()), {
            contentType: 'audio/mpeg',
        });

        client.transcripts.submit({
            audio: `https://storage.googleapis.com/prepiq_bucket_1/${fileName}`,
            webhook_url: `${process.env.NEXT_PUBLIC_HOST}/webhook/speechtotext?interview_id=${interviewId}&question_id=${questionId}`,
            webhook_auth_header_name: "Prepiq-Assembly-Webhook-Secret",
            webhook_auth_header_value: process.env.ASSEMBLYAI_WEBHOOK_SECRET!
        })
        // const data = {
        //     // audio_url: uploadUrl
        // }
        // const transcript = await client.transcripts.transcribe(data);
        // await supabase.from('interview_questions').update({ submitted_answer: transcript.text }).eq('id', questionId).eq('interview_id', interviewId);
        return NextResponse.json({ success: true, message: 'File uploaded successfully' }, { status: 200 });
    } catch (error) {
        console.log('Error transcribing audio:', error)
        return NextResponse.json({ success: false, error: 'Error transcribing audio' }, { status: 400 })
    }
}