"use client";

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Button } from '@/components/ui/button';
import { browserClient } from '@/utils/supabase/client';
import { ArrowLeft, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from 'next/link';

const dummaryQuestions = [
    { id: 1, question: 'Can you provide an example from your experience where you have worked on developing software applications similar to what is mentioned in the job description at Google?', submitted_answer: "jhbh" },
    { id: 2, question: 'The role at Google involves contributing to projects in AI and machine learning. Could you discuss a specific project where you have interacted with AI or machine learning technologies?', submitted_answer: "" },
    { id: 3, question: 'Collaboration on scalability challenges is a key responsibility at Google. Can you share a past experience where you collaborated effectively with a team to address a scalability issue in a project?', submitted_answer: "" },
    { id: 4, question: 'Leadership skills development is encouraged in this role. How have you taken the initiative to lead a team or a project in the past, and what were the outcomes of your leadership?', submitted_answer: "" },
    { id: 5, question: 'With your background in technical coordination, how have you managed and coordinated activities within a team to achieve common objectives, similar to your role in the Newton School Coding Club?', submitted_answer: "" },
];

const Questions = ({ jobId, questionsData }: { jobId: string, questionsData: any }) => {

    const router = useRouter();
    const [questions, setQuestions] = useState<any>(questionsData);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const supabase = browserClient();
        const fetchQuestions = async () => {
            const { data, error } = await supabase
                .from('questions')
                .select('*')
                .eq('job_id', jobId);

            if (error) {
                console.error('Error fetching jobs:', error);
            } else {
                setQuestions(data);
            }
        };
        fetchQuestions();

        const subscription = supabase
            .channel('fetch_questions')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, payload => {
                fetchQuestions();
            })
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        };

    }, [jobId]);

    const generateQuestions = async () => {
        setLoading(true);
        console.log("click")
        setLoading(false);
    }

    return (
        <MaxWidthWrapper className='flex flex-col items-center px-32 py-16'>
            <Button onClick={() => router.back()} variant="outline" className='rounded-full mr-auto flex items-center bg-muted shadow-md'><ArrowLeft className="mr-2" />{" "}Back</Button>
            <section className='bg-muted my-10 flex-flex-col py-2 rounded-lg shadow-md'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='px-6 text-primary'>Question</TableHead>
                            <TableHead className='px-6 text-primary'>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dummaryQuestions.map((question: any, index: number) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium px-6"><Link href={`/dashboard/${jobId}/questions/${question.id}`}>{index + 1}. {question?.question}</Link></TableCell>
                                <TableCell className="font-medium px-8"><Link href={`/dashboard/${jobId}/questions/${question.id}`}>{question.submitted_answer != "" ? <Check className='bg-green-500 p-1 rounded-full text-white font-bold' /> : <Check className='bg-zinc-400 p-1 rounded-full text-white font-bold' />}</Link></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </section>
            <Button disabled={loading} onClick={generateQuestions} className='rounded-full'>{loading ? "Generating..." : "Generate More Interview Questions"}</Button>
        </MaxWidthWrapper>
    )
}

export default Questions;