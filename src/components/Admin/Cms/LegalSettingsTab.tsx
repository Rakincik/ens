"use client";

import React from "react";
import { Save, Loader2, Plus, Trash2, GripVertical } from "lucide-react";

interface LegalSettingsProps {
  data: any;
  onChange: (key: string, value: any) => void;
  onSave: () => void;
  saving: boolean;
}

export default function LegalSettingsTab({ data, onChange, onSave, saving }: LegalSettingsProps) {
  const faq = data?.faq || [];
  const terms = data?.terms || { distanceSelling: "", privacyPolicy: "", refundPolicy: "" };

  const handleUpdate = (field: string, val: any) => {
    onChange("legal_settings", { ...data, [field]: val });
  };

  // ----- FAQ HANDLERS -----
  const handleAddFaq = () => {
    handleUpdate("faq", [...faq, { q: "", a: "" }]);
  };
  const handleUpdateFaq = (index: number, field: "q" | "a", value: string) => {
    const updated = [...faq];
    updated[index] = { ...updated[index], [field]: value };
    handleUpdate("faq", updated);
  };
  const handleRemoveFaq = (index: number) => {
    handleUpdate("faq", faq.filter((_: any, i: number) => i !== index));
  };

  // ----- TERMS HANDLERS -----
  const handleUpdateTerms = (field: string, value: string) => {
    handleUpdate("terms", { ...terms, [field]: value });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-primary)" }}>Yasal Metinler & Destek</h3>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>S.S.S. (Sıkça Sorulan Sorular) ve sözleşme metinlerini düzenleyin.</p>
        </div>
        <button 
          onClick={onSave} disabled={saving}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", backgroundColor: "var(--color-accent)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Değişiklikleri Kaydet
        </button>
      </div>

      {/* FAQ */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
          <h4 style={{ fontSize: "16px", fontWeight: 700 }}>Sıkça Sorulan Sorular (S.S.S.)</h4>
          <button 
            onClick={handleAddFaq}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)", border: "none", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}
          >
            <Plus size={14} /> Yeni Soru Ekle
          </button>
        </div>

        {faq.length === 0 && <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", backgroundColor: "var(--bg-secondary)", borderRadius: "8px" }}>Soru eklenmedi.</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {faq.map((item: any, i: number) => (
            <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start", backgroundColor: "var(--bg-secondary)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <GripVertical size={20} style={{ color: "var(--text-muted)", marginTop: "10px", cursor: "grab" }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                <input type="text" value={item.q} onChange={e => handleUpdateFaq(i, "q", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-color)", fontWeight: 600 }} placeholder="Soru..." />
                <textarea value={item.a} onChange={e => handleUpdateFaq(i, "a", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-color)", minHeight: "80px", resize: "vertical" }} placeholder="Cevap..." />
              </div>
              <button onClick={() => handleRemoveFaq(i)} style={{ background: "transparent", border: "none", color: "var(--color-error)", cursor: "pointer", marginTop: "10px" }}>
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--border-color)" }} />

      {/* LEGAL TERMS */}
      <div style={{ backgroundColor: "var(--bg-secondary)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "24px" }}>
        <h4 style={{ fontSize: "16px", fontWeight: 700, borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>Yasal Metinler ve Sözleşmeler</h4>
        
        <div>
          <label style={{ fontSize: "14px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Mesafeli Satış Sözleşmesi</label>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>HTML etiketleri kullanarak (ör. &lt;h3&gt;, &lt;b&gt;, &lt;p&gt;) biçimlendirme yapabilirsiniz.</p>
          <textarea value={terms.distanceSelling} onChange={e => handleUpdateTerms("distanceSelling", e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid var(--border-color)", minHeight: "200px", resize: "vertical", fontFamily: "monospace" }} placeholder="Sözleşme metni..." />
        </div>

        <div>
          <label style={{ fontSize: "14px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Gizlilik Politikası</label>
          <textarea value={terms.privacyPolicy} onChange={e => handleUpdateTerms("privacyPolicy", e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid var(--border-color)", minHeight: "200px", resize: "vertical", fontFamily: "monospace" }} placeholder="Gizlilik metni..." />
        </div>

        <div>
          <label style={{ fontSize: "14px", fontWeight: 600, display: "block", marginBottom: "8px" }}>İade ve İptal Şartları</label>
          <textarea value={terms.refundPolicy} onChange={e => handleUpdateTerms("refundPolicy", e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid var(--border-color)", minHeight: "200px", resize: "vertical", fontFamily: "monospace" }} placeholder="İade şartları metni..." />
        </div>
      </div>
    </div>
  );
}
