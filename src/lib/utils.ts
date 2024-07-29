import { type ClassValue, clsx } from "clsx";
import { Metadata } from "next";
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
  title = "PrepiQ | Crack Your Interview Easily with PrepiQ",
  description = "PrepiQ is an Interview Prep SaaS application that gives you the most comprehensive interview preparation experience so that you can crush your next interview and land the next job offer.",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false,
  keywords = ['prepiq', 'prep iq', 'interview preparation for experienced', 'ai', 'mock', 'job', 'naukri', 'taiyari', 'behavioural round', 'answering questions during an interview', 'common interview questions', 'aptitude', 'strengths', 'weakness', 'interview help', 'interview prep questions', 'job interview preparation', 'recruitment']
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
    metadataBase: new URL('https://prepiq.vercel.app'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    }),
    other: {
      "google-site-verification": "co0B-CYrqRdI_fmi2ySiu2nYjJd2Wq8Db9ESsAv_uZE"
    }
  }
}