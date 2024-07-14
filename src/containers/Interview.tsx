"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import AudioRecorder from '@/components/AudioRecorder';
import VideoRecorder from '@/components/VideoRecorder';
import QuestionDisplay from '@/components/QuestionDisplay';
import { useToast } from '@/components/ui/use-toast';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

const questions: any[] = [
    {
        id: 1,
        text: "With your background in technical coordination, can you describe a situation where you coordinated activities within a team to achieve a goal? How does this relate to your role in the Newton School Coding Club?"
    },
    {
        id: 2,
        text: "With your background in technical coordination, can you describe a situation where you coordinated activities within a team to achieve a goal? How does this relate to your role in the Newton School Coding Club?"
    },
    {
        id: 3,
        text: "With your background in technical coordination, can you describe a situation where you coordinated activities within a team to achieve a goal? How does this relate to your role in the Newton School Coding Club?"
    },
    // Add more questions here
];

export default function Interview({ jobId, interviewId }: { jobId: string, interviewId: string }) {

    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
    const [isInterviewStarted, setIsInterviewStarted] = useState<boolean>(false);

    const { toast } = useToast();
    const [isCameraEnabled, setIsCameraEnabled] = useState(false);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');
    const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');

    const enableCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: isAudioEnabled });
            setStream(mediaStream);
            await getDevices();
            setIsCameraEnabled(true);
        } catch (error) {
            toast({
                variant: "destructive",
                title: 'Error accessing camera.',
                description: "Please ensure you have granted the necessary permissions.",
            })
        }
    };

    const enableAudio = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: isCameraEnabled, audio: true });
            setStream(mediaStream);
            await getDevices();
            setIsAudioEnabled(true);
        } catch (error) {
            toast({
                variant: "destructive",
                title: 'Error accessing microphone.',
                description: "Please ensure you have granted the necessary permissions.",
            })
        }
    };

    const getDevices = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            setAudioDevices(devices.filter(device => device.kind === 'audioinput'));
            setVideoDevices(devices.filter(device => device.kind === 'videoinput'));
        } catch (error) {
            toast({
                variant: "destructive",
                title: 'Error enumerating devices.',
                description: "Failed to get list of audio/video devices.",
            })
        }
    };

    const changeAudioDevice = async (deviceId: string) => {
        if (stream) {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    audio: { deviceId: { exact: deviceId } },
                    video: selectedVideoDevice != "" ? { deviceId: { exact: selectedVideoDevice } } : true,
                });
                setStream(newStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = newStream;
                }
                setSelectedAudioDevice(deviceId);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: 'Error changing audio device.',
                    description: "Failed to switch audio device.",
                })
            }
        }
    };

    const changeVideoDevice = async (deviceId: string) => {
        if (stream) {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    audio: selectedAudioDevice != "" ? { deviceId: { exact: selectedAudioDevice } } : true,
                    video: { deviceId: { exact: deviceId } }
                });
                setStream(newStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = newStream;
                }
                setSelectedVideoDevice(deviceId);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: 'Failed to switch video device.',
                    description: "Some Error Occured!",
                })
            }
        }
    };

    const startInterview = () => {
        setIsInterviewStarted(true);
        setCurrentQuestionIndex(0);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // End interview
            setIsInterviewStarted(false);
        }
    };

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current?.play();
            };
        }
    }, [stream]);

    return (
        <MaxWidthWrapper className="flex h-full">
            <div className="w-1/2 py-10 h-full px-10 overflow-y-auto">
                {!isInterviewStarted ? (
                    <div className='h-full'>
                        <h2 className="text-3xl mb-4 font-semibold">Interview Instructions</h2>
                        <div className='bg-blue-100 p-4 rounded list my-4'>
                            <li className='text-sm text-black'>Please grant permission for both camera and microphone</li>
                            <li className='text-sm text-black'>Ensure camera and microphone are working properly</li>
                            <li className='text-sm text-black'>Check audio clarity and volume</li>
                            <li className='text-sm text-black'>You will get 3 question one after another.</li>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <div className="flex space-x-3">
                                <Button onClick={enableAudio} disabled={isAudioEnabled}>
                                    {isAudioEnabled ? 'Microphone Enabled' : 'Enable Microphone'}
                                </Button>
                                <Button onClick={enableCamera} disabled={!isAudioEnabled || isCameraEnabled}>
                                    {isCameraEnabled ? 'Camera Enabled' : 'Enable Camera'}
                                </Button>
                            </div>
                            {/* <div className="flex flex-col space-y-3 my-2">
                                {isCameraEnabled && <div className="flex flex-col justify-start">
                                    <span className="text-primary font-semibold">Video Device:</span>
                                    <select
                                        value={selectedVideoDevice}
                                        onChange={(e) => changeVideoDevice(e.target.value)}
                                        disabled={!isCameraEnabled}
                                        className='w-fit rounded-full px-2 py-1 border'
                                    >
                                        {videoDevices.map(device => (
                                            <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
                                        ))}
                                    </select>
                                </div>}
                                {isAudioEnabled && <div className="flex flex-col justify-start">
                                    <span className="text-primary font-semibold">Audio Device:</span>
                                    <select
                                        value={selectedAudioDevice}
                                        onChange={(e) => changeAudioDevice(e.target.value)}
                                        disabled={!isAudioEnabled}
                                        className='w-fit rounded-full px-2 py-1 border'
                                    >
                                        {audioDevices.map(device => (
                                            <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
                                        ))}
                                    </select>
                                </div>}
                            </div> */}
                            {isAudioEnabled && <AudioRecorder stream={stream!} />}
                            <Button className='w-fit' onClick={startInterview} disabled={!isCameraEnabled || !isAudioEnabled}>
                                Start Interview
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className='h-full'>
                        <QuestionDisplay question={questions[currentQuestionIndex]} />
                        <VideoRecorder jobId={jobId} questionId={questions[currentQuestionIndex].id as string} stream={stream!} onRecordingComplete={nextQuestion} />
                    </div>
                )}
            </div>
            <div className="w-1/2">
                <div className='w-full h-full flex flex-col items-center justify-center'>
                    <div className="flex rounded-xl items-center justify-center bg-gray-700 w-[600px] my-10 h-[450px] z-10">
                        <video ref={videoRef} autoPlay muted className="z-30 w-[600px] rounded-xl" />
                    </div>
                </div>
            </div>
        </MaxWidthWrapper>
    );
}