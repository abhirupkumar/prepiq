"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";

export default function AudioRecorder({ stream }: { stream: MediaStream }) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const startRecording = async () => {
        setAudioURL(null);
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();

        const audioChunks: BlobPart[] = [];
        mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
            audioChunks.push(event.data);
        });

        mediaRecorderRef.current.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioURL(audioUrl);
        });

        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    return (
        <div className="flex space-x-3 my-3 w-full">
            <Button onClick={startRecording} disabled={isRecording}>
                {isRecording ? 'Recording...' : 'Record Audio'}
            </Button>
            <Button onClick={stopRecording} disabled={!isRecording}>
                Stop Recording
            </Button>
            {audioURL && (
                <audio src={audioURL} controls className="w-full" />
            )}
        </div>
    );
}