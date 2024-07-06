import Interview from '@/containers/Interview';
import InterviewOverview from '@/containers/InterviewOverview';
import React from 'react';

interface PageProps {
    params: {
        interviewId: string
    }
}

const Page = async ({ params }: PageProps) => {
    const { interviewId } = params;
    return (
        <>
            <Interview interviewId={interviewId} />
            {/* <InterviewOverview interviewId={interviewId} /> */}
        </>
    )
}

export default Page;