"use client";

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react'

const BillingForm = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <MaxWidthWrapper className='max-w-5xl'>
            <form
                className='mt-12'>
                <Card>
                    <CardHeader>
                        <CardTitle>Your Plans</CardTitle>
                        <CardDescription>
                            You haven't purchased nay plan.
                        </CardDescription>
                    </CardHeader>

                    <CardFooter className='flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0'>
                        <Button type='submit'>
                            Purchase a plan
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </MaxWidthWrapper>
    )
}

export default BillingForm;