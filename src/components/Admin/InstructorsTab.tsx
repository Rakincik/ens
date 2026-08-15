"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, GraduationCap, Edit, X } from "lucide-react";
import Image from "next/image";
import ImageUploader from "./Cms/ImageUploader";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useToast } from "@/contexts/ToastContext";
import styles from "@/app/admin/dashboard/admin.module.css";

export default function InstructorsTab() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [fullData, setFullData] = useState<any>({});
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentTeacher, setCurrentTeacher] = useState<any>({ name: "", title: "", bio: "", image: "" });
  
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const json = await res.json();
        const corpSettings = json.settings?.corporate_settings || {};
        setFullData(corpSettings);
        setTeachers(corpSettings.teachers || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Eğitmenler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatedData = { ...fullData, teachers };
      
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "corporate_settings", value: updatedData })
      });
      
      if (res.ok) {
        toast.success("Eğitmen kadrosu başarıyla kaydedildi!");
        setFullData(updatedData);
      } else {
        toast.error("Kaydetme işlemi başarısız oldu.");
      }
    } catch (error) {
      toast.error("Kaydetme sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setCurrentTeacher({ name: "", title: "", bio: "", image: "" });
    setEditingIndex(null);
    setShowModal(true);
  };

  const openEditModal = (index: number) => {
    setCurrentTeacher({ ...teachers[index] });
    setEditingIndex(index);
    setShowModal(true);
  };

  const handleModalSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updated = [...teachers];
      updated[editingIndex] = currentTeacher;
      setTeachers(updated);
    } else {
      setTeachers([...teachers, currentTeacher]);
    }
    setShowModal(false);
  };

  const confirmRemoveTeacher = () => {
    if (deleteIndex !== null) {
      setTeachers(teachers.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
      toast.success("Eğitmen başarıyla listeden çıkarıldı. Kalıcı olması için 'Kaydet' butonuna basmayı unutmayın.");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
        <Loader2 className="animate-spin" size={32} style={{ color: "var(--color-accent)" }} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "var(--shadow-sm)" }}>
      <div className={styles.tabHeader}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
            <GraduationCap size={24} color="var(--color-accent)" /> Eğitmen Yönetimi
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "8px", marginBottom: 0 }}>
            Platformdaki tüm eğitmenleri buradan ekleyebilir, düzenleyebilir veya silebilirsiniz.
          </p>
        </div>
        <div className={styles.tabHeaderButtons}>
          <button 
            onClick={openAddModal}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "14px", transition: "all 0.2s" }}
          >
            <Plus size={18} /> Eğitmen Ekle
          </button>
          <button 
            onClick={handleSave} disabled={saving}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 24px", backgroundColor: "var(--color-accent)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px", opacity: saving ? 0.7 : 1, transition: "all 0.2s" }}
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Kaydet
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
        {teachers.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", backgroundColor: "var(--bg-secondary)", borderRadius: "12px", border: "1px dashed var(--border-color)", color: "var(--text-secondary)" }}>
            Henüz eğitmen eklenmemiş. Sağ üstteki "Eğitmen Ekle" butonuna tıklayarak ilk eğitmeni ekleyebilirsiniz.
          </div>
        )}

        {teachers.map((teacher: any, i: number) => (
          <div key={i} style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", transition: "all 0.2s" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              {teacher.image ? (
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", overflow: "hidden", border: "2px solid #f1f5f9", position: "relative", flexShrink: 0 }}>
                  <Image src={teacher.image} alt={teacher.name || "Eğitmen"} fill style={{ objectFit: "cover" }} sizes="64px" />
                </div>
              ) : (
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", flexShrink: 0 }}>
                  <GraduationCap size={28} />
                </div>
              )}
              <div style={{ minWidth: 0, flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--color-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {teacher.name || "İsimsiz Eğitmen"}
                </h4>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {teacher.title || "Branş belirtilmedi"}
                </p>
              </div>
            </div>
            
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1 }}>
              {teacher.bio || "Biyografi eklenmemiş."}
            </p>
            
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "auto", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
              <button type="button" onClick={() => openEditModal(i)} className={`${styles.iconBtn} ${styles.iconBtnMove}`} title="Düzenle">
                <Edit size={18} />
              </button>
              <button type="button" onClick={() => setDeleteIndex(i)} className={`${styles.iconBtn} ${styles.iconBtnDelete}`} title="Sil">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* POPUP (MODAL) */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingIndex !== null ? "Eğitmeni Düzenle" : "Yeni Eğitmen Ekle"}
              </h3>
              <button type="button" className={styles.modalCloseBtn} onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleModalSave}>
              <div className={styles.modalBody}>
                <div style={{ marginBottom: "24px" }}>
                  <ImageUploader 
                    label="Eğitmen Fotoğrafı" 
                    value={currentTeacher.image || ""} 
                    onChange={(url) => setCurrentTeacher({ ...currentTeacher, image: url })} 
                    recommendedSize="Sistem otomatik optimize eder (Sınır yok)" 
                  />
                </div>
                
                <div className={styles.formGroup} style={{ marginBottom: "16px" }}>
                  <label className={styles.label} style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px", display: "block" }}>İsim Soyisim</label>
                  <input type="text" className={styles.premiumInput} value={currentTeacher.name} onChange={e => setCurrentTeacher({ ...currentTeacher, name: e.target.value })} placeholder="Örn: Rüstem Hoca" required />
                </div>
                
                <div className={styles.formGroup} style={{ marginBottom: "16px" }}>
                  <label className={styles.label} style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px", display: "block" }}>Branş / Ünvan</label>
                  <input type="text" className={styles.premiumInput} value={currentTeacher.title} onChange={e => setCurrentTeacher({ ...currentTeacher, title: e.target.value })} placeholder="Örn: Dil Bilgisi Uzmanı" required />
                </div>
                
                <div className={styles.formGroup} style={{ marginBottom: "16px" }}>
                  <label className={styles.label} style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px", display: "block" }}>Biyografi / Detay</label>
                  <textarea className={styles.premiumInput} value={currentTeacher.bio} onChange={e => setCurrentTeacher({ ...currentTeacher, bio: e.target.value })} placeholder="Eğitmen hakkında kısa açıklama..." style={{ minHeight: "100px", resize: "vertical" }} />
                </div>
              </div>
              
              <div className={styles.modalFooter}>
                <button type="button" className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setShowModal(false)}>İptal</button>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                  {editingIndex !== null ? "Güncelle" : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        onConfirm={confirmRemoveTeacher}
        title="Eğitmeni Sil"
        message={`Bu eğitmeni listeden kaldırmak istediğinize emin misiniz? (Değişikliklerin kalıcı olması için sağ üstten kaydetmelisiniz.)`}
      />
    </div>
  );
}

