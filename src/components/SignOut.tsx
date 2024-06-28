"use client";

import React, { useState } from 'react'
import { DropdownMenuItem } from './ui/dropdown-menu';
import { Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { absoluteUrl } from '@/lib/utils';
import { signout } from '@/lib/auth-actions';

const SignOut = ({ notMenuItem }: { notMenuItem: boolean }) => {

    const pathname = usePathname();
    const [loading, setLoading] = useState<boolean>(false);

    const handleSignOut = async () => {
        setLoading(true);
        await signout();
        setLoading(false);
    }

    if (notMenuItem) {
        return (
            <div className='flex items-center w-full font-semibold cursor-pointer'>
                <span onClick={handleSignOut}>Log out</span>
                {loading && <Loader2 className='h-4 w-4 ml-2 animate-spin text-zinc-50' />}
            </div>
        )
    }

    return (
        <DropdownMenuItem className='cursor-pointer'>
            <span onClick={handleSignOut}>Log out</span>
            {loading && <Loader2 className='h-4 w-4 ml-2 animate-spin text-zinc-50' />}
        </DropdownMenuItem>
    )
}

export default SignOut;