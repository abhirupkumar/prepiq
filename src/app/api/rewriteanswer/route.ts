import { NextRequest, NextResponse } from 'next/server';
import { model } from '@/lib/gemini';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 60;

export async function POST(request: NextRequest) {

    const { answer, jobId, questionId, rewritePrompt } = await request.json();
    const supabase = createClient();

    const { data: job, error: error1 } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

    if (error1) {
        return NextResponse.json({ success: false, error: error1.message }, { status: 401 });
    }

    const { data: questionData, error: error2 } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single()

    if (error2) {
        return NextResponse.json({ success: false, error: error2.message }, { status: 401 });
    }

    const prompt = `
    You are a professional interviewer ${job.company_name != "" ? ("of " + job.company_name) : ""}.
    ${job.company_desc == "" ? "" : `
        Company Description: 

        ${job.company_desc}

        `
        }
    Job description:

    ${job.desc}

    The candidate's resume is:

    ${job.resume_text}

    Question you asked: 

    ${questionData.question}

    Answer given by the candidate:

    ${answer}

    Prompt about the answer given by the candidate:

    ${rewritePrompt}

    Change the answer as per the candidate's prompt.
    Format your output as a single string with proper punctuations without double quotes.
    `

    const res: any = await model.invoke(prompt);

    const newAnswer = res.content;

    return NextResponse.json({ success: true, answer: newAnswer }, { status: 200 });
}