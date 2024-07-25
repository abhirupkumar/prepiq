import Job from '@/containers/Job';
import { getCurrentUser } from '@/lib/auth-actions';
import { absoluteUrl } from '@/lib/utils';
import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

interface PageProps {
    params: {
        jobId: string
    }
}

const Page = async ({ params }: PageProps) => {

    const { user, isAuth } = await getCurrentUser();
    if (!isAuth) redirect('/');
    const { jobId } = params;
    const supabase = createClient();
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();
    const { data: interviewData, error: interviewError } = await supabase
        .from('interviews')
        .select('*')
        .eq('job_id', jobId);

    if (error || !data) return notFound();

    return (
        <>
            {data && <Job user={user} jobId={jobId} jobData={data} interviewData={interviewData} />}
        </>
    )
}

export default Page;