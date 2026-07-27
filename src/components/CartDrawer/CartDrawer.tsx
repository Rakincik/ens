"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Trash2, ShoppingBag, Percent, BookOpen } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import styles from "./CartDrawer.module.css";

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getCartTotal,
    getDiscountAmount,
    getCartSubtotal,
  } = useCart();

  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sayfa dışı kaydırmayı engelleme (Sepet açıkken)
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplying(true);
    const success = await applyCoupon(couponCode.trim());
    setIsApplying(false);
    
    if (success) {
      setCouponCode("");
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);

    if (!user) {
      toast.warning("Satın alma işlemini tamamlamak için öğrenci girişi yapmanız zorunludur.");
      router.push("/auth/login?redirect=/sepet");
    } else {
      router.push("/sepet");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${isCartOpen ? styles.openBackdrop : ""}`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className={`${styles.drawer} ${isCartOpen ? styles.openDrawer : ""}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.title}>
            <ShoppingBag size={20} className={styles.titleIcon} />
            <span>Sepetim ({mounted ? cartItems.length : 0})</span>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => setIsCartOpen(false)}
            aria-label="Kapat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items List */}
        <div className={styles.itemsList}>
          {(!mounted || cartItems.length === 0) ? (
            <div className={styles.emptyState}>
              <ShoppingBag size={48} className={styles.emptyIcon} />
              <p className={styles.emptyText}>Sepetiniz henüz boş.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className={styles.shopLink}
              >
                Eğitimleri İncele
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className={styles.item}>
                {/* Image */}
                <div className={styles.itemImageWrapper}>
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="80px"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-muted)"
                    }}>
                      <BookOpen size={24} />
                    </div>
                  )}
                </div>

                {/* Meta details */}
                <div className={styles.itemInfo}>
                  <h4 className={styles.itemTitle}>{item.title}</h4>
                  <div className={styles.itemMeta}>
                    <span>Türkçe ÖABT</span>
                    {!item.isCouponEligible && (
                      <span style={{
                        color: "var(--color-error)",
                        backgroundColor: "rgba(185, 28, 28, 0.05)",
                        padding: "2px 6px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "10px",
                        fontWeight: "600"
                      }}>
                        Kupona Kapalı
                      </span>
                    )}
                  </div>
                  <span className={styles.itemPrice}>
                    {item.price.toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Sepetten Çıkar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {(mounted && cartItems.length > 0) && (
          <>
            {/* Coupon Application Box */}
            <div className={styles.couponArea}>
              {appliedCoupon ? (
                <div className={styles.activeCoupon}>
                  <span className={styles.couponTag}>
                    <Percent size={14} />
                    <span>
                      {appliedCoupon.code} (%
                      {appliedCoupon.discountType === "PERCENTAGE"
                        ? `${appliedCoupon.discountValue} İndirim`
                        : `${appliedCoupon.discountValue} TL İndirim`}
                      )
                    </span>
                  </span>
                  <button
                    className={styles.removeCouponBtn}
                    onClick={removeCoupon}
                    aria-label="Kuponu Kaldır"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <form className={styles.couponForm} onSubmit={handleCouponSubmit}>
                  <input
                    className={styles.couponInput}
                    type="text"
                    placeholder="İNDİRİM KODU GİRİN"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={isApplying}
                  />
                  <button
                    className={styles.couponBtn}
                    type="submit"
                    disabled={isApplying || !couponCode.trim()}
                  >
                    Uygula
                  </button>
                </form>
              )}
            </div>

            {/* Summary details */}
            <div className={styles.summaryFooter}>
              <div className={styles.summaryRow}>
                <span>Sepet Toplamı</span>
                <span>
                  {getCartTotal().toLocaleString("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  })}
                </span>
              </div>
              {getDiscountAmount() > 0 && (
                <div className={styles.summaryRow} style={{ color: "var(--color-success)" }}>
                  <span>Kupon İndirimi</span>
                  <span>
                    -{" "}
                    {getDiscountAmount().toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })}
                  </span>
                </div>
              )}
              <div className={styles.subtotalRow}>
                <span>Ödenecek Tutar</span>
                <span>
                  {getCartSubtotal().toLocaleString("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  })}
                </span>
              </div>

              <button className={styles.checkoutBtn} onClick={handleCheckout}>
                Ödemeye Geç
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
