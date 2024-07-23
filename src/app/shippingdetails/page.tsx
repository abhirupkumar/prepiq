import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ShippingAndDelivery() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Shipping and Delivery</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                    <h2>Shipping Methods</h2>
                    <p>We are a SaaS business so there is no need for shipping methods.</p>
                </CardContent>
            </Card>
        </div>
    );
}