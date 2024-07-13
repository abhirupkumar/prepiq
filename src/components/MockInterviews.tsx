import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';
import { Calendar, Check, Clock, Plus } from 'lucide-react';
import { Separator } from './ui/separator';

const MockInterviews = ({ jobId }: { jobId: string }) => {
    return (
        <div className='flex flex-col mt-10 space-y-4 w-full'>
            <div className='w-full items-center justify-between flex'>
                <h2 className='text-3xl font-semibold'>
                    Mock Interviews
                </h2>
                <Button className='rounded-full'>New Interview <Plus className='ml-2 text-sm' /></Button>
            </div>
            <Separator className='!mt-1' />
            <div className="flex flex-wrap">
                <Link href={`/dashboard/${jobId}/interview/1`} className='flex items-center m-2 bg-muted px-4 py-4 rounded-md border w-80 text-start'>
                    <Image src="/mockinterview.jpg" alt="interview-question" height="80" width="80" className='rounded-md mr-4' />
                    <div className='flex flex-col space-y-1'>
                        <h3 className='text-xl text-semibold'>Interview 1</h3>
                        <div className='flex gap-2'>
                            <div className='flex items-center gap-1 text-xs'>
                                <Calendar className='h-4 w-4' />
                                03/07/2024
                            </div>
                            <div className='flex items-center gap-1 text-xs'>
                                <Clock className='h-4 w-4' />
                                10:11 a.m
                            </div>
                        </div>
                        <div className='flex items-center gap-2 text-xs'>
                            <Check className='h-4 w-4' />
                            Ready
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default MockInterviews;