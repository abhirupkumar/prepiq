import Interview from '@/containers/Interview';
import React from 'react'

interface PageProps {
    params: {
        interviewId: string
    }
}

const Page = async ({ params }: PageProps) => {
    const { interviewId } = params;
    return (
        <Interview interviewId={interviewId} />
    )
}

export default Page;