import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CancellationAndRefund() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Cancellation and Refund Policy</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                    <h2>Cancellation Policy</h2>
                    <p>You may cancel your order within 24 hours of placing it, provided that the order has not yet been shipped. To cancel an order, please contact our customer support team.</p>
                    <h2>Refund Policy</h2>
                    <p>We offer a 30-day money-back guarantee on all our products. If you are not satisfied with your purchase, you may return the item within 30 days of receipt for a full refund of the purchase price, minus shipping costs.</p>
                    <h2>Refund Process</h2>
                    <p>Once we receive your returned item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.</p>
                    <h2>Non-refundable Items</h2>
                    <p>Certain items are non-refundable, including digital products, gift cards, and personalized items.</p>
                </CardContent>
            </Card>
        </div>
    );
}