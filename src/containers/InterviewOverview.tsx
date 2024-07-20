"use client";

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { browserClient } from '@/utils/supabase/client';
import { ArrowLeft, Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Question from './Question';

const InterviewOverview = ({ jobId, interviewId, interviewData, questionsData }: { jobId: string, interviewId: string, interviewData: any, questionsData: any[] }) => {

    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState<any[]>(questionsData);
    const [interview, setInterview] = useState<any>(interviewData);
    const supabase = browserClient();

    useEffect(() => {
        const fetchQuestions = async () => {
            if (interview.completed != "completed" && questions.find((question: any) => question.submitted_answer === "") === undefined) {
                await supabase.from('interviews').update({ completed: "completed" }).eq('id', interviewId);
                setInterview({ ...interview, completed: "completed" });
            }
            const { data, error } = await supabase
                .from('interview_questions')
                .select('*')
                .eq('interview_id', interviewId);

            if (error) {
                console.error('Error fetching questions:', error);
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

    }, [interviewId]);

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    }

    const nextQuestion = () => {
        if (currentQuestionIndex < 5) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    }

    return (
        <>
            {questionsData.map((question, index) => currentQuestionIndex == index && <Question key={index} jobId={jobId} interviewId={interviewId} isInterview={true} questionId={question.id} questionData={question} prevQuestion={prevQuestion} nextQuestion={nextQuestion} />)}
        </>
    )
}

export default InterviewOverview;