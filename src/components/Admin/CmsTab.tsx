"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";
import { Loader2, Globe, Home, Building2, Scale } from "lucide-react";

import GlobalSettingsTab from "./Cms/GlobalSettingsTab";
import HomepageSettingsTab from "./Cms/HomepageSettingsTab";
import CorporateSettingsTab from "./Cms/CorporateSettingsTab";
import LegalSettingsTab from "./Cms/LegalSettingsTab";

export default function CmsTab() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"global" | "homepage" | "corporate" | "legal">("global");
  
  // Local state for all settings
  const [data, setData] = useState<any>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const json = await res.json();
        setData(json.settings || {});
      }
    } catch (error) {
      console.error(error);
      toast.error("Ayarlar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDataChange = (key: string, value: any) => {
    setData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string) => {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: data[key] })
      });
      if (res.ok) {
        toast.success("Ayarlar başarıyla kaydedildi!");
      } else {
        toast.error("Kaydetme işlemi başarısız oldu.");
      }
    } catch (error) {
      toast.error("Kaydetme sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
        <Loader2 className="animate-spin" size={32} style={{ color: "var(--color-accent)" }} />
      </div>
    );
  }

  const tabs = [
    { id: "global", label: "Genel Site", icon: <Globe size={18} /> },
    { id: "homepage", label: "Anasayfa", icon: <Home size={18} /> },
    { id: "corporate", label: "Kurumsal", icon: <Building2 size={18} /> },
    { id: "legal", label: "Yasal & Destek", icon: <Scale size={18} /> }
  ];

  return (
    <div style={{ display: "flex", gap: "24px", minHeight: "600px" }}>
      {/* SIDEBAR NAVIGATION */}
      <div style={{ width: "240px", flexShrink: 0, backgroundColor: "#fff", padding: "16px", borderRadius: "12px", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", gap: "8px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--color-primary)", padding: "8px", marginBottom: "8px", borderBottom: "1px solid var(--border-color)" }}>
          CMS Modülleri
        </h2>
        
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 16px", borderRadius: "8px",
              fontWeight: 600, fontSize: "14px", border: "none", cursor: "pointer", transition: "all 0.2s",
              backgroundColor: activeTab === tab.id ? "var(--color-primary-light)" : "transparent",
              color: activeTab === tab.id ? "var(--color-primary)" : "var(--text-secondary)",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, backgroundColor: "#fff", padding: "32px", borderRadius: "12px", boxShadow: "var(--shadow-sm)" }}>
        {activeTab === "global" && (
          <GlobalSettingsTab 
            data={data.global_settings || {}} 
            onChange={handleDataChange} 
            onSave={() => handleSave("global_settings")} 
            saving={saving} 
          />
        )}
        {activeTab === "homepage" && (
          <HomepageSettingsTab 
            data={data.homepage_settings || {}} 
            onChange={handleDataChange} 
            onSave={() => handleSave("homepage_settings")} 
            saving={saving} 
          />
        )}
        {activeTab === "corporate" && (
          <CorporateSettingsTab 
            data={data.corporate_settings || {}} 
            onChange={handleDataChange} 
            onSave={() => handleSave("corporate_settings")} 
            saving={saving} 
          />
        )}
        {activeTab === "legal" && (
          <LegalSettingsTab 
            data={data.legal_settings || {}} 
            onChange={handleDataChange} 
            onSave={() => handleSave("legal_settings")} 
            saving={saving} 
          />
        )}
      </div>
    </div>
  );
}
