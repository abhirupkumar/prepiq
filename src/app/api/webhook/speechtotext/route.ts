// app/api/webhook/speechtotext/route.js

import { adminClient } from '@/utils/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const interviewId = searchParams.get('interview_id');
        const questionId = searchParams.get('question_id');

        const secret = req.headers.get('Prepiq-Assembly-Webhook-Secret');

        if (secret !== process.env.ASSEMBLYAI_WEBHOOK_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { status, transcript_id } = await req.json();

        if (status == 'error') {
            return NextResponse.json({ success: false, error: 'Failed to transcribe.' }, { status: 405 })
        }

        const fetchData = await fetch(`https://api.assemblyai.com/v2/transcript/${transcript_id}`, {
            method: 'GET',
            headers: {
                'Authorization': process.env.ASSEMBLYAI_API_KEY!,
            },
        });
        const response = await fetchData.json();
        const supabase = adminClient();
        const { error } = await supabase.from('interview_questions').update({ submitted_answer: response.text }).eq('id', questionId).eq('interview_id', interviewId);
        if (error) {
            return NextResponse.json({ success: false, error: 'Unable to save the transcription.' }, { status: 407 });
        }
        return NextResponse.json({ success: true }, { status: 200 });
    }
    catch (error: any) {
        return NextResponse.json({ success: false, error: 'Some Error Occured!' }, { status: 500 });
    }
};