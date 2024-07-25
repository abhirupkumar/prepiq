import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
    const { plan, receipt } = await request.json();

    const razorpay = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const payment_capture = 1;
    const options = {
        amount: (plan.price * 100).toString(),
        currency: 'INR',
        receipt: receipt,
        payment_capture,
    };

    try {
        const order = await razorpay.orders.create(options);
        return NextResponse.json({ orderId: order.id }, { status: 200 });
    } catch (error: any) {
        console.log(error);
        console.log(error.error.description);
        return NextResponse.json({ error: error.error.description }, { status: 500 });
    }
}
