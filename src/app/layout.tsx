import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useCart, CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton/WhatsAppButton";
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading-family",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Türkçe ÖABTdeyiz | En Seçkin Türkçe ÖABT Hazırlık Platformu",
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
    <html lang="tr" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body>
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
