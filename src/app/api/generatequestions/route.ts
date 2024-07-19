import { getCurrentUser } from '@/lib/auth-actions';
import { model } from '@/lib/gemini';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;
export const revalidate = 0;

export async function POST(request: NextRequest) {
    const { jobId } = await request.json();
    const supabase = createClient();
    const { user, isAuth } = await getCurrentUser();
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
    if (!isAuth) return NextResponse.json({ success: false, error: "User not authenticated." }, { status: 405 });
    if (user.credits <= 0) return NextResponse.json({ success: false, error: "Need more Credits.", submessage: "1 credit for each 10 questions." }, { status: 405 });
    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    const job = data[0];

    const { data: prevQuestions, error: prevQuestionsError } = await supabase.from('questions').select('question').eq('job_id', jobId);

    if (prevQuestionsError) {
        return NextResponse.json({ success: false, error: prevQuestionsError.message }, { status: 401 });
    }

    const prevQuestionsText = prevQuestions.length > 0 ? prevQuestions.map((question: any) => question.question).join("\n\n") : "";

    const Question = `
    Ask Questions based on the job description and also about the work or project or experience or achievement he has mentioned in his resume.If required search on the internet about different questions asked for the above mentioned job description.
    ${prevQuestions.length > 0 && prevQuestionsText != "" && `
    Previously Asked Questions: 

    ${prevQuestionsText}`}
     ${prevQuestions.length > 0 && prevQuestionsText != "" && `Also, do not ask the above previous questions as they have already been asked in the previous round of interview`}
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
    Please generate top 10 different interview questions which might come in the interview for a candidate applying for the position described in the following job description:

    ${job.desc}

    The candidate's resume is:

    ${job.resume_text}

    ${Question}
    `

    const { data: userData, error: userError } = await supabase.from('profiles').update({ 'credits': user.credits - 1 }).eq('id', user.id).select();
    if (userError) {
        return NextResponse.json({ success: false, error: "Some error occured!" }, { status: 406 });
    }

    const res: any = await model.invoke(prompt);

    const questions = JSON.parse(res.content);
    const created_at = new Date();
    const questionWithId = questions.map((question: any, index: number) => {
        return { ...question, job_id: jobId, created_at: created_at }
    });

    const response = await supabase
        .from('questions')
        .insert(questionWithId)

    if (response.error) {
        return NextResponse.json({ success: false, error: response.error.message }, { status: 402 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
}