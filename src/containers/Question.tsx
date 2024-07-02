"use client";

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Bot } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
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

const Question = ({ questionId }: { questionId: string }) => {

    const router = useRouter();
    const [question, setQuestion] = useState<any>({
        question: "Can you provide an example from your experience where you have worked on developing software applications similar to what is mentioned in the job description at Google?"
    })

    return (
        <MaxWidthWrapper className='flex flex-col items-center px-20 py-16 w-full'>
            <span className='flex w-full justify-between'>
                <Button variant="outline" className='rounded-full mr-auto flex items-center bg-muted shadow-md'><ArrowLeft className="mr-2" />{" "}Previous Question</Button>
                <Button variant="outline" className='rounded-full ml-auto flex items-center bg-muted shadow-md'>Next Question{" "}<ArrowRight className="mr-2" /></Button>
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
                                <Button className='rounded-full'><Bot className="mr-2" />Generate Answer</Button>
                                <Button className='rounded-full'>Submit</Button>
                            </span>
                        </div>
                    </div>
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
                </section>
                <section className='my-10 space-y-6 flex-flex-col py-2 rounded-lg w-[50%]'>
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
            </div>
        </MaxWidthWrapper>
    )
}

export default Question;