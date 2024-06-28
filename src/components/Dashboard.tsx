"use client";

import React, { useEffect, useState } from 'react';
// import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
// import CreatejobButton from './CreatejobButton';
// import { UserRecord } from 'firebase-admin/auth';
// import { DocumentData, collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
import { Code2, MessageSquare, Plus } from 'lucide-react';
import Link from 'next/link';
import { absoluteUrl } from '@/lib/utils';
import { browserClient } from '@/utils/supabase/client';
// import { getUserSubscriptionPlan } from '@/lib/stripe';

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

  return (
    <main className='mx-auto max-w-7xl md:p-10 p-4'>
      <div className='mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0'>
        <h1 className='font-bold text-4xl text-primary'>
          My jobs
        </h1>
        {/* {!loading && <CreatejobButton user={user} subscriptionPlan={subscriptionPlan} noOfExps={noOfjobs} />} */}
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
                className='col-span-1 divide-y rounded-lg bg-card border-[1px] border-primary'>
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
                    {new Date(job.created_at).toLocaleDateString()}
                  </div>

                  <div className='flex items-center gap-2'>
                    <MessageSquare className='h-4 w-4' />
                    Job
                  </div>
                </div>
              </li>
            ))}
        </ul>
      ) : loading ? (
        <></>
        // <SkeletonTheme baseColor="#36383e" highlightColor="#444">
        //   <Skeleton count={3} height={100} className="my-2" />
        // </SkeletonTheme>
      ) : (
        <div className='mt-16 flex flex-col items-center gap-2'>
          <Code2 className='h-8 w-8 text-primary' />
          <h3 className='font-semibold text-xl'>
            Pretty empty around here
          </h3>
          <p>To get started, create your first Job.</p>
        </div>
      )}
    </main>
  )
}

export default Dashboard;