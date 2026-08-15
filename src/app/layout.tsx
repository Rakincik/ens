import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useCart, CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton/WhatsAppButton";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Türkçe ÖABTDEYİZ | Türkiye'nin En Kapsamlı Türkçe ÖABT Merkezi",
  description: "Türkçe ÖABT Alan Sınavı hazırlık sürecinde Türkiye'nin en seçkin kadrosuyla canlı dersler, konu anlatımları, PDF kaynaklar ve interaktif deneme sınavları platformu.",
  keywords: ["Türkçe ÖABT", "ÖABT hazırlık", "Türkçe öğretmenliği alan sınavı", "canlı dersler", "deneme sınavları"],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable}`} suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning={true} style={{ "--font-heading-family": "'Plus Jakarta Sans', sans-serif" } as React.CSSProperties}>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <CartDrawer />
              <WhatsAppButton />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
        <div id="toast-portal" />
      </body>
    </html>
  );
}
