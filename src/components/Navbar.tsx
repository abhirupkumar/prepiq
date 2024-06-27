import React from 'react';
import MaxWidthWrapper from './MaxWidthWrapper';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { ArrowRight } from 'lucide-react';
import MobileNav from './MobileNav';
import UserAccountNav from './UserAccountNav';
import { ModeToggle } from './ModeToggle';
import { getCurrentUser } from '@/lib/auth-actions';


const Navbar = async () => {

    const { user, isAuth } = await getCurrentUser();

    return (
        <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 backdrop-blur-lg transition-all'>
            <MaxWidthWrapper>
                <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
                    <Link
                        href='/'
                        className='flex z-40 font-semibold md:mx-20 mx-6'>
                        <span className='flex items-center justify-center'>
                            <p className='font-mono text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#FD9248] via-[#FA1768] to-[#F001FF] font-semibold'>PrepiQ</p>
                        </span>
                    </Link>

                    <MobileNav isAuth={isAuth} />

                    <div className='hidden items-center space-x-4 sm:flex'>
                        <Link
                            href='/pricing'
                            className={buttonVariants({
                                variant: 'ghost',
                                size: 'sm',
                            })}>
                            Pricing
                        </Link>
                        {!isAuth ? (
                            <>
                                <Link
                                    href="/sign-in"
                                    className={buttonVariants({
                                        size: 'sm',
                                    })} >
                                    Get Started{" "}
                                    <ArrowRight className='ml-1.5 h-5 w-5' />
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href='/dashboard'
                                    className={buttonVariants({
                                        variant: 'ghost',
                                        size: 'sm',
                                    })}>
                                    Dashboard
                                </Link>

                                <UserAccountNav
                                    name={
                                        !user?.full_name
                                            ? 'Your Account'
                                            : `${user?.full_name}`
                                    }
                                    email={user?.email ?? ''}
                                    imageUrl={user?.avatar_url ?? ''}
                                />
                            </>
                        )}
                        <ModeToggle />
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default Navbar
