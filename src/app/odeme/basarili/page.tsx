"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import styles from "./success.module.css";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Optionally clear cart from localStorage here
    localStorage.removeItem("cart");

    // Redirect to user dashboard after 5 seconds
    const timer = setTimeout(() => {
      router.push("/dashboard"); // Or wherever the user panel is
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <CheckCircle className={styles.icon} size={80} />
        <h1 className={styles.title}>Ödemeniz Başarılı!</h1>
        <p className={styles.description}>
          Satın alma işleminiz başarıyla tamamlandı. Satın aldığınız içeriklere paneliniz üzerinden erişebilirsiniz.
        </p>
        <p className={styles.redirectText}>5 saniye içinde panelinize yönlendiriliyorsunuz...</p>
        <button className={styles.button} onClick={() => router.push("/dashboard")}>
          Hemen Git
        </button>
      </div>
    </div>
  );
}
