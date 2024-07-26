"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import AudioRecorder from '@/components/AudioRecorder';
import MainRecorder from '@/components/MainRecorder';
import { useToast } from '@/components/ui/use-toast';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { browserClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import SendingDataModal from '@/components/SendingDataModal';

export default function Interview({ jobId, interviewId, questionsData }: { jobId: string, interviewId: string, questionsData: any[] }) {

    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
    const [isInterviewStarted, setIsInterviewStarted] = useState<boolean>(false);
    const [questions, setQuestions] = useState<any[]>(questionsData);

    const { toast } = useToast();
    const supabase = browserClient();
    const [isEnabled, setIsEnabled] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');
    const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');
    const [audioData, setAudioData] = useState<any>();
    const [openModal, setOpenModal] = useState(false);
    const [isUploading, setIsUploading] = useState(-1);
    const [isSpeaking, setIsSpeaking] = useState(true);
    const [startTranscribe, setStartTranscribe] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const enableAudioAndCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(mediaStream);
            await getDevices();
            setIsEnabled(true);
        } catch (error) {
            toast({
                variant: "destructive",
                title: 'Error accessing camera.',
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
        const newIndex = questions.findIndex(question => question.submitted_answer == "");
        setCurrentQuestionIndex(newIndex);
    };

    const onRecordingComplete = () => {
        setStartTranscribe(true);
    }

    const nextQuestion = async () => {
        if (currentQuestionIndex < questions.length - 1) {
            setLoading(true);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsSpeaking(true);
            setLoading(false);
        }
        else {
            setLoading(true);
            await supabase.from('interviews').update({ completed: 'completed' }).eq('id', interviewId);
            router.refresh();
            setLoading(true);
        }
    };

    useEffect(() => {
        if (startTranscribe) {
            setOpenModal(true);
            transcribeAudio();
        }
    }, [startTranscribe])

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current?.play();
            };
        }
    }, [stream]);

    const transcribeAudio = async () => {
        await supabase.from('interviews').update({ completed: 'pending' }).eq('id', interviewId);
        setIsUploading(audioData.index);
        const audioBlob = audioData.audioBlob;
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
        await supabase.from('interview_questions').update({ submitted_answer: response.transcription }).eq('id', audioData.questionId);
        setAudioData(null);
        setStartTranscribe(false);
    }

    return (
        <>
            <MaxWidthWrapper className="md:flex h-full hidden">
                <div className="w-1/2 py-10 h-full px-10 overflow-y-auto">
                    {!isInterviewStarted ? (
                        <div className='h-full'>
                            <h2 className="text-3xl mb-4 font-semibold">Interview Instructions</h2>
                            <div className='bg-blue-100 p-4 rounded list my-4'>
                                <li className='text-sm text-black'>Please grant permission for both camera and microphone</li>
                                <li className='text-sm text-black'>Ensure camera and microphone are working properly</li>
                                <li className='text-sm text-black'>Check audio clarity and volume</li>
                                <li className='text-sm text-black'>You will get 5 question one after another.</li>
                            </div>
                            <div className="flex flex-col space-y-4">
                                <div className="flex space-x-3">
                                    <Button onClick={enableAudioAndCamera} disabled={isEnabled}>
                                        {isEnabled ? 'Enabled' : 'Enable Both Microphone And Camera'}
                                    </Button>
                                </div>
                                <div className="flex flex-col space-y-3 my-2">
                                    {isEnabled && <div className="flex flex-col justify-start">
                                        <span className="text-primary font-semibold">Video Device:</span>
                                        <select
                                            value={selectedVideoDevice}
                                            onChange={(e) => changeVideoDevice(e.target.value)}
                                            disabled={!isEnabled}
                                            className='w-fit rounded-full px-2 py-1 border'
                                        >
                                            {videoDevices.map(device => (
                                                <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
                                            ))}
                                        </select>
                                    </div>}
                                    {isEnabled && <div className="flex flex-col justify-start">
                                        <span className="text-primary font-semibold">Audio Device:</span>
                                        <select
                                            value={selectedAudioDevice}
                                            onChange={(e) => changeAudioDevice(e.target.value)}
                                            disabled={!isEnabled}
                                            className='w-fit rounded-full px-2 py-1 border'
                                        >
                                            {audioDevices.map(device => (
                                                <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
                                            ))}
                                        </select>
                                    </div>}
                                </div>
                                {isEnabled && <AudioRecorder stream={stream!} />}
                                <Button className='w-fit' onClick={startInterview} disabled={!isEnabled}>
                                    Start Interview
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <MainRecorder isSpeaking={isSpeaking} setIsSpeaking={setIsSpeaking} jobId={jobId} questionId={questions[currentQuestionIndex].id as string} stream={stream!} onRecordingComplete={onRecordingComplete} currIndex={currentQuestionIndex} question={questions[currentQuestionIndex]} setAudioData={setAudioData} />

                            <SendingDataModal loading={loading} nextQuestion={nextQuestion} startTranscribe={startTranscribe} openModal={openModal} setOpenModal={setOpenModal} isUploading={isUploading} />
                        </>
                    )}
                </div>
                <div className="w-1/2">
                    <div className='w-full h-full flex flex-col items-center justify-center'>
                        <div className="flex rounded-xl items-center justify-center bg-gray-700 w-[300px] lg:w-[600px] my-10 h-[450px] z-10">
                            <video ref={videoRef} autoPlay muted className="z-30 lg:max-w-[600px] rounded-xl" />
                        </div>
                    </div>
                </div>
            </MaxWidthWrapper>
            <MaxWidthWrapper className="md:hidden h-screen flex items-center justify-center">
                <h1 className="text-xl font-semibold p-4">Interview cannot be given in mobile. Please use Laptop or Desktop.</h1>
            </MaxWidthWrapper>
        </>
    );
}