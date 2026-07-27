"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, MessageSquare, Globe, Share2 } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
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
        console.error("Error loading settings in footer:", error);
      }
    }
    fetchSettings();
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} container`}>
        <div className={styles.grid}>
          {/* Logo & Description */}
          <div className={styles.brandCol}>
            <div className={styles.logoWrapper}>
              <Image
                src="/logo.png"
                alt="Türkçe ÖABTdeyiz Logo"
                fill
                sizes="150px"
                style={{ objectFit: "contain" }}
              />
            </div>
            <p className={styles.description}>
              {globalSettings?.footerAbout || "Türkçe ÖABT Alan Sınavı hazırlık sürecinde Türkiye'nin en seçkin kadrosuyla canlı dersler, konu anlatımları ve interaktif deneme sınavları platformu."}
            </p>
            <div className={styles.socials}>
              <a
                href={globalSettings?.socialYoutube || "https://youtube.com"}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="YouTube"
              >
                <Globe size={18} />
              </a>
              <a
                href={globalSettings?.socialInstagram || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram"
              >
                <Share2 size={18} />
              </a>
              <a
                href={globalSettings?.whatsappNumber ? `https://wa.me/${globalSettings.whatsappNumber.replace(/[^0-9]/g, '')}` : "https://wa.me"}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="WhatsApp"
              >
                <MessageSquare size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={styles.title}>Hızlı Bağlantılar</h3>
            <ul className={styles.linksList}>
              <li>
                <Link href="/" className={styles.link}>Anasayfa</Link>
              </li>
              <li>
                <Link href="/egitimlerimiz" className={styles.link}>Eğitimlerimiz</Link>
              </li>
              <li>
                <Link href="/yayinlar" className={styles.link}>Yayınlarımız</Link>
              </li>
              <li>
                <Link href="/kadromuz" className={styles.link}>Kadro</Link>
              </li>
              <li>
                <Link href="/basarilarimiz" className={styles.link}>Başarılarımız</Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className={styles.title}>Destek</h3>
            <ul className={styles.linksList}>
              <li>
                <Link href="/oabt-rehberi" className={styles.link}>ÖABT Rehberi</Link>
              </li>
              <li>
                <Link href="/sss" className={styles.link}>Sıkça Sorulan Sorular</Link>
              </li>
              <li>
                <Link href="/iletisim" className={styles.link}>İletişim</Link>
              </li>
              <li>
                <Link href="/hakkimizda" className={styles.link}>Hakkımızda</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className={styles.title}>İletişim Bilgileri</h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <MapPin size={18} className={styles.contactIcon} />
                <span>{globalSettings?.contactAddress || "Kızılay, Atatürk Bulvarı No: 123, Çankaya / Ankara"}</span>
              </li>
              <li className={styles.contactItem}>
                <Phone size={18} className={styles.contactIcon} />
                <a href={globalSettings?.contactPhone ? `tel:${globalSettings.contactPhone.replace(/[^0-9+]/g, '')}` : "tel:+905555555555"} className={styles.link}>
                  {globalSettings?.contactPhone || "+90 (555) 555 55 55"}
                </a>
              </li>
              <li className={styles.contactItem}>
                <Mail size={18} className={styles.contactIcon} />
                <a href={globalSettings?.contactEmail ? `mailto:${globalSettings.contactEmail}` : "mailto:info@turkceoabtdeyiz.com"} className={styles.link}>
                  {globalSettings?.contactEmail || "info@turkceoabtdeyiz.com"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className={styles.bottomBar}>
          <p>{globalSettings?.copyrightText || `© ${currentYear} Türkçe ÖABTdeyiz. Tüm Hakları Saklıdır.`}</p>
          <div className={styles.bottomLinks}>
            <Link href="/hakkimizda" className={styles.bottomLink}>Mesafeli Satış Sözleşmesi</Link>
            <Link href="/hakkimizda" className={styles.bottomLink}>Gizlilik Politikası</Link>
            <Link href="/hakkimizda" className={styles.bottomLink}>KVKK Aydınlatma Metni</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
