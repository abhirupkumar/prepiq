import { model } from '@/lib/gemini';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;
export const revalidate = 0;

export async function POST(request: NextRequest) {
    const { noOfQuestions, jobId } = await request.json();
    const supabase = createClient();
    const { data, error } = await supabase
        .from('jobs')
        .select('desc, resume_text, company_name, company_desc, status')
        .eq('id', jobId)
    if (error) {
        console.log("Some error occured: ", error)
        return NextResponse.error();
    }
    const job = data[0];

    const Question = `
    Ask Questions based on the job description and also about the work or project or experience or achievement he has mentioned in his resume.
    Follow the format of output of the following example and write nothing extra.
    For example:
    [
        {
            question: "..."
        },
        ...
    ]
    `

    const prompt = `
    You are a professional interviewer ${job.company_name != "" ? ("of " + job.company_name) : ""}.
    ${job.company_desc == "" ? "" : `
        Company Description: 

        ${job.company_desc}

        `
        }
    Please generate top ${noOfQuestions} different interview questions which might come in the interview for a candidate applying for the position described in the following job description:

    ${job.desc}

    The candidate's resume is:

    ${job.resume_text}

    ${Question}
    `
    const res: any = await model.invoke(prompt);

    const questions = JSON.parse(res.content);
    const questionWithId = questions.map((question: any, index: number) => {
        return { ...question, job_id: jobId }
    });

    const response = await supabase
        .from('questions')
        .insert(questionWithId)
    await supabase.from('jobs').update({ status: true }).eq('id', jobId);

    return NextResponse.json({ success: true, questionWithId, response }, { status: 200 });
}