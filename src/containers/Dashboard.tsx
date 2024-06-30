"use client";

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Plus, SearchX } from 'lucide-react';
import Link from 'next/link';
import { absoluteUrl, cn } from '@/lib/utils';
import { browserClient } from '@/utils/supabase/client';
import { Skeleton } from '../components/ui/skeleton';
import { buttonVariants } from '@/components/ui/button';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

const Dashboard = ({ user }: {
  user: any
}) => {

  const [jobs, setJobs] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const supabase = browserClient();
    setLoading(true);
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('profile_id', user?.id);

      if (error) {
        console.error('Error fetching jobs:', error);
      } else {
        setJobs(data);
      }
      setLoading(false);
    };
    fetchJobs();

    const subscription = supabase
      .channel('public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, payload => {
        fetchJobs();
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    };

  }, [user?.id]);

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
    <MaxWidthWrapper className='md:p-10 p-4'>
      <div className='mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0'>
        <h1 className='font-bold text-4xl text-primary'>
          Custom Jobs
        </h1>
        {!loading && <Link href="/create-job" className={cn(buttonVariants(), "rounded-full")}>Create a New Job</Link>}
      </div>

      {jobs && jobs?.length !== 0 ? (
        <ul className='mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {jobs.sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
            .map((job: any, index: number) => (
              <li
                key={index}
                className='col-span-1 divide-y divide-muted-foreground rounded-lg bg-card border-[1px] border-muted-foreground'>
                <Link
                  href={absoluteUrl(`/dashboard/${job.id}`)}
                  className='flex flex-col gap-2'>
                  <div className='pt-6 px-6 flex w-full items-center justify-between space-x-6'>
                    <div className='h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-tr from-[#FD9248] via-[#FA1768] to-[#F001FF]' />
                    <div className='flex-1 truncate'>
                      <div className='flex items-center space-x-3'>
                        <h3 className='truncate text-lg font-medium text-primary'>
                          {job.title} {job.company_name && job.company_name != null && `- ${job.company_name}`}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className='px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-primary'>
                  <div className='flex items-center gap-2'>
                    <Plus className='h-4 w-4' />
                    Custom Job
                  </div>
                  <div className='flex items-center gap-2'>
                    <Calendar className='h-4 w-4' />
                    {getFormattedDate(job.created_at)}
                  </div>
                  <div className='flex items-center gap-2'>
                    <Clock className='h-4 w-4' />
                    {getTime(job.created_at)}
                  </div>
                </div>
              </li>
            ))}
        </ul>
      ) : loading ? (
        <>
          <Skeleton className="my-2 h-40" />
        </>
      ) : (
        <div className='mt-16 flex flex-col items-center gap-2'>
          <SearchX className='h-8 w-8 text-primary' />
          <h3 className='font-semibold text-xl'>
            Pretty empty around here
          </h3>
          <p>To get started, create your first Job.</p>
        </div>
      )}
    </MaxWidthWrapper>
  )
}

export default Dashboard;