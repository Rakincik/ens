"use client";

import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import styles from "./error.module.css";

export default function PaymentErrorPage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <XCircle className={styles.icon} size={80} />
        <h1 className={styles.title}>Ödeme İşlemi Başarısız</h1>
        <p className={styles.description}>
          Ödeme işlemi sırasında bir hata oluştu veya işlem tarafınızdan iptal edildi. Lütfen kart bilgilerinizi kontrol edip tekrar deneyiniz.
        </p>
        <div className={styles.buttonGroup}>
          <button className={styles.primaryButton} onClick={() => router.push("/sepet")}>
            Sepete Dön
          </button>
          <button className={styles.secondaryButton} onClick={() => router.push("/")}>
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
}
