"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";
import { Loader2, Plus, Trash2, Edit, Save, X, Tag, Hash, Info } from "lucide-react";
import styles from "@/app/admin/dashboard/admin.module.css";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface Category {
  id: string;
  name: string;
  orderIndex: number;
}

export default function CategoriesTab() {
  const toast = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Partial<Category> | null>(null);
  const [saving, setSaving] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      toast.error("Kategoriler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCat?.name) return;

    setSaving(true);
    try {
      const isEdit = !!selectedCat.id;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch("/api/admin/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedCat)
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setShowModal(false);
        loadCategories();
      } else {
        toast.error(data.error || "İşlem başarısız.");
      }
    } catch (err) {
      toast.error("Kaydetme işlemi sırasında hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const executeDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
        toast.success("Kategori başarıyla silindi.");
        setCategoryToDelete(null);
      } else {
        toast.error("Silinemedi.");
      }
    } catch (err) {
      toast.error("Sistemsel hata.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
        <Loader2 className="animate-spin" size={32} style={{ color: "var(--color-accent)" }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className={styles.headerRow}>
        <h2 className={styles.viewTitle}>Kategori Yönetimi</h2>
        <button 
          className={styles.btn}
          onClick={() => {
            setSelectedCat({ name: "", orderIndex: 0 });
            setShowModal(true);
          }}
        >
          <Plus size={16} />
          <span>Yeni Kategori Ekle</span>
        </button>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sıra (Order)</th>
                <th>Kategori Adı</th>
                <th style={{ width: "150px" }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
                    Kategori bulunamadı.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id}>
                    <td style={{ fontWeight: 600, color: "var(--color-primary)" }}>{cat.orderIndex}</td>
                    <td>{cat.name}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionBtn} onClick={() => { setSelectedCat(cat); setShowModal(true); }}>
                          <Edit size={16} />
                        </button>
                        <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => setCategoryToDelete(cat.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedCat && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} style={{ maxWidth: "500px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{selectedCat.id ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}</h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Kategori Adı</label>
                <div className={styles.inputWrapper}>
                  <Tag className={styles.inputIcon} size={18} />
                  <input 
                    type="text" 
                    className={`${styles.input} ${styles.inputWithIcon}`} 
                    style={{ width: "100%" }}
                    required
                    autoFocus
                    placeholder="Örn: Canlı Eğitimler"
                    value={selectedCat.name || ""} 
                    onChange={(e) => setSelectedCat({ ...selectedCat, name: e.target.value })} 
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Sıralama Numaranız</label>
                <div className={styles.inputWrapper}>
                  <Hash className={styles.inputIcon} size={18} />
                  <input 
                    type="number" 
                    className={`${styles.input} ${styles.inputWithIcon}`}
                    style={{ width: "100%" }}
                    value={selectedCat.orderIndex || 0} 
                    onChange={(e) => setSelectedCat({ ...selectedCat, orderIndex: parseInt(e.target.value) || 0 })} 
                  />
                </div>
                <span className={styles.formHelperText}>
                  <Info size={14} /> Küçük numaralar vitrinde daha üstte gösterilir (Örn: 1).
                </span>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={`${styles.btn} ${styles.btnOutlineMuted}`} onClick={() => setShowModal(false)}>İptal</button>
                <button type="submit" className={styles.btn} disabled={saving}>
                  {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={() => { if(categoryToDelete) executeDelete(categoryToDelete); }}
        title="Kategoriyi Sil"
        message="Kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        isDeleting={isDeleting}
      />
    </div>
  );
}
