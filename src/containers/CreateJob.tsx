"use client";

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react'

interface FormDataProps {
    title: string,
    description: string,
    company: string,
    companyDescription: string,
    resume: string
}

const CreateJob = () => {

    const [formData, setFormData] = useState<FormDataProps>({
        title: '',
        description: '',
        company: '',
        companyDescription: '',
        resume: ""
    })

    const handleSubmit = () => {
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
                        })} id='job-description' className='p-2 border border-gray-400 rounded-md mn-h-[100px]' required />
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
                        })} id='company-description' className='p-2 border border-gray-400 rounded-md mn-h-[100px]' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='resume' className='text-sm text-foreground'>Resume*</Label>
                        <Input type='file' value={formData.resume} onChange={(e) => setFormData({
                            ...formData,
                            resume: e.target.value
                        })} id='resume' className='p-2 border border-gray-400 rounded-md' required />
                    </div>
                    <Button type='submit' className='my-4 rounded-full'>Submit</Button>
                </form>
            </div>
        </MaxWidthWrapper>
    )
}

export default CreateJob;