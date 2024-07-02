"use client";

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { absoluteUrl } from '@/lib/utils';
import { browserClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

interface FormDataProps {
    title: string,
    description: string,
    company: string,
    companyDescription: string,
    resume: File | null
}

const CreateJob = ({ user }: { user: any }) => {

    const { toast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormDataProps>({
        title: '',
        description: '',
        company: '',
        companyDescription: '',
        resume: null
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const fileForm = new FormData();
        fileForm.append('file', formData.resume!);
        const fetchData = await fetch('/api/extracttextfrompdf', {
            method: 'POST',
            body: fileForm
        });
        const res = await fetchData.json();
        if (res.error) {
            toast({
                variant: "destructive",
                description: "There was a problem with your request.",
                title: 'Some error Occured!',
            })
        }
        else {
            const supabase = browserClient();
            const { data, error } = await supabase
                .from('jobs')
                .insert({
                    profile_id: user?.id,
                    desc: formData.description,
                    title: formData.title,
                    company_name: formData.company ?? "",
                    company_desc: formData.companyDescription ?? "",
                    resume_name: formData.resume?.name,
                    resume_text: res.text,
                });

            if (error) {
                toast({
                    variant: "destructive",
                    description: "There was a problem with your request.",
                    title: 'Some error Occured!',
                })
            }
            else {
                toast({
                    description: "Job Created Successfully!",
                    title: 'You will be redirected to dashboard.',
                })
                router.push(absoluteUrl('/dashboard'));
            }
        }
        setLoading(false);
    }

    return (
        <MaxWidthWrapper className='md:p-10 p-2 min-h-screen'>
            <div className='flex flex-col bg-muted md:p-16 p-6 rounded-xl'>
                <h1 className='font-bold text-4xl text-primary'>
                    Create a Job
                </h1>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-8'>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='job-title' className='text-sm text-foreground'>Job Title*</Label>
                        <Input value={formData.title} onChange={(e) => setFormData({
                            ...formData,
                            title: e.target.value
                        })} type='text' id='job-title' className='p-2 border border-gray-400 rounded-md' required />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='job-description' className='text-sm text-foreground'>Job Description*</Label>
                        <Textarea value={formData.description} onChange={(e) => setFormData({
                            ...formData,
                            description: e.target.value
                        })} id='job-description' className='p-2 border border-gray-400 rounded-md min-h-[100px]' required />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='company-name' className='text-sm text-foreground'>Company Name (Optional)</Label>
                        <Input value={formData.company} onChange={(e) => setFormData({
                            ...formData,
                            company: e.target.value
                        })} type='text' id='company-name' className='p-2 border border-gray-400 rounded-md' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='company-description' className='text-sm text-foreground'>Company Description (Optional)</Label>
                        <Textarea value={formData.companyDescription} onChange={(e) => setFormData({
                            ...formData,
                            companyDescription: e.target.value
                        })} id='company-description' className='p-2 border border-gray-400 rounded-md min-h-[100px]' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='resume' className='text-sm text-foreground'>Resume* (PDF must contain texts)</Label>
                        <Input type='file' onChange={(e) => setFormData({
                            ...formData,
                            resume: e.target.files![0]
                        })} id='resume' accept="application/pdf" className='p-2 border border-gray-400 rounded-md' required />
                    </div>
                    <Button disabled={loading} type='submit' className='my-4 rounded-full'>{loading ? "Loading..." : "Submit"}</Button>
                </form>
            </div>
        </MaxWidthWrapper>
    )
}

export default CreateJob;