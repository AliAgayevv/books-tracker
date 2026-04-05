import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Provider } from "../components/Provider";
import "./globals.css";

const joan = localFont({
  src: "../public/fonts/Joan-Regular.ttf",
  variable: "--font-joan",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Books Tracker",
    template: "%s | Books Tracker",
  },
  description: "Track your reading list — want to read, currently reading, and finished books.",
  openGraph: {
    siteName: "Books Tracker",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${joan.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
