"use client";

import { useState, useEffect } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "../Home.module.css";

export default function FAQPage() {
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchFaqs() {
      try {
        const response = await fetch("/api/public/settings");
        if (response.ok) {
          const data = await response.json();
          if (data.settings?.legal_settings?.faq) {
            setFaqs(data.settings.legal_settings.faq);
          }
        }
      } catch (error) {
        console.error("Error loading FAQs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFaqs();
  }, []);

  const toggleFaq = (index: number) => {
    if (faqOpenIndex === index) {
      setFaqOpenIndex(null);
    } else {
      setFaqOpenIndex(index);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h1 className={styles.sectionTitle}>Sıkça Sorulan Sorular</h1>
              <p className={styles.sectionDesc}>
                Eğitim süreçlerimiz, ders dökümanları ve ödeme sistemi hakkında aklınıza takılan soruların yanıtları.
              </p>
            </div>

            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}>
                <div className={styles.spinner} style={{
                  width: "40px",
                  height: "40px",
                  border: "3px solid var(--border-color)",
                  borderTopColor: "var(--color-accent)",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }} />
              </div>
            ) : (
              <div className={styles.faqContainer}>
                {faqs.map((faq, index) => {
                  const isOpen = faqOpenIndex === index;
                  return (
                    <div
                      key={index}
                      className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}
                    >
                      <button
                        className={styles.faqQuestion}
                        onClick={() => toggleFaq(index)}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <HelpCircle size={18} style={{ color: isOpen ? "var(--color-accent)" : "var(--text-muted)", flexShrink: 0 }} />
                          <span>{faq.q}</span>
                        </span>
                        <ChevronDown size={18} style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform var(--transition-fast)",
                          flexShrink: 0
                        }} />
                      </button>
                      
                      {isOpen && (
                        <div className={styles.faqAnswer}>
                          <p style={{ paddingLeft: "30px" }}>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
