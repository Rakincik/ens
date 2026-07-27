"use client";

import React from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import ImageUploader from "./ImageUploader";

interface CorporateSettingsProps {
  data: any;
  onChange: (key: string, value: any) => void;
  onSave: () => void;
  saving: boolean;
}

export default function CorporateSettingsTab({ data, onChange, onSave, saving }: CorporateSettingsProps) {
  const teachers = data?.teachers || [];
  const achievements = data?.achievements || [];
  const aboutUs = data?.aboutUs || { title: "", content: "", mission: "", vision: "", image: "" };

  const handleUpdate = (field: string, val: any) => {
    onChange("corporate_settings", { ...data, [field]: val });
  };

  // ----- ABOUT US HANDLERS -----
  const handleUpdateAbout = (field: string, value: string) => {
    handleUpdate("aboutUs", { ...aboutUs, [field]: value });
  };

  // ----- TEACHERS HANDLERS -----
  const handleAddTeacher = () => {
    handleUpdate("teachers", [...teachers, { name: "", title: "", bio: "", image: "" }]);
  };
  const handleUpdateTeacher = (index: number, field: string, value: string) => {
    const updated = [...teachers];
    updated[index] = { ...updated[index], [field]: value };
    handleUpdate("teachers", updated);
  };
  const handleRemoveTeacher = (index: number) => {
    handleUpdate("teachers", teachers.filter((_: any, i: number) => i !== index));
  };

  // ----- ACHIEVEMENTS HANDLERS -----
  const handleAddAchievement = () => {
    handleUpdate("achievements", [...achievements, { name: "", rank: "", year: "2026", comment: "" }]);
  };
  const handleUpdateAchievement = (index: number, field: string, value: string) => {
    const updated = [...achievements];
    updated[index] = { ...updated[index], [field]: value };
    handleUpdate("achievements", updated);
  };
  const handleRemoveAchievement = (index: number) => {
    handleUpdate("achievements", achievements.filter((_: any, i: number) => i !== index));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-primary)" }}>Kurumsal İçerikler</h3>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Hakkımızda sayfası, eğitmen kadrosu ve başarı hikayelerini yönetin.</p>
        </div>
        <button 
          onClick={onSave} disabled={saving}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", backgroundColor: "var(--color-accent)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Değişiklikleri Kaydet
        </button>
      </div>

      {/* ABOUT US */}
      <div style={{ backgroundColor: "var(--bg-secondary)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "16px" }}>
        <h4 style={{ fontSize: "16px", fontWeight: 700, borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>Hakkımızda Sayfası İçerikleri</h4>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
          <div>
            <ImageUploader 
              label="Hakkımızda Görseli" 
              value={aboutUs.image || ""} 
              onChange={(url) => handleUpdateAbout("image", url)} 
              recommendedSize="800x600px" 
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Ana Başlık</label>
              <input type="text" value={aboutUs.title} onChange={e => handleUpdateAbout("title", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-color)" }} placeholder="Örn: Biz Kimiz?" />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Hakkımızda Metni</label>
              <textarea value={aboutUs.content} onChange={e => handleUpdateAbout("content", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-color)", minHeight: "100px", resize: "vertical" }} placeholder="Kurumun detaylı tanıtım yazısı..." />
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Misyonumuz</label>
            <textarea value={aboutUs.mission} onChange={e => handleUpdateAbout("mission", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-color)", minHeight: "80px", resize: "vertical" }} />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Vizyonumuz</label>
            <textarea value={aboutUs.vision} onChange={e => handleUpdateAbout("vision", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-color)", minHeight: "80px", resize: "vertical" }} />
          </div>
        </div>
      </div>

      {/* TEACHERS */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
          <h4 style={{ fontSize: "16px", fontWeight: 700 }}>Eğitmen Kadromuz</h4>
          <button 
            onClick={handleAddTeacher}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)", border: "none", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}
          >
            <Plus size={14} /> Eğitmen Ekle
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {teachers.map((teacher: any, i: number) => (
            <div key={i} style={{ backgroundColor: "var(--bg-secondary)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: "13px" }}>Eğitmen {i + 1}</span>
                <button onClick={() => handleRemoveTeacher(i)} style={{ background: "transparent", border: "none", color: "var(--color-error)", cursor: "pointer" }}><Trash2 size={16}/></button>
              </div>
              
              <ImageUploader 
                label="Eğitmen Fotoğrafı (Opsiyonel)" 
                value={teacher.image || ""} 
                onChange={(url) => handleUpdateTeacher(i, "image", url)} 
                recommendedSize="400x400px (Kare)" 
              />
              
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px", display: "block" }}>İsim Soyisim</label>
                <input type="text" value={teacher.name} onChange={e => handleUpdateTeacher(i, "name", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)" }} placeholder="Örn: Rüstem Hoca" />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px", display: "block" }}>Branş / Ünvan</label>
                <input type="text" value={teacher.title} onChange={e => handleUpdateTeacher(i, "title", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)" }} placeholder="Örn: Türkçe ÖABT Eğitmeni" />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px", display: "block" }}>Biyografi</label>
                <textarea value={teacher.bio} onChange={e => handleUpdateTeacher(i, "bio", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)", minHeight: "80px", resize: "vertical" }} placeholder="Eğitmen hakkında kısa bilgi..." />
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--border-color)" }} />

      {/* ACHIEVEMENTS */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
          <h4 style={{ fontSize: "16px", fontWeight: 700 }}>Başarı Hikayeleri & Dereceler</h4>
          <button 
            onClick={handleAddAchievement}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)", border: "none", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}
          >
            <Plus size={14} /> Derece Ekle
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {achievements.map((ach: any, i: number) => (
            <div key={i} style={{ backgroundColor: "var(--bg-secondary)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: "13px" }}>Kayıt {i + 1}</span>
                <button onClick={() => handleRemoveAchievement(i)} style={{ background: "transparent", border: "none", color: "var(--color-error)", cursor: "pointer" }}><Trash2 size={16}/></button>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px", display: "block" }}>İsim Soyisim</label>
                  <input type="text" value={ach.name} onChange={e => handleUpdateAchievement(i, "name", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)" }} placeholder="Örn: Büşra Y." />
                </div>
                <div style={{ width: "80px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px", display: "block" }}>Sınav Yılı</label>
                  <input type="text" value={ach.year} onChange={e => handleUpdateAchievement(i, "year", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)", textAlign: "center" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px", display: "block" }}>Sıralama / Derece</label>
                <input type="text" value={ach.rank} onChange={e => handleUpdateAchievement(i, "rank", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)" }} placeholder="Örn: Türkiye 1.si" />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px", display: "block" }}>Öğrenci Yorumu</label>
                <textarea value={ach.comment} onChange={e => handleUpdateAchievement(i, "comment", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)", minHeight: "80px", resize: "vertical" }} placeholder="Kısa bir görüş veya alıntı..." />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
