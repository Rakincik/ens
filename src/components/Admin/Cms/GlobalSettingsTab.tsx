"use client";

import React from "react";
import { Save, Loader2 } from "lucide-react";
import ImageUploader from "./ImageUploader";

interface GlobalSettingsProps {
  data: any;
  onChange: (key: string, value: any) => void;
  onSave: () => void;
  saving: boolean;
}

export default function GlobalSettingsTab({ data, onChange, onSave, saving }: GlobalSettingsProps) {
  const handleChange = (field: string, val: any) => {
    onChange("global_settings", { ...data, [field]: val });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-primary)" }}>Genel Site Ayarları</h3>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Sitenin temel bilgilerini, logo ve iletişim kanallarını buradan yönetin.</p>
        </div>
        <button 
          onClick={onSave} disabled={saving}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", backgroundColor: "var(--color-accent)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Değişiklikleri Kaydet
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
        {/* LOGO & BRANDING */}
        <div style={{ backgroundColor: "var(--bg-secondary)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h4 style={{ fontSize: "15px", fontWeight: 700, borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>Marka & Kimlik</h4>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <ImageUploader 
              label="Ana Logo" 
              value={data?.logoUrl || ""} 
              onChange={(url) => handleChange("logoUrl", url)} 
              recommendedSize="200x60px (PNG, Transparan)" 
            />
            <ImageUploader 
              label="Favicon" 
              value={data?.faviconUrl || ""} 
              onChange={(url) => handleChange("faviconUrl", url)} 
              recommendedSize="32x32px (ICO veya PNG)" 
            />
          </div>
        </div>

        {/* CONTACT INFO */}
        <div style={{ backgroundColor: "var(--bg-secondary)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h4 style={{ fontSize: "15px", fontWeight: 700, borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>İletişim Bilgileri</h4>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Telefon Numarası</label>
              <input type="text" value={data?.contactPhone || ""} onChange={e => handleChange("contactPhone", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)" }} placeholder="Örn: 0850 123 45 67" />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>WhatsApp Destek</label>
              <input type="text" value={data?.whatsappNumber || ""} onChange={e => handleChange("whatsappNumber", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)" }} placeholder="Örn: +90 555 123 45 67" />
            </div>
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>E-posta Adresi</label>
            <input type="email" value={data?.contactEmail || ""} onChange={e => handleChange("contactEmail", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)" }} placeholder="Örn: info@turkceoabtdeyiz.com" />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Fiziksel Adres</label>
            <textarea value={data?.contactAddress || ""} onChange={e => handleChange("contactAddress", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)", minHeight: "60px", resize: "vertical" }} placeholder="Kurum adresi..." />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
        {/* SOCIAL MEDIA */}
        <div style={{ backgroundColor: "var(--bg-secondary)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h4 style={{ fontSize: "15px", fontWeight: 700, borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>Sosyal Medya Linkleri</h4>
          
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Instagram URL</label>
            <input type="text" value={data?.socialInstagram || ""} onChange={e => handleChange("socialInstagram", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)" }} placeholder="https://instagram.com/..." />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>YouTube URL</label>
            <input type="text" value={data?.socialYoutube || ""} onChange={e => handleChange("socialYoutube", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)" }} placeholder="https://youtube.com/..." />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>X (Twitter) URL</label>
            <input type="text" value={data?.socialTwitter || ""} onChange={e => handleChange("socialTwitter", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)" }} placeholder="https://x.com/..." />
          </div>
        </div>

        {/* FOOTER & MAP */}
        <div style={{ backgroundColor: "var(--bg-secondary)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h4 style={{ fontSize: "15px", fontWeight: 700, borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>Footer & Harita</h4>
          
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Footer Kısa Hakkımızda</label>
            <textarea value={data?.footerAbout || ""} onChange={e => handleChange("footerAbout", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)", minHeight: "80px", resize: "vertical" }} placeholder="Sitenin en altında yer alacak kısa tanıtım metni..." />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Google Haritalar (Iframe SRC veya Kodu)</label>
            <input type="text" value={data?.mapIframe || ""} onChange={e => handleChange("mapIframe", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)" }} placeholder="<iframe src='...' />" />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Telif Hakkı (Copyright)</label>
            <input type="text" value={data?.copyrightText || ""} onChange={e => handleChange("copyrightText", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)" }} placeholder="© 2026 Türkçe ÖABTdeyiz. Tüm Hakları Saklıdır." />
          </div>
        </div>
      </div>
    </div>
  );
}
