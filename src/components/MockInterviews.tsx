"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { Calendar, Check, Clock, Plus, SearchX } from 'lucide-react';
import { Separator } from './ui/separator';
import { browserClient } from '@/utils/supabase/client';
import { Skeleton } from './ui/skeleton';
import { useToast } from './ui/use-toast';

const MockInterviews = ({ jobId, interviewData }: { jobId: string, interviewData: any[] }) => {

    const [interviews, setInterviews] = useState<any[]>(interviewData);
    const supabase = browserClient();
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setLoading(true);
        const fetchInterviews = async () => {
            const { data, error } = await supabase
                .from('interviews')
                .select('*')
                .eq('job_id', jobId);

            if (error) {
                console.error('Error fetching jobs:', error);
            } else {
                setInterviews(data);
            }
            setLoading(false);
        };
        fetchInterviews();

        const subscription = supabase
            .channel('fetch_interviews')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'interviews' }, payload => {
                fetchInterviews();
            })
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        };

    }, [jobId]);

    const generateNewInterviews = async () => {
        setIsFetching(true);
        const fetchedData = await fetch(`/api/generateinterview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ jobId }),
        });
        const response = await fetchedData.json();
        if (response.success) {
            toast({
                title: 'Interview created successfully!',
                description: 'You can now start taking the interviews.',
            })
        }
        else {
            toast({
                variant: 'destructive',
                title: response.error,
                description: response.submessage ?? "Please try again later.",
            })
        }
        setIsFetching(false);
    }

    const getFormattedDate = (date: Date) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }

    const getTime = (date: Date) => {
        const d = new Date(date);
        let hours = d.getHours();
        let minutes: any = d.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    return (
        <div className='flex flex-col mt-10 space-y-4 w-full'>
            <div className='w-full items-center justify-between flex'>
                <h2 className='text-3xl font-semibold'>
                    Mock Interviews
                </h2>
                <Button disabled={isFetching} onClick={generateNewInterviews} className='rounded-full'>{isFetching ? "Creating..." : "New Interview"}<Plus className='ml-2 text-sm' /></Button>
            </div>
            <Separator className='!mt-1' />
            <div className="flex flex-wrap">
                {isFetching ? <Skeleton className="my-2 h-40 w-full" /> :
                    interviews && interviews.length > 0 ? interviews.map((interview, index) => <Link key={index} href={`/dashboard/${jobId}/interview/${interview.id}`} className='flex items-center m-2 bg-muted px-4 py-4 rounded-md border w-80 text-start'>
                        <Image src="/mockinterview.jpg" alt="interview-question" height="80" width="80" className='rounded-md mr-4' />
                        <div className='flex flex-col space-y-1'>
                            <h3 className='text-xl text-semibold'>Interview {index + 1}</h3>
                            <div className='flex gap-2'>
                                <div className='flex items-center gap-1 text-xs'>
                                    <Calendar className='h-4 w-4' />
                                    {getFormattedDate(interview.created_at)}
                                </div>
                                <div className='flex items-center gap-1 text-xs'>
                                    <Clock className='h-4 w-4' />
                                    {getTime(interview.created_at)}
                                </div>
                            </div>
                            <div className='flex items-center gap-2 text-sm'>
                                <Check className={`${interview.completed == "completed" && "text-green-500"} ${interview.completed == "pending" && "text-red-500"}`} />
                                {interview.completed.charAt(0).toUpperCase() + interview.completed.slice(1)}
                            </div>
                        </div>
                    </Link>)
                        : loading ? (
                            <>
                                <Skeleton className="my-2 h-40 w-full" />
                            </>
                        )
                            : (
                                <div className='mt-4 w-full flex flex-col items-center gap-2'>
                                    <SearchX className='h-8 w-8 text-primary' />
                                    <h3 className='font-semibold text-xl'>
                                        Pretty empty around here
                                    </h3>
                                    <p>To get started, create your first interview.</p>
                                </div>
                            )}
            </div>
        </div>
    )
}

export default MockInterviews;