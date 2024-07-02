import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

const MockInterviews = () => {
    return (
        <div className='flex flex-col mt-10 space-y-4 w-full'>
            <div className='w-full justify-between flex'>
                <h2 className='text-2xl font-semibold'>
                    Mock Interviews:
                </h2>
                <Button className='rounded-full'>New Interview <Plus className='ml-2 text-sm' /></Button>
            </div>
            <Link href="/interview/id" className='flex items-center text-semibold text-xl bg-muted px-6 py-4 rounded-md border-2 w-80 text-start'>
                <Image src="/mockinterview.jpg" alt="interview-question" height="80" width="80" className='rounded-md mr-4' />
                Interview 1
            </Link>
        </div>
    )
}

export default MockInterviews;