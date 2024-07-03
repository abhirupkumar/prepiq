"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useToast } from './ui/use-toast';
import MaxWidthWrapper from './MaxWidthWrapper';
import { Button } from './ui/button';
import AudioMeter from "@/components/AudioMeter";

const InterviewPermission = () => {

    const { toast } = useToast();
    const [hasPermission, setHasPermission] = useState(false);
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');
    const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const [audioLevel, setAudioLevel] = useState<number>(0);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const getMediaPermission = async () => {
        try {
            console.log('Requesting media permissions...');
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            console.log('Permissions granted, stream obtained:', mediaStream);
            setStream(mediaStream);
            setHasPermission(true);
            await getDevices();
            if (videoRef.current) {
                console.log('Setting video source...');
                videoRef.current.srcObject = mediaStream;
                videoRef.current.onloadedmetadata = () => {
                    console.log('Video metadata loaded, playing video...');
                    videoRef.current?.play();
                };
            } else {
                console.error('Video ref is null');
            }
        } catch (error) {
            console.error('Error accessing media devices:', error);
            toast({
                variant: "destructive",
                title: 'Failed to access media devices.',
                description: "Please ensure you have granted the necessary permissions.",
            })
            setError('Failed to access media devices. Please ensure you have granted the necessary permissions.');
        }
    };

    const getDevices = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            console.log('Available devices:', devices);
            setAudioDevices(devices.filter(device => device.kind === 'audioinput'));
            setVideoDevices(devices.filter(device => device.kind === 'videoinput'));
        } catch (error) {
            toast({
                variant: "destructive",
                title: 'Error enumerating devices.',
                description: "Failed to get list of audio/video devices.",
            })
            setError('Failed to get list of audio/video devices.');
        }
    };

    const changeAudioDevice = async (deviceId: string) => {
        if (stream) {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    audio: { deviceId: { exact: deviceId } },
                    video: true
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
                setError('Failed to switch audio device.');
            }
        }
    };

    const changeVideoDevice = async (deviceId: string) => {
        if (stream) {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
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
                setError('Failed to switch video device.');
            }
        }
    };

    const testAudio = () => {
        if (stream) {
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            source.connect(analyser);
            analyser.fftSize = 2048;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const checkAudioLevel = () => {
                analyser.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / bufferLength;
                const normalizedLevel = Math.min(average / 128, 1);
                setAudioLevel(normalizedLevel);
                requestAnimationFrame(checkAudioLevel);
            }

            checkAudioLevel();
        } else {
            toast({
                variant: "destructive",
                title: 'Some error occured!',
                description: "No audio stream available for testing.",
            })
            setError('No audio stream available for testing');
        }
    };

    const startRecording = () => {
        if (stream) {
            audioChunksRef.current = [];
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                setRecordedAudio(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const playRecordedAudio = () => {
        if (recordedAudio) {
            const audio = new Audio(URL.createObjectURL(recordedAudio));
            audio.play();
        }
    };

    useEffect(() => {
        let audioContext: AudioContext | null = null;
        let analyser: AnalyserNode | null = null;
        let dataArray: Uint8Array | null = null;

        if (stream) {
            audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            analyser = audioContext.createAnalyser();
            source.connect(analyser);
            analyser.fftSize = 2048;
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);

            const checkAudioLevel2 = () => {
                if (analyser && dataArray) {
                    analyser.getByteFrequencyData(dataArray);
                    const average = dataArray.reduce((a, b) => a + b) / bufferLength;
                    const normalizedLevel = Math.min(average / 128, 1);
                    setAudioLevel(normalizedLevel);
                }
                requestAnimationFrame(checkAudioLevel2);
            }

            checkAudioLevel2();
        }

        return () => {
            if (audioContext) {
                audioContext.close();
            }
        };
    }, [stream]);

    return (
        <MaxWidthWrapper className="py-12 flex flex-col justify-center">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="relative px-10 py-10 bg-muted border shadow-lg sm:rounded-3xl">
                    <div className="flex flex-col space-y-3 max-w-md mx-auto">
                        <h1 className="text-2xl font-semibold">Interview Setup</h1>
                        <span className='bg-blue-100 p-4 rounded list'>
                            <li className='text-sm text-black'>Give permission for both camera and microphone</li>
                            <li className='text-sm text-black'>Ensure camera and microphone are working properly</li>
                            <li className='text-sm text-black'>Check audio clarity and volume</li>
                        </span>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        {!hasPermission ? (
                            <Button
                                onClick={getMediaPermission}
                                className="rounded"
                            >
                                Get Camera and Audio Access
                            </Button>
                        ) : (
                            <div>
                                <video ref={videoRef} autoPlay playsInline className="w-full mb-4 rounded" />
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="audioDevice">
                                        Audio Device
                                    </label>
                                    <select
                                        id="audioDevice"
                                        value={selectedAudioDevice}
                                        onChange={(e) => changeAudioDevice(e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        {audioDevices.map((device) => (
                                            <option key={device.deviceId} value={device.deviceId}>
                                                {device.label || `Audio device ${device.deviceId}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="videoDevice">
                                        Video Device
                                    </label>
                                    <select
                                        id="videoDevice"
                                        value={selectedVideoDevice}
                                        onChange={(e) => changeVideoDevice(e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        {videoDevices.map((device) => (
                                            <option key={device.deviceId} value={device.deviceId}>
                                                {device.label || `Video device ${device.deviceId}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <Button
                                    onClick={testAudio}
                                    className="rounded"
                                >
                                    Test Audio
                                </Button>
                                <AudioMeter level={audioLevel} />
                                <div className="flex items-center mt-4 space-x-2">
                                    {!isRecording ? (
                                        <Button
                                            onClick={startRecording}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Record Audio
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={stopRecording}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Stop Recording
                                        </Button>
                                    )}
                                    {recordedAudio && (
                                        <>
                                            <Button
                                                onClick={playRecordedAudio}
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Play Recording
                                            </Button>
                                            <Button
                                                onClick={() => setRecordedAudio(null)}
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Clear Recording
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MaxWidthWrapper>
    );
};

export default InterviewPermission;