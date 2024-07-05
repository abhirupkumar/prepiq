"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface VideoRecorderProps {
    onRecordingComplete: () => void;
}

export default function VideoRecorder({ onRecordingComplete }: VideoRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [timer, setTimer] = useState(0);
    const videoChunksRef = useRef<BlobPart[]>([]);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRecording) {
            timerIntervalRef.current = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer >= 240) { // 4 minutes = 240 seconds
                        stopRecording();
                        return prevTimer;
                    }
                    return prevTimer + 1;
                });
            }, 1000);
        } else if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, [isRecording]);

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
        mediaRecorderRef.current?.addEventListener("stop", () => {
            const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
            const videoSizeInMB = videoBlob.size / (1024 * 1024);
            console.log(`Recorded video size: ${videoSizeInMB.toFixed(2)} MB`);

            // Here you would typically upload the video or process it
        }, { once: true });
        onRecordingComplete();
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-2">
            {isRecording && (
                <div className="text-xl font-bold">
                    Time: {formatTime(timer)} / 4:00
                </div>
            )}
            <Button onClick={startRecording} disabled={isRecording}>
                Start Recording
            </Button>
            <Button onClick={stopRecording} disabled={!isRecording}>
                Stop Recording
            </Button>
        </div>
    );
}