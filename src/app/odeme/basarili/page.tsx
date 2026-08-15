"use client";
 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import styles from "./success.module.css";
 
export default function PaymentSuccessPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(true);
 
  useEffect(() => {
    // Optionally clear cart from localStorage here
    localStorage.removeItem("cart");
 
    if (showModal) return; // Pause redirect while modal is open
 
    // Redirect to user dashboard after 5 seconds
    const timer = setTimeout(() => {
      router.push("/dashboard"); // Or wherever the user panel is
    }, 5000);
 
    return () => clearTimeout(timer);
  }, [router, showModal]);
 
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

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <CheckCircle className={styles.modalIcon} size={60} />
            <h2 className={styles.modalTitle}>Ödemeniz Başarıyla Alındı!</h2>
            <div className={styles.modalText}>
              Ödemeniz başarıyla alınmıştır.{" "}
              <a href="https://online.turkceoabtdeyiz.com" target="_blank" rel="noopener noreferrer" className={styles.modalLink}>
                https://online.turkceoabtdeyiz.com
              </a>{" "}
              linki üzerinden sisteme başında sıfır olmadan telefon numaranız ve şifre olarak Türkçe karakterlerle ve küçük harflerle soyadınız + telefonunuzun son 2 hanesi ile giriş yapabilirsiniz.
            </div>
            <div className={styles.modalButtonGroup}>
              <button 
                className={styles.modalButtonPrimary}
                onClick={() => {
                  window.open("https://online.turkceoabtdeyiz.com", "_blank");
                }}
              >
                Muro LMS Eğitim Paneline Git
              </button>
              <button 
                className={styles.modalButtonSecondary}
                onClick={() => setShowModal(false)}
              >
                Web Sitesi Panelime Git (Yönlendirmeyi Başlat)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
