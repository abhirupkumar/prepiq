"use client";

import { CheckIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const Pricing = () => {
    return (
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Affordable Pricing for Every Budget</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Choose the plan that best fits your needs and start preparing for your next interview with confidence. These plans are not monthly subscriptions, but one-time purchases. You can always upgrade to a higher plan if you need more credits.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-7xl items-center gap-4 py-12 lg:grid-cols-4 lg:gap-10">
                    <div className="flex flex-col justify-between rounded-lg bg-background p-6 shadow-lg">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">Free Plan</h3>
                            <p className="text-4xl font-bold">
                                $0
                            </p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    5 Credits
                                </li>
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    Each Interviews costs 4 credits
                                </li>
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    Every 10 Questions costs 1 credit.
                                </li>
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    Generate Answers with AI
                                </li>
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    AI-Powered Feedback and Guidance
                                </li>
                            </ul>
                        </div>
                        <Link
                            href="/sign-in"
                            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            prefetch={false}
                        >
                            Try Now
                        </Link>
                    </div>
                    <div className="flex flex-col justify-between rounded-lg bg-background p-6 shadow-lg">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">Lite Plan</h3>
                            <p className="text-4xl font-bold">
                                $4.99
                            </p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    10 Credits
                                </li>
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    Each Interviews costs 4 credits
                                </li>
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    Every 10 Questions costs 1 credit.
                                </li>
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    Generate Answers with AI
                                </li>
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    AI-Powered Feedback and Guidance
                                </li>
                            </ul>
                        </div>
                        <Link
                            href="/sign-in"
                            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            prefetch={false}
                        >
                            Try Now
                        </Link>
                    </div>
                    <div className="flex flex-col justify-between rounded-lg bg-background p-6 shadow-lg">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">Plus Plan</h3>
                            <p className="text-4xl font-bold">
                                $7.99
                            </p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    25 Credits
                                </li>
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    Each Interviews costs 4 credits
                                </li>
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    Every 10 Questions costs 1 credit.
                                </li>
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    Generate Answers with AI
                                </li>
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    AI-Powered Feedback and Guidance
                                </li>
                            </ul>
                        </div>
                        <Link
                            href="/sign-in"
                            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            prefetch={false}
                        >
                            Try Now
                        </Link>
                    </div>
                    <div className="flex flex-col justify-between rounded-lg bg-background p-6 shadow-lg">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">Pro Plan</h3>
                            <p className="text-4xl font-bold">
                                $13.99
                            </p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    50 Credits
                                </li>
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    Each Interviews costs 4 credits
                                </li>
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    Every 10 Questions costs 1 credit.
                                </li>
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    Generate Answers with AI
                                </li>
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    AI-Powered Feedback and Guidance
                                </li>
                            </ul>
                        </div>
                        <Link
                            href="/sign-in"
                            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            prefetch={false}
                        >
                            Try Now
                        </Link>
                    </div>
                    <div className="flex flex-col justify" />
                </div>
            </div>
        </section>
    )
}

export default Pricing;