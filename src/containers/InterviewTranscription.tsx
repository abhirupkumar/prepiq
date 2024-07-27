"use client";

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { useToast } from '@/components/ui/use-toast';
import { browserClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const InterviewTranscription = ({ interviewId, questionsData }: { interviewId: string, questionsData: any[] }) => {

    const [questions, setQuestions] = useState<any[]>(questionsData);
    const supabase = browserClient();
    const { toast } = useToast();

    useEffect(() => {
        const fetchQuestions = async () => {
            const { data, error } = await supabase
                .from('interview_questions')
                .select('*')
                .eq('interview_id', interviewId);

            if (error) {
                toast({
                    variant: "destructive",
                    title: 'Error fetching Interviews. Please try again later.',
                    description: error?.message,
                })
            } else {
                const sortDataWithIndex = data.sort((a: any, b: any) => a.index - b.index)
                setQuestions(sortDataWithIndex);
                const areAllAnswersSubmitted = questions.find((question: any) => question.submitted_answer === "") === undefined;
                if (areAllAnswersSubmitted) {
                    window.location.reload();
                }
            }
        };
        fetchQuestions();

        const subscription = supabase
            .channel('fetch_interview_questions_status')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'interview_questions' }, payload => {
                fetchQuestions();
            })
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        };

    }, [interviewId]);

    return (
        <MaxWidthWrapper className="flex flex-col items-center min-h-screen my-6 justify-center space-y-4">
            {questions.map((question: any, index: number) => <div key={index} className='flex space-x-4 items-center'>
                <h2 className={`text-primary`}>Transcribing Audio of Question {index + 1}</h2>
                {question.submitted_answer == "" && <Loader2 className="animate-spin h-6 w-6" />}
            </div>)}
        </MaxWidthWrapper>
    )
}

export default InterviewTranscription;