import Question from '@/containers/Question';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import React from 'react';

interface PageProps {
    params: {
        jobId: string,
        questionId: string
    }
}

const Page = async ({ params }: PageProps) => {
    const { jobId, questionId } = params;
    const supabase = createClient();
    const { data, error } = await supabase.from('questions').select('*').eq('job_id', jobId);
    if (error) return notFound();
    const sortDataWithTime = data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const dataWithIndex = sortDataWithTime.map((question: any, index: number) => {
        return { ...question, index: index + 1 }
    });
    const questionData = dataWithIndex.find((question: any) => question.id === questionId)
    const prevQuestion = dataWithIndex.filter((question: any) => question.index === questionData.index - 1)[0] ?? null
    const nextQuestion = dataWithIndex.filter((question: any) => question.index === questionData.index + 1)[0] ?? null

    return (
        <Question jobId={jobId} questionId={questionId} questionData={questionData} prevQuestion={prevQuestion} nextQuestion={nextQuestion} />
    )
}

export default Page;