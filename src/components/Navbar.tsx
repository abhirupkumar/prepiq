import React from 'react';
import MaxWidthWrapper from './MaxWidthWrapper';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { ArrowRight } from 'lucide-react';
import MobileNav from './MobileNav';
import UserAccountNav from './UserAccountNav';
import { ModeToggle } from './ModeToggle';
import { getCurrentUser } from '@/lib/auth-actions';
import CreditsNotification from './CreditsNotification';

const Navbar = async () => {

    const { user, isAuth } = await getCurrentUser();

    return (
        <>
            <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 backdrop-blur-lg transition-all'>
                <MaxWidthWrapper>
                    <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
                        <Link
                            href='/'
                            className='flex z-40 font-semibold md:mx-20 mx-6 dark:bg-white px-1 rounded-full'>
                            <span className='flex items-center space-x-2 justify-center'>
                                <img src="/logo.png" alt="logo" className='h-10 w-10' />
                                <img src="/name-logo.png" alt="logo" className='h-[1.8rem]' />
                            </span>
                        </Link>

                        <MobileNav isAuth={isAuth} user={user} />

                        <div className='hidden items-center space-x-4 sm:flex mx-4'>
                            <Link
                                href='https://dev.to/abhirup2003/how-i-encountered-the-problem-and-built-the-solution-prepiq-3lkh'
                                className={buttonVariants({
                                    variant: 'ghost',
                                    size: 'sm',
                                })}>
                                Blog
                            </Link>
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
                                        credits={user?.credits ?? 0}
                                    />
                                </>
                            )}
                            <ModeToggle />
                        </div>
                    </div>
                </MaxWidthWrapper>
            </nav>
            {isAuth && user.credits <= 1 && <CreditsNotification user={user} />}
        </>
    )
}

export default Navbar
