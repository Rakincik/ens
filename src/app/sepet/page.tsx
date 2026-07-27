"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "./sepet.module.css";

export default function CheckoutPage() {
  const { cartItems, appliedCoupon, getCartTotal, getDiscountAmount, getCartSubtotal } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Oturum kontrolü
  useEffect(() => {
    if (!authLoading && !user) {
      toast.warning("Ödeme sayfasına erişebilmek için giriş yapmanız gerekmektedir.");
      router.push("/auth/login?redirect=/sepet");
    }
  }, [user, authLoading, router, toast]);

  // PayTR Iframe url'ini yükle
  useEffect(() => {
    async function fetchPaytrIframe() {
      if (!user || cartItems.length === 0) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/payment/paytr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartItems: cartItems.map((item) => ({ id: item.id })),
            couponCode: appliedCoupon?.code || null,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Ödeme oturumu başlatılamadı.");
          toast.error(data.error || "Ödeme oturumu başlatılamadı.");
          return;
        }

        setIframeUrl(data.iframeUrl);
      } catch (err) {
        console.error(err);
        setError("PayTR ödeme servisine bağlanırken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }

    if (user && cartItems.length > 0) {
      fetchPaytrIframe();
    }
  }, [user, cartItems, appliedCoupon, toast]);

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className={styles.checkoutWrapper}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Yönlendiriliyorsunuz...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.checkoutWrapper}>
        <div className="container">
          <Link href="/" style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            color: "var(--text-secondary)",
            marginBottom: "24px",
            width: "fit-content"
          }}>
            <ArrowLeft size={16} />
            <span>Alışverişe Devam Et</span>
          </Link>

          <h1 className={styles.title}>Güvenli Ödeme Sayfası</h1>

          {cartItems.length === 0 ? (
            <div className={styles.card} style={{ textAlign: "center", padding: "64px 24px" }}>
              <ShoppingBag size={48} style={{ color: "var(--border-color-dark)", marginBottom: "16px" }} />
              <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>Sepetinizde ürün bulunmamaktadır.</p>
              <Link href="/" className={styles.actionBtn} style={{ padding: "12px 24px", borderRadius: "var(--radius-md)" }}>
                Eğitimleri İncele
              </Link>
            </div>
          ) : (
            <div className={styles.layout}>
              {/* Sol Sütun: Sipariş Özeti */}
              <div className={styles.card}>
                <h2 className={styles.sectionTitle}>
                  <ShoppingBag size={18} />
                  <span>Sipariş Özeti ({cartItems.length})</span>
                </h2>

                <div className={styles.itemsList}>
                  {cartItems.map((item) => (
                    <div key={item.id} className={styles.item}>
                      <div className={styles.itemInfo}>
                        <h4 className={styles.itemTitle}>{item.title}</h4>
                      </div>
                      <span className={styles.itemPrice}>
                        {item.price.toLocaleString("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        })}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.pricingDetail}>
                  <div className={styles.pricingRow}>
                    <span>Ara Toplam</span>
                    <span>
                      {getCartTotal().toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                    </span>
                  </div>
                  {getDiscountAmount() > 0 && (
                    <div className={styles.pricingRow} style={{ color: "var(--color-success)" }}>
                      <span>Kupon İndirimi ({appliedCoupon?.code})</span>
                      <span>
                        -{" "}
                        {getDiscountAmount().toLocaleString("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        })}
                      </span>
                    </div>
                  )}
                  <div className={styles.totalRow}>
                    <span>Genel Toplam</span>
                    <span>
                      {getCartSubtotal().toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sağ Sütun: PayTR Iframe Kartı */}
              <div className={styles.card} style={{ display: "flex", flexDirection: "column" }}>
                <h2 className={styles.sectionTitle}>
                  <CreditCard size={18} />
                  <span>PayTR Kredi Kartı Ödemesi</span>
                </h2>

                <div className={styles.iframeContainer}>
                  {loading ? (
                    <div className={styles.loadingState}>
                      <div className={styles.spinner} />
                      <p>Güvenli ödeme kanalı kuruluyor, lütfen bekleyin...</p>
                    </div>
                  ) : error ? (
                    <div style={{ textAlign: "center", color: "var(--color-error)", padding: "40px" }}>
                      <p style={{ fontWeight: 600, marginBottom: "8px" }}>Ödeme Formu Yüklenemedi</p>
                      <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{error}</p>
                    </div>
                  ) : iframeUrl ? (
                    <iframe
                      src={iframeUrl}
                      className={styles.iframe}
                      title="PayTR Secure Payment Frame"
                      sandbox="allow-same-origin allow-scripts allow-top-navigation allow-forms"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
