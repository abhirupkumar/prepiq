import SignIn from '@/containers/SignIn'
import { getCurrentUser } from '@/lib/auth-actions';
import { redirect } from 'next/navigation';
import React from 'react'

const Page = async () => {

    const { user, isAuth } = await getCurrentUser();
    if (isAuth) redirect('/dashboard');

    return <SignIn />
}

export default Page
