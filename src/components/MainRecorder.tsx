"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { browserClient } from '@/utils/supabase/client';

interface MainRecorderProps {
    isSpeaking: boolean;
    setIsSpeaking: React.Dispatch<React.SetStateAction<boolean>>;
    jobId: string;
    questionId: string;
    stream: MediaStream;
    currIndex: number;
    question: any;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setIsUploading: React.Dispatch<React.SetStateAction<number>>;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    setAudioData: React.Dispatch<React.SetStateAction<any>>;
    nextQuestion: () => void;
    interviewId: string;
}

export default function MainRecorder({ setLoading, setIsUploading, setOpenModal, isSpeaking, setIsSpeaking, jobId, questionId, stream, currIndex, question, setAudioData, nextQuestion, interviewId }: MainRecorderProps) {
    const { toast } = useToast();
    const [timer, setTimer] = useState(0);
    const videoChunksRef = useRef<BlobPart[]>([]);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recognitionRef = useRef(null);
    const supabase = browserClient();

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


    const onRecordingComplete = async (audioBlob: Blob) => {
        setLoading(true);
        setIsUploading(currIndex);
        setOpenModal(true);
        const formData = new FormData();
        formData.append('audioBlob', audioBlob);
        formData.append('interview_id', interviewId);
        formData.append('question_id', questionId);
        console.log("sending data");
        const fetchedData = await fetch('/api/transcribeaudio', {
            method: 'POST',
            body: formData,
        });
        const response = await fetchedData.json();
        console.log("data eceived");
        if (response.success) {
            toast({
                title: 'Recording uploaded successfully!',
                description: 'You can now proceed to the next question.',
            })
        }
        else {
            toast({
                variant: 'destructive',
                title: response.error,
                description: response.submessage ?? "Please try again later.",
            })
        }
        // const arrayBuffer = await audioBlob.arrayBuffer();
        // const audioFileData = new Uint8Array(arrayBuffer);
        // console.log(process.env.ASSEMBLYAI_API_KEY)
        // await supabase.from('interviews').update({ completed: 'pending' }).eq('id', interviewId);
        // const uploadResponse = await axios.post(`https://api.assemblyai.com/v2/upload`, audioFileData, {
        //     "headers": {
        //         "authorization": process.env.ASSEMBLYAI_API_KEY!,
        //         'Content-Type': 'application/octet-stream',
        //     },
        // })
        // const uploadUrl = uploadResponse.data.upload_url
        // client.transcripts.submit({
        //     audio: uploadUrl,
        //     webhook_url: `${process.env.NEXT_PUBLIC_HOST}/webhook/speechtotext?interview_id=${interviewId}&question_id=${audioData.questionId}`,
        //     webhook_auth_header_name: "Prepiq-Assembly-Webhook-Secret",
        //     webhook_auth_header_value: process.env.ASSEMBLYAI_WEBHOOK_SECRET!
        // })
        // const data = {
        //     audio_url: uploadUrl
        // }
        // const transcript = await client.transcripts.transcribe(data);
        // await supabase.from('interview_questions').update({ submitted_answer: transcript.text }).eq('id', questions[currentQuestionIndex].id).eq('interview_id', interviewId);

        await supabase.from('interview_questions').update({ is_answered: true }).eq('id', questionId).eq('interview_id', interviewId);
        if (currIndex == 0) {
            await supabase.from('interviews').update({ completed: 'pending' }).eq('id', interviewId);
        }
        if (currIndex == 4) {
            await supabase.from('interviews').update({ completed: 'completed' }).eq('id', interviewId);
        }
        nextQuestion();

    }

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