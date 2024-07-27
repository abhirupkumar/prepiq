"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface MainRecorderProps {
    isSpeaking: boolean;
    setIsSpeaking: React.Dispatch<React.SetStateAction<boolean>>;
    jobId: string;
    questionId: string;
    stream: MediaStream;
    onRecordingComplete: (audioBlob: Blob) => void;
    currIndex: number;
    question: any;
    setAudioData: React.Dispatch<React.SetStateAction<any>>;
}

export default function MainRecorder({ isSpeaking, setIsSpeaking, jobId, questionId, stream, onRecordingComplete, currIndex, question, setAudioData }: MainRecorderProps) {
    const { toast } = useToast();
    const [timer, setTimer] = useState(0);
    const videoChunksRef = useRef<BlobPart[]>([]);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (isSpeaking && question.question && question.question != "") {
            const utterance = new SpeechSynthesisUtterance(question.question);
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(false);
        }
    }, [isSpeaking]);

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
            setAudioData({
                index: currIndex,
                questionId: questionId,
                audioBlob
            });
            onRecordingComplete(audioBlob);
        });

        setTimer(0);
        setIsRecording(true);
    };

    const stopRecording = async () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
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

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className='h-full overflow-y-auto'>
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Question {currIndex + 1}</h2>
                <p>{question.question}</p>
            </div>
            <div className="flex flex-col justify-between h-full">
                <div className='flex space-x-4 flex-wrap items-center'>
                    <Button disabled={isSpeaking ? true : false} onClick={isRecording ? stopRecording : startRecording}>
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
        </div>
    );
}