"use client";

import React from 'react';
import MaxWidthWrapper from './MaxWidthWrapper';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CreditsNotification = ({ user }: { user: any }) => {

    const pathname = usePathname();
    if (pathname === '/' || pathname.includes("questions") || pathname.includes("interview")) return <></>;

    return (
        <MaxWidthWrapper className={``}>
            {user.credits <= 1 && <div className='flex text-white items-center justify-center text-sm space-x-2 bg-red-500 w-full'>
                <p className='font-semibold'>
                    {user.credits} Credits Left!
                </p>
                <Link href="/pricing" className={`underline`}>Get More Credits.</Link>
            </div>}
        </MaxWidthWrapper>
    )
}

export default CreditsNotification;