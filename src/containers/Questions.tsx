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
import { useToast } from '@/components/ui/use-toast';

const Questions = ({ jobId, questionsData }: { jobId: string, questionsData: any }) => {

    const { toast } = useToast();
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
                toast({
                    variant: "destructive",
                    title: 'Error fetching Job. Please try again later.',
                    description: error?.message,
                })
            } else {
                const sortDataWithIndex = data.sort((a: any, b: any) => a.index - b.index)
                setQuestions(sortDataWithIndex);
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
        const fetchedData = await fetch(`/api/generatequestions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ noOfQuestions: 10, jobId })
        });
        const res = await fetchedData.json();
        if (res.success) {
            toast({
                title: 'Questions Generated Successfully.',
                description: "Practice these questions to prepare for the interview.",
            })
        }
        else {
            toast({
                variant: "destructive",
                title: res.error,
                description: res.submessage ?? "Please try again.",
            })
        }
        setLoading(false);
    }

    return (
        <MaxWidthWrapper className='flex flex-col items-center px-4 md:px-16 lg:px-32 py-16'>
            <Button onClick={() => router.push(`/dashboard/${jobId}`)} variant="outline" className='rounded-full mr-auto flex items-center bg-muted shadow-md'><ArrowLeft className="mr-2" />{" "}Back</Button>
            <section className='bg-muted my-10 flex-flex-col py-2 rounded-lg shadow-md'>
                {questions.length > 0 ? <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='px-6 text-primary'>Question</TableHead>
                            <TableHead className='px-6 text-primary'>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {questions.map((question: any, index: number) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium px-6"><Link href={`/dashboard/${jobId}/questions/${question.id}`}>{question?.index}. {question?.question}</Link></TableCell>
                                <TableCell className="font-medium px-8"><Link href={`/dashboard/${jobId}/questions/${question.id}`}>{question.submitted_answer != "" ? <Check className='bg-green-500 p-1 rounded-full text-white font-bold' /> : <Check className='bg-zinc-400 p-1 rounded-full text-white font-bold' />}</Link></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table> : <p className='text-center text-lg px-2'>Generate New Questions.</p>}
            </section>
            <Button disabled={loading} onClick={generateQuestions} className='rounded-full'>{loading ? "Generating..." : "Generate More Interview Questions"}</Button>
        </MaxWidthWrapper>
    )
}

export default Questions;