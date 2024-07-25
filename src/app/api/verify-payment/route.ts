// pages/api/verify-payment.js
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET!;

    // Create expected signature
    const generated_signature = crypto
        .createHmac('sha256', secret)
        .update(razorpayOrderId + '|' + razorpayPaymentId)
        .digest('hex');

    if (generated_signature === razorpaySignature) {
        // Payment signature is valid
        return NextResponse.json({ success: true }, { status: 200 });
    } else {
        return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 500 });
    }
}
