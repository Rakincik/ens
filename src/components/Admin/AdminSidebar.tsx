"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, BookOpen, Settings, LogOut, ShieldCheck, Menu, Percent, Library, Megaphone, MessageSquare, BarChart3, ListTree, GraduationCap, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import styles from "@/app/admin/dashboard/admin.module.css";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminSidebar({ activeTab, onTabChange, sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      fetch("/api/admin/support/unread")
        .then(res => res.json())
        .then(data => {
          if (data.count !== undefined) {
            setUnreadMessages(data.count);
          }
        })
        .catch(err => console.error(err));
    }
  }, [user, activeTab]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader} style={{ justifyContent: "space-between", padding: "20px" }}>
        <img src="/logo.png" alt="Türkçe ÖABT" style={{ height: "45px", objectFit: "contain", cursor: "pointer" }} onClick={() => router.push("/")} />
        <button 
          className={styles.mobileCloseBtn}
          onClick={() => setSidebarOpen(false)}
          aria-label="Menüyü Kapat"
        >
          <X size={24} />
        </button>
      </div>

      <ul className={styles.sidebarMenu}>
        <li>
          <button 
            className={`${styles.menuBtn} ${activeTab === "sales" ? styles.menuBtnActive : ""}`}
            onClick={() => { onTabChange("sales"); setSidebarOpen(false); }}
          >
            <BarChart3 size={18} />
            <span>Satış Geçmişi & Siparişler</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.menuBtn} ${activeTab === "students" ? styles.menuBtnActive : ""}`}
            onClick={() => { onTabChange("students"); setSidebarOpen(false); }}
          >
            <Users size={18} />
            <span>Öğrenci Yönetimi</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.menuBtn} ${activeTab === "courses" ? styles.menuBtnActive : ""}`}
            onClick={() => { onTabChange("courses"); setSidebarOpen(false); }}
          >
            <BookOpen size={18} />
            <span>Eğitim Paketleri</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.menuBtn} ${activeTab === "publications" ? styles.menuBtnActive : ""}`}
            onClick={() => { onTabChange("publications"); setSidebarOpen(false); }}
          >
            <Library size={18} />
            <span>Yayın Yönetimi</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.menuBtn} ${activeTab === "categories" ? styles.menuBtnActive : ""}`}
            onClick={() => { onTabChange("categories"); setSidebarOpen(false); }}
          >
            <ListTree size={18} />
            <span>Eğitim Kategorisi Yönetimi</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.menuBtn} ${activeTab === "publicationCategories" ? styles.menuBtnActive : ""}`}
            onClick={() => { onTabChange("publicationCategories"); setSidebarOpen(false); }}
          >
            <ListTree size={18} />
            <span>Yayın Kategorisi Yönetimi</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.menuBtn} ${activeTab === "instructors" ? styles.menuBtnActive : ""}`}
            onClick={() => { onTabChange("instructors"); setSidebarOpen(false); }}
          >
            <GraduationCap size={18} />
            <span>Eğitmen Yönetimi</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.menuBtn} ${activeTab === "coupons" ? styles.menuBtnActive : ""}`}
            onClick={() => { onTabChange("coupons"); setSidebarOpen(false); }}
          >
            <Percent size={18} />
            <span>Kupon Yönetimi</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.menuBtn} ${activeTab === "influencer" ? styles.menuBtnActive : ""}`}
            onClick={() => { onTabChange("influencer"); setSidebarOpen(false); }}
          >
            <Megaphone size={18} />
            <span>Influencer Marketing</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.menuBtn} ${activeTab === "cms" ? styles.menuBtnActive : ""}`}
            onClick={() => { onTabChange("cms"); setSidebarOpen(false); }}
          >
            <Settings size={18} />
            <span>Dinamik Ayarlar (CMS)</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.menuBtn} ${activeTab === "support" ? styles.menuBtnActive : ""}`}
            onClick={() => { onTabChange("support"); setSidebarOpen(false); }}
            style={{ position: "relative" }}
          >
            <MessageSquare size={18} />
            <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
              <span>Destek Mesajları</span>
              {unreadMessages > 0 && (
                <span style={{ backgroundColor: "var(--color-error)", color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: "11px", fontWeight: 700 }}>
                  {unreadMessages}
                </span>
              )}
            </div>
          </button>
        </li>
      </ul>

      <div className={styles.sidebarFooter}>
        <button 
          className={styles.menuBtn} 
          onClick={logout} 
          style={{ color: "var(--color-error)" }}
        >
          <LogOut size={18} />
          <span>Güvenli Çıkış</span>
        </button>
      </div>
    </aside>
  );
}
