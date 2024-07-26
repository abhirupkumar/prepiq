import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
                <p className="text-gray-400">Last updated on Jul 23rd 2024</p>
                <p className="mt-4">
                    This privacy policy sets out how PrepiQ uses and protects any information that you give PrepiQ when you visit their website and/or agree to purchase from them.
                </p>
                <p className="mt-4">
                    PrepiQ is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, and then you can be assured that it will only be used in accordance with this privacy statement.
                </p>
                <p className="mt-4">
                    PrepiQ may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you adhere to these changes.
                </p>
                <h2 className="text-2xl font-bold mt-6">We may collect the following information:</h2>
                <ul className="list-disc list-inside mt-4">
                    <li>Name</li>
                    <li>Email Address</li>
                    <li>Resume (For Job Creation)</li>
                    <li>Job Description (For Job Creation)</li>
                    <li>Company Name (For Job Creation)</li>
                    <li>Company Description (For Job Creation)</li>
                    <li>Video (Temporarily stored for checking answer efficiency)</li>
                </ul>
                <h2 className="text-2xl font-bold mt-6">What we do with the information we gather</h2>
                <p className="">We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:</p>
                <ul className="list-disc list-inside mt-4">
                    <li>Internal record keeping.</li>
                    <li>Informations collected for job creation are only used for that purpose.</li>
                    <li>Video is also collected at the time of mock interview, but after transcribing it to text, the video is deleted.</li>
                    <li>We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided.</li>
                    <li>From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail. We may use the information to customise the website according to your interests.</li>
                </ul>
                <p className="mt-4">We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in suitable measures.</p>
                <p className="mt-4">We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.</p>
                <p className="mt-4">If you believe that any information we are holding on you is incorrect or incomplete, message us by filling up the contact form as soon as possible. We will promptly correct any information found to be incorrect.</p>
            </div>
        </div>
    );
}