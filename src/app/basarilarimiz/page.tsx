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
  
  // Interactive Filters
  const [yearFilter, setYearFilter] = useState("ALL");
  const [rankFilter, setRankFilter] = useState("ALL");
  
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

  const getRankNumber = (rankStr: string) => {
    const match = rankStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 999;
  };

  const filteredAchievements = achievements.filter((ach) => {
    // Filter by year
    if (yearFilter !== "ALL" && !ach.year.includes(yearFilter)) {
      return false;
    }
    // Filter by rank category
    if (rankFilter !== "ALL") {
      const num = getRankNumber(ach.rank);
      if (rankFilter === "TOP10" && num > 10) return false;
      if (rankFilter === "TOP100" && num > 100) return false;
    }
    return true;
  });

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

            {/* General Highlights Stats Panel */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "24px",
              marginBottom: "48px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "28px 32px",
              boxShadow: "var(--shadow-md)",
              position: "relative",
              zIndex: 5
            }}>
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <div style={{ 
                  fontSize: "36px", 
                  fontWeight: 800, 
                  background: "linear-gradient(135deg, var(--color-accent) 0%, #d4af37 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>{pageConfig.stat1Number}</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-secondary)", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{pageConfig.stat1Label}</div>
              </div>
              <div style={{ 
                textAlign: "center", 
                padding: "8px 0",
                borderLeft: "1.5px solid var(--border-color)", 
                borderRight: "1.5px solid var(--border-color)" 
              }} className="stats-middle-col">
                <div style={{ 
                  fontSize: "36px", 
                  fontWeight: 800, 
                  background: "linear-gradient(135deg, var(--color-accent) 0%, #d4af37 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>{pageConfig.stat2Number}</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-secondary)", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{pageConfig.stat2Label}</div>
              </div>
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <div style={{ 
                  fontSize: "36px", 
                  fontWeight: 800, 
                  background: "linear-gradient(135deg, var(--color-accent) 0%, #d4af37 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>{pageConfig.stat3Number}</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-secondary)", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{pageConfig.stat3Label}</div>
              </div>
            </div>

            {/* Dynamic Filter Controls */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "16px",
              marginBottom: "40px"
            }}>
              {/* Year Filters */}
              <div style={{ display: "flex", gap: "4px", backgroundColor: "var(--bg-secondary)", padding: "4px", borderRadius: "var(--radius-full)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
                {[
                  { value: "ALL", label: "Tüm Yıllar" },
                  { value: "2025", label: "2025 KPSS" },
                  { value: "2024", label: "2024 KPSS" }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setYearFilter(opt.value)}
                    style={{
                      padding: "8px 18px",
                      fontSize: "13px",
                      fontWeight: 700,
                      borderRadius: "var(--radius-full)",
                      border: "none",
                      backgroundColor: yearFilter === opt.value ? "var(--color-primary)" : "transparent",
                      color: yearFilter === opt.value ? "white" : "var(--text-secondary)",
                      cursor: "pointer",
                      transition: "all var(--transition-fast)"
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Rank Filters */}
              <div style={{ display: "flex", gap: "4px", backgroundColor: "var(--bg-secondary)", padding: "4px", borderRadius: "var(--radius-full)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
                {[
                  { value: "ALL", label: "Tüm Dereceler" },
                  { value: "TOP10", label: "İlk 10 Derece" },
                  { value: "TOP100", label: "İlk 100 Derece" }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setRankFilter(opt.value)}
                    style={{
                      padding: "8px 18px",
                      fontSize: "13px",
                      fontWeight: 700,
                      borderRadius: "var(--radius-full)",
                      border: "none",
                      backgroundColor: rankFilter === opt.value ? "var(--color-primary)" : "transparent",
                      color: rankFilter === opt.value ? "white" : "var(--text-secondary)",
                      cursor: "pointer",
                      transition: "all var(--transition-fast)"
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
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
