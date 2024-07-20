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

const InterviewOverview = ({ jobId, interviewId, interviewData, questionsData }: { jobId: string, interviewId: string, interviewData: any, questionsData: any[] }) => {

    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState(0);
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

    }, [interviewId]);

    return (
        <MaxWidthWrapper className='flex flex-col items-center px-8 py-4 w-full'>
            <span className='flex w-full justify-between'>
                <Button onClick={() => router.push(`/dashboard/${jobId}`)} variant="outline" className='rounded-full mr-auto flex items-center bg-muted shadow-md'><ArrowLeft className="mr-2" />{" "}Back</Button>
            </span>
            <div className='flex space-x-8'>
                <section className='my-10 w-[50%] space-y-6'>
                    <div className='bg-muted border flex flex-col py-6 px-6 rounded-lg'>
                        <div className='flex flex-wrap items-center my-2'>
                            {questions.map((question: any, index: number) => <button onClick={() => setCurrentQuestion(index)} key={index} className={`flex flex-col mx-3 my-1 px-3 py-1 rounded-full ${currentQuestion == index ? "bg-blue-200 text-black" : "bg-background text-primary"}`}>
                                <h2 className="text-lg font-bold">Question {index + 1}</h2>
                            </button>)}
                        </div>
                        <p className="mb-4 font-semibold">{questions[currentQuestion].question}</p>
                        <video src="https://storage.googleapis.com/custom-job-interview-recordings/user_2iMIGZm7eBeFL2F9OF8qjFwDjhT/customJob/clxtzcd3u000ltc6hjsg5kx23/interview/clxtzcdk6000stc6hc0nt8zxb/clxtzcd3u000ntc6h505qy1b9/recording.webm?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=cloud-storage-access%40interview-ai-408102.iam.gserviceaccount.com%2F20240706%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240706T040829Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=799c49a546a2daeae1815287d9d59cc5831d2e6e95ba572c98a7ab4714eb490171f1891cda969f227af7614ad39816374aaade3cc543f30a230132e08ded364ce3b5c05cce2a6626d48920b862ecd2414f2d69578d2a50793b42bdc7c1f90e1d9befb8569f95c48c33fdd4e24828f66915b7dac69e9bb465cf465d1b589882c98e8462ed47c66d9c140b029792821f297e1a808c45cb74fa897d60110be849db8c4dc03ef1ab4ef8652e86768660ed1576a6dc4320ed781de6b0fa356e183fa2b1e647d293d8858697076a33061c8555121f909f16bd2711b7b433ed863ee850bb8c06a8353a5aacbbfa56566ff3fe0bf8e79a9a418324b81aa59fbd8ee32516" className='h-[350px]' controls />
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Answer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="bg-background rounded-md text-sm p-2 overflow-y-scroll max-h-[250px]">
                                Hello sir, my name is Abhirup Kumar Bhowmick and I had built a project named DocWhisperer, where I had built a software called SASS, which actually uses PDFs and then extracts it from the PDF and then converts it to embeddings, and so using the embeddings you can talk to PDFs. So, that&apos;s it. I had used Open AI API.
                            </div>
                        </CardContent>
                    </Card>
                </section>
                <section className='my-10 space-y-6 flex-flex-col py-2 rounded-lg w-[50%]'>
                    <Tabs defaultValue="rewrite" className="">
                        <TabsList className="grid w-full grid-cols-2">
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
                                            <Bot className="absolute mx-2" />
                                            <Input placeholder='Make it more professional' className='rounded-full pl-10 w-full' />
                                        </span>
                                        <Button className='rounded-full'>Rewrite</Button>
                                    </div>
                                    <div className='flex space-x-2'>
                                        <Button variant="outline" className='rounded-full'>Make it more concise</Button>
                                        <Button variant="outline" className='rounded-full'>Make it sound smarter</Button>
                                    </div>
                                    <Separator className="my-4" />
                                    <Button variant="outline" className='rounded-full'>Save Answer</Button>
                                    <div className="bg-background rounded-md p-2 text-sm">
                                        As a Freelance Web Developer, I implemented features to enhance operational efficiency and security in web applications. For example, I developed an admin dashboard to simplify inventory management and order processing, resulting in a 40% increase in efficiency. Additionally, I implemented improved security measures, leading to a 50% reduction in breaches and improved user data protection. These accomplishments showcase my proficiency in optimizing software projects by effectively addressing functional and security needs.
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="saved">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Saved Answer</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="bg-background rounded-md p-2 text-sm">
                                        As a Freelance Web Developer, I implemented features to enhance operational efficiency and security in web applications. For example, I developed an admin dashboard to simplify inventory management and order processing, resulting in a 40% increase in efficiency. Additionally, I implemented improved security measures, leading to a 50% reduction in breaches and improved user data protection. These accomplishments showcase my proficiency in optimizing software projects by effectively addressing functional and security needs.
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                    <Card>
                        <CardHeader>
                            <CardTitle>Strengths</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="bg-background rounded-md text-sm p-2 overflow-y-scroll max-h-[250px]">
                                The user provides a specific example of a software development project they worked on as a Freelance Web Developer, showcasing experience in designing and implementing features for web-based applications
                                The user highlights tangible results from their project, such as a 40% boost in operational efficiency and a 50% decrease in security breaches, demonstrating ability to deliver measurable outcomes
                                The user effectively communicates their proactive approach to software development by leading the integration of security protocols and conducting regular assessments, showing initiative and dedication to project success
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>How To Improve</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="bg-background rounded-md text-sm p-2 overflow-y-scroll max-h-[250px]">
                                The user&apos;s example lacks direct alignment with the types of software applications typically developed at companies like Google
                                The response could benefit from more explicit references to relevant technologies, programming languages, or frameworks used in the project
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div >
        </MaxWidthWrapper >
    )
}

export default InterviewOverview;