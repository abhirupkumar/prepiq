import { getCurrentUser } from '@/lib/auth-actions';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async () => {

    const { user, isAuth } = await getCurrentUser();
    if (!isAuth) redirect('/');

    return (
        <>
            {/* {currentUser && user && <Dashboard user={user} subscriptionPlan={subscriptionPlan} />} */}
        </>
    )
}

export default Page;