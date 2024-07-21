import { PLANS } from '@/config/lemonsqueezy';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const crypto = require('crypto');

        const rawBody = await request.text()

        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
        const hmac = crypto.createHmac('sha256', secret);
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
        const signature = Buffer.from(request.headers.get('X-Signature') || '', 'utf8');

        if (!crypto.timingSafeEqual(digest, signature)) {
            return NextResponse.json({ error: "Invalid signature." }, { status: 500 });
        }

        const data = JSON.parse(rawBody)

        const eventName = data['meta']['event_name']
        const obj = data['data']['attributes']
        const objId = data['data']['id']
        const supabase = createClient();

        if (eventName === 'order.created') {
            if (obj['store_id'] != process.env.LEMONSQUEEZY_STORE_ID) {
                return NextResponse.json({ error: "Invalid store id." }, { status: 500 });
            }
            const order = obj['first_order_item'];
            const plan = PLANS.find((p) => p.priceId === order['product_id']);
            if (plan == undefined || plan == null) {
                return NextResponse.json({ error: "Invalid product id." }, { status: 500 });
            }

            // increment_profile_credit is a function created in SQL Editor
            await supabase.rpc('increment_profile_credit', { credit: plan.credits, profile_id: "" })
        }

        return new Response('OK', { status: 200 })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}