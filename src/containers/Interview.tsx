"use client";

import InterviewPermission from '@/components/InterviewPermission';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import React, { useRef, useState } from 'react';

const Interview = ({ interviewId }: { interviewId: string }) => {

    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const liveVideoFeed = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [videoChunks, setVideoChunks] = useState<any[]>([]);
    const [recordedVideo, setRecordedVideo] = useState(null);

    return (
        <MaxWidthWrapper className='flex flex-col items-center px-16 py-16 w-full'>
            <InterviewPermission />
        </MaxWidthWrapper>
    )
}

export default Interview;