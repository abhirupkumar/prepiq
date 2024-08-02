import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn, constructMetadata } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import NextTopLoader from 'nextjs-toploader';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/theme-provider';
import Footer from '@/components/Footer';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen font-sans antialiased bg-background',
          inter.className
        )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Script id="tracker" src="@/utils/tracker.js" />
          <NextTopLoader color="#f98e12" showSpinner={false} />
          <Toaster />
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
