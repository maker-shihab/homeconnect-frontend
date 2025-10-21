
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { AuthProvider } from "@/lib/auth-context";
import { nunitoSans } from "@/lib/fonts";
import "leaflet/dist/leaflet.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import ReactQueryProvider from "./providers";


export const metadata: Metadata = {
  title: "Home Connect",
  description: "Real estate and rent management",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`$ ${nunitoSans.className} antialiased relative z-10`}
      >
        <ReactQueryProvider>
          <AuthProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
            <Toaster richColors position="top-right" closeButton />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
