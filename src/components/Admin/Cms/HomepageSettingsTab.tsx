"use client";

import React from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import ImageUploader from "./ImageUploader";

interface HomepageSettingsProps {
  data: any;
  onChange: (key: string, value: any) => void;
  onSave: () => void;
  saving: boolean;
}

export default function HomepageSettingsTab({ data, onChange, onSave, saving }: HomepageSettingsProps) {
  // Safe extraction
  const sliders = data?.slider || [];
  const stats = data?.stats || [];

  const handleUpdate = (field: string, val: any) => {
    onChange("homepage_settings", { ...data, [field]: val });
  };

  // ----- SLIDER HANDLERS -----
  const handleAddSlider = () => {
    handleUpdate("slider", [...sliders, { title: "", subtitle: "", buttonText: "İncele", buttonLink: "#", image: "" }]);
  };
  const handleUpdateSlider = (index: number, field: string, value: string) => {
    const updated = [...sliders];
    updated[index] = { ...updated[index], [field]: value };
    handleUpdate("slider", updated);
  };
  const handleRemoveSlider = (index: number) => {
    handleUpdate("slider", sliders.filter((_: any, i: number) => i !== index));
  };

  // ----- STATS HANDLERS -----
  const handleAddStat = () => {
    handleUpdate("stats", [...stats, { value: "", label: "" }]);
  };
  const handleUpdateStat = (index: number, field: string, value: string) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: value };
    handleUpdate("stats", updated);
  };
  const handleRemoveStat = (index: number) => {
    handleUpdate("stats", stats.filter((_: any, i: number) => i !== index));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-primary)" }}>Anasayfa Yönetimi</h3>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Hero slider ve istatistik bölümlerini düzenleyin.</p>
        </div>
        <button 
          onClick={onSave} disabled={saving}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", backgroundColor: "var(--color-accent)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Değişiklikleri Kaydet
        </button>
      </div>

      {/* SLIDER SECTION */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
          <h4 style={{ fontSize: "16px", fontWeight: 700 }}>Hero Slider</h4>
          <button 
            onClick={handleAddSlider}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)", border: "none", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}
          >
            <Plus size={14} /> Yeni Slide Ekle
          </button>
        </div>

        {sliders.length === 0 && <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", backgroundColor: "var(--bg-secondary)", borderRadius: "8px" }}>Henüz slider eklenmedi.</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {sliders.map((slide: any, i: number) => (
            <div key={i} style={{ border: "1px solid var(--border-color)", borderRadius: "12px", padding: "20px", backgroundColor: "var(--bg-secondary)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-secondary)" }}>Slide {i + 1}</span>
                <button onClick={() => handleRemoveSlider(i)} style={{ background: "transparent", border: "none", color: "var(--color-error)", cursor: "pointer" }} title="Sil">
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
                <div style={{ flex: "1 1 250px" }}>
                  <ImageUploader 
                  label="Arkaplan Görseli" 
                  value={slide.image || ""} 
                  onChange={(url) => handleUpdateSlider(i, "image", url)} 
                  recommendedSize="1920x800px" 
                />
                </div>

                <div style={{ flex: "2 1 300px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Ana Başlık</label>
                    <input type="text" value={slide.title} onChange={e => handleUpdateSlider(i, "title", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-color)" }} placeholder="Örn: Türkçe ÖABT Kampı..." />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Alt Açıklama</label>
                    <input type="text" value={slide.subtitle} onChange={e => handleUpdateSlider(i, "subtitle", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-color)" }} placeholder="Örn: Sınava hazırlanmanın en iyi yolu..." />
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Buton Metni</label>
                      <input type="text" value={slide.buttonText} onChange={e => handleUpdateSlider(i, "buttonText", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-color)" }} placeholder="Örn: Hemen İncele" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Buton Linki</label>
                      <input type="text" value={slide.buttonLink} onChange={e => handleUpdateSlider(i, "buttonLink", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-color)" }} placeholder="Örn: /urun/123 veya #kurslar" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--border-color)" }} />

      {/* STATS SECTION */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
          <h4 style={{ fontSize: "16px", fontWeight: 700 }}>İstatistikler Modülü</h4>
          <button 
            onClick={handleAddStat}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)", border: "none", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}
          >
            <Plus size={14} /> Yeni İstatistik Ekle
          </button>
        </div>

        {stats.length === 0 && <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", backgroundColor: "var(--bg-secondary)", borderRadius: "8px" }}>İstatistik eklenmedi.</div>}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" }}>
          {stats.map((stat: any, i: number) => (
            <div key={i} style={{ backgroundColor: "var(--bg-secondary)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, fontSize: "13px", color: "var(--text-secondary)" }}>Kayıt {i + 1}</span>
                <button onClick={() => handleRemoveStat(i)} style={{ background: "transparent", border: "none", color: "var(--color-error)", cursor: "pointer" }}><Trash2 size={16}/></button>
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px", display: "block" }}>Sayısal Değer (Örn: %98, 1500+)</label>
                <input type="text" value={stat.value} onChange={e => handleUpdateStat(i, "value", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)", fontWeight: 700, fontSize: "18px" }} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px", display: "block" }}>Açıklama (Örn: Öğrenci Memnuniyeti)</label>
                <input type="text" value={stat.label} onChange={e => handleUpdateStat(i, "label", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
