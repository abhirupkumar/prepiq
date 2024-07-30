'use client'

import { ArrowRight, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ModeToggle } from './ModeToggle'
import SignOut from './SignOut'
import { Avatar, AvatarFallback } from './ui/avatar'
import Image from 'next/image'
import { Icons } from './Icons'

const MobileNav = ({ isAuth, user }: { isAuth: boolean, user: any }) => {
    const [isOpen, setOpen] = useState<boolean>(false)

    const toggleOpen = () => setOpen((prev) => !prev)

    const pathname = usePathname()

    useEffect(() => {
        if (isOpen) toggleOpen()
    }, [pathname])

    const closeOnCurrent = (href: string) => {
        if (pathname === href) {
            toggleOpen()
        }
    }

    return (
        <div className='sm:hidden'>
            <Menu
                onClick={toggleOpen}
                className='relative z-50 h-5 w-5 text-primary mr-6'
            />
            {isOpen ? (
                <div className='fixed animate-in slide-in-from-top-5 slide-out-to-top-5 fade-in-20 fade-out-20 inset-0 z-0 w-full'>
                    <ul className='absolute bg-accent border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8'>
                        <li className='my-3 h-px w-full bg-border' />
                        <li>
                            <Link
                                className='flex items-center w-full font-semibold'
                                href='https://dev.to/abhirup2003/how-i-encountered-the-problem-and-built-the-solution-prepiq-3lkh'>
                                Blog
                                <ArrowRight className='ml-2 h-5 w-5' />
                            </Link>
                        </li>
                        <li className='my-3 h-px w-full bg-border' />
                        {!isAuth ? (
                            <>
                                <li>
                                    <Link
                                        onClick={() =>
                                            closeOnCurrent('/sign-in')
                                        }
                                        className='flex items-center w-full font-semibold'
                                        href='/sign-in'>
                                        Get started
                                        <ArrowRight className='ml-2 h-5 w-5' />
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Avatar className='relative w-8 h-8'>
                                        {user?.avatar_url ? (
                                            <div className='relative aspect-square h-full w-full'>
                                                <Image
                                                    fill
                                                    src={user?.avatar_url}
                                                    alt='profile picture'
                                                    referrerPolicy='no-referrer'
                                                />
                                            </div>
                                        ) : (
                                            <AvatarFallback className='bg-popover'>
                                                <span className='sr-only'>{user?.full_name}</span>
                                                <Icons.user className='h-4 w-4 text-zinc-50' />
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                </li>
                                <li className='my-1 h-px w-full bg-border' />
                                <li>
                                    <div className='flex items-center justify-start gap-2 p-2 w-full'>
                                        <div className='flex flex-col space-y-0.5 leading-none'>
                                            {user?.full_name && (
                                                <p className='font-medium text-sm text-primary'>
                                                    {user?.full_name}
                                                </p>
                                            )}
                                            {user?.email && (
                                                <p className='w-[200px] truncate text-xs text-primary'>
                                                    {user?.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </li>
                                <li className='my-1 h-px w-full bg-border' />
                                <li>
                                    <Link
                                        onClick={() =>
                                            closeOnCurrent('/dashboard')
                                        }
                                        className='flex items-center w-full font-semibold'
                                        href='/dashboard'>
                                        Dashboard
                                    </Link>
                                </li>
                                <li className='my-1 h-px w-full bg-border' />
                                <li>
                                    <span
                                        className='flex items-center w-full font-semibold'
                                    >
                                        {user.credits} Credits Left
                                    </span>
                                </li>
                                <li className='my-1 h-px w-full bg-border' />
                                <li>
                                    <SignOut notMenuItem={true} />
                                </li>
                            </>
                        )}
                        <li>
                            <Link
                                onClick={() =>
                                    closeOnCurrent('/pricing')
                                }
                                className='flex items-center w-full font-semibold'
                                href='/pricing'>
                                Pricing
                            </Link>
                        </li>
                        <li className='my-1 h-px w-full bg-border' />
                        <li>
                            <div
                                className='flex items-center w-full font-semibold'>
                                <ModeToggle />
                            </div>
                        </li>
                    </ul>
                </div>
            ) : null}
        </div>
    )
}

export default MobileNav