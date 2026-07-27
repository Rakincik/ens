"use client";

import React, { useState, useEffect, useRef } from "react";
import { Save, Loader2, Plus, Trash2, GraduationCap } from "lucide-react";
import ImageUploader from "./Cms/ImageUploader";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useToast } from "@/contexts/ToastContext";

export default function InstructorsTab() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [fullData, setFullData] = useState<any>({});
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  
  const endOfListRef = useRef<HTMLDivElement>(null);

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

  const handleAddTeacher = () => {
    setTeachers([...teachers, { name: "", title: "", bio: "", image: "" }]);
    setTimeout(() => {
      endOfListRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleUpdateTeacher = (index: number, field: string, value: string) => {
    const updated = [...teachers];
    updated[index] = { ...updated[index], [field]: value };
    setTeachers(updated);
  };

  const handleRemoveTeacherClick = (index: number) => {
    setDeleteIndex(index);
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--border-color)" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
            <GraduationCap size={24} color="var(--color-accent)" /> Eğitmen Yönetimi
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Platformdaki tüm eğitmenleri buradan ekleyebilir, düzenleyebilir veya silebilirsiniz.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button 
            onClick={handleAddTeacher}
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
        {teachers.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", backgroundColor: "var(--bg-secondary)", borderRadius: "12px", border: "1px dashed var(--border-color)", color: "var(--text-secondary)" }}>
            Henüz eğitmen eklenmemiş. Sağ üstteki "Eğitmen Ekle" butonuna tıklayarak ilk eğitmeni ekleyebilirsiniz.
          </div>
        )}

        {teachers.map((teacher: any, i: number) => (
          <div key={i} style={{ backgroundColor: "var(--bg-secondary)", padding: "24px", borderRadius: "12px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "16px", transition: "all 0.2s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
              <span style={{ fontWeight: 700, color: "var(--color-primary)", fontSize: "15px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ backgroundColor: "var(--color-primary-light)", width: "24px", height: "24px", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", fontSize: "12px" }}>{i + 1}</span>
                Eğitmen
              </span>
              <button onClick={() => handleRemoveTeacherClick(i)} style={{ background: "transparent", border: "none", color: "var(--color-error)", cursor: "pointer", padding: "6px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }} title="Sil"><Trash2 size={18}/></button>
            </div>
            
            <ImageUploader 
              label="Eğitmen Fotoğrafı" 
              value={teacher.image || ""} 
              onChange={(url) => handleUpdateTeacher(i, "image", url)} 
              recommendedSize="Kare Format (Örn: 400x400px)" 
            />
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, marginBottom: "6px", display: "block", color: "var(--text-primary)" }}>İsim Soyisim</label>
                <input type="text" value={teacher.name} onChange={e => handleUpdateTeacher(i, "name", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "14px" }} placeholder="Örn: Rüstem Hoca" />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, marginBottom: "6px", display: "block", color: "var(--text-primary)" }}>Branş / Ünvan</label>
                <input type="text" value={teacher.title} onChange={e => handleUpdateTeacher(i, "title", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "14px" }} placeholder="Örn: Dil Bilgisi Uzmanı" />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, marginBottom: "6px", display: "block", color: "var(--text-primary)" }}>Biyografi / Detay</label>
                <textarea value={teacher.bio} onChange={e => handleUpdateTeacher(i, "bio", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", minHeight: "100px", resize: "vertical", fontSize: "14px" }} placeholder="Eğitmen hakkında kısa açıklama..." />
              </div>
            </div>
          </div>
        ))}
        <div ref={endOfListRef} />
      </div>

      <DeleteConfirmModal
        isOpen={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        onConfirm={confirmRemoveTeacher}
        title="Eğitmeni Sil"
        message={`Bu eğitmeni (${deleteIndex !== null && teachers[deleteIndex] ? teachers[deleteIndex].name || (deleteIndex + 1) + ". Eğitmen" : ""}) listeden kaldırmak istediğinize emin misiniz? (Değişikliklerin kalıcı olması için sağ üstten kaydetmelisiniz.)`}
      />
    </div>
  );
}
