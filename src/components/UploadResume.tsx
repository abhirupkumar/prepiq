"use client";

import React, { useRef, useState } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { browserClient } from '@/utils/supabase/client';

const UploadResume = ({ jobId, resume_name }: { jobId: string, resume_name: string }) => {

    const { toast } = useToast();
    const [loading, setLoading] = useState<boolean>(false);

    const hiddenFileInput = useRef<HTMLInputElement>(null);

    const handleClick = (event: any) => {
        hiddenFileInput?.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files?.length === 0) return;
        setLoading(true);
        const fileName = e.target.files![0].name;
        const fileForm = new FormData();
        fileForm.append('file', e.target.files![0]);
        const fetchData = await fetch('/api/extracttextfrompdf', {
            method: 'POST',
            body: fileForm
        });
        const res = await fetchData.json();
        if (res.error) {
            toast({
                variant: "destructive",
                title: 'Some error Occured!',
                description: "There was a problem with your request.",
            })
        }
        else {
            const supabase = browserClient();
            const { error } = await supabase
                .from('jobs')
                .update({
                    resume_name: fileName,
                    resume_text: res.text,
                })
                .eq('id', jobId);

            if (error) {
                toast({
                    variant: "destructive",
                    title: 'Some error Occured!',
                    description: "There was a problem with your request.",
                })
            }
            else {
                toast({
                    title: 'Resume Uploaded Successfully!',
                    description: "Your resume was uploaded successfully.",
                })
            }
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col space-y-2">
            <div className='flex space-x-2 items-center'>
                <h2 className='text-xl font-bold'>Your File:</h2>
                <label htmlFor="file">
                    <Button disabled={loading} variant="outline" onClick={handleClick} className='rounded-full shadow-md'>{loading ? "Uploading..." : "Upload New Resume"}</Button>
                </label>
                <input type="file" id="file" onChange={handleFileChange} ref={hiddenFileInput} className='hidden' />
            </div>
            <p className='px-4 py-3 bg-muted text-primary rounded-md flex w-fit'>{resume_name}{" "}<Plus className='text-red-400 rotate-45' /></p>
        </div>
    );
}

export default UploadResume;