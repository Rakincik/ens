"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserPlus, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import styles from "../auth.module.css";

export default function RegisterPage() {
  const { user, register, loading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Zaten giriş yapmışsa yönlendir
  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !surname || !email || !password || !passwordConfirm || !phone) return;
    
    if (password !== passwordConfirm) {
      toast.error("Şifreler eşleşmiyor.");
      return;
    }

    if (phone.startsWith("0")) {
      toast.error("Telefon numarası 0 ile başlayamaz.");
      return;
    }

    setIsSubmitting(true);
    const success = await register(email, password, name, surname, phone);
    setIsSubmitting(false);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Back to home */}
      <Link href="/" style={{
        position: "absolute",
        top: "24px",
        left: "24px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "14px",
        fontWeight: "500",
        color: "var(--text-secondary)",
        transition: "color var(--transition-fast)"
      }}>
        <ArrowLeft size={16} />
        <span>Geri Dön</span>
      </Link>

      <div className={styles.card} style={{ maxWidth: "480px" }}>
        <div className={styles.logoWrapper}>
          <Image
            src="/logo.png"
            alt="Türkçe ÖABTdeyiz Logo"
            fill
            sizes="160px"
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
        
        <h1 className={styles.title}>Kayıt Olun</h1>
        <p className={styles.subtitle}>Yeni bir öğrenci hesabı oluşturun.</p>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "16px" }}>
            <div className={styles.inputGroup} style={{ flex: 1 }}>
              <label className={styles.label} htmlFor="name">Ad</label>
              <input
                className={styles.input}
                id="name"
                type="text"
                placeholder="Ahmet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading || isSubmitting}
              />
            </div>
            
            <div className={styles.inputGroup} style={{ flex: 1 }}>
              <label className={styles.label} htmlFor="surname">Soyad</label>
              <input
                className={styles.input}
                id="surname"
                type="text"
                placeholder="Yılmaz"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                disabled={loading || isSubmitting}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">E-posta Adresi</label>
            <input
              className={styles.input}
              id="email"
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || isSubmitting}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="phone">Telefon Numarası</label>
            <input
              className={styles.input}
              id="phone"
              type="tel"
              placeholder="5--"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={loading || isSubmitting}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">Şifre (Min. 6 Karakter)</label>
            <input
              className={styles.input}
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading || isSubmitting}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="passwordConfirm">Şifre Tekrar</label>
            <input
              className={styles.input}
              id="passwordConfirm"
              type="password"
              placeholder="••••••••"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              disabled={loading || isSubmitting}
            />
          </div>

          <button
            className={styles.submitBtn}
            type="submit"
            disabled={loading || isSubmitting}
          >
            <UserPlus size={18} />
            <span>{isSubmitting ? "Hesap Oluşturuluyor..." : "Kayıt Ol"}</span>
          </button>
        </form>

        <p className={styles.footerText}>
          Zaten hesabınız var mı?{" "}
          <Link href="/auth/login" className={styles.footerLink}>
            Giriş Yapın
          </Link>
        </p>
      </div>
    </div>
  );
}
