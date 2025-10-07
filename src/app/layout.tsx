import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans, Pacifico } from "next/font/google";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home Connect",
  description: "Real estate and rent management",
};

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito-sans',
  display: 'swap',
});

export const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`$ ${nunitoSans.className} ${geistSans.variable} ${geistMono.variable} antialiased relative z-10`}
      >
        {children}
      </body>
    </html>
  );
}
