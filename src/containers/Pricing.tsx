"use client";

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PLANS } from '@/config/plans';
import { getCheckoutURL } from '@/lib/getCheckoutUrl';
import { pricingItems } from '@/lib/leomonsqueezy';
import { CheckIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import React, { useState } from 'react';

const Pricing = ({ isAuth, user }: { isAuth: boolean, user: any }) => {

    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const handleClick = async (text: string) => {
        if (!isAuth) {
            router.push("/sign-in");
        }
        else {
            setLoading(true);
            const plan = PLANS.find((p) => p.name === text);
            // const checkoutUrl = await getCheckoutURL(plan.variantId);
            // router.push(checkoutUrl ?? '/');
            if (!plan) {
                toast({
                    variant: "destructive",
                    title: "Some Error Occured!",
                    description: `Please try again later.`,
                })
            }
            else {
                handlePayment(plan);
            }
            setLoading(false);
        }
    }

    const handlePayment = async (plan: any) => {
        setLoading(true);
        try {
            const res = await fetch('/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id, plan }),
            });

            const data = await res.json();

            const options = {
                key: process.env.RAZORPAY_KEY_ID,
                amount: plan.price * 100,
                currency: 'INR',
                name: 'PrepiQ',
                description: `Purchase ${plan.name} Pack`,
                order_id: data.orderId,
                image: "/thumbnail.jpg",
                handler: async function (response: any) {
                    const verifyRes = await fetch('/api/verify-payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        }),
                    });

                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        toast({
                            title: "Payment Successful!",
                            description: `You have successfully purchased the ${plan.name} pack.`,
                        })
                    } else {
                        toast({
                            variant: "destructive",
                            title: "Payment Verification Failed!",
                            description: `Some Error Occured! Please try again later.`,
                        })
                    }
                },
                prefill: {
                    name: user?.full_name ?? "User",
                    email: user?.email ?? 'Email',
                },
                notes: {
                    userId: user.id,
                    plan: plan,
                },
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: error.message ?? "Some Error Occured!",
                description: `Please try again later.`,
            })
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Affordable Pricing for Every Budget</h2>
                            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Choose the plan that best fits your needs and start preparing for your next interview with confidence. These plans are not monthly subscriptions, but one-time purchases. You can always upgrade to a higher plan if you need more credits.
                            </p>
                        </div>
                    </div>
                    <div className="mx-auto grid max-w-7xl items-center gap-4 py-12 lg:grid-cols-4 lg:gap-10">
                        {pricingItems.map((item, index) => <div key={index} className="flex flex-col justify-between rounded-lg bg-background p-6 shadow-lg">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold">{item.name}</h3>
                                <p className="text-4xl font-bold">
                                    ${item.price}
                                </p>
                                <ul className="space-y-2 text-muted-foreground">
                                    {item.features.map((feature, index2) => <li key={index2}>
                                        <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                        {feature}
                                    </li>)}
                                </ul>
                            </div>
                            <Button onClick={() => handleClick(item.name)} disabled={loading || (item.name == "Free" && isAuth)} className="my-1">
                                {loading ? "Loading..." : "Try Now"}
                            </Button>
                        </div>)}
                        <div className="flex flex-col justify" />
                    </div>
                </div>
            </section>
        </>
    )
}

export default Pricing;