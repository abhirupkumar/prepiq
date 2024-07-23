import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TermsAndConditions() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Terms and Conditions</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                    <h2 className="font-semibold">1. Acceptance of Terms</h2>
                    <p className="ml-4">By accessing or using our service, you agree to be bound by these Terms and Conditions.</p>
                    <h2 className="font-semibold">2. User Accounts</h2>
                    <p className="ml-4">You are responsible for maintaining the confidentiality of your account and password.</p>
                    <h2 className="font-semibold">3. Intellectual Property</h2>
                    <p className="ml-4">All content included on this site, such as text, graphics, logos, and software, is the property of our company or its content suppliers and protected by copyright laws.</p>
                    <h2 className="font-semibold">4. Limitation of Liability</h2>
                    <p className="ml-4">We shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of our services.</p>
                </CardContent>
            </Card>
        </div>
    );
}