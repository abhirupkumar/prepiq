import { Storage } from "@google-cloud/storage";

export async function getCloudStorage() {
    return new Storage({
        projectId: process.env.GOOGLE_PROJECT_ID!,
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL!,
            private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        }
    });
}