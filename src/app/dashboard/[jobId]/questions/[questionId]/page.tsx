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
    const dataWithIndex = data.map((question: any, index: number) => {
        return { ...question, index: index + 1 }
    });

    return (
        <Question jobId={jobId} questionId={questionId} questionsData={dataWithIndex} questionData={dataWithIndex.find((question: any) => question.id === questionId)} />
    )
}

export default Page;