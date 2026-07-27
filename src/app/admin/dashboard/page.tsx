"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, BookOpen, Settings, LogOut, ShieldCheck, Menu, Percent, Library, Megaphone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import styles from "./admin.module.css";

// Modular Sub-components
import StudentsTab from "@/components/Admin/StudentsTab";
import CoursesTab from "@/components/Admin/CoursesTab";
import CouponsTab from "@/components/Admin/CouponsTab";
import CmsTab from "@/components/Admin/CmsTab";
import SalesTab from "@/components/Admin/SalesTab";
import SupportTab from "@/components/Admin/SupportTab";
import CategoriesTab from "@/components/Admin/CategoriesTab";
import InstructorsTab from "@/components/Admin/InstructorsTab";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import { MessageSquare, BarChart3, ListTree } from "lucide-react";

export default function AdminDashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<"students" | "courses" | "publications" | "coupons" | "influencer" | "cms" | "sales" | "support" | "categories" | "instructors" | string>("sales");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Fetch unread messages count
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
  }, [user, activeTab]); // Refresh when tab changes so it updates when a message is read

  // Authenticated Admin Route Guards
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast.warning("Bu alana erişmek için giriş yapmalısınız.");
        router.push("/auth/login?redirect=/admin/dashboard");
      } else if (user.role !== "ADMIN") {
        toast.error("Bu alana erişim yetkiniz bulunmamaktadır.");
        router.push("/dashboard");
      }
    }
  }, [user, authLoading, router, toast]);

  if (authLoading || !user || user.role !== "ADMIN") {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div className={styles.spinner} style={{
          width: "40px",
          height: "40px",
          border: "3px solid var(--border-color)",
          borderTopColor: "var(--color-accent)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
      </div>
    );
  }

  return (
    <div className={`${styles.adminWrapper} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
      {/* SIDEBAR PANEL */}
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* MAIN VIEW AREA */}
      <div className={styles.mainContent}>
        <header className={styles.topbar}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button 
              className={styles.hamburger} 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <h1 className={styles.adminTitle}>Yönetim Paneli</h1>
          </div>
          
          <div className={styles.adminUser}>
            <span>Hoş geldiniz, {user?.name} {user?.surname} (Admin)</span>
          </div>
        </header>

        <div className={styles.contentBody}>
          {activeTab === "sales" && <SalesTab />}
          {activeTab === "students" && <StudentsTab />}
          {activeTab === "courses" && <CoursesTab productType="COURSE" />}
          {activeTab === "publications" && <CoursesTab productType="PUBLICATION" />}
          {activeTab === "categories" && <CategoriesTab />}
          {activeTab === "instructors" && <InstructorsTab />}
          {activeTab === "coupons" && <CouponsTab isInfluencerMode={false} />}
          {activeTab === "influencer" && <CouponsTab isInfluencerMode={true} />}
          {activeTab === "cms" && <CmsTab />}
          {activeTab === "support" && <SupportTab />}
        </div>
      </div>
    </div>
  );
}
