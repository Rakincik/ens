"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, CreditCard, ShoppingBag, LogOut, Play, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "./dashboard.module.css";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: string[];
}

export default function StudentDashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [courses, setCourses] = useState<Course[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Oturum kontrolü
  useEffect(() => {
    if (!authLoading && !user) {
      toast.warning("Öğrenci paneline erişebilmek için giriş yapmalısınız.");
      router.push("/auth/login?redirect=/dashboard");
    }
  }, [user, authLoading, router, toast]);

  // Dashboard verilerini çek
  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      try {
        setLoading(true);
        const response = await fetch("/api/student/dashboard");
        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses);
          setOrders(data.orders);
        }
      } catch (error) {
        console.error(error);
        toast.error("Panel bilgileri yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchDashboardData();
    }
  }, [user, toast]);

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className={styles.wrapper}>
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
      </div>
    );
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return styles.statusSuccess;
      case "PENDING":
        return styles.statusPending;
      case "FAILED":
        return styles.statusFailed;
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "Başarılı";
      case "PENDING":
        return "Bekliyor";
      case "FAILED":
        return "Başarısız";
      default:
        return status;
    }
  };

  return (
    <>
      <Header />
      <main className={styles.wrapper}>
        <div className="container">
          {/* Header Welcome Area */}
          <div className={styles.headerArea}>
            <div>
              <h1 className={styles.welcomeText}>
                Hoş geldin, <span>{user?.name} {user?.surname}</span>
              </h1>
              <p className={styles.emailText}>{user?.email} (Öğrenci Hesabı)</p>
            </div>
            
            <button className={styles.logoutBtn} onClick={logout}>
              <LogOut size={16} />
              <span>Çıkış Yap</span>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className={styles.statTitle}>Aktif Eğitimlerim</h3>
                <div className={styles.statVal}>{courses.length} Paket</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className={styles.statTitle}>Toplam Ödeme</h3>
                <div className={styles.statVal}>
                  {orders
                    .filter((o) => o.status === "SUCCESS")
                    .reduce((sum, o) => sum + o.totalAmount, 0)
                    .toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })}
                </div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <ShoppingBag size={20} />
              </div>
              <div>
                <h3 className={styles.statTitle}>Sipariş Sayısı</h3>
                <div className={styles.statVal}>{orders.length} İşlem</div>
              </div>
            </div>
          </div>

          {/* Sections Layout */}
          <div className={styles.sections}>
            {/* 1. Aktif Eğitimler */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>
                <BookOpen size={18} />
                <span>Aktif Kurslarım</span>
              </h2>

              {loading ? (
                <p style={{ color: "var(--text-secondary)" }}>Yükleniyor...</p>
              ) : courses.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-secondary)" }}>
                  <p style={{ marginBottom: "16px" }}>Henüz aktif eğitim paketiniz bulunmamaktadır.</p>
                  <Link href="/" className={styles.watchBtn} style={{ padding: "10px 20px" }}>
                    Eğitimleri Keşfet
                  </Link>
                </div>
              ) : (
                <div className={styles.courseGrid}>
                  {courses.map((course) => (
                    <div key={course.id} className={styles.courseCard}>
                      <h3 className={styles.courseTitle}>{course.title}</h3>
                      <div className={styles.courseDesc} dangerouslySetInnerHTML={{ __html: course.description }} />
                      
                      <button 
                        className={styles.watchBtn}
                        onClick={() => toast.info("Canlı eğitim hub platformuna yönlendiriliyorsunuz (Muro LMS Entegrasyonu)")}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                      >
                        <Play size={14} fill="white" />
                        <span>Derse Başla</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Sipariş Geçmişi */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>
                <CreditCard size={18} />
                <span>Sipariş Geçmişi</span>
              </h2>

              {loading ? (
                <p style={{ color: "var(--text-secondary)" }}>Yükleniyor...</p>
              ) : orders.length === 0 ? (
                <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "20px" }}>
                  Henüz sipariş geçmişiniz bulunmamaktadır.
                </p>
              ) : (
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Sipariş ID</th>
                        <th>Tarih</th>
                        <th>Satın Alınan Kurslar</th>
                        <th>Ödenen Tutar</th>
                        <th>Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td style={{ fontSize: "12px", fontFamily: "monospace" }}>{order.id.substring(0, 8)}...</td>
                          <td style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Calendar size={14} style={{ color: "var(--text-muted)" }} />
                            <span>{new Date(order.createdAt).toLocaleDateString("tr-TR")}</span>
                          </td>
                          <td>{order.items.join(", ")}</td>
                          <td style={{ fontWeight: 700, color: "var(--color-primary)" }}>
                            {order.totalAmount.toLocaleString("tr-TR", {
                              style: "currency",
                              currency: "TRY",
                            })}
                          </td>
                          <td>
                            <span className={`${styles.status} ${getStatusClass(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
