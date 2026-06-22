import type { Metadata } from "next";
import StoreProvider from "@/components/StoreProvider.component";
import ToastProvider from "@/components/ToastProvider.component";
import "./globals.css";

export const metadata: Metadata = {
  title: "Viklance Admin",
  description: "Viklance internal admin panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full font-sans">
        <StoreProvider>
          {children}
          <ToastProvider />
        </StoreProvider>
      </body>
    </html>
  );
}
