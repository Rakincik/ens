"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, Calendar, Package, CreditCard, ShieldAlert, Menu } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import styles from "./studentDetail.module.css";
import adminStyles from "@/app/admin/dashboard/admin.module.css";
import AdminSidebar from "@/components/Admin/AdminSidebar";

interface OrderItem {
  price: number;
  course: {
    title: string;
    type: string;
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentId: string | null;
  orderItems: OrderItem[];
}

interface Student {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  surname: string;
  phone: string | null;
  createdAt: string;
  orders: Order[];
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    async function loadStudent() {
      try {
        const res = await fetch(`/api/admin/students/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setStudent(data.student);
        } else {
          toast.error("Öğrenci bulunamadı.");
          router.push("/admin/dashboard");
        }
      } catch (err) {
        toast.error("Sistemsel bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) loadStudent();
  }, [params.id, router, toast]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır.");
      return;
    }
    
    setIsResetting(true);
    try {
      // Reusing the general students API for password reset, or we can use specific
      const response = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: student?.id, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Şifre güncellenemedi.");
      } else {
        toast.success(data.message || "Öğrenci şifresi başarıyla güncellendi.");
        setNewPassword("");
      }
    } catch (err) {
      toast.error("Şifre güncellenirken bir hata oluştu.");
    } finally {
      setIsResetting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid #eee", borderTopColor: "#b89047", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className={`${adminStyles.adminWrapper} ${sidebarOpen ? adminStyles.sidebarOpen : ""}`}>
      <AdminSidebar 
        activeTab="students" 
        onTabChange={() => router.push('/admin/dashboard')} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      <div className={adminStyles.mainContent}>
        <header className={adminStyles.topbar}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button 
              className={adminStyles.hamburger} 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <h1 className={adminStyles.adminTitle}>Öğrenci Yönetimi</h1>
          </div>
          
          <div className={adminStyles.adminUser}>
            <button onClick={() => router.push("/admin/dashboard")} className={styles.backBtn} style={{ marginBottom: 0 }}>
              <ArrowLeft size={16} />
              <span>Panele Dön</span>
            </button>
          </div>
        </header>

        <div className={adminStyles.contentBody}>
          <div className={styles.container} style={{ padding: 0 }}>
            <div className={styles.header}>
              <h1 className={styles.title}>Öğrenci Detayı: {student.name} {student.surname}</h1>
            </div>

      <div className={styles.grid}>
        {/* Sol Kolon: Bilgiler ve Güvenlik */}
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Kişisel Bilgiler</h2>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <User size={18} className={styles.icon} />
                <div>
                  <span className={styles.label}>Ad Soyad</span>
                  <span className={styles.value}>{student.name} {student.surname}</span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Mail size={18} className={styles.icon} />
                <div>
                  <span className={styles.label}>E-posta</span>
                  <span className={styles.value}>{student.email}</span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Phone size={18} className={styles.icon} />
                <div>
                  <span className={styles.label}>Telefon</span>
                  <span className={styles.value}>{student.phone || "Belirtilmemiş"}</span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Calendar size={18} className={styles.icon} />
                <div>
                  <span className={styles.label}>Kayıt Tarihi</span>
                  <span className={styles.value}>{new Date(student.createdAt).toLocaleString("tr-TR")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <ShieldAlert size={20} style={{ color: "var(--color-accent)" }} />
              <h2 className={styles.cardTitle} style={{ margin: 0 }}>Güvenlik ve Şifre</h2>
            </div>
            
            <div style={{ marginBottom: "24px", padding: "16px", backgroundColor: "var(--bg-secondary)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <span style={{ display: "block", fontSize: "13px", color: "var(--text-muted)", marginBottom: "4px" }}>Şifre (Düz Metin)</span>
              <span style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", wordBreak: "break-all" }}>
                {student.passwordHash}
              </span>
              {student.passwordHash.startsWith("$2") && (
                <span style={{ display: "block", fontSize: "12px", color: "var(--color-danger)", marginTop: "6px" }}>
                  * Bu şifre eski sistemle hashlenmiştir. Düz metin görmek için şifreyi sıfırlayın.
                </span>
              )}
            </div>

            <form onSubmit={handlePasswordReset} className={styles.pwdForm}>
              <input 
                type="text" 
                placeholder="Yeni Şifre Belirle" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
              />
              <button type="submit" disabled={isResetting || !newPassword} className={styles.btnDanger} style={{ backgroundColor: "var(--color-accent)" }}>
                {isResetting ? "Güncelleniyor..." : "Şifreyi Güncelle"}
              </button>
            </form>
          </div>
        </div>

        {/* Sağ Kolon: Satın Alım Geçmişi */}
        <div className={styles.rightCol}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Satın Alım Geçmişi</h2>
            
            {student.orders.length === 0 ? (
              <div className={styles.emptyState}>
                <Package size={32} style={{ color: "var(--text-muted)", marginBottom: "12px" }} />
                <p>Öğrencinin henüz bir siparişi bulunmuyor.</p>
              </div>
            ) : (
              <div className={styles.orderList}>
                {student.orders.map(order => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <div>
                        <span className={styles.orderDate}>{new Date(order.createdAt).toLocaleString("tr-TR")}</span>
                        <span className={styles.orderId}>Sipariş ID: {order.id.slice(0, 8).toUpperCase()}</span>
                      </div>
                      <span className={`${styles.badge} ${order.status === "SUCCESS" ? styles.badgeSuccess : styles.badgeDanger}`}>
                        {order.status === "SUCCESS" ? "Ödendi" : "Başarısız/İptal"}
                      </span>
                    </div>
                    
                    <div className={styles.orderItems}>
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className={styles.orderItem}>
                          <span className={styles.itemName}>{item.course.title}</span>
                          <span className={styles.itemPrice}>₺{item.price.toLocaleString("tr-TR")}</span>
                        </div>
                      ))}
                    </div>

                    <div className={styles.orderFooter}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CreditCard size={14} style={{ color: "var(--text-muted)" }} />
                        <span className={styles.paymentInfo}>
                          {order.paymentId ? "PayTR ile Ödendi" : "Sistem Kaydı"}
                        </span>
                      </div>
                      <span className={styles.totalAmount}>Toplam: ₺{order.totalAmount.toLocaleString("tr-TR")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
}
