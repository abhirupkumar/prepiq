/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    experimental: {
        serverComponentsExternalPackages: ["pdf-parse"],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com'
            },
        ]
    },
};

export default nextConfig;
