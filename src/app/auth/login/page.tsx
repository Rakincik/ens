"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogIn, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import styles from "../auth.module.css";

export default function LoginPage() {
  const { user, login, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    if (!email || !password) return;
    
    setIsSubmitting(true);
    const success = await login(email, password);
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

      <div className={styles.card}>
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
        
        <h1 className={styles.title}>Öğrenci Girişi</h1>
        <p className={styles.subtitle}>Eğitimlerinize erişmek ve satın almak için giriş yapın.</p>
        
        <form className={styles.form} onSubmit={handleSubmit}>
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
            <label className={styles.label} htmlFor="password">Şifre</label>
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

          <button
            className={styles.submitBtn}
            type="submit"
            disabled={loading || isSubmitting}
          >
            <LogIn size={18} />
            <span>{isSubmitting ? "Giriş Yapılıyor..." : "Giriş Yap"}</span>
          </button>
        </form>

        <p className={styles.footerText}>
          Hesabınız yok mu?{" "}
          <Link href="/auth/register" className={styles.footerLink}>
            Şimdi Kayıt Olun
          </Link>
        </p>
      </div>
    </div>
  );
}
