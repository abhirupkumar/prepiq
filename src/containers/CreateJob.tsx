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
// import { getDocument } from 'pdfjs-dist';
// import { pdfjs } from 'react-pdf'
// import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'

// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

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
    const [pdfText, setPdfText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormDataProps>({
        title: '',
        description: '',
        company: '',
        companyDescription: '',
        resume: null
    });

    // async function extractText(pdfFile: File) {
    //     const buffer = await pdfFile.arrayBuffer();
    //     const pdf = await getDocument({
    //         data: buffer,
    //         cMapUrl: './node_modules/pdfjs-dist/cmaps/',
    //         cMapPacked: true
    //     }).promise
    //     let text = "";
    //     for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    //         const page = await pdf.getPage(pageNumber)
    //         const textContent = await page.getTextContent()
    //         console.log(textContent)
    //     }
    // }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Submit the form
        // await extractText(formData.resume!);
        setLoading(true);
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
                resume_text: "",
            });

        if (error) {
            () => toast({
                variant: "destructive",
                description: "There was a problem with your request.",
                title: 'Some error Occured!',
            })
        }
        else {
            () => toast({
                description: "Job Created Successfully!",
                title: 'You will be redirected to dashboard.',
            })
            router.push(absoluteUrl('/dashboard'));
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