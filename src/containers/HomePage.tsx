import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Image from "next/image";
import { ArrowRight, Check } from 'lucide-react';
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Pricing from "@/containers/Pricing";
import Feedback from "@/components/Feedback";

export default function HomePage({ isAuth, user }: { isAuth: boolean, user: any }) {
    return (
        <>
            <MaxWidthWrapper className='mb-12 mt-28 sm:mt-30 flex flex-col items-center space-y-8'>
                <section className="w-full text-center">
                    <div className="max-w-3xl px-4 md:px-6 w-full mx-auto">
                        <div className="flex flex-col justify-center items-center space-y-4">
                            <div className="space-y-6 flex flex-col items-center">
                                <div className='mx-auto flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/90'>
                                    <p className='text-sm font-semibold text-gray-700'>
                                        PrepiQ is now open for public!
                                    </p>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                                    Ace Your Next Interview with Prepi<span className="text-[#cb5c05]">Q</span>
                                </h1>
                                <p className="max-w-[600px] text-foreground md:text-xl">
                                    Prepare for your dream job with our AI-powered interview platform. Get personalized feedback
                                    and realtime analytics to boost your confidence and performance.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                <Link className={buttonVariants({
                                    size: 'lg',
                                })} href="/sign-in">
                                    Try Free Today{' '}
                                    <ArrowRight className='ml-1.5 h-5 w-5' />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                    <div className="px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Elevate Your Interview Preparation</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Our AI-powered platform provides personalized feedback, curated practice questions, and real-time performance analytics to help you ace your next interview.
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-6xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
                            <div className="flex flex-col justify-center space-y-4">
                                <ul className="grid gap-6">
                                    <li>
                                        <div className="grid gap-1">
                                            <h3 className="text-2xl font-bold">Personalized Feedback</h3>
                                            <p className="text-muted-foreground text-lg">
                                                Get tailored insights and recommendations to improve your interview performance.
                                            </p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="grid gap-1">
                                            <h3 className="text-2xl font-bold">Curated Practice Questions</h3>
                                            <p className="text-muted-foreground text-lg">
                                                Access a vast library of industry-specific practice questions to sharpen your skills.
                                            </p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="grid gap-1">
                                            <h3 className="text-2xl font-bold">AI Powered Interviews</h3>
                                            <p className="text-muted-foreground text-lg">
                                                Through our AI-powered mock interview you can improve your communication skills.
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <img
                                src="/interview.png"
                                alt="Features"
                                className="mx-auto rounded-lg h-full"
                            />
                        </div>
                    </div>
                </section>
                <section id="examples" className="w-full px-6 py-12 md:py-24 lg:py-32">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16 items-center">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold">1) Generate Unlimited Practice Interview Questions</h2>
                            <p className="text-muted-foreground text-xl">
                                Upload a job description + your resume to generate{" "}
                                <strong>unlimited custom practice interview questions</strong>{" "}
                                based off of your previous work experience.
                            </p>
                            <Button>Get Started</Button>
                        </div>
                        <div>
                            <img src="/create-job.png" alt="Upload documents" className="w-full h-auto rounded-lg" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16 items-center md:mt-0 mt-6">
                        <div className="md:-order-1 order-1">
                            <img src="/questions.png" alt="Practice your answers" className="w-full h-auto rounded-lg" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold">2) Practice Your Answers</h2>
                            <p className="text-muted-foreground text-xl">
                                Don&apos;t know how to answer the question? No problem. We can generate an answer for you based off of your
                                previous work experience.
                            </p>
                            <p className="text-muted-foreground text-xl">
                                Want to clean up your answer? We got you. Tell us how you want to improve your answer, and we&apos;ll
                                rewrite it for you.
                            </p>
                            <Button>Get Started</Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16 items-center md:mt-0 mt-6">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold">3) Detailed Feedback and Suggestions</h2>
                            <p className="text-muted-foreground text-xl">
                                Get Detailed Feedback and Suggestions with our AI-powered mock interviewer
                            </p>
                            <p className="text-muted-foreground text-xl">
                                The AI mock interviewer asks you questions, you answer them with your voice, and we record the entire interview and transcribe it to text. (Don&apos;t worry we don&apos;t store your personal information, after the video is transcribed, it is deleted automatically).
                            </p>
                            <Button>Get Started</Button>
                        </div>
                        <div>
                            <img src="/question.png" alt="Mock interview" className="w-full h-auto rounded-lg" />
                        </div>
                    </div>
                </section>
                <Pricing user={user} isAuth={isAuth} />
                <section id="questions" className="w-full py-12 md:py-24 lg:py-32 bg-bacground">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="space-y-2 text-center">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Let&apos;s Clear Some Doubts</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Can&apos;t seem to find the answer to a different question you have? Contact our support team.
                                </p>
                            </div>
                            <Accordion type="single" collapsible className="w-full accordion-class max-w-[800px] flex flex-col justify-start bg-muted px-8 rounded-xl">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Which Generative AI does PrepiQ use?</AccordionTrigger>
                                    <AccordionContent>
                                        Yes, PrepiQ is powered by the latest Gemini 1.5 Flash AI model.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>How do these credits work?</AccordionTrigger>
                                    <AccordionContent>
                                        Each custom job costs 1  credit and every mock interview you create costs 4 credits, and each mock interview contains 5 questions. You do not need to pay credits to answer any questions. You can purchase additional credits at any time, as per the plans given in the pricing section.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>Does it support multiple languages?</AccordionTrigger>
                                    <AccordionContent>
                                        Our tool is only available in English.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>Is there mobile support?</AccordionTrigger>
                                    <AccordionContent>
                                        We currently do not offer mobile support.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-5">
                                    <AccordionTrigger>Is is free to use?</AccordionTrigger>
                                    <AccordionContent>
                                        We offer a limited free plan.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </section>
                <Feedback />
                <section id="tryforfree" className="w-full py-12 md:py-24 lg:py-32 bg-background">
                    <div className="px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-8">
                            <div className="space-y-2 text-center">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Got an Interview coming up</h2>
                                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                                    Use PrepiQ now to increase your chances of landing that offer.
                                </p>
                                <Link className={buttonVariants({
                                    size: 'lg',
                                })} href="/sign-in">
                                    Try Free Today{' '}
                                    <ArrowRight className='ml-1.5 h-5 w-5' />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </MaxWidthWrapper>
        </>

    )
}

function BotIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
        </svg>
    )
}


function CheckIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    )
}