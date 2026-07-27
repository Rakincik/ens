"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useToast } from "@/contexts/ToastContext";
import styles from "../Home.module.css";

export default function ContactPage() {
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [globalSettings, setGlobalSettings] = useState<any>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/public/settings");
        if (response.ok) {
          const data = await response.json();
          if (data.settings?.global_settings) {
            setGlobalSettings(data.settings.global_settings);
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Mesajınız başarıyla gönderildi! Eğitim danışmanlarımız en kısa sürede sizi arayacaktır.");
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        toast.error(data.error || "Mesaj gönderilirken bir hata oluştu.");
      }
    } catch (error) {
      toast.error("Bağlantı hatası oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h1 className={styles.sectionTitle}>İletişim</h1>
              <p className={styles.sectionDesc}>
                Eğitimlerimiz hakkında bilgi almak veya destek talebinde bulunmak için bizimle iletişime geçin.
              </p>
            </div>

            <div className={styles.contactLayout}>
              {/* İletişim Detayları */}
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                <div className={styles.courseCard} style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-primary)" }}>İletişim Bilgileri</h3>
                  
                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <MapPin size={20} style={{ color: "var(--color-accent)", marginTop: "4px", flexShrink: 0 }} />
                    <div>
                      <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-primary)" }}>Adres</h4>
                      <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px", lineHeight: "1.5" }}>
                        {globalSettings?.contactAddress || "Kızılay, Atatürk Bulvarı No: 123, Çankaya / Ankara"}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <Phone size={20} style={{ color: "var(--color-accent)", marginTop: "4px", flexShrink: 0 }} />
                    <div>
                      <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-primary)" }}>Telefon</h4>
                      <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
                        {globalSettings?.contactPhone || "+90 (555) 555 55 55"}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <Mail size={20} style={{ color: "var(--color-accent)", marginTop: "4px", flexShrink: 0 }} />
                    <div>
                      <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-primary)" }}>E-posta</h4>
                      <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
                        {globalSettings?.contactEmail || "info@turkceoabtdeyiz.com"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Harita Mock */}
                {globalSettings?.mapIframe ? (
                  <div className={styles.courseCard} style={{ height: "220px", overflow: "hidden", borderRadius: "12px", border: "1px solid var(--border-color)" }} dangerouslySetInnerHTML={{ __html: globalSettings.mapIframe }} />
                ) : (
                  <div className={styles.courseCard} style={{
                    height: "220px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "var(--color-primary-light)",
                    color: "var(--text-muted)",
                    fontSize: "14px",
                    fontWeight: 600
                  }}>
                    <MapPin size={24} style={{ marginRight: "8px", color: "var(--color-accent)" }} />
                    <span>Harita Yer Tutucu (Ankara Kızılay)</span>
                  </div>
                )}
              </div>

              {/* İletişim Formu */}
              <div className={styles.courseCard} style={{ padding: "40px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-primary)", marginBottom: "24px" }}>Bize Mesaj Gönderin</h3>
                
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600" }} htmlFor="name">Adınız Soyadınız</label>
                    <input
                      style={{
                        padding: "12px 16px",
                        fontSize: "14px",
                        border: "1.5px solid var(--border-color)",
                        borderRadius: "var(--radius-md)",
                        outline: "none",
                        backgroundColor: "var(--bg-primary)"
                      }}
                      id="name"
                      type="text"
                      placeholder="Ahmet Yılmaz"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600" }} htmlFor="email">E-posta Adresiniz</label>
                    <input
                      style={{
                        padding: "12px 16px",
                        fontSize: "14px",
                        border: "1.5px solid var(--border-color)",
                        borderRadius: "var(--radius-md)",
                        outline: "none",
                        backgroundColor: "var(--bg-primary)"
                      }}
                      id="email"
                      type="email"
                      placeholder="ahmet@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600" }} htmlFor="phone">Telefon Numaranız</label>
                    <input
                      style={{
                        padding: "12px 16px",
                        fontSize: "14px",
                        border: "1.5px solid var(--border-color)",
                        borderRadius: "var(--radius-md)",
                        outline: "none",
                        backgroundColor: "var(--bg-primary)"
                      }}
                      id="phone"
                      type="tel"
                      placeholder="0 (555) 555 55 55"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600" }} htmlFor="message">Mesajınız</label>
                    <textarea
                      style={{
                        padding: "12px 16px",
                        fontSize: "14px",
                        border: "1.5px solid var(--border-color)",
                        borderRadius: "var(--radius-md)",
                        outline: "none",
                        backgroundColor: "var(--bg-primary)",
                        minHeight: "120px",
                        resize: "vertical"
                      }}
                      id="message"
                      placeholder="Eğitimler hakkında detaylı bilgi almak istiyorum..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    style={{
                      backgroundColor: "var(--color-primary)",
                      color: "white",
                      padding: "14px",
                      fontSize: "14px",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "background-color var(--transition-fast)"
                    }}
                    type="submit"
                    disabled={loading}
                  >
                    <Send size={16} />
                    <span>{loading ? "Gönderiliyor..." : "Mesajı Gönder"}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
