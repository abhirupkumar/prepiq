"use client";

import React, { useState } from 'react'
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';
import { browserClient } from '@/utils/supabase/client';

const Feedback = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<any>({
        name: "",
        email: "",
        message: "",
    });
    const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

    const handleClick = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        const supabase = browserClient();
        const { error } = await supabase.from('messages').insert(formData);
        if (error) {
            toast({
                variant: "destructive",
                title: "Couldn't submit your message.",
                description: error.message
            })
        }
        else {
            toast({
                title: "Message Sent!",
                description: "Thank you for reaching out to us.",
            })
            setFeedbackSubmitted(true);
            setFormData({
                name: "",
                email: "",
                message: "",
            })
        }
        setLoading(false);
    }

    return (
        <section id="feedback" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="px-4 md:px-6">
                {!feedbackSubmitted ? <div className="flex flex-col items-center justify-center space-y-8">
                    <div className="space-y-2 text-center">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Feedback</h2>
                        <p className="max-w-[700px] text-muted-foreground md:text-xl">
                            We&apos;d love to hear your feedback! Please fill out the form below.
                        </p>
                    </div>
                    <div className="w-full max-w-[800px] space-y-4 bg-background p-6 rounded-lg shadow-md">
                        <form onSubmit={handleClick} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input value={formData.name} onChange={(e: any) => setFormData({
                                        ...formData,
                                        "name": e.target.value
                                    })} className="bg-muted" id="name" placeholder="Enter your name" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input value={formData.email} onChange={(e: any) => setFormData({
                                        ...formData,
                                        "email": e.target.value
                                    })} className="bg-muted" id="email" type="email" placeholder="Enter your email" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea value={formData.message} onChange={(e: any) => setFormData({
                                    ...formData,
                                    "message": e.target.value
                                })} className="bg-muted min-h-[100px]" id="message" placeholder="Enter your message" required />
                            </div>
                            <Button disabled={loading} type="submit" className="w-full">
                                {loading ? "Loading..." : "Send Message"}
                            </Button>
                        </form>
                    </div>
                </div> :
                    <div className="flex flex-col items-center justify-center space-y-8">
                        <div className="space-y-2 text-center">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Feedback</h2>
                            <p className="max-w-[700px] text-primary font-semibold md:text-xl">
                                Thank you for your feedback! We&apos;ll get back to you soon.
                            </p>
                        </div>
                    </div>}
            </div>
        </section>
    )
}

export default Feedback;