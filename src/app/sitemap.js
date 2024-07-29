export default async function sitemap() {

    const routes = ["", "/pricing", "/contact", "/privacypolicy", "/termsandcondition", '/sign-in'].map((route) => ({
        url: `${process.env.NEXT_PUBLIC_HOST}${route}`,
        lastModified: new Date().toISOString(),
    }));


    return [...routes];
}