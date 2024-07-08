import { type ClassValue, clsx } from "clsx";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path;
  if (process.env.NEXT_PUBLIC_HOST)
    return `${process.env.NEXT_PUBLIC_HOST}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function constructMetadata({
  title = "PrepiQ",
  description = "PrepiQ Labs is an Interview Prep SaaS application that gives you the most comprehensive interview preparation experience so that you can crush your next interview and land the next job offer.",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false,
  keywords = ['prepiq', 'prep iq', 'interview', 'preparation', 'ai', 'mock', 'job', 'naukri', 'taiyari']
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean,
  keywords?: string[]
} = {}): Metadata {
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image
        }
      ]
    },
    icons,
    metadataBase: new URL('https://interview-labs.vercel.app'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    }),
  }
}