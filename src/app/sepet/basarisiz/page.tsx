"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "../sepet.module.css";

export default function PaymentFailedPage() {
  return (
    <>
      <Header />
      <main className={styles.statusWrapper}>
        <div className={styles.statusCard}>
          <div className={`${styles.statusIconWrapper} styles.errorIcon`}>
            <AlertCircle size={48} style={{ color: "var(--color-error)" }} />
          </div>
          
          <h1 className={styles.statusTitle}>Ödeme İşlemi Başarısız!</h1>
          
          <p className={styles.statusDesc}>
            Kredi kartı ödemeniz bankanız veya PayTR ödeme altyapısı tarafından onaylanmadı. Lütfen kart limitinizi, internet bankacılığı ayarlarınızı kontrol edip tekrar deneyiniz.
          </p>

          <div style={{ display: "flex", gap: "16px" }}>
            <Link href="/sepet" className={styles.actionBtn}>
              Ödeme Sayfasına Dön
            </Link>
            <Link href="/iletisim" className={`${styles.actionBtn} ${styles.actionBtnOutline}`} style={{
              backgroundColor: "transparent",
              color: "var(--color-primary)",
              border: "1.5px solid var(--color-primary)"
            }}>
              Destek Al
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
