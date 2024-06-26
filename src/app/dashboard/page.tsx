// import Dashboard from '@/components/Dashboard';
// import { adminDb, getCurrentUser } from '@/lib/firebase-admin';
// import { getUserSubscriptionPlan } from '@/lib/stripe';
import { getCurrentUser } from '@/lib/auth-actions';
import { absoluteUrl } from '@/lib/utils';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async () => {

    // const currentUser = await getCurrentUser();
    // if (!currentUser) return redirect(absoluteUrl("/sign-in"));
    // const user = JSON.parse(JSON.stringify(currentUser.toJSON()));
    // const subscriptionPlan = await getUserSubscriptionPlan();
    const { user, isAuth } = await getCurrentUser();
    if (!isAuth) redirect('/');

    return (
        <>
            {/* {currentUser && user && <Dashboard user={user} subscriptionPlan={subscriptionPlan} />} */}
        </>
    )
}

export default Page;