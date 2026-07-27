"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ShoppingCart, CheckCircle, ArrowLeft, ShieldCheck, HelpCircle } from "lucide-react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import styles from "../urun.module.css";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  isActive: boolean;
  image: string | null;
  isCouponEligible: boolean;
  features?: string[];
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { addToCart } = useCart();
  const toast = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/public/courses/detail?id=${id}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Ürün bulunamadı.");
          return;
        }

        setCourse(data.course);
      } catch (err) {
        console.error(err);
        setError("Ürün detayları yüklenirken sistemsel bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchDetail();
    }
  }, [id]);

  const isBook = course?.title.toLowerCase().includes("kitap");

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.wrapper}>
          <div style={{ display: "flex", justifyContent: "center", padding: "128px 0" }}>
            <div className={styles.spinner} style={{
              width: "40px",
              height: "40px",
              border: "3px solid var(--border-color)",
              borderTopColor: "var(--color-accent)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !course) {
    return (
      <>
        <Header />
        <div className={styles.wrapper}>
          <div className="container" style={{ textAlign: "center", padding: "64px 24px" }}>
            <h2 style={{ color: "var(--color-error)", marginBottom: "16px" }}>Ürün Bulunamadı</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>{error || "İstediğiniz ürün sistemde bulunamadı veya pasif durumda."}</p>
            <Link href="/" className={styles.addToCartBtn} style={{ margin: "0 auto", width: "fit-content" }}>
              Anasayfaya Dön
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.wrapper}>
        <div className="container">
          {/* Back button */}
          <Link href={isBook ? "/yayinlar" : "/egitimlerimiz"} style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            color: "var(--text-secondary)",
            marginBottom: "32px",
            width: "fit-content"
          }}>
            <ArrowLeft size={16} />
            <span>{isBook ? "Yayınlarımıza Geri Dön" : "Eğitimlerimize Geri Dön"}</span>
          </Link>

          {/* Product Sheet Layout (Matching Live Site) */}
          <div className={styles.layout}>
            {/* LEFT SIDE: Description and Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div>
                <div className={styles.description} style={{ wordWrap: "break-word", overflowWrap: "anywhere", maxWidth: "100%", overflowX: "hidden", fontSize: "15px", lineHeight: "1.8", color: "var(--text-primary)" }} dangerouslySetInnerHTML={{ __html: course.description }} />
              </div>
            </div>

            {/* RIGHT SIDE: Floating Card with Image & Buy Button */}
            <div style={{ backgroundColor: "#f8f9fa", borderRadius: "16px", padding: "24px", border: "1px solid var(--border-color)", boxShadow: "0 10px 40px rgba(0,0,0,0.05)", position: "sticky", top: "100px" }}>
              {course.image ? (
                <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", marginBottom: "24px", borderRadius: "12px", overflow: "hidden", backgroundColor: "#fff" }}>
                  <Image src={course.image} alt={course.title} fill style={{ objectFit: "cover" }} priority />
                </div>
              ) : (
                <div style={{ width: "100%", aspectRatio: "1/1", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", marginBottom: "24px", border: "1px solid var(--border-color)" }}>
                  <BookOpen size={48} color="var(--color-accent)" />
                </div>
              )}
              
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--color-primary)", marginBottom: "24px", textAlign: "center", lineHeight: "1.4" }}>{course.title}</h3>
              
              <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "16px", border: "1px solid var(--border-color)", marginBottom: "24px", textAlign: "center" }}>
                {course.originalPrice && course.originalPrice > course.price ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "28px", fontWeight: 900, color: "#198754", lineHeight: 1 }}>
                      ₺{course.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                    </span>
                    <span style={{ textDecoration: "line-through", color: "var(--text-muted)", fontSize: "16px", fontWeight: 500 }}>
                      ₺{course.originalPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ) : (
                   <div style={{ fontSize: "28px", fontWeight: 900, color: "#198754", lineHeight: 1, marginBottom: "8px" }}>
                      ₺{course.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                   </div>
                )}
                
                {course.originalPrice && course.originalPrice > course.price && (
                   <div style={{ backgroundColor: "#ffc107", color: "#000", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", display: "inline-block" }}>
                      %{Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)} İndirim
                   </div>
                )}
              </div>

              <button 
                className={styles.addToCartBtn}
                onClick={() => addToCart({
                  id: course.id,
                  title: course.title,
                  price: course.price,
                  image: course.image || null,
                  isCouponEligible: course.isCouponEligible
                })}
                style={{ width: "100%", padding: "16px", fontSize: "16px", borderRadius: "var(--radius-md)", backgroundColor: "#be1e2d", color: "#fff", border: "none", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", fontWeight: "bold" }}
              >
                Hemen Satın Al
              </button>
              
              <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "16px", fontSize: "13px", color: "var(--text-secondary)" }}>
                 <span style={{ cursor: "pointer" }}><i className="fa-solid fa-share-nodes"></i> Paylaş</span>
                 <span style={{ cursor: "pointer" }}><i className="fa-regular fa-heart"></i> İstek Listesi</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
