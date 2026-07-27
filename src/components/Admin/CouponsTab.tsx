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
      <div className={styles.headerRow}>
        <h2 className={styles.viewTitle}>{isInfluencerMode ? "Influencer Marketing" : "İndirim Kuponları"}</h2>
        <button 
          className={styles.btn}
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
          <Plus size={16} />
          <span>{isInfluencerMode ? "Influencer Kuponu Oluştur" : "Kupon Oluştur"}</span>
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
          <div className={styles.spinner} style={{ width: "32px", height: "32px" }} />
        </div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Kupon Kodu</th>
                  {isInfluencerMode && <th>Influencer</th>}
                  <th>Türü</th>
                  <th>Değeri</th>
                  <th>Kullanım</th>
                  <th>Geçerlilik</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan={isInfluencerMode ? 8 : 7} style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>
                      Henüz kupon bulunmuyor.
                    </td>
                  </tr>
                ) : coupons.map((coupon) => {
                  const associatedCourse = courses.find(c => c.id === coupon.courseId);
                  
                  return (
                    <tr key={coupon.id}>
                      <td style={{ fontWeight: 700, fontFamily: "monospace", color: "var(--color-accent)" }}>{coupon.code}</td>
                      {isInfluencerMode && (
                        <td>
                          <div style={{ fontWeight: 600 }}>{coupon.influencerName}</div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{coupon.influencerEmail}</div>
                        </td>
                      )}
                      <td>{coupon.discountType === "PERCENTAGE" ? "Yüzdesel (%)" : "Sabit Tutar (TL)"}</td>
                      <td style={{ fontWeight: 600 }}>
                        {coupon.discountType === "PERCENTAGE" 
                          ? `%${coupon.discountValue}` 
                          : `${coupon.discountValue} TL`}
                      </td>
                      <td>
                        {coupon.usageCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ""}
                      </td>
                      <td>
                        <div style={{ fontSize: "12px" }}>
                          {coupon.startDate ? new Date(coupon.startDate).toLocaleDateString("tr-TR") : "Belirsiz"} - 
                          {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString("tr-TR") : "Süresiz"}
                        </div>
                      </td>
                      <td>
                        <label className={styles.switchLabel}>
                          <input 
                            type="checkbox" 
                            className={styles.switchInput}
                            checked={coupon.isActive}
                            onChange={() => handleToggleCouponActive(coupon)}
                          />
                          <span className={styles.switchSlider} />
                        </label>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button 
                            className={`${styles.btn} ${styles.btnOutline}`}
                            style={{ padding: "6px" }}
                            onClick={() => setStatsCoupon(coupon)}
                            aria-label="Performans Göster"
                            title="Performans Grafikleri"
                          >
                            <BarChart2 size={14} />
                          </button>
                          <button 
                            className={`${styles.btn} ${styles.btnOutline}`}
                            style={{ padding: "6px" }}
                            onClick={() => {
                              setSelectedCoupon(coupon);
                              setShowCouponModal(true);
                            }}
                            aria-label="Düzenle"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className={`${styles.btn} ${styles.btnDanger}`}
                            style={{ padding: "6px" }}
                            onClick={() => setCouponToDelete(coupon.id)}
                            aria-label="Sil"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: KUPON EKLE / DÜZENLE */}
      {showCouponModal && selectedCoupon && (
        <div className={styles.modalOverlay} onClick={() => setShowCouponModal(false)}>
          <div className={styles.modal} style={{ maxWidth: "550px", overflow: "visible" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{selectedCoupon.id ? "Kuponu Düzenle" : "Yeni İndirim Kuponu Oluştur"}</h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowCouponModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCouponSubmit}>
              <div className={styles.modalBody} style={{ overflow: "visible" }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Kupon Kodu (Örn: HOCA20)</label>
                  <input
                    className={styles.input}
                    style={{ textTransform: "uppercase" }}
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
                  <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                      <label className={styles.label}>Influencer Adı Soyadı</label>
                      <input
                        className={styles.input}
                        type="text"
                        value={selectedCoupon.influencerName || ""}
                        onChange={(e) => setSelectedCoupon({ ...selectedCoupon, influencerName: e.target.value })}
                        required={isInfluencerMode}
                      />
                    </div>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                      <label className={styles.label}>Influencer E-posta</label>
                      <input
                        className={styles.input}
                        type="email"
                        value={selectedCoupon.influencerEmail || ""}
                        onChange={(e) => setSelectedCoupon({ ...selectedCoupon, influencerEmail: e.target.value })}
                        required={isInfluencerMode}
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label className={styles.label}>İndirim Türü</label>
                    <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                        <input 
                          type="radio" 
                          name="discountType" 
                          value="PERCENTAGE" 
                          checked={selectedCoupon.discountType === "PERCENTAGE"}
                          onChange={() => setSelectedCoupon({ ...selectedCoupon, discountType: "PERCENTAGE" })}
                        /> Yüzdesel (%)
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                        <input 
                          type="radio" 
                          name="discountType" 
                          value="FIXED" 
                          checked={selectedCoupon.discountType === "FIXED"}
                          onChange={() => setSelectedCoupon({ ...selectedCoupon, discountType: "FIXED" })}
                        /> Sabit Tutar
                      </label>
                    </div>
                  </div>

                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label className={styles.label}>İndirim Değeri</label>
                    <input
                      className={styles.input}
                      type="number"
                      value={selectedCoupon.discountValue !== undefined ? selectedCoupon.discountValue : ""}
                      onChange={(e) => setSelectedCoupon({ ...selectedCoupon, discountValue: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup} style={{ position: "relative" }}>
                  <label className={styles.label}>Uygulanacağı Ders Paketi (Boş bırakılırsa tüm sepete uygulanır)</label>
                  <div 
                    className={styles.input} 
                    style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white" }}
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

                <div style={{ display: "flex", gap: "16px" }}>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label className={styles.label}>Kullanım Limiti (Opsiyonel)</label>
                    <input
                      className={styles.input}
                      type="number"
                      placeholder="Sınırsız"
                      value={selectedCoupon.usageLimit || ""}
                      onChange={(e) => setSelectedCoupon({ ...selectedCoupon, usageLimit: e.target.value ? parseInt(e.target.value) : null })}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px" }}>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label className={styles.label}>Başlangıç Tarihi (Opsiyonel)</label>
                    <input
                      className={styles.input}
                      type="date"
                      value={selectedCoupon.startDate ? selectedCoupon.startDate.split("T")[0] : ""}
                      onChange={(e) => setSelectedCoupon({ ...selectedCoupon, startDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                    />
                  </div>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label className={styles.label}>Son Kullanma Tarihi (Opsiyonel)</label>
                    <input
                      className={styles.input}
                      type="date"
                      value={selectedCoupon.expiryDate ? selectedCoupon.expiryDate.split("T")[0] : ""}
                      onChange={(e) => setSelectedCoupon({ ...selectedCoupon, expiryDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
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
