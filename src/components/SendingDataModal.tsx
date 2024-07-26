"use client";

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Loader2 } from 'lucide-react';

const SendingDataModal = ({ openModal, setOpenModal, isUploading }: { openModal: boolean, setOpenModal: React.Dispatch<React.SetStateAction<boolean>>, isUploading: number }) => {
    console.log(isUploading);
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
                    {[0, 1, 2, 3, 4].map((val, index) => <div key={index} className='flex space-x-4 items-center'>
                        <h2 className={`text-primary ${isUploading >= val + 1 && "text-green-600"}`}>Transcribing Audio of Question {val + 1}</h2>
                        {isUploading == val && <Loader2 className="animate-spin h-6 w-6" />}
                    </div>)}
                    <h1 className="text-xl text-primary font-semibold">Please do not refresh. Good things take time.</h1>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SendingDataModal;