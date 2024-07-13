"use client";

import InterviewQuestions from '@/components/InterviewQuestions';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import MockInterviews from '@/components/MockInterviews';
import UploadResume from '@/components/UploadResume';
import { Button } from '@/components/ui/button';
import { browserClient } from '@/utils/supabase/client';
import { ArrowLeft, MoveLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Job = ({ jobId, jobData }: { jobId: string, jobData: any }) => {

    const router = useRouter();
    const [job, setJob] = useState<any>(jobData);

    useEffect(() => {
        const supabase = browserClient();
        const fetchJob = async () => {
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .eq('id', jobId);

            if (error) {
                console.error('Error fetching jobs:', error);
            } else {
                setJob(data[0]);
            }
        };
        fetchJob();

        const subscription = supabase
            .channel('fetch_job')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, payload => {
                fetchJob();
            })
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        };

    }, [jobId]);

    return (
        <MaxWidthWrapper className='px-4 md:px-16 lg:px-32 py-16'>
            <Button onClick={() => router.back()} variant="outline" className='rounded-full bg-muted shadow-md flex items-center'><ArrowLeft className="mr-2" />{" "}Back</Button>
            <h1 className='text-4xl font-bold my-4'>{job?.title}{job?.company_name ? " - " + job?.company_name : ""}</h1>
            <UploadResume jobId={jobId} resume_name={job?.resume_name} />
            <InterviewQuestions jobId={jobId} />
            <MockInterviews jobId={jobId} />
        </MaxWidthWrapper>
    )
}

export default Job;