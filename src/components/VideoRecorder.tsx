"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Clock } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface VideoRecorderProps {
    jobId: string;
    questionId: string;
    stream: MediaStream;
    onRecordingComplete: () => void;
}

export default function VideoRecorder({ jobId, questionId, stream, onRecordingComplete }: VideoRecorderProps) {
    const { toast } = useToast();
    const [timer, setTimer] = useState(0);
    const videoChunksRef = useRef<BlobPart[]>([]);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recognitionRef = useRef(null);

    const startRecording = async () => {
        setAudioURL(null);
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();

        const audioChunks: BlobPart[] = [];
        mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
            audioChunks.push(event.data);
        });

        mediaRecorderRef.current?.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
            transcribeAudio(audioBlob);
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioURL(audioUrl);
        });

        setTimer(0);
        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
        // onRecordingComplete();
    };

    useEffect(() => {
        if (isRecording) {
            timerIntervalRef.current = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer >= 180) { // 3 minutes = 180 seconds
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

    const transcribeAudio = async (audioBlob: Blob) => {
        const formData = new FormData();
        formData.append('audioBlob', audioBlob);
        const fetchedData = await fetch('/api/speechtotext', {
            method: 'POST',
            body: formData,
        });

        const response = await fetchedData.json();
        if (!response.success) {
            toast({
                title: "Some error occured!"
            })
            return;
        }

        console.log('Transcription:', response.transcription);
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col justify-between h-full">
            <div className='flex space-x-4 flex-wrap items-center'>
                <Button onClick={isRecording ? stopRecording : startRecording}>
                    {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
                {isRecording && (
                    <div className="text-xl flex items-center font-bold">
                        <Clock className="mr-2" size={24} />
                        Time: {formatTime(timer)} / 3:00
                    </div>
                )}
            </div>
            <div className='bg-blue-100 p-4 mt-48 rounded my-4 text-black'>
                <h3 className='text-lg font-semibold'>Please Note:</h3>
                <p className="text-sm">You respond to the question by submitting a video clip. After that, we preserve your response, transcribe your video recording to text, and provide you with feedback on how effectively you responded to the question.</p>
            </div>
        </div>
    );
}