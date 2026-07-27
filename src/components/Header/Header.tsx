"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ShoppingBag, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import styles from "./Header.module.css";
// Bu context dosyalarını Task 4 ve 5'te tanımlayacağız
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cartItems, setIsCartOpen } = useCart();
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [globalSettings, setGlobalSettings] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
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
        console.error("Error loading settings in header:", error);
      }
    }
    fetchSettings();
  }, []);

  // Sayfa kaydırma takibi
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      setMobileMenuOpen(false);
      setDropdownOpen(false);
    }, 0);
    return () => clearTimeout(handle);
  }, [pathname]);

  const navLinks = [
    { name: "Anasayfa", path: "/" },
    { name: "Eğitimlerimiz", path: "/egitimlerimiz" },
    { name: "Yayınlarımız", path: "/yayinlar" },
    { name: "Kadromuz", path: "/kadromuz" },
    { name: "Başarılarımız", path: "/basarilarimiz" },
    { name: "SSS", path: "/sss" },
    { name: "İletişim", path: "/iletisim" },
  ];

  const totalCartCount = cartItems?.length || 0;

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""} ${mobileMenuOpen ? styles.mobileMenuOpen : ""}`}>
      <div className={`${styles.container} container`}>
        {/* Logo */}
        <Link href="/" className={styles.logoArea}>
          <div className={styles.logoWrapper}>
            <Image
              src={globalSettings?.logoUrl || "/logo.png"}
              alt="Türkçe ÖABTdeyiz Logo"
              width={150}
              height={50}
              style={{ objectFit: "contain" }}
              className={styles.logoImage}
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Actions Area */}
        <div className={styles.actions}>
          {/* Cart Button */}
          <button 
            className={styles.cartBtn} 
            onClick={() => setIsCartOpen(true)}
            aria-label="Sepeti Aç"
          >
            <ShoppingBag size={22} />
            {mounted && totalCartCount > 0 && (
              <span className={styles.cartBadge}>{totalCartCount}</span>
            )}
          </button>

          {/* Auth Actions (Desktop) */}
          <div style={{ display: "flex", gap: "10px" }} className={styles.nav}>
            {user ? (
              <div style={{ position: "relative" }}>
                <button
                  className={`${styles.authBtn} ${styles.authBtnOutline}`}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <User size={16} />
                  <span>Merhaba, {user.name}</span>
                </button>
                
                {dropdownOpen && (
                  <div style={{
                    position: "absolute",
                    top: "110%",
                    right: 0,
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--shadow-lg)",
                    minWidth: "180px",
                    display: "flex",
                    flexDirection: "column",
                    padding: "8px 0",
                    zIndex: 1010
                  }}>
                    <Link
                      href={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}
                      style={{
                        padding: "10px 16px",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "var(--text-primary)"
                      }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard size={14} />
                      <span>{user.role === "ADMIN" ? "Admin Paneli" : "Öğrenci Paneli"}</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      style={{
                        padding: "10px 16px",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "var(--color-error)",
                        background: "none",
                        border: "none",
                        textAlign: "left",
                        width: "100%",
                        cursor: "pointer"
                      }}
                    >
                      <LogOut size={14} />
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className={styles.authBtn}>
                <User size={16} />
                <span>Öğrenci Girişi</span>
              </Link>
            )}
          </div>

          {/* Hamburger Menu Toggle (Mobile) */}
          <button
            className={styles.menuToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menüyü Aç/Kapat"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div 
        className={styles.mobileMenuOverlay} 
        onClick={() => setMobileMenuOpen(false)} 
      />
      <div className={styles.mobileMenu}>
        <div className={styles.mobileMenuHeader}>
          <Image
            src={globalSettings?.logoUrl || "/logo.png"}
            alt="Türkçe ÖABTdeyiz Logo"
            width={120}
            height={40}
            style={{ objectFit: "contain" }}
          />
          <button 
            className={styles.closeBtn}
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className={styles.mobileNav}>
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ""}`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className={styles.mobileActions}>
          {user ? (
            <>
              <Link 
                href={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}
                className={`${styles.authBtn} ${styles.authBtnOutline}`}
              >
                <LayoutDashboard size={16} />
                <span>{user.role === "ADMIN" ? "Admin Paneli" : "Öğrenci Paneli"}</span>
              </Link>
              <button 
                onClick={() => logout()}
                className={styles.authBtn}
                style={{ backgroundColor: "var(--color-error)", borderColor: "var(--color-error)" }}
              >
                <LogOut size={16} />
                <span>Çıkış Yap</span>
              </button>
            </>
          ) : (
            <Link href="/auth/login" className={styles.authBtn}>
              <User size={16} />
              <span>Öğrenci Girişi</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
