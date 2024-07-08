import React from 'react';
import BillingForm from '@/containers/BillingForm';
import { redirect } from 'next/navigation';
import { absoluteUrl } from '@/lib/utils';

const Page = async () => {
    // const currentUser = await getCurrentUser();
    // const subscriptionPlan = await getUserSubscriptionPlan();
    // if (!currentUser) redirect(absoluteUrl("/sign-in"))

    // return <BillingForm subscriptionPlan={subscriptionPlan} />
    return <BillingForm />
}

export default Page;