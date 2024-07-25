import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Separator } from './ui/separator';

const InterviewQuestions = ({ jobId }: { jobId: string }) => {
    return (
        <div className='flex flex-col mt-10 space-y-4'>
            <h2 className='text-3xl font-semibold'>
                Practice Questions:
            </h2>
            <Separator className='!mt-1' />
            <Link href={`/dashboard/${jobId}/questions`} className='flex items-center text-semibold text-xl bg-muted px-6 py-4 rounded-md border w-80 text-start'>
                <Image src="/interviewquestion.jpg" alt="interview-question" height="80" width="80" className='rounded-md mr-4' />
                Practice Interview Questions
            </Link>
        </div>
    )
}

export default InterviewQuestions;