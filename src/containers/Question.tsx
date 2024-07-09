"use client";

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from '@/components/ui/separator';
import { browserClient } from '@/utils/supabase/client';

const Question = ({ jobId, questionId, questionsData, questionData }: { jobId: string, questionId: string, questionsData: any[], questionData: any }) => {

    const router = useRouter();
    const supabase = browserClient();
    const [question, setQuestion] = useState<any>(questionData);
    const [prevQuestion, setPrevQuestion] = useState<any>(questionsData.filter((question: any) => question.index === questionData.index - 1)[0]);
    const [nextQuestion, setNextQuestion] = useState<any>(questionsData.filter((question: any) => question.index === questionData.index + 1)[0]);
    const [answer, setAnswer] = useState<string>(questionData.submitted_answer);
    const [rewrittenAnswer, setRewrittenAnswer] = useState<string>("");

    useEffect(() => {
        setQuestion(questionData);
        setPrevQuestion(questionsData.filter((question: any) => question.index === questionData.index - 1)[0]);
        setNextQuestion(questionsData.filter((question: any) => question.index === questionData.index + 1)[0]);
        setAnswer(questionData.submitted_answer);
    }, [questionId]);

    useEffect(() => {
        const fetchQuestion = async () => {
            const { data, error } = await supabase
                .from('questions')
                .select('*')
                .eq('id', questionId)
                .single();

            if (error) {
                console.error('Error fetching jobs:', error);
            } else {
                setQuestion(data);
                setAnswer(data.submitted_answer);
            }
        };
        fetchQuestion();

        const subscription = supabase
            .channel('fetch_questions')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, payload => {
                fetchQuestion();
            })
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        };

    }, [questionId]);

    return (
        <MaxWidthWrapper className='flex flex-col items-center px-20 py-16 w-full'>
            <span className='flex w-full justify-between'>
                {prevQuestion == undefined && <Button onClick={() => router.push(`/dashboard/${jobId}/questions`)} variant="outline" className='rounded-full mr-auto flex items-center bg-muted shadow-md'><ArrowLeft className="mr-2" />{" "}Back</Button>}
                {prevQuestion != undefined && <Button onClick={() => router.push(`/dashboard/${jobId}/questions/${prevQuestion.id}`)} variant="outline" className='rounded-full mr-auto flex items-center bg-muted shadow-md'><ArrowLeft className="mr-2" />{" "}Previous Question</Button>}
                {nextQuestion != undefined && <Button onClick={() => router.push(`/dashboard/${jobId}/questions/${nextQuestion.id}`)} variant="outline" className='rounded-full ml-auto flex items-center bg-muted shadow-md'>Next Question{" "}<ArrowRight className="mr-2" /></Button>}
            </span>
            <div className='flex space-x-8'>
                <section className='my-10 w-[50%] space-y-10'>
                    <div className='bg-muted border divide-y-2 flex flex-col py-6 px-6 rounded-lg'>
                        <div className='flex flex-col'>
                            <h2 className="text-xl font-bold mb-2">Question</h2>
                            <p className="mb-4 font-semibold">{question.question}</p>
                        </div>
                        <div className='flex flex-col space-y-2'>
                            <h2 className='text-xl font-semibold'>Your Answer:</h2>
                            <Textarea id='answer' className='p-2 border border-gray-400 rounded-md min-h-[100px]' />
                            <span className='flex space-x-2 mt-2'>
                                <Button className='rounded-full'>
                                    <img src="/logo-black.png" className="mr-2 h-5 w-5 hidden dark:block" />
                                    <img src="/logo-white.png" className="mr-2 h-5 w-5 block dark:hidden" />
                                    Generate Answer</Button>
                                <Button className='rounded-full'>Submit</Button>
                            </span>
                        </div>
                    </div>
                    <Tabs defaultValue="rewrite" className="">
                        <TabsList className="grid w-full grid-cols-2 border">
                            <TabsTrigger value="rewrite">Rewrite Answer</TabsTrigger>
                            <TabsTrigger value="saved">Saved Answer</TabsTrigger>
                        </TabsList>
                        <TabsContent value="rewrite">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Rewrite Answer</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className='flex w-full space-x-2'>
                                        <span className='flex w-full items-center'>
                                            <img src="/logo-black.png" className="mx-3 absolute h-5 w-5 block dark:hidden" />
                                            <img src="/logo-white.png" className="mx-3 absolute h-5 w-5 hidden dark:block" />
                                            <Input placeholder='Make it more professional' className='rounded-full pl-10 w-full' />
                                        </span>
                                        <Button className='rounded-full'>Rewrite</Button>
                                    </div>
                                    <div className='flex space-x-2'>
                                        <Button variant="outline" className='rounded-full'>Make it more concise</Button>
                                        <Button variant="outline" className='rounded-full'>Make it sound smarter</Button>
                                    </div>
                                    {rewrittenAnswer != "" && <>
                                        <Separator className="my-4" />
                                        <Button variant="outline" className='rounded-full'>Save Answer</Button>
                                        <div className="bg-background rounded-md p-2 text-sm">
                                            {rewrittenAnswer}
                                        </div>
                                    </>}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="saved">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Saved Answer</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {question.saved_answer != "" ? <div className="bg-background rounded-md p-2 text-sm">
                                        {question.saved_answer}
                                    </div>
                                        :
                                        <div className="bg-background rounded-md p-4 font-semibold text-sm text-center">
                                            No saved answer found.
                                        </div>}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </section>
                <section className='my-10 space-y-6 flex-flex-col py-2 rounded-lg w-[50%]'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Strengths</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {question.strengths != "" ? <div className="bg-background rounded-md text-sm p-2 overflow-y-scroll max-h-[250px]">
                                {question.strengths}
                            </div>
                                :
                                <div className="bg-background rounded-md font-semibold text-sm p-4 text-center overflow-y-scroll max-h-[250px]">
                                    Submit an answer to get Feedback.
                                </div>}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>How To Improve</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {question.suggestions != "" ? <div className="bg-background rounded-md text-sm p-2 overflow-y-scroll max-h-[250px]">
                                {question.suggesstions}
                            </div>
                                :
                                <div className="bg-background rounded-md font-semibold text-sm p-4 text-center overflow-y-scroll max-h-[250px]">
                                    Submit an answer to get Feedback.
                                </div>}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </MaxWidthWrapper>
    )
}

export default Question;