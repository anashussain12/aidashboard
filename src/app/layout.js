import localFont from "next/font/local";
import "./globals.css";
import LayoutWrapper from "./Components/LayoutWrapper";
import Script from "next/script";
import GAProvider from "./ga-provider";

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
  title: "Aitoolcity | Best AI tools in one frame",
  description:
    "Discover the best AI tools in one place. Explore, compare, and find the perfect AI solutions for your needs at Aitoolcity. Your ultimate AI tools directory.",
  icons: {
    icon: "/assets/favicon.ico",
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Pageview tracker (listens to route changes) */}
        <GAProvider />

        <LayoutWrapper>{children}</LayoutWrapper>

        {/* GA4 base scripts */}
        {GA_ID ? (
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
        ) : null}
      </body>
    </html>
  );
}
