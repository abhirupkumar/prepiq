import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Privacy Policy</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                    <h2 className="font-semibold">1. Information We Collect</h2>
                    <p className="ml-4">We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
                    <h2 className="font-semibold">2. How We Use Your Information</h2>
                    <p className="ml-4">We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you.</p>
                    <h2 className="font-semibold">3. Information Sharing and Disclosure</h2>
                    <p className="ml-4">We do not sell your personal information. We may share your information with third-party service providers who perform services on our behalf.</p>
                    <h2 className="font-semibold">4. Data Security</h2>
                    <p className="ml-4">We implement appropriate technical and organizational measures to protect the security of your personal information.</p>
                    <h2 className="font-semibold">5. Your Rights</h2>
                    <p className="ml-4">Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data.</p>
                </CardContent>
            </Card>
        </div>
    );
}