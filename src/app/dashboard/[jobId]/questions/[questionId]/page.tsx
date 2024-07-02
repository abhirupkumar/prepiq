import Question from '@/containers/Question';
import React from 'react';

interface PageProps {
    params: {
        questionId: string
    }
}

const Page = async ({ params }: PageProps) => {
    const { questionId } = params;
    return (
        <Question questionId={questionId} />
    )
}

export default Page;