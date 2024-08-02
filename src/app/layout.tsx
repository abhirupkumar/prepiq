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
          <Script>
            {`
          (function() {
        (window as any).sib = {
            equeue: [],
            client_key: "lcnxo42wj5aan0f64le790xg"
        };
        /* OPTIONAL: email for identify request*/
        // (window as any).sib.email_id = 'example@domain.com';
        (window as any).sendinblue = {};
        for (var j = ['track', 'identify', 'trackLink', 'page'], i = 0; i < j.length; i++) {
        (function(k) {
            (window as any).sendinblue[k] = function() {
                var arg = Array.prototype.slice.call(arguments);
                ((window as any).sib[k] || function() {
                        var t = {};
                        t[k] = arg;
                        (window as any).sib.equeue.push(t);
                    })(arg[0], arg[1], arg[2]);
                };
            })(j[i]);
        }
        var n = document.createElement("script"),
            i = document.getElementsByTagName("script")[0];
            n.type = "text/javascript", n.id = "sendinblue-js",
            n.async = !0, n.src = "https://sibautomation.com/sa.js?key="+ (window as any).sib.client_key,
            i.parentNode.insertBefore(n, i), (window as any).sendinblue.page();
    })();
  `}
          </Script>
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
