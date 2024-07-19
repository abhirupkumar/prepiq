import Questions from '@/containers/Questions';
import { getCurrentUser } from '@/lib/auth-actions';
import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

interface PageProps {
    params: {
        jobId: string
    }
}

const Page = async ({ params }: PageProps) => {

    const { isAuth } = await getCurrentUser();
    if (!isAuth) redirect('/');
    const { jobId } = params;
    const supabase = createClient();
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();
    if (error || !data) return notFound();
    const res = await supabase.from('questions').select('*').eq('job_id', jobId);
    const sortDataWithIndex = res?.data.sort((a: any, b: any) => a.index - b.index);
    const dataWithIndex = sortDataWithIndex.map((question: any, index: number) => {
        return { ...question, index: index + 1 }
    });

    return (
        <Questions jobId={jobId} questionsData={dataWithIndex} />
    )
}

export default Page;