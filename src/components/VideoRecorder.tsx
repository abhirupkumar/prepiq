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
            const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
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

    // const startRecording = async () => {
    //     mediaRecorderRef.current = new MediaRecorder(stream);
    //     videoChunksRef.current = [];

    //     mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
    //         videoChunksRef.current.push(event.data);
    //     });

    //     mediaRecorderRef.current.start();
    //     // setRecordedVideoUrl(null);
    //     setTimer(0);
    //     setIsRecording(true);
    // };

    // const stopRecording = () => {
    //     mediaRecorderRef.current?.stop();
    //     setIsRecording(false);
    //     mediaRecorderRef.current?.addEventListener("stop", () => {
    //         const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
    //         // const videoUrl = URL.createObjectURL(videoBlob);
    //         // setRecordedVideoUrl(videoUrl);
    //         const videoSizeInMB = videoBlob.size / (1024 * 1024);
    //         console.log(`Recorded video size: ${videoSizeInMB.toFixed(2)} MB`);

    //         // Here you would typically upload the video or process it
    //     }, { once: true });
    //     onRecordingComplete();
    // };

    const transcribeAudio = async (audioBlob: Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
            const base64Audio = (reader?.result as string).split(',')[1];
            const fetchedData = await fetch('/api/speechtotext', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    audioBlob: base64Audio,
                    // fileName: `${jobId}/questions/${questionId}`,
                    fileName: `${Date.now()}_audio.mp3`,
                }),
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
    }

    // const transcribeAudio = (audioBlob: Blob) => {
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //         const audioUrl = reader.result as string;
    //         const recognition = new window.webkitSpeechRecognition();
    //         recognition.continuous = false;
    //         recognition.interimResults = false;
    //         recognition.lang = 'en-US';

    //         recognition.onresult = (event: any) => {
    //             const transcript = event.results[0][0].transcript;
    //             console.log(transcript);
    //         };

    //         recognition.onerror = (event: any) => {
    //             console.error('Speech recognition error:', event.error);
    //         };

    //         recognition.onaudioend = () => {
    //             console.log('Audio ended');
    //         };

    //         recognitionRef.current = recognition;
    //         recognition.start();
    //     };
    //     reader.readAsDataURL(audioBlob);
    // };

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
            {/* {recordedVideoUrl && (
                <div className="mt-4">
                    <video
                        src={recordedVideoUrl}
                        controls
                        className="w-full max-w-md"
                    />
                    <div className="mt-2 space-x-2">
                        <Button onClick={() => setRecordedVideoUrl(null)}>Discard</Button>
                        <Button onClick={() => {
                            onRecordingComplete();
                            setRecordedVideoUrl(null);
                        }}>
                            Save and Continue
                        </Button>
                    </div>
                </div>
            )} */}
            <div className='bg-blue-100 p-4 mt-48 rounded my-4 text-black'>
                <h3 className='text-lg font-semibold'>Please Note:</h3>
                <p className="text-sm">You respond to the question by submitting a video clip. After that, we preserve your response, transcribe your video recording to text, and provide you with feedback on how effectively you responded to the question.</p>
            </div>
        </div>
    );
}