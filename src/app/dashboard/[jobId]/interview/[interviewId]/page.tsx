import Interview from '@/containers/Interview';
import InterviewOverview from '@/containers/InterviewOverview';
import React from 'react';

interface PageProps {
    params: {
        jobId: string,
        interviewId: string
    }
}

const Page = async ({ params }: PageProps) => {
    const { jobId, interviewId } = params;
    return (
        <>
            <Interview interviewId={interviewId} />
            {/* <InterviewOverview jobId={jobId} interviewId={interviewId} /> */}
        </>
    )
}

export default Page;