"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Search, ShoppingCart, Filter, RotateCcw, CheckCircle } from "lucide-react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useCart } from "@/contexts/CartContext";
import styles from "../Home.module.css";

interface Publication {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  image: string | null;
  isCouponEligible: boolean;
  categories?: { id: string; name: string }[];
}

export default function PublicationsPage() {
  const { addToCart } = useCart();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  // E-Ticaret Filtre Eyaletleri (Sola Taşıdık)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState("DEFAULT");

  useEffect(() => {
    async function fetchPublications() {
      try {
        setLoading(true);
        const response = await fetch("/api/public/courses");
        if (response.ok) {
          const data = await response.json();
          const books = data.courses.filter((course: any) =>
            course.type === "PUBLICATION" ||
            course.categories?.some((c: any) => c.name === "Yayınlar" || c.name === "Kitap") || 
            course.title.toLowerCase().includes("kitap") || course.title.toLowerCase().includes("yayın")
          );
          setPublications(books);

          const allCatMap = new Map<string, {id: string, name: string}>();
          books.forEach((book: any) => {
            if (book.categories) {
              book.categories.forEach((c: any) => {
                if (c.name !== "Yayınlar" && c.name !== "Kitap") {
                  allCatMap.set(c.name, c);
                }
              });
            }
          });
          setCategories(Array.from(allCatMap.values()));
        }
      } catch (error) {
        console.error("Error loading publications:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPublications();
  }, []);


  const handleCategoryToggle = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory("ALL"); // Zaten seçiliyse kaldır
    } else {
      setSelectedCategory(category);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setSortBy("DEFAULT");
  };

  const filteredAndSortedPublications = publications
    .filter((pub) => {
      // 1. Kategori Filtresi
      if (selectedCategory !== "ALL") {
        if (!pub.categories?.some(cat => cat.name === selectedCategory)) return false;
      }
      // 2. Arama Filtresi
      return pub.title.toLowerCase().includes(searchQuery.toLowerCase());
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
              <h1 className={styles.sectionTitle}>Yayınlarımız</h1>
              <p className={styles.sectionDesc}>
                Öğretmenlik Alan Bilgisi Sınavı (ÖABT) için özel olarak hazırlanan, tamamı özgün çözümlü soru bankası, konu anlatımı ve branş denemesi kitaplarımız.
              </p>
            </div>

            {/* İki Sütunlu Katalog Düzeni */}
            <div className={styles.catalogLayout}>
              {/* SOL SÜTUN: Gelişmiş Filtre Paneli */}
              {/* SOL SÜTUN: Gelişmiş Filtre Paneli */}
              <aside className={styles.sidebarFilter} style={{ background: "transparent", border: "none", padding: 0 }}>
                {/* Arama Kutusu */}
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder="Kitap veya yayın ara..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: "100%", padding: "14px 16px 14px 44px", borderRadius: "12px",
                        border: "1.5px solid var(--border-color)", backgroundColor: "var(--bg-primary)",
                        fontSize: "15px", transition: "all 0.2s", outline: "none", color: "var(--text-primary)"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                      onBlur={(e) => e.target.style.borderColor = "var(--border-color)"}
                    />
                    <Search size={18} style={{ position: "absolute", left: "16px", color: "var(--text-muted)" }} />
                  </div>
                </div>

                {/* Kitap Kategorileri */}
                <div style={{ marginBottom: "24px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>YAYIN TÜRLERİ</h4>
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
                        transition: "all 0.2s", cursor: "pointer"
                      }}
                    >
                      Tüm Yayınlar
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
                            transition: "all 0.2s", cursor: "pointer"
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

              {/* SAĞ SÜTUN: Kitap Listesi */}
              <div className={styles.catalogMain}>
                <div className={styles.catalogTopbar}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-primary)" }}>
                    Yayınlar ({filteredAndSortedPublications.length})
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
                ) : filteredAndSortedPublications.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "64px 16px", color: "var(--text-secondary)" }}>
                    <p>Kriterlerinize uygun fiziksel yayın bulunamadı.</p>
                  </div>
                ) : (
                  <div className={styles.coursesGrid}>
                    {filteredAndSortedPublications.map((pub) => (
                      <div key={pub.id} className={styles.courseCard}>
                        <Link href={`/urun/${pub.id}`}>
                          <div className={styles.courseImgWrapper} style={{ position: "relative", width: "100%", aspectRatio: "1/1", overflow: "hidden", backgroundColor: "#fff" }}>
                            {pub.image ? (
                              <Image src={pub.image} alt={pub.title} fill style={{ objectFit: "cover" }} />
                            ) : (
                              <BookOpen size={40} />
                            )}
                          </div>
                        </Link>
                        
                        <div className={styles.courseContent}>
                          <Link href={`/urun/${pub.id}`}>
                            <h3 className={styles.courseTitle}>{pub.title}</h3>
                          </Link>
                          <div className={styles.courseDesc}>
                            {pub.description ? pub.description.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...' : ''}
                          </div>
                          
                          <div className={styles.courseFooter}>
                            <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "6px" }}>
                              {pub.originalPrice && pub.originalPrice > pub.price ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span style={{ textDecoration: "line-through", color: "var(--text-muted)", fontSize: "14px", fontWeight: 500 }}>
                                    ₺{pub.originalPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                                  </span>
                                  <span style={{ backgroundColor: "var(--color-error)", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>
                                    %{Math.round(((pub.originalPrice - pub.price) / pub.originalPrice) * 100)} İndirim
                                  </span>
                                </div>
                              ) : null}
                              <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                                <span className={styles.coursePrice}>
                                  ₺{pub.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                                </span>
                                <button
                                  className={styles.addToCartBtn}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    addToCart({
                                      id: pub.id,
                                      title: pub.title,
                                      price: pub.price,
                                      image: null,
                                      isCouponEligible: pub.isCouponEligible
                                    });
                                  }}
                                >
                                  <ShoppingCart size={16} />
                                  <span>Sepete Ekle</span>
                                </button>
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
