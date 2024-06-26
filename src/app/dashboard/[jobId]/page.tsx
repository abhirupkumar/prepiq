import { absoluteUrl } from '@/lib/utils';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

interface PageProps {
    params: {
        jobId: string
    }
}

const Page = async ({ params }: PageProps) => {


    const { jobId } = params;
    return (
        <></>
    )
}

export default Page;