import localFont from "next/font/local";
import "./globals.css";
import LayoutWrapper from "./Components/LayoutWrapper";
import Script from "next/script";
import GAProvider from "./ga-provider";
import { Suspense } from "react"; // ✅

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "AI Tool City - Your Ultimate AI Tools Directory ",
  description:
    "Explore a curated collection of AI tools designed to boost your productivity and creativity. Find the perfect AI solution for your needs today!",
};


const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <GAProvider />
        </Suspense>

        <LayoutWrapper>{children}</LayoutWrapper>

        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
