import Interview from '@/containers/Interview';
import InterviewOverview from '@/containers/InterviewOverview';
import InterviewTranscription from '@/containers/InterviewTranscription';
import { getCurrentUser } from '@/lib/auth-actions';
import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

interface PageProps {
    params: {
        jobId: string,
        interviewId: string
    }
}

const Page = async ({ params }: PageProps) => {
    const { jobId, interviewId } = params;
    const supabase = createClient();
    const { user, isAuth } = await getCurrentUser();
    const { data: jobData, error: jobError } = await supabase.from('jobs').select('*').eq('id', jobId).single();
    const { data: interviewData, error: interviewError } = await supabase.from('interviews').select('*').eq('id', interviewId).single();
    const { data: questionsData, error: questionsError } = await supabase.from('interview_questions').select('*').eq('interview_id', interviewId);
    if (!isAuth) {
        redirect('/sign-in');
    }
    if (jobError || interviewError || interviewData.job_id !== jobId || jobData.profile_id !== user.id) {
        return notFound();
    }

    if (questionsError) {
        return <div className="flex justify-center items-center min-h-screen">
            <h1 className="text-xl">Error while fetching the interview questions.</h1>
        </div>
    }

    const newQuestiondata = questionsData.sort((a: any, b: any) => a.index - b.index);
    const areAllAnswersSubmitted = questionsData.find((question: any) => question.submitted_answer === "") === undefined;
    const areAllAnswered = questionsData.find((question: any) => question.inAnswered === false) === undefined;
    const isInterviewCompleted = interviewData.completed === "completed" || areAllAnswersSubmitted;
    return (
        <>
            {!isInterviewCompleted ?
                <Interview jobId={jobId} interviewId={interviewId} questionsData={newQuestiondata} />
                :
                !areAllAnswered ? <InterviewTranscription interviewId={interviewId} questionsData={newQuestiondata} /> :
                    <InterviewOverview interviewData={interviewData} jobId={jobId} interviewId={interviewId} questionsData={newQuestiondata} />}
        </>
    )
}

export default Page;