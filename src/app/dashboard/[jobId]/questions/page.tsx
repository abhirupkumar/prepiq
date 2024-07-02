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
    const res = await supabase.from('questions').select('*').eq('job_id', jobId);

    if (error || !data) return notFound();
    return (
        <Questions jobId={jobId} questionsData={res?.data} />
    )
}

export default Page;