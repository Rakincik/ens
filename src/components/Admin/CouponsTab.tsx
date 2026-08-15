"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, BarChart2, ChevronDown } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import styles from "@/app/admin/dashboard/admin.module.css";
import DeleteConfirmModal from "./DeleteConfirmModal";
import CouponStatsModal from "./CouponStatsModal";

interface Course {
  id: string;
  title: string;
  price: number;
}

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  courseId?: string | null;
  isActive: boolean;
  startDate: string | null;
  expiryDate: string | null;
  usageLimit: number | null;
  usageCount: number;
  influencerName: string | null;
  influencerEmail: string | null;
  orders?: any[];
}

interface CouponsTabProps {
  isInfluencerMode?: boolean;
}

export default function CouponsTab({ isInfluencerMode = false }: CouponsTabProps) {
  const toast = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals and coupon state
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Partial<Coupon> | null>(null);
  const [isSavingCoupon, setIsSavingCoupon] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statsCoupon, setStatsCoupon] = useState<Coupon | null>(null);
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/coupons");
      const coursesRes = await fetch("/api/admin/courses");
      
      if (res.ok) {
        const data = await res.json();
        // Filtreleme: Influencer Modundaysa sadece influencerName dolu olanları getir, yoksa boş olanları getir
        const filteredCoupons = data.coupons.filter((c: Coupon) => 
          isInfluencerMode ? !!c.influencerName : !c.influencerName
        );
        setCoupons(filteredCoupons);
      } else {
        toast.error("Kuponlar yüklenemedi.");
      }

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData.courses);
      }
    } catch (err) {
      console.error(err);
      toast.error("Veriler yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoupon?.code || !selectedCoupon?.discountType || selectedCoupon?.discountValue === undefined) return;

    setIsSavingCoupon(true);
    try {
      const isEdit = !!selectedCoupon.id;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch("/api/admin/coupons", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedCoupon),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Kupon kaydedilemedi.");
      } else {
        toast.success(data.message);
        setShowCouponModal(false);
        loadData();
      }
    } catch (err) {
      toast.error("Kupon kaydedilirken hata oluştu.");
    } finally {
      setIsSavingCoupon(false);
    }
  };

  const handleToggleCouponActive = async (coupon: Coupon) => {
    try {
      const response = await fetch("/api/admin/coupons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: coupon.id, isActive: !coupon.isActive }),
      });

      if (response.ok) {
        setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, isActive: !c.isActive } : c));
        toast.success(`Kupon ${!coupon.isActive ? 'aktif' : 'pasif'} yapıldı.`);
      }
    } catch (err) {
      toast.error("Sistemsel hata.");
    }
  };

  const executeDeleteCoupon = async (couponId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/coupons?id=${couponId}`, { method: "DELETE" });
      if (response.ok) {
        setCoupons(prev => prev.filter(c => c.id !== couponId));
        toast.success("Kupon başarıyla silindi.");
        setCouponToDelete(null);
      }
    } catch (err) {
      toast.error("Sistemsel hata.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className={styles.tabHeader}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--color-primary)", margin: 0 }}>
            {isInfluencerMode ? "Influencer Marketing" : "İndirim Kuponları"}
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "8px", marginBottom: 0 }}>
            {isInfluencerMode ? "Influencer işbirlikleri ve performans takibi" : "Satışları artırmak için promosyon kuponları oluşturun."}
          </p>
        </div>
        <div className={styles.tabHeaderButtons}>
          <button 
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px 16px", backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "14px", transition: "all 0.2s" }}
            onClick={() => {
              setSelectedCoupon({ 
                code: "", 
                discountType: "PERCENTAGE", 
                discountValue: 10, 
                courseId: "", 
                isActive: true,
                startDate: null,
                expiryDate: null,
                usageLimit: null,
                influencerName: isInfluencerMode ? "" : null,
                influencerEmail: isInfluencerMode ? "" : null
              });
              setShowCouponModal(true);
            }}
          >
            <Plus size={18} />
            <span>{isInfluencerMode ? "Influencer Ekle" : "Kupon Oluştur"}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
          <div className={styles.spinner} style={{ width: "32px", height: "32px" }} />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {coupons.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", backgroundColor: "var(--bg-secondary)", borderRadius: "12px", border: "1px dashed var(--border-color)", color: "var(--text-muted)" }}>
              Henüz kupon bulunmuyor. Sağ üstteki butondan yeni kupon oluşturabilirsiniz.
            </div>
          ) : coupons.map((coupon) => {
            const isPercent = coupon.discountType === "PERCENTAGE";
            
            return (
              <div key={coupon.id} style={{ display: "flex", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid var(--border-color)", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", position: "relative", transition: "all 0.2s" }}>
                {/* Left side: Ticket Value */}
                <div style={{ width: "100px", backgroundColor: "var(--color-primary-light)", borderRight: "2px dashed var(--border-color)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", color: "var(--color-primary)", flexShrink: 0 }}>
                  <span style={{ fontSize: "24px", fontWeight: 800 }}>
                    {isPercent ? `%${coupon.discountValue}` : `₺${coupon.discountValue}`}
                  </span>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 700, marginTop: "4px", letterSpacing: "0.5px" }}>İndirim</span>
                </div>
                
                {/* Right side: Ticket Details */}
                <div style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: "12px", minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--color-accent)", letterSpacing: "1px", fontFamily: "monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {coupon.code}
                      </div>
                      {isInfluencerMode && (
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginTop: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {coupon.influencerName}
                        </div>
                      )}
                    </div>
                    <label className={styles.switchLabel} style={{ flexShrink: 0 }}>
                      <input 
                        type="checkbox" 
                        className={styles.switchInput}
                        checked={coupon.isActive}
                        onChange={() => handleToggleCouponActive(coupon)}
                      />
                      <span className={styles.switchSlider} />
                    </label>
                  </div>
                  
                  <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "var(--text-muted)", marginTop: "auto" }}>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Kullanım</div>
                      <div>{coupon.usageCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : " (Sınır yok)"}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Geçerlilik</div>
                      <div>{coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString("tr-TR") : "Süresiz"}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", borderTop: "1px solid var(--border-color)", paddingTop: "12px", marginTop: "4px" }}>
                    <button 
                      className={`${styles.iconBtn} ${styles.iconBtnMove}`} 
                      onClick={() => setStatsCoupon(coupon)} 
                      title="Performans Grafikleri"
                    >
                      <BarChart2 size={16} />
                    </button>
                    <button 
                      className={`${styles.iconBtn} ${styles.iconBtnMove}`} 
                      onClick={() => { setSelectedCoupon(coupon); setShowCouponModal(true); }} 
                      title="Düzenle"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className={`${styles.iconBtn} ${styles.iconBtnDelete}`} 
                      onClick={() => setCouponToDelete(coupon.id)} 
                      title="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: KUPON EKLE / DÜZENLE */}
      {showCouponModal && selectedCoupon && (
        <div className={styles.modalOverlay} onClick={() => setShowCouponModal(false)}>
          <div className={styles.modal} style={{ maxWidth: "550px", width: "95%", maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "20px", overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader} style={{ borderRadius: "20px 20px 0 0" }}>
              <h3 className={styles.modalTitle}>{selectedCoupon.id ? "Kuponu Düzenle" : "Yeni İndirim Kuponu Oluştur"}</h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowCouponModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCouponSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <div className={styles.modalBody} style={{ overflowY: "auto", overflowX: "hidden", padding: "16px", flex: 1 }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Kupon Kodu (Örn: HOCA20)</label>
                  <input
                    className={styles.input}
                    style={{ textTransform: "uppercase", width: "100%", boxSizing: "border-box" }}
                    type="text"
                    value={selectedCoupon.code || ""}
                    onChange={(e) => {
                      let val = e.target.value.toUpperCase();
                      // Türkçe karakterleri ve boşlukları temizle
                      val = val.replace(/Ç/g, 'C').replace(/Ğ/g, 'G').replace(/İ/g, 'I').replace(/Ö/g, 'O').replace(/Ş/g, 'S').replace(/Ü/g, 'U');
                      val = val.replace(/[^A-Z0-9]/g, '');
                      setSelectedCoupon({ ...selectedCoupon, code: val });
                    }}
                    required
                  />
                </div>

                {isInfluencerMode && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "16px" }}>
                    <div className={styles.formGroup} style={{ flex: "1 1 200px" }}>
                      <label className={styles.label}>Influencer Adı Soyadı</label>
                      <input
                        className={styles.premiumInput || styles.input}
                        style={{ width: "100%", boxSizing: "border-box" }}
                        type="text"
                        value={selectedCoupon.influencerName || ""}
                        onChange={(e) => setSelectedCoupon({ ...selectedCoupon, influencerName: e.target.value })}
                        required={isInfluencerMode}
                      />
                    </div>
                    <div className={styles.formGroup} style={{ flex: "1 1 200px" }}>
                      <label className={styles.label}>Influencer E-posta</label>
                      <input
                        className={styles.premiumInput || styles.input}
                        style={{ width: "100%", boxSizing: "border-box" }}
                        type="email"
                        value={selectedCoupon.influencerEmail || ""}
                        onChange={(e) => setSelectedCoupon({ ...selectedCoupon, influencerEmail: e.target.value })}
                        required={isInfluencerMode}
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "16px" }}>
                  <div className={styles.formGroup} style={{ flex: "1 1 200px" }}>
                    <label className={styles.label}>İndirim Türü</label>
                    <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
                        <input 
                          type="radio" 
                          name="discountType" 
                          value="PERCENTAGE" 
                          style={{ width: "16px", height: "16px", accentColor: "var(--color-accent)" }}
                          checked={selectedCoupon.discountType === "PERCENTAGE"}
                          onChange={() => setSelectedCoupon({ ...selectedCoupon, discountType: "PERCENTAGE" })}
                        /> Yüzdesel (%)
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
                        <input 
                          type="radio" 
                          name="discountType" 
                          value="FIXED" 
                          style={{ width: "16px", height: "16px", accentColor: "var(--color-accent)" }}
                          checked={selectedCoupon.discountType === "FIXED"}
                          onChange={() => setSelectedCoupon({ ...selectedCoupon, discountType: "FIXED" })}
                        /> Sabit Tutar
                      </label>
                    </div>
                  </div>

                  <div className={styles.formGroup} style={{ flex: "1 1 200px" }}>
                    <label className={styles.label}>İndirim Değeri</label>
                    <input
                      className={styles.premiumInput || styles.input}
                      style={{ width: "100%", boxSizing: "border-box" }}
                      type="number"
                      value={selectedCoupon.discountValue !== undefined ? selectedCoupon.discountValue : ""}
                      onChange={(e) => setSelectedCoupon({ ...selectedCoupon, discountValue: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup} style={{ position: "relative", marginTop: "16px" }}>
                  <label className={styles.label}>Uygulanacağı Ders Paketi (Boş bırakılırsa tüm sepete uygulanır)</label>
                  <div 
                    className={styles.premiumInput || styles.input} 
                    style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", width: "100%", boxSizing: "border-box" }}
                    onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
                  >
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {selectedCoupon.courseId 
                        ? courses.find(c => c.id === selectedCoupon.courseId)?.title || "Tüm Sepet (Genel İndirim)"
                        : "Tüm Sepet (Genel İndirim)"}
                    </span>
                    <ChevronDown size={16} style={{ transform: isCourseDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s", flexShrink: 0 }} />
                  </div>
                  {isCourseDropdownOpen && (
                    <div style={{ 
                      position: "absolute", 
                      top: "100%", 
                      left: 0, 
                      right: 0, 
                      marginTop: "4px", 
                      backgroundColor: "white", 
                      border: "1px solid var(--border-color, #e2e8f0)", 
                      borderRadius: "8px", 
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", 
                      zIndex: 9999,
                      maxHeight: "200px",
                      overflowY: "auto"
                    }}>
                      <div 
                        style={{ padding: "10px 12px", cursor: "pointer", borderBottom: "1px solid var(--border-color, #e2e8f0)", borderRadius: "8px 8px 0 0" }}
                        onClick={() => { setSelectedCoupon({ ...selectedCoupon, courseId: null }); setIsCourseDropdownOpen(false); }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        Tüm Sepet (Genel İndirim)
                      </div>
                      {courses.map((course, index) => (
                        <div 
                          key={course.id}
                          style={{ 
                            padding: "10px 12px", 
                            cursor: "pointer", 
                            borderBottom: index !== courses.length - 1 ? "1px solid var(--border-color, #e2e8f0)" : "none",
                            borderRadius: index === courses.length - 1 ? "0 0 8px 8px" : "0"
                          }}
                          onClick={() => { setSelectedCoupon({ ...selectedCoupon, courseId: course.id }); setIsCourseDropdownOpen(false); }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          {course.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "16px" }}>
                  <div className={styles.formGroup} style={{ flex: "1 1 100%" }}>
                    <label className={styles.label}>Kullanım Limiti (Opsiyonel)</label>
                    <input
                      className={styles.premiumInput || styles.input}
                      style={{ width: "100%", boxSizing: "border-box" }}
                      type="number"
                      placeholder="Sınırsız"
                      value={selectedCoupon.usageLimit || ""}
                      onChange={(e) => setSelectedCoupon({ ...selectedCoupon, usageLimit: e.target.value ? parseInt(e.target.value) : null })}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "16px" }}>
                  <div className={styles.formGroup} style={{ flex: "1 1 200px" }}>
                    <label className={styles.label}>Başlangıç Tarihi (Opsiyonel)</label>
                    <input
                      className={styles.premiumInput || styles.input}
                      style={{ width: "100%", boxSizing: "border-box" }}
                      type="date"
                      value={selectedCoupon.startDate ? selectedCoupon.startDate.split("T")[0] : ""}
                      onChange={(e) => setSelectedCoupon({ ...selectedCoupon, startDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                    />
                  </div>
                  <div className={styles.formGroup} style={{ flex: "1 1 200px" }}>
                    <label className={styles.label}>Son Kullanma Tarihi (Opsiyonel)</label>
                    <input
                      className={styles.premiumInput || styles.input}
                      style={{ width: "100%", boxSizing: "border-box" }}
                      type="date"
                      value={selectedCoupon.expiryDate ? selectedCoupon.expiryDate.split("T")[0] : ""}
                      onChange={(e) => setSelectedCoupon({ ...selectedCoupon, expiryDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                    />
                  </div>
                </div>
              </div>

              <div 
                className={styles.modalFooter} 
                style={{ backgroundColor: "#ffffff", borderTop: "1px solid var(--border-color, #e2e8f0)", padding: "16px", marginTop: "auto" }}
              >
                <button 
                  className={`${styles.btn} ${styles.btnOutline}`} 
                  type="button" 
                  onClick={() => setShowCouponModal(false)}
                >
                  İptal
                </button>
                <button 
                  className={styles.btn} 
                  type="submit" 
                  disabled={isSavingCoupon}
                >
                  {selectedCoupon.id ? "Güncelle" : "Oluştur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!couponToDelete}
        onClose={() => setCouponToDelete(null)}
        onConfirm={() => { if(couponToDelete) executeDeleteCoupon(couponToDelete); }}
        title="Kuponu Sil"
        message="Bu kuponu silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        isDeleting={isDeleting}
      />

      {statsCoupon && (
        <CouponStatsModal
          isOpen={!!statsCoupon}
          onClose={() => setStatsCoupon(null)}
          coupon={statsCoupon}
        />
      )}
    </div>
  );
}
