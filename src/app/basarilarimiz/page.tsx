"use client";

import { useState, useEffect } from "react";
import { Award, Star, MessageSquare } from "lucide-react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "../Home.module.css";

interface Achievement {
  name: string;
  rank: string;
  year: string;
  comment: string;
  image?: string | null;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Page Config State
  const [pageConfig, setPageConfig] = useState({
    title: "Gurur Tablomuz",
    subtitle: "Yıllardır Türkçe ÖABT sınavında derece yapan ve hayallerine kavuşup atanan yüzlerce öğretmenimizin yorumları ve başarı hikayeleri.",
    stat1Number: "İlk 10 Derece",
    stat1Label: "3 Seçkin Derece",
    stat2Number: "İlk 100 Derece",
    stat2Label: "24 Başarılı Atama",
    stat3Number: "1.500+",
    stat3Label: "Atanan Türkçe Öğretmeni"
  });
  

  
  // Modal Preview Image
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPageData() {
      try {
        const response = await fetch("/api/public/settings");
        if (response.ok) {
          const data = await response.json();
          if (data.settings) {
            if (data.settings.achievements) setAchievements(data.settings.achievements);
            if (data.settings.achievementsPage) {
              setPageConfig(prev => ({
                ...prev,
                ...data.settings.achievementsPage
              }));
            }
          }
        }
      } catch (error) {
        console.error("Error loading achievements data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPageData();
  }, []);



  const filteredAchievements = achievements;

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Background Glow Blobs */}
        <div className="glow-blob glow-gold" style={{ top: "15%", left: "-150px" }} />
        <div className="glow-blob glow-slate" style={{ top: "50%", right: "-150px" }} />

        <section className={styles.section}>
          <div className="container">
            {/* Header Title */}
            <div className={styles.sectionHeader}>
              <h1 className={styles.sectionTitle}>{pageConfig.title}</h1>
              <p className={styles.sectionDesc}>{pageConfig.subtitle}</p>
            </div>





            {/* Testimonials Loading / Grid */}
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
            ) : filteredAchievements.length === 0 ? (
              <div style={{ textAlign: "center", padding: "64px 24px", color: "var(--text-secondary)" }}>
                <p>Kriterlerinize uygun derece/başarı hikayesi bulunamadı.</p>
              </div>
            ) : (
              <div className={styles.coursesGrid}>
                {filteredAchievements.map((ach, index) => {
                  const verifiedDoc = ach.image || "/osym_result_mockup.png";
                  return (
                    <div
                      key={index}
                      className={`${styles.courseCard} glass-card`}
                      style={{ 
                        padding: "32px", 
                        gap: "20px", 
                        display: "flex", 
                        flexDirection: "column",
                        position: "relative",
                        overflow: "hidden"
                      }}
                    >
                      {/* Gold Ribbon Indicator */}
                      <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "4px",
                        height: "100%",
                        background: "linear-gradient(180deg, var(--color-accent) 0%, #e2c07d 100%)"
                      }} />

                      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        {/* Student Document Icon/Thumbnail */}
                        <div 
                          style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "var(--radius-sm)",
                            backgroundColor: "var(--color-primary-light)",
                            border: "1.5px solid var(--border-color)",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            cursor: "pointer",
                            position: "relative"
                          }}
                          onClick={() => setSelectedImage(verifiedDoc)}
                          title="Sonuç Belgesini Görüntüle"
                        >
                          <img 
                            src={verifiedDoc} 
                            alt={ach.name} 
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                          />
                          <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(30, 41, 59, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "opacity 0.2s"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = "0"}
                          >
                            <span style={{ color: "white", fontSize: "10px", fontWeight: "700" }}>Belge</span>
                          </div>
                        </div>

                        {/* Student Details */}
                        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: "4px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "8px" }}>
                            <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--color-primary)" }}>
                              {ach.name}
                            </span>
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 800,
                                color: "var(--color-accent)",
                                backgroundColor: "var(--color-accent-light)",
                                padding: "4px 10px",
                                borderRadius: "var(--radius-full)",
                                border: "1px solid rgba(184, 144, 71, 0.2)",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                flexShrink: 0
                              }}
                            >
                              <Award size={12} style={{ color: "var(--color-accent)" }} />
                              <span>{ach.rank}</span>
                            </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ display: "flex", color: "var(--color-accent)" }}>
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill="var(--color-accent)" stroke="none" />
                              ))}
                            </div>
                            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
                              {ach.year}
                            </span>
                            <span style={{
                              fontSize: "10px",
                              color: "var(--color-success)",
                              backgroundColor: "rgba(21, 128, 61, 0.06)",
                              border: "1px solid rgba(21, 128, 61, 0.15)",
                              padding: "2px 6px",
                              borderRadius: "var(--radius-sm)",
                              fontWeight: 700,
                              marginLeft: "auto"
                            }}>
                              Doğrulandı
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Comment Quote Section */}
                      <div style={{ position: "relative", marginTop: "4px" }}>
                        <MessageSquare
                          size={24}
                          style={{
                            position: "absolute",
                            top: "-12px",
                            left: "-12px",
                            opacity: 0.05,
                            color: "var(--color-primary)",
                          }}
                        />
                        <p
                          style={{
                            fontStyle: "italic",
                            fontSize: "14.5px",
                            lineHeight: "1.7",
                            color: "var(--text-secondary)",
                            position: "relative",
                            zIndex: 1,
                            paddingLeft: "8px"
                          }}
                        >
                          &quot;{ach.comment}&quot;
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Verified Document Preview Modal */}
      {selectedImage && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(30, 41, 59, 0.7)",
            backdropFilter: "blur(8px)",
            zIndex: 100000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            cursor: "pointer"
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div 
            style={{
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90%",
              backgroundColor: "var(--bg-secondary)",
              padding: "12px",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-xl)",
              cursor: "default"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button 
              style={{
                position: "absolute",
                top: "-12px",
                right: "-12px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "var(--color-primary)",
                color: "white",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "var(--shadow-md)",
                fontWeight: "bold",
                fontSize: "14px"
              }}
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            
            {/* Verified Document Image */}
            <img 
              src={selectedImage} 
              alt="Sınav Sonuç Belgesi" 
              style={{ 
                maxWidth: "100%", 
                maxHeight: "80vh", 
                borderRadius: "var(--radius-md)", 
                objectFit: "contain",
                display: "block" 
              }} 
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
