import { configureLemonSqueezy } from "@/utils/lemonsqueezy"
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js"
import { getCurrentUser } from "./auth-actions"

export async function getCheckoutURL(variantId: number) {
    configureLemonSqueezy()

    const { user, isAuth } = await getCurrentUser()

    if (!isAuth || !user.id) {
        throw new Error('User is not authenticated.');
    }

    const storeId = process.env.LEMONSQUEEZY_STORE_ID!;

    const checkout = await createCheckout(
        storeId,
        variantId,
        {
            checkoutOptions: {
                embed: false,
            },
            checkoutData: {
                email: user.email ?? undefined,
                custom: {
                    user_id: user.id,
                },
            },
            productOptions: {
                redirectUrl: `${process.env.NEXT_PUBLIC_HOST}/dashboard`,
                receiptButtonText: 'Go to Dashboard',
                receiptThankYouNote: 'Thank you for signing up to Lemon Stand!',
            },
        }
    )

    return checkout.data?.data.attributes.url
}