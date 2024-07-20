import { NextRequest, NextResponse } from 'next/server';
import { model } from '@/lib/gemini';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 60;

export async function POST(request: NextRequest) {

    const { answer, jobId, questionId, isInterview, interviewId } = await request.json();
    try {

        const supabase = createClient();

        const { data: job, error: error1 } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', jobId)
            .single();

        if (error1) {
            return NextResponse.json({ success: false, error: error1.message }, { status: 401 });
        }

        let fetchedQuestionData;
        if (isInterview)
            fetchedQuestionData = await supabase
                .from("interview_questions")
                .select('*')
                .eq('id', questionId)
                .eq('interview_id', interviewId)
                .single()
        else
            fetchedQuestionData = await supabase
                .from('questions')
                .select('*')
                .eq('id', questionId)
                .single()
        const { data: questionData, error: error2 } = fetchedQuestionData
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

    Tell him whether the strengths of his answer and how much appropriate it is and then Also provide some suggestions.
    Follow the format of output of the following example and write nothing extra.
    For example:
    [
        {
            strength: "Strengths of the answer in 1 - 2 paragraphs with proper punctuations.",
            suggestion: "Suggestions for improvement in 1 - 2 paragraphs with proper punctuations."
        }
    ]
    `

        const res: any = await model.invoke(prompt);

        const resData = JSON.parse(res.content);

        let fetchedAnswerData;
        if (isInterview)
            fetchedAnswerData = await supabase
                .from("interview_questions")
                .update({
                    'strengths': resData[0].strength,
                    'suggestions': resData[0].suggestion,
                })
                .eq('id', questionId);
        else
            fetchedAnswerData = await supabase
                .from('questions')
                .update({
                    'strengths': resData[0].strength,
                    'suggestions': resData[0].suggestion,
                })
                .eq('id', questionId);
        const { error: answerError } = fetchedAnswerData;

        if (answerError) {
            return NextResponse.json({ success: false, error: answerError.message }, { status: 401 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    }
    catch (error: any) {
        return NextResponse.json({ success: false, error: "Some error occured!" }, { status: 401 });
    }
}
