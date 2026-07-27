"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, UploadCloud, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Image from "next/image";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import DeleteConfirmModal from "./DeleteConfirmModal";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import { useToast } from "@/contexts/ToastContext";
import styles from "@/app/admin/dashboard/admin.module.css";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  isActive: boolean;
  image: string | null;
  isCouponEligible: boolean;
  orderIndex: number;
  categoryId?: string | null;
  category?: { name: string } | null;
  type?: string;
  features?: string[];
}

interface Category {
  id: string;
  name: string;
}

export default function CoursesTab({ productType = "COURSE" }: { productType?: "COURSE" | "PUBLICATION" }) {
  const toast = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals and course state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Partial<Course> | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSavingCourse, setIsSavingCourse] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Upload helper
  const handleUploadFile = async (file: File, onUploadSuccess: (url: string) => void) => {
    try {
      const resizedBlob = await new Promise<Blob>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new window.Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject(new Error("Canvas context failed"));
            
            const targetSize = 800;
            canvas.width = targetSize;
            canvas.height = targetSize;
            
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, targetSize, targetSize);
            
            const scale = Math.min(targetSize / img.width, targetSize / img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            const x = (targetSize - w) / 2;
            const y = (targetSize - h) / 2;
            
            ctx.drawImage(img, x, y, w, h);
            
            canvas.toBlob(
              (blob) => {
                if (blob) resolve(blob);
                else reject(new Error("Canvas toBlob failed"));
              },
              "image/webp",
              0.85
            );
          };
          img.onerror = reject;
          img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const formData = new FormData();
      const originalName = file.name.split('.')[0] || 'image';
      formData.append("file", resizedBlob, `${originalName}.webp`);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Yükleme başarısız");
      
      const data = await res.json();
      onUploadSuccess(data.url);
      toast.success("Görsel başarıyla yüklendi!");
    } catch (error) {
      console.error(error);
      toast.error("Görsel yüklenirken bir hata oluştu.");
    }
  };

  async function loadCourses() {
    try {
      setLoading(true);
      const [coursesRes, catRes] = await Promise.all([
        fetch(`/api/admin/courses?type=${productType}`),
        fetch("/api/admin/categories")
      ]);
      
      if (coursesRes.ok) {
        const data = await coursesRes.json();
        setCourses(data.courses);
      } else {
        toast.error("Kurslar yüklenemedi.");
      }

      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Veriler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse?.title || !selectedCourse?.description || selectedCourse?.price === undefined) return;

    setIsSavingCourse(true);
    try {
      const isEdit = !!selectedCourse.id;
      const method = isEdit ? "PUT" : "POST";
      
      const response = await fetch("/api/admin/courses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedCourse),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Kurs kaydedilemedi.");
      } else {
        toast.success(data.message);
        setShowCourseModal(false);
        loadCourses();
      }
    } catch (err) {
      toast.error("Kaydetme işlemi sırasında hata oluştu.");
    } finally {
      setIsSavingCourse(false);
    }
  };

  const handleToggleCourseActive = async (course: Course) => {
    try {
      const response = await fetch("/api/admin/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: course.id, isActive: !course.isActive }),
      });

      if (response.ok) {
        setCourses(prev => prev.map(c => c.id === course.id ? { ...c, isActive: !c.isActive } : c));
        toast.success(`Kurs paketi ${!course.isActive ? 'aktif' : 'pasif'} hale getirildi.`);
      } else {
        toast.error("Durum güncellenemedi.");
      }
    } catch (err) {
      toast.error("Sistemsel hata oluştu.");
    }
  };

  const handleToggleCourseCoupon = async (course: Course) => {
    try {
      const response = await fetch("/api/admin/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: course.id, isCouponEligible: !course.isCouponEligible }),
      });

      if (response.ok) {
        setCourses(prev => prev.map(c => c.id === course.id ? { ...c, isCouponEligible: !c.isCouponEligible } : c));
        toast.success(`Kurs kupon kullanımı ${!course.isCouponEligible ? 'açıldı' : 'kapatıldı'}.`);
      } else {
        toast.error("Kupon durumu güncellenemedi.");
      }
    } catch (err) {
      toast.error("Sistemsel hata.");
    }
  };

  const executeDeleteCourse = async (courseId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/courses?id=${courseId}`, { method: "DELETE" });
      if (response.ok) {
        setCourses(prev => prev.filter(c => c.id !== courseId));
        toast.success("Kurs başarıyla silindi.");
        setCourseToDelete(null);
      } else {
        toast.error("Kurs silinemedi.");
      }
    } catch (err) {
      toast.error("Sistemsel hata.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (sourceIndex === destinationIndex) return;

    const newCourses = Array.from(courses);
    const [reorderedItem] = newCourses.splice(sourceIndex, 1);
    newCourses.splice(destinationIndex, 0, reorderedItem);

    const updatedCourses = newCourses.map((course, index) => ({
      ...course,
      orderIndex: index
    }));
    setCourses(updatedCourses);

    try {
      const payload = updatedCourses.map(c => ({ id: c.id, orderIndex: c.orderIndex }));
      const response = await fetch("/api/admin/courses/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("API hatası");
    } catch (err) {
      toast.error("Sıralama güncellenirken hata oluştu.");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className={styles.headerRow}>
        <h2 className={styles.viewTitle}>Kurs Paketleri</h2>
        <button 
          className={styles.btn}
          onClick={() => {
            setSelectedCourse({ title: "", description: "", price: 0, originalPrice: null, isActive: true, isCouponEligible: true, image: null, orderIndex: 0, categoryIds: [], type: productType });
            setIsCategoryDropdownOpen(false);
            setShowCourseModal(true);
          }}
        >
          <Plus size={16} />
          <span>{productType === "COURSE" ? "Yeni Kurs Paketi Ekle" : "Yeni Yayın Ekle"}</span>
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
          <div className={styles.spinner} style={{ width: "32px", height: "32px" }} />
        </div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableContainer}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: "60px", textAlign: "center" }}>Sıra</th>
                    <th>Kategori</th>
                    <th>{productType === "COURSE" ? "Kurs Adı" : "Yayın Adı"}</th>
                    <th>Açıklama</th>
                    <th>Fiyat</th>
                    <th>Kupon Uyumlu</th>
                    <th>Aktif / Pasif</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <Droppable droppableId="coursesDroppable">
                  {(provided) => (
                    <tbody ref={provided.innerRef} {...provided.droppableProps}>
                      {courses.map((course, index) => (
                        <Draggable key={course.id} draggableId={course.id} index={index}>
                          {(provided, snapshot) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`${styles.tableRow} ${snapshot.isDragging ? styles.draggingRow : ''}`}
                            >
                              <td>
                                <div {...provided.dragHandleProps} className={styles.dragHandle}>
                                  <GripVertical size={20} />
                                </div>
                              </td>
                              <td style={{ color: "var(--text-secondary)" }}>{course.categories?.map((c: any) => c.name).join(", ") || "Kategorisiz"}</td>
                              <td style={{ fontWeight: 600, color: "var(--color-primary)" }}>{course.title}</td>
                              <td style={{ maxWidth: "300px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                {course.description.replace(/<[^>]*>?/gm, '')}
                              </td>
                              <td style={{ fontWeight: 700, color: "var(--color-primary)" }}>
                                {course.price.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                              </td>
                              <td>
                                <label className={styles.switchLabel}>
                                  <input 
                                    type="checkbox" 
                                    className={styles.switchInput}
                                    checked={course.isCouponEligible}
                                    onChange={() => handleToggleCourseCoupon(course)}
                                  />
                                  <span className={styles.switchSlider} />
                                </label>
                              </td>
                              <td>
                                <label className={styles.switchLabel}>
                                  <input 
                                    type="checkbox" 
                                    className={styles.switchInput}
                                    checked={course.isActive}
                                    onChange={() => handleToggleCourseActive(course)}
                                  />
                                  <span className={styles.switchSlider} />
                                </label>
                              </td>
                              <td>
                                <div style={{ display: "flex", gap: "8px" }}>
                                  <button 
                                    className={`${styles.btn} ${styles.btnOutline}`}
                                    style={{ padding: "6px" }}
                                    onClick={() => {
                                      setSelectedCourse({ ...course, categoryIds: course.categories?.map((c: any) => c.id) || [], features: course.features || [] });
                                      setIsCategoryDropdownOpen(false);
                                      setShowCourseModal(true);
                                    }}
                                    aria-label="Düzenle"
                                  >
                                    <Edit size={14} />
                                  </button>
                                    <button 
                                      className={`${styles.btn} ${styles.btnDanger}`}
                                      style={{ padding: "6px" }}
                                      onClick={() => setCourseToDelete(course.id)}
                                      aria-label="Sil"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </table>
            </DragDropContext>
          </div>
        </div>
      )}

      {/* MODAL: KURS PAKETİ EKLE / DÜZENLE */}
      {showCourseModal && selectedCourse && (
        <div className={styles.modalOverlay} onClick={() => { setIsCategoryDropdownOpen(false); setShowCourseModal(false); }}>
          <div className={`${styles.modal} ${styles.modalWide}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {selectedCourse.id 
                  ? (productType === "COURSE" ? "Kurs Paketini Düzenle" : "Yayını Düzenle") 
                  : (productType === "COURSE" ? "Yeni Kurs Paketi Oluştur" : "Yeni Yayın Oluştur")}
              </h3>
              <button className={styles.modalCloseBtn} type="button" onClick={() => { setIsCategoryDropdownOpen(false); setShowCourseModal(false); }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCourseSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.modalGrid}>
                  {/* Sol Sütun: Kapak Görseli */}
                  <div className={styles.imageUploadColumn}>
                    <div className={styles.formGroup} style={{ height: "100%" }}>
                      <label className={styles.label}>Kapak Görseli</label>
                      {selectedCourse.image ? (
                        <div style={{ position: "relative", width: "250px", height: "250px", margin: "0 auto", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border-color)", background: "#f8fafc" }}>
                          <Image src={selectedCourse.image} alt="Kapak" fill style={{ objectFit: "contain", padding: "16px" }} />
                          <button 
                            type="button"
                            onClick={() => setSelectedCourse({ ...selectedCourse, image: null })}
                            style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(4px)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px", padding: "8px", cursor: "pointer", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", transition: "all 0.2s" }}
                            aria-label="Görseli Sil"
                            onMouseOver={(e) => e.currentTarget.style.background = "#ef4444"}
                            onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.85)"}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ width: "250px", height: "250px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed var(--border-color)", borderRadius: "12px", textAlign: "center", cursor: "pointer", transition: "all 0.2s ease", backgroundColor: "#f8fafc" }}>
                          <label style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", width: "100%" }}>
                            <input 
                              type="file" 
                              accept="image/*" 
                              style={{ display: "none" }}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleUploadFile(e.target.files[0], (url) => {
                                    setSelectedCourse({ ...selectedCourse, image: url });
                                  });
                                }
                              }}
                            />
                            <UploadCloud size={40} style={{ color: "var(--color-primary)", marginBottom: "12px" }} />
                            <span style={{ fontWeight: 600, color: "var(--color-primary)", fontSize: "15px" }}>Görsel Yüklemek İçin Tıklayın</span>
                            <span style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" }}>PNG, JPG, WEBP (Max 3MB)</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sağ Sütun: Kurs Detayları */}
                  <div className={styles.formColumn}>
                    <div className={styles.formGroup}>
                      <label>{productType === "COURSE" ? "Kurs Adı (Paket Başlığı)" : "Yayın Adı"}</label>
                      <input 
                        type="text" 
                        className={styles.input} 
                        required
                        value={selectedCourse.title || ""} 
                        onChange={(e) => setSelectedCourse({ ...selectedCourse, title: e.target.value })} 
                      />
                    </div>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label>Kategoriler (Çoklu Seçim)</label>
                        <div style={{ position: "relative" }}>
                          <button
                            type="button"
                            className={styles.input}
                            style={{ width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff" }}
                            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                          >
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {selectedCourse.categoryIds?.length 
                                ? `${selectedCourse.categoryIds.length} Kategori Seçildi` 
                                : "Kategori Seçin"}
                            </span>
                            <span style={{ fontSize: "10px", transform: isCategoryDropdownOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▼</span>
                          </button>
                          
                          {isCategoryDropdownOpen && (
                            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: "4px", zIndex: 100, display: "flex", flexDirection: "column", gap: "2px", maxHeight: "200px", overflowY: "auto", border: "1px solid var(--border-color)", borderRadius: "8px", background: "#fff", padding: "4px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}>
                              {categories.map(c => (
                                <label key={c.id} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", background: selectedCourse.categoryIds?.includes(c.id) ? "rgba(184, 144, 71, 0.08)" : "transparent", color: selectedCourse.categoryIds?.includes(c.id) ? "var(--color-primary)" : "var(--text-primary)", padding: "8px 12px", borderRadius: "6px", fontSize: "14px", transition: "background 0.2s", fontWeight: selectedCourse.categoryIds?.includes(c.id) ? 600 : 400 }}>
                                  <input 
                                    type="checkbox" 
                                    style={{ width: "16px", height: "16px", accentColor: "var(--color-primary)", cursor: "pointer" }}
                                    checked={selectedCourse.categoryIds?.includes(c.id) || false}
                                    onChange={(e) => {
                                      const currentIds = selectedCourse.categoryIds || [];
                                      if (e.target.checked) {
                                        setSelectedCourse({ ...selectedCourse, categoryIds: [...currentIds, c.id] });
                                      } else {
                                        setSelectedCourse({ ...selectedCourse, categoryIds: currentIds.filter((id: string) => id !== c.id) });
                                      }
                                    }}
                                  />
                                  {c.name}
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "16px" }}>
                      <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label className={styles.label}>Fiyat (TL)</label>
                        <input
                          className={styles.input}
                          type="text"
                          value={selectedCourse.price !== undefined ? new Intl.NumberFormat("tr-TR").format(selectedCourse.price) : ""}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setSelectedCourse({ ...selectedCourse, price: val ? parseInt(val) : 0 });
                          }}
                          required
                          style={{ fontSize: "16px", padding: "14px 16px" }}
                        />
                      </div>
                      <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label className={styles.label}>Eski Fiyat (TL)</label>
                        <input
                          className={styles.input}
                          type="text"
                          value={selectedCourse.originalPrice ? new Intl.NumberFormat("tr-TR").format(selectedCourse.originalPrice) : ""}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setSelectedCourse({ ...selectedCourse, originalPrice: val ? parseInt(val) : null });
                          }}
                          placeholder="İsteğe bağlı"
                          style={{ fontSize: "16px", padding: "14px 16px" }}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Açıklama (Zengin Metin)</label>
                      <div style={{ background: "#fff", color: "#000", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
                        <ReactQuill 
                          theme="snow" 
                          value={selectedCourse.description || ""} 
                          onChange={(content) => setSelectedCourse({ ...selectedCourse, description: content })}
                          style={{ height: "230px", border: "none", paddingBottom: "42px" }}
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup} style={{ marginTop: "16px" }}>
                      <label className={styles.label}>Özellikler (Tikli Maddeler)</label>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="Örn: Güvenli PayTR Altyapısı"
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (newFeature.trim()) {
                                setSelectedCourse(prev => ({ ...prev, features: [...(prev?.features || []), newFeature.trim()] }));
                                setNewFeature("");
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          className={`${styles.btn} ${styles.btnOutline}`}
                          onClick={() => {
                            if (newFeature.trim()) {
                              setSelectedCourse(prev => ({ ...prev, features: [...(prev?.features || []), newFeature.trim()] }));
                              setNewFeature("");
                            }
                          }}
                        >
                          Ekle
                        </button>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {(selectedCourse.features || []).map((feature, idx) => (
                          <div key={idx} style={{ display: "flex", alignItems: "center", gap: "4px", background: "var(--color-primary-light)", color: "var(--color-primary)", padding: "4px 8px", borderRadius: "16px", fontSize: "13px", fontWeight: 500 }}>
                            <span>{feature}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCourse(prev => ({
                                  ...prev,
                                  features: (prev?.features || []).filter((_, i) => i !== idx)
                                }));
                              }}
                              style={{ display: "flex", background: "transparent", border: "none", color: "var(--color-primary)", cursor: "pointer", padding: "0" }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button 
                  className={`${styles.btn} ${styles.btnOutline}`} 
                  type="button" 
                  onClick={() => { setIsCategoryDropdownOpen(false); setShowCourseModal(false); }}
                >
                  İptal
                </button>
                <button 
                  className={styles.btn} 
                  type="submit" 
                  disabled={isSavingCourse}
                >
                  {selectedCourse.id ? "Güncelle" : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onConfirm={() => { if(courseToDelete) executeDeleteCourse(courseToDelete); }}
        title="Kursu Sil"
        message="Bu kurs paketini silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        isDeleting={isDeleting}
      />
    </div>
  );
}
