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
        .eq('interview_id', null)
        .single();
    const res = await supabase.from('questions').select('*').eq('job_id', jobId);
    const sortDataWithTime = res?.data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const dataWithIndex = sortDataWithTime.map((question: any, index: number) => {
        return { ...question, index: index + 1 }
    });

    if (error || !data) return notFound();
    return (
        <Questions jobId={jobId} questionsData={dataWithIndex} />
    )
}

export default Page;