"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Search, ShoppingCart, Filter, RotateCcw, CheckCircle } from "lucide-react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import styles from "../Home.module.css";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  image: string | null;
  isCouponEligible: boolean;
  paymentLink?: string | null;
  categories?: { id: string; name: string }[];
}

export default function CoursesPage() {
  const { addToCart } = useCart();
  const toast = useToast();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  // E-Ticaret Filtre Eyaletleri (Sola Taşıdık)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState("DEFAULT");

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const [coursesRes, catRes] = await Promise.all([
          fetch("/api/public/courses?type=COURSE"),
          fetch("/api/public/categories?type=COURSE")
        ]);

        if (coursesRes.ok) {
          const data = await coursesRes.json();
          // type=COURSE olduğu için hepsi eğitim
          setCourses(data.courses || []);
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories || []);
        }
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const handleCategoryToggle = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory("ALL");
    } else {
      setSelectedCategory(category);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setSortBy("DEFAULT");
  };

  const filteredAndSortedCourses = courses
    .filter((course) => {
      // 1. Kategori Filtresi
      if (selectedCategory !== "ALL") {
        if (!course.categories?.some(cat => cat.name === selectedCategory)) return false;
      }
      // 2. Arama Filtresi
      return course.title.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "PRICE_ASC") return a.price - b.price;
      if (sortBy === "PRICE_DESC") return b.price - a.price;
      if (sortBy === "NAME_ASC") return a.title.localeCompare(b.title, "tr");
      if (sortBy === "NAME_DESC") return b.title.localeCompare(a.title, "tr");
      return 0;
    });

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h1 className={styles.sectionTitle}>Eğitim Paketlerimiz</h1>
              <p className={styles.sectionDesc}>
                Türkçe ÖABT ve Edebiyat ÖABT hazırlık sürecinde hedeflerinize en uygun, güncel ve nitelikli eğitim paketlerimizi inceleyin.
              </p>
            </div>

            {/* İki Sütunlu Katalog Düzeni */}
            <div className={styles.catalogLayout}>
              {/* SOL SÜTUN: Filtreler */}
              <aside className={styles.filterSidebar}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
                  <Filter size={22} color="var(--color-primary)" />
                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--color-primary)", margin: 0, letterSpacing: "-0.5px" }}>Filtrele</h3>
                </div>

                {/* Arama */}
                <div style={{ marginBottom: "32px" }}>
                  <h4 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "12px", letterSpacing: "1px" }}>Eğitim Ara</h4>
                  <div style={{ position: "relative" }}>
                    <Search size={16} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      type="text"
                      placeholder="Ders adı yazın..."
                      className={styles.searchInput}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: "100%", padding: "14px 16px 14px 44px", borderRadius: "12px", border: "1.5px solid var(--border-color)", fontSize: "14px", outline: "none", transition: "all 0.2s", backgroundColor: "var(--bg-primary)" }}
                    />
                  </div>
                </div>

                {/* Kategoriler */}
                <div style={{ marginBottom: "32px" }}>
                  <h4 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "12px", letterSpacing: "1px" }}>Kategoriler</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <button 
                      onClick={() => handleCategoryToggle("ALL")}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "12px 16px", borderRadius: "12px", width: "100%", textAlign: "left",
                        backgroundColor: selectedCategory === "ALL" ? "var(--color-primary)" : "transparent",
                        color: selectedCategory === "ALL" ? "#fff" : "var(--text-primary)",
                        fontWeight: selectedCategory === "ALL" ? 700 : 500,
                        border: selectedCategory === "ALL" ? "1px solid var(--color-primary)" : "1px solid transparent",
                        transition: "all 0.2s",
                        cursor: "pointer"
                      }}
                    >
                      Tüm Eğitimler
                      {selectedCategory === "ALL" && <CheckCircle size={16} color="#fff" />}
                    </button>
                    {categories.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => handleCategoryToggle(cat.name)}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "12px 16px", borderRadius: "12px", width: "100%", textAlign: "left",
                          backgroundColor: selectedCategory === cat.name ? "var(--color-primary)" : "transparent",
                          color: selectedCategory === cat.name ? "#fff" : "var(--text-primary)",
                          fontWeight: selectedCategory === cat.name ? 700 : 500,
                          border: selectedCategory === cat.name ? "1px solid var(--color-primary)" : "1px solid transparent",
                          transition: "all 0.2s",
                          cursor: "pointer"
                        }}
                      >
                        {cat.name}
                        {selectedCategory === cat.name && <CheckCircle size={16} color="#fff" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtreleri Temizle Butonu */}
                <button 
                  onClick={clearAllFilters}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    width: "100%", padding: "14px", borderRadius: "12px",
                    backgroundColor: "var(--bg-primary)", border: "1.5px solid var(--border-color)",
                    color: "var(--text-secondary)", fontWeight: 600, fontSize: "14px",
                    cursor: "pointer", transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--color-error)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "var(--color-error)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-primary)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border-color)"; }}
                >
                  <RotateCcw size={16} />
                  <span>Filtreleri Temizle</span>
                </button>
              </aside>

              {/* SAĞ SÜTUN: Kurs Listesi */}
              <div className={styles.catalogMain}>
                <div className={styles.catalogTopbar}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-primary)" }}>
                    Eğitimler ({filteredAndSortedCourses.length})
                  </div>

                  <select
                    className={styles.sortSelect}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="DEFAULT">Varsayılan Sıralama</option>
                    <option value="PRICE_ASC">Fiyat: Düşükten Yükseğe</option>
                    <option value="PRICE_DESC">Fiyat: Yüksekten Düşüğe</option>
                    <option value="NAME_ASC">İsme Göre: A-Z</option>
                    <option value="NAME_DESC">İsme Göre: Z-A</option>
                  </select>
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
                ) : filteredAndSortedCourses.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "64px 16px", color: "var(--text-secondary)" }}>
                    <p>Kriterlerinize uygun aktif bir eğitim paketi bulunamadı.</p>
                  </div>
                ) : (
                  <div className={styles.coursesGrid}>
                    {filteredAndSortedCourses.map((course) => (
                      <div key={course.id} className={styles.courseCard}>
                        <Link href={`/urun/${course.id}`}>
                          <div className={styles.courseImgWrapper} style={{ position: "relative", width: "100%", aspectRatio: "1/1", overflow: "hidden", backgroundColor: "#fff" }}>
                        {course.image ? (
                          <Image src={course.image} alt={course.title} fill style={{ objectFit: "cover" }} />
                        ) : (
                          <BookOpen size={40} />
                        )}
                      </div>
                        </Link>
                        
                        <div className={styles.courseContent}>
                          <Link href={`/urun/${course.id}`}>
                            <h3 className={styles.courseTitle} title={course.title}>{course.title}</h3>
                          </Link>
                          <div className={styles.courseDesc}>
                            {course.description ? (() => {
                              let cleanText = course.description
                                .replace(/<\/(p|div|h[1-6]|li)>/gi, '\n')
                                .replace(/<br\s*\/?>/gi, '\n')
                                .replace(/<[^>]*>?/gm, '')
                                .replace(/&nbsp;/g, ' ')
                                .replace(/&amp;/g, '&')
                                .replace(/&quot;/g, '"')
                                .replace(/&#39;/g, "'")
                                .replace(/&lt;/g, '<')
                                .replace(/&gt;/g, '>')
                                .replace(/&rdquo;/g, '"')
                                .replace(/&ldquo;/g, '"');
                              
                              const parts = cleanText.split(/özet\s*[:\-]*\s*/i);
                              if (parts.length > 1) {
                                cleanText = parts.pop()?.trim() || '';
                              } else {
                                cleanText = cleanText.replace(/\n+/g, ' ').trim();
                              }
                              
                              if (!cleanText || cleanText === '...') return null;
                              return cleanText.length > 120 ? cleanText.substring(0, 120) + '...' : cleanText;
                            })() : ''}
                          </div>
                          
                          <div className={styles.courseFooter}>
                            <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "6px" }}>
                              {course.originalPrice && course.originalPrice > course.price ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span style={{ textDecoration: "line-through", color: "var(--text-muted)", fontSize: "14px", fontWeight: 500 }}>
                                    ₺{course.originalPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                                  </span>
                                  <span style={{ backgroundColor: "var(--color-error)", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>
                                    %{Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)} İndirim
                                  </span>
                                </div>
                              ) : null}
                              <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                                <span className={styles.coursePrice}>
                                  ₺{course.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                                </span>
                                {course.paymentLink ? (
                                  <button
                                    className={styles.addToCartBtn}
                                    style={{ backgroundColor: "#198754" }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (!user) {
                                        toast.error("Lütfen satın almadan önce giriş yapın veya kayıt olun.");
                                        window.location.href = "/auth/login";
                                      } else {
                                        window.open(course.paymentLink as string, '_blank');
                                      }
                                    }}
                                  >
                                    <CheckCircle size={16} />
                                    <span>Satın Al / Kaydol</span>
                                  </button>
                                ) : (
                                  <button
                                    className={styles.addToCartBtn}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      addToCart({
                                        id: course.id,
                                        title: course.title,
                                        price: course.price,
                                        image: course.image,
                                        isCouponEligible: course.isCouponEligible
                                      });
                                    }}
                                  >
                                    <ShoppingCart size={16} />
                                    <span>Sepete Ekle</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
