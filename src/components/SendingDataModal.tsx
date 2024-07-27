"use client";

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

const SendingDataModal = ({ loading, openModal, setOpenModal, isUploading, startTranscribe, nextQuestion }: { loading: boolean, openModal: boolean, setOpenModal: React.Dispatch<React.SetStateAction<boolean>>, isUploading: number, startTranscribe: boolean, nextQuestion: () => void }) => {

    const handleSubmit = () => {
        window.location.reload();
    }

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
                        <h2 className={`text-primary`}>Transcribing Your Audio. It will take just 30 seconds</h2>
                        {startTranscribe && <Loader2 className="animate-spin h-6 w-6" />}
                    </div>
                    {!loading ? <Button onClick={handleSubmit} disabled={startTranscribe}>See Your Result</Button> :
                        <Button disabled={true}>Loading {" "}<Loader2 className="animate-spin h-6 w-6" /></Button>}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SendingDataModal;