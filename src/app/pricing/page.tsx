import Pricing from '@/containers/Pricing';
import { getCurrentUser } from '@/lib/auth-actions';
import React from 'react'

const Page = async () => {

    const { user, isAuth } = await getCurrentUser();

    return (
        <Pricing isAuth={isAuth} user={user} />
    )
}

export default Page;