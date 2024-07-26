"use client";

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

const SendingDataModal = ({ openModal, setOpenModal, isUploading, startTranscribe, nextQuestion }: { openModal: boolean, setOpenModal: React.Dispatch<React.SetStateAction<boolean>>, isUploading: number, startTranscribe: boolean, nextQuestion: () => void }) => {

    return (
        <Dialog
            open={openModal}
            onOpenChange={() => setOpenModal(true)}
        >
            <DialogTitle>
                <></>
            </DialogTitle>
            <DialogContent>
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className='flex space-x-4 items-center'>
                        <h2 className={`text-green-600`}>Transcribing Audio of Question {isUploading + 1}</h2>
                        {startTranscribe && <Loader2 className="animate-spin h-6 w-6" />}
                    </div>
                    <h1 className="text-xl text-primary font-semibold">Please do not refresh. Good things take time.</h1>
                    <Button onClick={nextQuestion} disabled={startTranscribe}>{isUploading >= 5 ? "See Your Result" : 'Next Question'}</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SendingDataModal;