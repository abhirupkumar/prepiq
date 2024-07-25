// app/api/webhook/route.js
import { createClient } from '@/utils/supabase/server';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

        const body = await request.json();
        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(JSON.stringify(body));
        const digest = shasum.digest('hex');

        if (digest === request.headers.get('x-razorpay-signature')) {
            const { payload } = body;
            const { order, payment } = payload;
            const { order_id, status, notes } = payment.entity;
            console.log('payload');
            if (order.entity.status == 'paid') {
                const userId = notes.userId;
                const plan = notes.plan;

                const supabase = createClient();
                const { error: error1 } = await supabase.from('orders').insert({ order_id: order_id, profile_id: userId, payload });
                if (error1) return NextResponse.json({ success: false, error: error1.message }, { status: 405 });
                const { data, error } = await supabase.rpc('increment_profile_credit', { credit: plan.credits, profile_id: userId });
                if (error) {
                    return NextResponse.json({ success: false, error: error.message }, { status: 407 });
                } else {
                    return NextResponse.json({ success: true, data: data }, { status: 200 });
                }
            } else {
                return NextResponse.json({ success: false, error: 'Payment not captured' }, { status: 400 });
            }
        } else {
            return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
        }
    }
    catch (error: any) {
        console.log(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export const GET = () => NextResponse.json({ error: 'Method not allowed' }, { status: 405 });