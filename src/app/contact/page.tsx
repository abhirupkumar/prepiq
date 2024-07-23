"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { browserClient } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function ContactUs() {

    const { toast } = useToast();
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<any>({
        name: "",
        email: "",
        message: "",
    });

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
            setFormData({
                name: "",
                email: "",
                message: "",
            })
        }
        setLoading(false);
    }

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Contact Us</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleClick} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <Input value={formData.name} onChange={(e: any) => setFormData({
                                ...formData,
                                "name": e.target.value
                            })} id="name" type="text" placeholder="Your Name" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <Input value={formData.email} onChange={(e: any) => setFormData({
                                ...formData,
                                "email": e.target.value
                            })} id="email" type="email" placeholder="your@email.com" required />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                            <Textarea value={formData.message} onChange={(e: any) => setFormData({
                                ...formData,
                                "message": e.target.value
                            })} id="message" placeholder="Your message here..." required />
                        </div>
                        <Button disabled={loading} type="submit">{loading ? "Loading..." : "Send Message"}</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}