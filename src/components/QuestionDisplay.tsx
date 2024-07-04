"use client";

import React from 'react'

interface QuestionDisplayProps {
    question: any;
}

export default function QuestionDisplay({ question }: QuestionDisplayProps) {
    return (
        <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Question #{question.id}</h2>
            <p>{question.text}</p>
        </div>
    );
}