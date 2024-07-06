"use client";

import React, { useEffect, useRef, useState } from 'react'

interface QuestionDisplayProps {
    question: any;
}

export default function QuestionDisplay({ question }: QuestionDisplayProps) {

    const [isSpeaking, setIsSpeaking] = useState(true);
    useEffect(() => {
        if (isSpeaking && question.text && question.text != "") {
            const utterance = new SpeechSynthesisUtterance(question.text);
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(false);
        }
    }, [isSpeaking]);

    return (
        <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Question {question.id}</h2>
            <p>{question.text}</p>
        </div>
    );
}