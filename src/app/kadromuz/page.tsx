"use client";

import { useState, useEffect } from "react";
import { Users, GraduationCap, Award } from "lucide-react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "../Home.module.css";

export default function FacultyPage() {
  const [teachers, setTeachers] = useState<{ name: string; title: string; bio: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const response = await fetch("/api/public/settings?key=corporate_settings");
        if (response.ok) {
          const data = await response.json();
          if (data.value && data.value.teachers) setTeachers(data.value.teachers);
        }
      } catch (error) {
        console.error("Error loading teachers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTeachers();
  }, []);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h1 className={styles.sectionTitle}>Eğitmen Kadromuz</h1>
              <p className={styles.sectionDesc}>
                Türkçe ve Türk Dili Edebiyatı ÖABT sınav süreçlerinde size rehberlik edecek Türkiye&apos;nin en seçkin hoca kadrosu.
              </p>
            </div>

            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}>
                <div className={styles.spinner} style={{
                  width: "40px",
                  height: "40px",
                  border: "3px solid var(--border-color)",
                  borderTopColor: "var(--color-accent)",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }} />
              </div>
            ) : (
              <div className={styles.coursesGrid}>
                {teachers.map((t, index) => (
                  <div key={index} className={styles.courseCard} style={{ padding: "32px", gap: "16px", textAlign: "center" }}>
                    <div style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      backgroundColor: "var(--color-primary-light)",
                      margin: "0 auto 16px auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-accent)",
                      border: "2px solid var(--border-color)",
                      overflow: "hidden"
                    }}>
                      {(t as any).image ? (
                        <img src={(t as any).image} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <Users size={36} />
                      )}
                    </div>
                    <h3 style={{ fontSize: "20px", fontWeight: 700 }}>{t.name}</h3>
                    <h4 style={{ fontSize: "14px", color: "var(--color-accent)", fontWeight: 600 }}>{t.title}</h4>
                    
                    <div style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "12px",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      margin: "8px 0"
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <GraduationCap size={14} />
                        <span>Alan Eğitimi</span>
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Award size={14} />
                        <span>10+ Yıl Deneyim</span>
                      </span>
                    </div>

                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>{t.bio}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
