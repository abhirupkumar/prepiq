"use client";

import React, { useState, useEffect, useRef } from 'react';
import MaxWidthWrapper from './MaxWidthWrapper';
import { Button } from './ui/button';

const InterviewPermission = () => {
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
                    </div>
                </div>
            </div>
        </MaxWidthWrapper>
    );
};

export default InterviewPermission;