"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "../sepet.module.css";

export default function PaymentSuccessPage() {
  const { clearCart } = useCart();

  // Ödeme başarılı olduğu için sepeti temizle
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <>
      <Header />
      <main className={styles.statusWrapper}>
        <div className={styles.statusCard}>
          <div className={`${styles.statusIconWrapper} styles.successIcon`}>
            <CheckCircle2 size={48} style={{ color: "var(--color-success)" }} />
          </div>
          
          <h1 className={styles.statusTitle}>Ödemeniz Başarıyla Alındı!</h1>
          
          <p className={styles.statusDesc}>
            Türkçe ÖABT eğitim paketiniz hesabınıza tanımlanmıştır. Satın aldığınız paketlere öğrenci panelinizden hemen erişebilirsiniz. Başarılar dileriz!
          </p>

          <Link href="/dashboard" className={styles.actionBtn}>
            Öğrenci Paneline Git
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
