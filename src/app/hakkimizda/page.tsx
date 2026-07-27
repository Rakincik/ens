"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Target, Heart } from "lucide-react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "../Home.module.css";
import Image from "next/image";

export default function AboutPage() {
  const [aboutUs, setAboutUs] = useState<{ title?: string; content?: string; mission?: string; vision?: string; image?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/public/settings");
        if (response.ok) {
          const data = await response.json();
          if (data.settings?.corporate_settings?.aboutUs) {
            setAboutUs(data.settings.corporate_settings.aboutUs);
          }
        }
      } catch (error) {
        console.error("Error loading about us:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);
  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.section}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.sectionTitle}>{aboutUs?.title || "Hakkımızda"}</h1>
              <p className={styles.sectionDesc}>
                Türkçe ÖABT hazırlık sürecinde öğretmen adaylarına rehberlik eden kurumsal ve akademik vizyonumuz.
              </p>
            </div>

            {aboutUs?.image && (
              <div style={{ position: "relative", width: "100%", height: "400px", borderRadius: "16px", overflow: "hidden", marginBottom: "48px", boxShadow: "var(--shadow-lg)" }}>
                <Image src={aboutUs.image} alt={aboutUs.title || "Hakkımızda"} fill style={{ objectFit: "cover" }} />
              </div>
            )}

            {/* Vizyon & Misyon */}
            <div className={styles.coursesGrid} style={{ gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "48px" }}>
              <div className={styles.courseCard} style={{ padding: "32px", gap: "16px", display: "flex", flexDirection: "column" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--color-primary-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-accent)"
                }}>
                  <Target size={24} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Vizyonumuz</h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                  {aboutUs?.vision || "Teknolojiyi ve akademik birikimi bir araya getirerek, Türkiye'nin dört bir yanındaki Türkçe öğretmen adaylarına en nitelikli alan eğitimi desteğini sunmak ve sınav süreçlerinde rehberlik lideri olmak."}
                </p>
              </div>

              <div className={styles.courseCard} style={{ padding: "32px", gap: "16px", display: "flex", flexDirection: "column" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--color-primary-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-accent)"
                }}>
                  <Heart size={24} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Misyonumuz</h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                  {aboutUs?.mission || "ÖSYM formatına tam uyumlu canlı dersler, özgün yayınlar ve profesyonel rehberlik programları ile öğretmenlerimizin KPSS Alan sınavından (ÖABT) en yüksek netleri elde etmelerini sağlamak."}
                </p>
              </div>
            </div>

            {/* Tarihçe / Kurumsal Metin */}
            <div className={styles.courseCard} style={{ padding: "40px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <h2 style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <ShieldCheck size={20} style={{ color: "var(--color-accent)" }} />
                <span>Akademik Birikim ve Kalite Standartları</span>
              </h2>
              <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
                {aboutUs?.content || `Platformumuz, Türkçe ÖABT hazırlık süreçlerinde uzun yıllardır derece yapan öğretmenlerin tecrübeleri ve Rüstem Hoca liderliğindeki uzman akademisyenlerin çalışmalarıyla kurulmuştur. 
                
Sıradan ezberci eğitim yöntemleri yerine, ÖSYM'nin soru tarzlarını analiz eden derinlemesine konu anlatımları ve dil bilgisi çözüm kampları sunuyoruz. Sınav gününe kadar her öğrencimizin motivasyonunu yüksek tutmak amacıyla rehberlik ve koçluk desteğini canlı derslerimizin ayrılmaz bir parçası olarak konumlandırıyoruz.`}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
