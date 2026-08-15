"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ChevronRight, BookOpen, Star, Clock, Filter, ArrowRight, PlayCircle, Lock, Menu, ShieldCheck, HelpCircle, ChevronDown, ChevronLeft, ShoppingCart, Search, Check, CheckCircle, Phone, Users } from "lucide-react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./Home.module.css";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  isActive: boolean;
  image: string | null;
  isCouponEligible: boolean;
  paymentLink?: string | null;
  categories?: { id: string; name: string }[];
}

export default function Home() {
  const { addToCart } = useCart();
  const toast = useToast();
  const { user } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);
  const [teachers, setTeachers] = useState<{ name: string; title: string; bio: string; image?: string }[]>([]);
  const [achievements, setAchievements] = useState<{ name: string; rank: string; year: string; comment: string }[]>([]);
  const [aboutUs, setAboutUs] = useState<{ title?: string; content?: string; mission?: string; vision?: string; image?: string } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  // Dynamic Slider States
  const [sliders, setSliders] = useState<{ title: string; subtitle: string; buttonText: string; buttonLink: string; image?: string }[]>([]);
  const [stats, setStats] = useState<{ value: string; label: string }[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // E-Commerce Filters
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("DEFAULT");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const sortOptions = [
    { value: "DEFAULT", label: "Sıralama: Varsayılan" },
    { value: "PRICE_ASC", label: "Fiyat: Düşükten Yükseğe" },
    { value: "PRICE_DESC", label: "Fiyat: Yüksekten Düşüğe" },
    { value: "NAME_ASC", label: "İsme Göre: A-Z" },
    { value: "NAME_DESC", label: "İsme Göre: Z-A" }
  ];

  const filteredAndSortedCourses = courses
    .filter((course) => {
      if (selectedCategory !== "ALL") {
        if (!course.categories?.some(cat => cat.name === selectedCategory)) return false;
      }
      return course.title.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "PRICE_ASC") return a.price - b.price;
      if (sortBy === "PRICE_DESC") return b.price - a.price;
      if (sortBy === "NAME_ASC") return a.title.localeCompare(b.title, "tr");
      if (sortBy === "NAME_DESC") return b.title.localeCompare(a.title, "tr");
      return 0;
    });

  // İletişim Formu Eyaleti
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [submittingContact, setSubmittingContact] = useState(false);

  // Kursları ve CMS İçeriklerini Sunucudan Çek
  useEffect(() => {
    async function fetchPageData() {
      try {
        setLoading(true);
        // Kursları çek
        const coursesRes = await fetch("/api/public/courses?type=COURSE");
        if (coursesRes.ok) {
          const data = await coursesRes.json();
          setCourses(data.courses);
        }

        // Kategorileri çek
        const catRes = await fetch("/api/public/categories?type=COURSE");
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories || []);
        }

        // CMS İçeriklerini çek
        const settingsRes = await fetch("/api/public/settings");
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          const s = data.settings;
          
          if (s.legal_settings?.faq) setFaqs(s.legal_settings.faq);
          if (s.corporate_settings?.teachers) setTeachers(s.corporate_settings.teachers);
          if (s.corporate_settings?.achievements) setAchievements(s.corporate_settings.achievements);
          if (s.corporate_settings?.aboutUs) setAboutUs(s.corporate_settings.aboutUs);
          if (s.homepage_settings?.slider) {
            setSliders(s.homepage_settings.slider);
          } else if (s.slider) {
            setSliders(s.slider); // Fallback for old data
          }
          if (s.homepage_settings?.stats) {
            setStats(s.homepage_settings.stats);
          } else if (s.stats) {
            setStats(s.stats);
          }
        }
      } catch (error) {
        console.error("Home Page Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPageData();
  }, []);

  // Slide Rotation Timer
  useEffect(() => {
    if (sliders.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliders]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingContact(true);
    
    // Test amaçlı formu simüle ediyoruz
    setTimeout(() => {
      toast.success("Mesajınız başarıyla iletildi! En kısa sürede sizinle iletişime geçeceğiz.");
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setContactMsg("");
      setSubmittingContact(false);
    }, 1000);
  };

  const toggleFaq = (index: number) => {
    if (faqOpenIndex === index) {
      setFaqOpenIndex(null);
    } else {
      setFaqOpenIndex(index);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Decorative Background Glow Blobs */}
        <div className="glow-blob glow-gold" style={{ top: "10%", left: "-150px" }} />
        <div className="glow-blob glow-slate" style={{ top: "45%", right: "-150px" }} />
        <div className="glow-blob glow-gold" style={{ bottom: "10%", left: "10%" }} />

        {/* FULL-WIDTH HERO SLIDER SECTION */}
        <section className={styles.hero} style={{ 
          position: "relative", 
          overflow: "hidden",
          padding: 0
        }}>
          {loading ? (
            <div style={{ width: "100%", minHeight: "480px", backgroundColor: "var(--bg-secondary)" }} />
          ) : sliders.length > 0 ? (
            <div style={{
              display: "flex",
              width: "100%",
              transition: "transform 0.5s ease-in-out",
              transform: `translateX(-${currentSlide * 100}%)`
            }}>
              {sliders.map((slide, slideIdx) => (
                <div 
                  key={slideIdx}
                  className={styles.slideItem}
                  style={{
                    backgroundImage: slide.image ? `url(${slide.image})` : "none",
                    backgroundColor: slide.image ? "transparent" : "var(--bg-secondary)",
                    padding: slide.image ? "0" : "80px 0 100px 0",
                    cursor: (slide.image && slide.buttonLink && slide.buttonLink !== "#") ? "pointer" : "default"
                  }}
                  onClick={() => {
                    if (slide.image && slide.buttonLink && slide.buttonLink !== "#") {
                      window.location.href = slide.buttonLink;
                    }
                  }}
                >
                  {/* Sadece görsel yüklü DEĞİLSE eski tipteki metinleri ve butonları göster */}
                  {!slide.image && (
                    <div className={`${styles.heroLayout} container`} style={{ minHeight: "420px" }}>
                      {/* Left Content */}
                      <div className={styles.heroContent} style={{ color: "var(--color-primary)", minHeight: "260px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <div className={styles.badge} style={{ backgroundColor: "var(--color-primary-light)", borderColor: "var(--border-color)", color: "var(--color-primary)" }}>
                          🥇 <span className={styles.badgeAccent} style={{ color: "var(--color-accent)" }}>ÖSYM Uyumlu</span> Türkçe & Edebiyat ÖABT
                        </div>
                        <h1 className={styles.heroTitle} style={{ color: "var(--color-primary)" }}>
                          {slide.title}
                        </h1>
                        <p className={styles.heroDesc} style={{ color: "var(--text-secondary)" }}>
                          {slide.subtitle}
                        </p>
                        <div className={styles.heroActions}>
                          <a href={slide.buttonLink} className={styles.heroBtn}>
                            {slide.buttonText}
                          </a>
                          <a href="#iletisim" className={`${styles.heroBtn} ${styles.heroBtnOutline}`} style={{ color: "var(--color-primary)", borderColor: "var(--color-primary)" }}>
                            Ön Bilgi Al
                          </a>
                        </div>
                      </div>

                      {/* Right Content */}
                      <div className={styles.heroImageArea} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "380px" }}>
                        {slideIdx === 0 ? (
                          <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gridTemplateRows: "repeat(2, 1fr)",
                            gap: "16px",
                            width: "100%",
                            maxWidth: "500px",
                            height: "320px"
                          }}>
                            {(teachers.length > 0 ? teachers.slice(0, 6) : [
                              { name: "Enes Kaan Şahin", title: "Dört Temel Beceri" },
                              { name: "Asım Kara", title: "Yeni Türk Edebiyatı" },
                              { name: "Ali Zeybek", title: "Halk Edebiyatı" },
                              { name: "İlker Hayat", title: "Eski Türk Edebiyatı" },
                              { name: "Fatih Bedir", title: "Dil Bilgisi" },
                              { name: "İsa Kurtul", title: "Çocuk Edebiyatı" }
                            ]).map((teacher, idx) => (
                              <div key={idx} style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textAlign: "center",
                                backgroundColor: "var(--bg-secondary)",
                                border: "1.5px solid var(--border-color)",
                                borderRadius: "var(--radius-md)",
                                padding: "16px 12px",
                                boxShadow: "var(--shadow-sm)"
                              }}>
                                <div style={{
                                  width: "56px",
                                  height: "56px",
                                  borderRadius: "50%",
                                  backgroundColor: "var(--color-primary-light)",
                                  color: "var(--color-accent)",
                                  display: "flex",
                                  flexShrink: 0,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 700,
                                  fontSize: "18px",
                                  border: "2px solid var(--color-accent)",
                                  marginBottom: "8px",
                                  overflow: "hidden"
                                }}>
                                  {(teacher as any).image ? (
                                    <img src={(teacher as any).image} alt={teacher.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  ) : (
                                    teacher.name.split(" ").map(n => n[0]).join("")
                                  )}
                                </div>
                                <h4 style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-primary)", lineHeight: "1.2" }}>{teacher.name}</h4>
                                <p style={{ fontSize: "10px", color: "var(--text-secondary)", marginTop: "4px", lineHeight: "1.2" }}>{(teacher as any).title}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          /* Slide 1: Success ranking badges */
                          <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            gap: "20px",
                            width: "100%",
                            maxWidth: "500px",
                            height: "320px",
                            backgroundColor: "var(--color-primary)",
                            padding: "32px 40px",
                            borderRadius: "var(--radius-lg)",
                            color: "white",
                            boxShadow: "var(--shadow-lg)",
                            background: "linear-gradient(135deg, var(--color-primary) 0%, #222e3f 100%)"
                          }}>
                            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase" }}>
                              Zirvedekilerin Tercihi
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>
                                <span>Büşra Özbağ</span>
                                <strong style={{ color: "var(--color-accent)" }}>Türkiye 1.si (Rehberlik)</strong>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>
                                <span>Ali Yılmaz</span>
                                <strong style={{ color: "var(--color-accent)" }}>Türkiye 3.sü (Türkçe)</strong>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "4px" }}>
                                <span>Merve Kaya</span>
                                <strong style={{ color: "var(--color-accent)" }}>Türkiye 7.si (Edebiyat)</strong>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={`${styles.heroLayout} container`} style={{ padding: "80px 0" }}>
              <div className={styles.heroContent}>
                <div className={styles.badge}>
                  🥇 <span className={styles.badgeAccent}>ÖSYM Uyumlu</span> Türkçe & Edebiyat ÖABT
                </div>
                <h1 className={styles.heroTitle}>
                  Türkçe ÖABT&apos;de Türkiye&apos;nin En İyi Kadrosuyla Sınava Hazırlanın
                </h1>
                <p className={styles.heroDesc}>
                  Özel hazırlık programları, her hafta güncellenen deneme sınavları, konu anlatımlı dijital kaynaklar ve Rüstem Hoca mentörlüğünde alanınızda fark yaratın.
                </p>
                <div className={styles.heroActions}>
                  <a href="#kurslar" className={styles.heroBtn}>
                    Eğitimleri İncele
                  </a>
                  <a href="#iletisim" className={`${styles.heroBtn} ${styles.heroBtnOutline}`}>
                    Ön Bilgi Al
                  </a>
                </div>
              </div>
              <div className={styles.heroImageArea}>
                <div className={styles.heroImageWrapper}>
                  <div className={styles.heroImagePlaceholder}>
                    <BookOpen size={48} />
                    <span style={{ fontSize: "14px", fontWeight: "600" }}>Canlı Eğitim Hub (Önizleme)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dots & Arrows Navigation */}
          {sliders.length > 1 && (
            <>
              {/* Left Arrow */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? sliders.length - 1 : prev - 1))}
                style={{
                  position: "absolute",
                  left: "24px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(30, 41, 59, 0.5)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  zIndex: 10
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "var(--color-primary)"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.5)"}
                aria-label="Önceki Slayt"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Right Arrow */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % sliders.length)}
                style={{
                  position: "absolute",
                  right: "24px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(30, 41, 59, 0.5)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  zIndex: 10
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "var(--color-primary)"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.5)"}
                aria-label="Sonraki Slayt"
              >
                <ChevronRight size={24} />
              </button>

              {/* Dots */}
              <div style={{
                position: "absolute",
                bottom: "24px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "12px",
                zIndex: 10
              }}>
                {sliders.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      border: "none",
                      backgroundColor: currentSlide === index ? "var(--color-accent)" : "rgba(255, 255, 255, 0.5)",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                    }}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* COURSES / PRODUCTS SECTION (DİREKT ANASAYFADA SERGİLEME) */}
        <section id="kurslar" className={styles.section} style={{ backgroundColor: "var(--bg-secondary)" }}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Eğitim Paketlerimiz</h2>
              <p className={styles.sectionDesc}>
                Sınava hazırlık sürecinizde ihtiyacınıza en uygun paketi seçin, hemen kaydolup derse başlayın.
              </p>
            </div>

            {/* E-Ticaret Filtreleri */}
            <div className={styles.filterRow}>
              {/* Sol taraf: Kategori Pilleri */}
              <div className={styles.categoryGroup}>
                <button
                  className={`${styles.categoryBtn} ${selectedCategory === "ALL" ? styles.categoryBtnActive : ""}`}
                  onClick={() => setSelectedCategory("ALL")}
                >
                  TÜMÜ
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`${styles.categoryBtn} ${selectedCategory === cat.name ? styles.categoryBtnActive : ""}`}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Sağ taraf: Arama & Sıralama */}
              <div className={styles.filterControls}>
                <div className={styles.searchWrapper}>
                  <input
                    type="text"
                    placeholder="Ara..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search size={14} className={styles.searchIcon} />
                </div>

                {/* Özel Premium Seçim/Sıralama Dropdown Menüsü */}
                <div style={{ position: "relative", zIndex: 100 }}>
                  <button
                    type="button"
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      padding: "10px 16px",
                      fontSize: "13px",
                      fontWeight: 600,
                      border: "1.5px solid var(--border-color)",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--bg-secondary)",
                      color: "var(--color-primary)",
                      cursor: "pointer",
                      minWidth: "190px",
                      transition: "all var(--transition-fast)"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--color-accent)"}
                    onMouseLeave={(e) => {
                      if (!sortDropdownOpen) e.currentTarget.style.borderColor = "var(--border-color)";
                    }}
                  >
                    <span>{sortOptions.find(opt => opt.value === sortBy)?.label || "Sıralama: Varsayılan"}</span>
                    <ChevronDown size={14} style={{
                      transform: sortDropdownOpen ? "rotate(180deg)" : "none",
                      transition: "transform var(--transition-fast)"
                    }} />
                  </button>

                  {sortDropdownOpen && (
                    <div style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      right: 0,
                      backgroundColor: "var(--bg-primary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                      padding: "6px",
                      minWidth: "220px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      animation: "fadeIn 0.2s ease-out"
                    }}>
                      {sortOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.value);
                            setSortDropdownOpen(false);
                          }}
                          style={{
                            padding: "10px 12px",
                            fontSize: "13px",
                            fontWeight: sortBy === opt.value ? "700" : "500",
                            textAlign: "left",
                            border: "none",
                            backgroundColor: sortBy === opt.value ? "var(--color-primary-light)" : "transparent",
                            color: sortBy === opt.value ? "var(--color-primary)" : "var(--text-secondary)",
                            borderRadius: "var(--radius-sm)",
                            cursor: "pointer",
                            transition: "all var(--transition-fast)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                          onMouseEnter={(e) => {
                            if (sortBy !== opt.value) {
                              e.currentTarget.style.backgroundColor = "rgba(184, 144, 71, 0.05)";
                              e.currentTarget.style.color = "var(--color-primary)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (sortBy !== opt.value) {
                              e.currentTarget.style.backgroundColor = "transparent";
                              e.currentTarget.style.color = "var(--text-secondary)";
                            }
                          }}
                        >
                          <span>{opt.label}</span>
                          {sortBy === opt.value && <Check size={12} style={{ color: "var(--color-accent)" }} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
              <div style={{ textAlign: "center", padding: "64px 24px", color: "var(--text-secondary)" }}>
                <p>Kriterlerinize uygun bir eğitim paketi bulunamadı.</p>
              </div>
            ) : (
              <div className={styles.coursesGrid}>
                {filteredAndSortedCourses.map((course) => (
                  <div key={course.id} className={styles.courseCard}>
                    <Link href={`/urun/${course.id}`}>
                      <div className={styles.courseImgWrapper} style={{ position: "relative", width: "100%", aspectRatio: "1/1", overflow: "hidden" }}>
                        {course.image ? (
                          <Image src={course.image} alt={course.title} fill style={{ objectFit: "cover", backgroundColor: "var(--bg-secondary)" }} />
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
                          
                          // Extract summary from the bottom of the text
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
                                  window.open(course.paymentLink as string, '_blank');
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
        </section>

        {/* DERECE VE BAŞARILARIMIZ SECTION */}
        {achievements.length > 0 && (
          <section className={styles.section} style={{ backgroundColor: "var(--bg-primary)" }}>
            <div className="container">
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Başarı Hikayelerimiz</h2>
                <p className={styles.sectionDesc}>
                  Her yıl Türkçe ÖABT sınavında derece yapan yüzlerce öğretmen adayına rehberlik ediyoruz.
                </p>
              </div>

              <div className={styles.coursesGrid}>
                {achievements.map((ach, index) => (
                  <div key={index} className={styles.courseCard} style={{ padding: "32px", gap: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, color: "var(--color-primary)" }}>{ach.name}</span>
                      <span style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "var(--color-accent)",
                        backgroundColor: "var(--color-accent-light)",
                        padding: "4px 10px",
                        borderRadius: "var(--radius-sm)",
                        border: "1.5px solid var(--border-color)"
                      }}>{ach.rank}</span>
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>{ach.year} Sınavı</span>
                    <p style={{ fontStyle: "italic", fontSize: "14px" }}>&quot;{ach.comment}&quot;</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* HAKKIMIZDA SECTION (BAŞARILARIMIZDAN SONRA) */}
        {aboutUs && (aboutUs.title || aboutUs.content) && (
          <section className={styles.section} style={{ backgroundColor: "var(--bg-secondary)" }}>
            <div className="container">
              <div style={{ display: "grid", gridTemplateColumns: aboutUs.image ? "1fr 1fr" : "1fr", gap: "48px", alignItems: "center" }}>
                {aboutUs.image && (
                  <div style={{ position: "relative", width: "100%", height: "400px", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
                    <Image src={aboutUs.image} alt={aboutUs.title || "Hakkımızda"} fill style={{ objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <h2 className={styles.sectionTitle} style={{ textAlign: "left", marginBottom: 0 }}>
                    {aboutUs.title || "Biz Kimiz?"}
                  </h2>
                  <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
                    {aboutUs.content}
                  </p>
                  
                  {(aboutUs.mission || aboutUs.vision) && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "16px" }}>
                      {aboutUs.vision && (
                        <div style={{ padding: "20px", backgroundColor: "var(--bg-primary)", borderRadius: "12px", borderLeft: "4px solid var(--color-accent)" }}>
                          <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-primary)", marginBottom: "8px" }}>Vizyonumuz</h4>
                          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>{aboutUs.vision}</p>
                        </div>
                      )}
                      {aboutUs.mission && (
                        <div style={{ padding: "20px", backgroundColor: "var(--bg-primary)", borderRadius: "12px", borderLeft: "4px solid var(--color-primary)" }}>
                          <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-primary)", marginBottom: "8px" }}>Misyonumuz</h4>
                          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>{aboutUs.mission}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* EĞİTMEN KADROMUZ SECTION */}
        {teachers.length > 0 && (
          <section className={styles.section} style={{ backgroundColor: "var(--bg-primary)" }}>
            <div className="container">
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Uzman Eğitmen Kadromuz</h2>
                <p className={styles.sectionDesc}>
                  Alan sınavında yüksek netler hedefleyenler için Türkiye&apos;nin en deneyimli kadrosu.
                </p>
              </div>

              <div className={styles.coursesGrid}>
                {teachers.map((t, index) => (
                  <div key={index} className={styles.courseCard} style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    overflow: "hidden", 
                    textAlign: "center",
                    padding: 0
                  }}>
                    <div style={{
                      width: "100%",
                      aspectRatio: "4 / 5",
                      backgroundColor: "var(--color-primary-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-accent)",
                      borderBottom: "3px solid var(--color-accent)",
                      overflow: "hidden"
                    }}>
                      {(t as any).image ? (
                        <img 
                          src={(t as any).image} 
                          alt={t.name} 
                          style={{ 
                            width: "100%", 
                            height: "100%", 
                            objectFit: "cover",
                            objectPosition: "top"
                          }} 
                        />
                      ) : (
                        <Users size={48} />
                      )}
                    </div>
                    
                    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>{t.name}</h3>
                      <h4 style={{ fontSize: "13px", color: "var(--color-accent)", fontWeight: 600, margin: 0 }}>{t.title}</h4>
                      {t.bio && (
                        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6", margin: 0 }}>
                          {t.bio}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SSS SECTION */}
        {faqs.length > 0 && (
          <section className={styles.section} style={{ backgroundColor: "var(--bg-primary)" }}>
            <div className="container">
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Sıkça Sorulan Sorular</h2>
                <p className={styles.sectionDesc}>
                  Eğitim sürecimiz, yayınlar ve ödeme detayları hakkında aklınıza takılan soruların yanıtları.
                </p>
              </div>

              <div className={styles.faqContainer}>
                {faqs.map((faq, index) => {
                  const isOpen = faqOpenIndex === index;
                  return (
                    <div
                      key={index}
                      className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}
                    >
                      <button
                        className={styles.faqQuestion}
                        onClick={() => toggleFaq(index)}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown size={18} style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform var(--transition-fast)"
                        }} />
                      </button>
                      
                      {isOpen && (
                        <div className={styles.faqAnswer}>
                          <p>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* İLETİŞİM / BİLGİ ALMA FORMU */}
        <section id="iletisim" className={styles.section} style={{ backgroundColor: "var(--bg-secondary)" }}>
          <div className="container" style={{ maxWidth: "600px" }}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Ön Bilgi Alın</h2>
              <p className={styles.sectionDesc}>
                Eğitim paketlerimiz hakkında detaylı bilgi almak veya aklınıza takılanları sormak için formu doldurun, sizi arayalım.
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className={styles.contactForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="cname">Adınız Soyadınız</label>
                <input
                  className={styles.formInput}
                  id="cname"
                  type="text"
                  placeholder="Ahmet Yılmaz"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="cemail">E-posta Adresiniz</label>
                <input
                  className={styles.formInput}
                  id="cemail"
                  type="email"
                  placeholder="ahmet@example.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="cphone">Telefon Numaranız</label>
                <input
                  className={styles.formInput}
                  id="cphone"
                  type="tel"
                  placeholder="0 (555) 555 55 55"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="cmsg">Mesajınız</label>
                <textarea
                  className={styles.formInput}
                  style={{ minHeight: "120px", resize: "vertical" }}
                  id="cmsg"
                  placeholder="Eğitimleriniz hakkında bilgi almak istiyorum..."
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  required
                />
              </div>

              <button
                className={styles.formSubmitBtn}
                type="submit"
                disabled={submittingContact}
              >
                <Phone size={16} />
                <span>{submittingContact ? "Gönderiliyor..." : "Bilgi Edin"}</span>
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
