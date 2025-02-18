"use client";

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
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
import { useToast } from '@/components/ui/use-toast';

const Question = ({ jobId, questionId, interviewId, questionData, prevQuestion, nextQuestion, isInterview }: { jobId: string, questionId: string, interviewId?: string, questionData: any, prevQuestion: any, nextQuestion: any, isInterview?: boolean }) => {

    const router = useRouter();
    const { toast } = useToast();
    const supabase = browserClient();
    const [question, setQuestion] = useState<any>(questionData);
    const [answer, setAnswer] = useState<string>(questionData.submitted_answer);
    const [rewrittenAnswer, setRewrittenAnswer] = useState<string>("");
    const [rewritePrompt, setRewritePrompt] = useState<string>("");
    const [loading, setLoading] = useState<any>({
        generatingAnswer: false,
        submittingAnswer: false,
    });
    const [rewriteLoading, setRewriteLoading] = useState<boolean>(false);
    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const [isFeedbackGenerated, setIsFeedbackGenerated] = useState<boolean>(question.submitted_answer == "" || (question.submitted_answer != "" && question.strengths != ""));

    useEffect(() => {
        if (!isFeedbackGenerated) {
            checkAnswer();
        }
    }, [isFeedbackGenerated]);

    useEffect(() => {
        const fetchQuestion = async () => {
            let res;
            if (isInterview)
                res = await supabase
                    .from('interview_questions')
                    .select('*')
                    .eq('id', questionId)
                    .eq('interview_id', interviewId)
                    .single();
            else
                res = await supabase
                    .from('questions')
                    .select('*')
                    .eq('id', questionId)
                    .single();

            const { data, error } = res;

            if (error) {
                toast({
                    variant: "destructive",
                    title: 'Error fetching Questions. Please try again later.',
                    description: error?.message,
                })
            } else {
                setQuestion(data);
                setAnswer(data.submitted_answer);
            }
        };
        fetchQuestion();

        const subscription = supabase
            .channel(isInterview ? "fetch_interview_questions" : "fetch_practice_questions")
            .on('postgres_changes', { event: '*', schema: 'public', table: isInterview ? 'interview_questions' : 'questions' }, payload => {
                fetchQuestion();
            })
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        };

    }, [questionId]);

    const generateAnswer = async () => {
        setLoading({
            generatingAnswer: true,
            submittingAnswer: false,
        })
        const fetchedData = await fetch("/api/generateanswer", {
            method: "POST",
            body: JSON.stringify({ jobId, questionId }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const res = await fetchedData.json();
        if (!res.success) {
            toast({
                variant: "destructive",
                title: 'Error Generating Answer.',
                description: "Please try again.",
            })
        }
        setAnswer(res.answer);
        setLoading({
            generatingAnswer: false,
            submittingAnswer: false,
        })
    }

    const submitAnswer = async () => {
        setLoading({
            generatingAnswer: false,
            submittingAnswer: true,
        })
        let fetchedData;
        if (isInterview)
            fetchedData = await supabase
                .from("interview_questions")
                .update({
                    "submitted_answer": answer,
                })
                .eq('id', questionId)
                .ep('interview_id', interviewId);
        else
            fetchedData = await supabase
                .from('questions')
                .update({
                    "submitted_answer": answer,
                })
                .eq('id', questionId);
        const { data: answerData, error: answerError } = fetchedData

        if (answerError) {
            toast({
                variant: "destructive",
                title: 'Error submitting answer. Please try again later.',
                description: "Some error Occured!",
            })
        }
        else {
            setIsFeedbackGenerated(false);
        }
        setLoading({
            generatingAnswer: false,
            submittingAnswer: false,
        })
    }

    const checkAnswer = async () => {
        const fetchedData = await fetch("/api/checkanswer", {
            method: "POST",
            body: JSON.stringify({ answer, jobId, questionId, isInterview, interviewId: isInterview ? interviewId : null }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const res = await fetchedData.json();
        if (!res.success) {
            toast({
                variant: "destructive",
                title: 'Error Checking Answer.',
                description: "Please refresh the page.",
            })
        }
        else {
            setIsFeedbackGenerated(true);
        }
    }

    const rewriteAnswer = async () => {
        setRewriteLoading(true);
        const fetchedData = await fetch("/api/rewriteanswer", {
            method: "POST",
            body: JSON.stringify({ answer, jobId, questionId, rewritePrompt, isInterview, interviewId: isInterview ? interviewId : null }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const res = await fetchedData.json();
        if (!res.success) {
            toast({
                variant: "destructive",
                title: 'Error Submitting Answer.',
                description: "Please try again.",
            })
        }
        setRewrittenAnswer(res.answer);
        setRewriteLoading(false);
    }

    const changePromptAndRewrite = (text: string) => {
        setRewritePrompt(text);
        rewriteAnswer();
    }

    const saveAnswer = async () => {
        setSaveLoading(true);
        let fetchedAnswerData;
        if (isInterview)
            fetchedAnswerData = await supabase
                .from('interview_questions')
                .update({ saved_answer: rewrittenAnswer })
                .eq('id', questionId)
                .eq('interview_id', interviewId)
        else
            fetchedAnswerData = await supabase
                .from('questions')
                .update({ saved_answer: rewrittenAnswer })
                .eq('id', questionId)
        const { data, error } = fetchedAnswerData;
        if (error) {
            toast({
                variant: "destructive",
                title: 'Error Saving Answer.',
                description: "Please try again.",
            })
        } else {
            toast({
                title: 'Answer Saved.',
                description: "Your answer has been saved.",
            })
        }
        setSaveLoading(false);
    }

    return (
        <MaxWidthWrapper className='flex flex-col items-center px-4 lg:px-20 py-16 w-full'>
            <span className='flex w-full justify-between'>
                {!isInterview ? <Button onClick={() => router.push(`/dashboard/${jobId}/questions`)} variant="outline" className='rounded-full mr-auto flex items-center bg-muted shadow-md'><ArrowLeft className="mr-2" />{" "}Back</Button>
                    :
                    <Button onClick={() => router.push(`/dashboard/${jobId}`)} variant="outline" className='rounded-full mr-auto flex items-center bg-muted shadow-md'><ArrowLeft className="mr-2" />{" "}Back</Button>}
                {!isInterview ? <div className='ml-auto flex space-x-6 justify-between'>
                    {prevQuestion && <Button onClick={() => router.push(`/dashboard/${jobId}/questions/${prevQuestion.id}`)} variant="outline" className='rounded-full mr-auto flex items-center bg-muted shadow-md'><ArrowLeft className="mr-2" />{" "}Previous Question</Button>}
                    {nextQuestion && <Button onClick={() => router.push(`/dashboard/${jobId}/questions/${nextQuestion.id}`)} variant="outline" className='rounded-full ml-auto flex items-center bg-muted shadow-md'>Next Question{" "}<ArrowRight className="mr-2" /></Button>}
                </div>
                    :
                    <div className='ml-auto flex space-x-6 justify-between'>
                        {question.index > 1 && <Button onClick={prevQuestion} variant="outline" className='rounded-full mr-auto flex items-center bg-muted shadow-md'><ArrowLeft className="mr-2" />{" "}Previous Question</Button>}
                        {question.index < 5 && <Button onClick={nextQuestion} variant="outline" className='rounded-full ml-auto flex items-center bg-muted shadow-md'>Next Question{" "}<ArrowRight className="mr-2" /></Button>}
                    </div>}
            </span>
            <div className='flex md:flex-row flex-col md:space-x-8 md:mx-0 mx-2'>
                <section className='my-10 md:w-[50%] w-full space-y-10'>
                    <div className='bg-muted border divide-y-2 flex flex-col py-6 px-6 rounded-lg'>
                        <div className='flex flex-col'>
                            <h2 className="text-xl font-bold mb-2">Question {questionData.index}</h2>
                            <p className="mb-4 font-semibold">{question.question}</p>
                        </div>
                        <div className='flex flex-col space-y-2'>
                            <h2 className='text-xl font-semibold'>Your Answer:</h2>
                            {!isInterview ? <Textarea value={answer} onChange={(e: any) => setAnswer(e.target.value)} id='answer' className='p-2 border border-gray-400 rounded-md min-h-[100px]' /> : <span id='answer' className='p-2 border bg-background border-gray-400 rounded-md min-h-[100px]'>{answer}</span>}
                            {!isInterview && <span className='flex space-x-2 mt-2'>
                                <Button disabled={loading.generatingAnswer || loading.submittingAnswer} onClick={generateAnswer} className='rounded-full'>
                                    {!loading.generatingAnswer ? <>
                                        <img src="/logo-black.png" className="mr-2 h-5 w-5 hidden dark:block" />
                                        <img src="/logo-white.png" className="mr-2 h-5 w-5 block dark:hidden" />
                                        Generate Answer
                                    </>
                                        :
                                        <Loader2 className="h-5 w-5 animate-spin mx-4" />}</Button>
                                <Button onClick={submitAnswer} disabled={loading.generatingAnswer || loading.submittingAnswer} className='rounded-full'>{loading.submittingAnswer ? <Loader2 className="h-5 w-5 animate-spin mx-3" /> : "Submit"}</Button>
                            </span>}
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
                                            <Input value={rewritePrompt} onChange={(e: any) => setRewritePrompt(e.target.value)} placeholder='Make it more professional' className='rounded-full pl-10 w-full' />
                                        </span>
                                        <Button disabled={rewriteLoading} onClick={rewriteAnswer} className='rounded-full'>{rewriteLoading ? <Loader2 className="h-5 w-5 animate-spin mx-4" /> : "Rewrite"}</Button>
                                    </div>
                                    <div className='flex space-x-2'>
                                        <Button disabled={rewriteLoading} onClick={() => changePromptAndRewrite("Write a better answer")} variant="outline" className='rounded-full'>Write a better answer</Button>
                                        <Button disabled={rewriteLoading} onClick={() => changePromptAndRewrite("Make it sound smarter")} variant="outline" className='rounded-full'>Make it sound smarter</Button>
                                    </div>
                                    {rewrittenAnswer != "" && <>
                                        <Separator className="my-4" />
                                        <Button disabled={saveLoading} onClick={saveAnswer} variant="outline" className='rounded-full'>Save Answer</Button>
                                        <Textarea disabled={true} value={rewrittenAnswer} className="bg-background rounded-md p-2 text-sm min-h-[300px]" />
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
                                    {question.saved_answer != "" ? <Textarea disabled={true} value={question.saved_answer} className="bg-background rounded-md p-4 text-sm min-h-[300px]" />
                                        :
                                        <div className="bg-background rounded-md p-4 font-semibold text-sm text-center">
                                            No saved answer found.
                                        </div>}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </section>
                <section className='my-10 space-y-6 flex-flex-col py-2 rounded-lg md:w-[50%] w-full'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Strengths</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {question.submitted_answer != "" ? !isFeedbackGenerated ? <div className={`bg-background rounded-md text-sm p-4 overflow-y-scroll max-h-[250px] flex`}>
                                Generating Your Feedback
                                <Loader2 className='h-5 w-5 animate-spin ml-2' />
                            </div> : <Textarea disabled={true} value={question.strengths} className={`bg-background rounded-md text-sm p-4 overflow-y-scroll min-h-[250px]`} />
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
                            {question.submitted_answer != "" ? !isFeedbackGenerated ? <div className={`bg-background rounded-md text-sm p-4 overflow-y-scroll max-h-[250px] flex`}>
                                Generating Your Feedback
                                <Loader2 className='h-5 w-5 animate-spin ml-2' />
                            </div> : <Textarea disabled={true} value={question.suggestions} className={`bg-background rounded-md text-sm p-4 overflow-y-scroll min-h-[250px]`} />
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