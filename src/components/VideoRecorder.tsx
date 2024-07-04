"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";

interface VideoRecorderProps {
    onRecordingComplete: () => void;
}

export default function VideoRecorder({ onRecordingComplete }: VideoRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const videoChunksRef = useRef<BlobPart[]>([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        videoChunksRef.current = [];

        mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
            videoChunksRef.current.push(event.data);
        });

        mediaRecorderRef.current.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
        onRecordingComplete();
    };

    return (
        <div className="space-y-2">
            <Button onClick={startRecording} disabled={isRecording}>
                Start Recording
            </Button>
            <Button onClick={stopRecording} disabled={!isRecording}>
                Stop Recording
            </Button>
        </div>
    );
}