import CreateJob from '@/containers/CreateJob';
import { getCurrentUser } from '@/lib/auth-actions';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async () => {

    const { user, isAuth } = await getCurrentUser();
    if (!isAuth) redirect('/');

    return (
        <>
            {user && <CreateJob />}
        </>
    );
}

export default Page;