"use client";

import { useState, useEffect } from "react";
import { Key, X, Search, ChevronRight, ArrowUpDown, Filter, Plus } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";
import { createUser } from "@/app/admin/actions";
import styles from "@/app/admin/dashboard/admin.module.css";

interface Student {
  id: string;
  email: string;
  name: string;
  surname: string;
  createdAt: string;
  orders: {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    orderItems: { course: { title: string } }[];
  }[];
}

export default function StudentsTab() {
  const toast = useToast();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentSearch, setStudentSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "name_asc" | "name_desc">("date_desc");

  // Modals and password reset state
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [isResettingPwd, setIsResettingPwd] = useState(false);

  // New user state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: "", surname: "", email: "", password: "", role: "STUDENT" });
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/students");
        if (res.ok) {
          const data = await res.json();
          setStudents(data.students);
        } else {
          toast.error("Öğrenciler yüklenemedi.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Öğrenciler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, [toast]);

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !newPassword) return;

    setIsResettingPwd(true);
    try {
      const response = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: selectedStudent.id, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Şifre sıfırlanamadı.");
      } else {
        toast.success(data.message);
        setShowPwdModal(false);
        setNewPassword("");
      }
    } catch (err) {
      toast.error("Sistemsel bir hata oluştu.");
    } finally {
      setIsResettingPwd(false);
    }
  };

  let filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.surname.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  // Apply sorting
  filteredStudents.sort((a, b) => {
    if (sortBy === "date_desc") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "date_asc") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === "name_asc") return a.name.localeCompare(b.name);
    if (sortBy === "name_desc") return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <div className="animate-fade-in">
      <div className={styles.headerRow} style={{ flexWrap: "wrap", gap: "16px" }}>
        <h2 className={styles.viewTitle}>Öğrenci Yönetimi</h2>
        
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", marginLeft: "auto" }}>
          {/* Yeni Kullanıcı Ekle Butonu */}
          <button
            className={styles.btn}
            onClick={() => {
              setNewUserForm({ name: "", surname: "", email: "", password: "", role: "ADMIN" });
              setShowAddUserModal(true);
            }}
          >
            <Plus size={16} />
            <span>Yeni Kullanıcı Ekle</span>
          </button>

          {/* Arama Inputu */}
          <div style={{ position: "relative", width: "100%", minWidth: "260px", maxWidth: "320px" }}>
            <input 
              className={styles.searchBar} 
              type="text" 
              placeholder="İsim, soyisim veya e-posta ara..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              style={{ paddingLeft: "36px" }}
            />
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          </div>

          {/* Sıralama Select */}
          <div style={{ position: "relative" }}>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className={styles.selectInput}
              style={{ padding: "10px 36px 10px 16px", borderRadius: "8px", border: "1px solid var(--border-color)", appearance: "none", backgroundColor: "white", outline: "none", cursor: "pointer", fontWeight: 500 }}
            >
              <option value="date_desc">En Yeni Kayıtlar</option>
              <option value="date_asc">En Eski Kayıtlar</option>
              <option value="name_asc">İsime Göre (A-Z)</option>
              <option value="name_desc">İsime Göre (Z-A)</option>
            </select>
            <ArrowUpDown size={16} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
          <div className={styles.spinner} style={{ width: "32px", height: "32px" }} />
        </div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Öğrenci Adı Soyadı</th>
                  <th>E-posta</th>
                  <th>Kayıt Tarihi</th>
                  <th>Satın Aldığı Paketler</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((st) => {
                  const successfulOrders = st.orders.filter(o => o.status === "SUCCESS");
                  const purchasedTitles = successfulOrders.flatMap(o => o.orderItems.map(item => item.course.title));
                  
                  return (
                    <tr key={st.id}>
                      <td style={{ fontWeight: 600, color: "var(--color-primary)" }}>{st.name} {st.surname}</td>
                      <td>{st.email}</td>
                      <td>{new Date(st.createdAt).toLocaleDateString("tr-TR")}</td>
                      <td>
                        {purchasedTitles.length > 0 ? (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {purchasedTitles.map((t, idx) => (
                              <span key={idx} style={{
                                fontSize: "11px",
                                fontWeight: 600,
                                backgroundColor: "var(--color-primary-light)",
                                color: "var(--color-primary)",
                                padding: "2px 6px",
                                borderRadius: "var(--radius-sm)"
                              }}>{t}</span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>Kurs Satın Alınmamış</span>
                        )}
                      </td>
                      <td>
                        <button 
                          onClick={() => router.push(`/admin/students/${st.id}`)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 14px",
                            backgroundColor: "var(--color-primary)",
                            color: "white",
                            border: "none",
                            borderRadius: "var(--radius-sm)",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "13px"
                          }}
                        >
                          <span>Detayı Gör</span>
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ŞİFRE SIFIRLAMA */}
      {showPwdModal && selectedStudent && (
        <div className={styles.modalOverlay} onClick={() => setShowPwdModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Şifre Güncelle: {selectedStudent.name} {selectedStudent.surname}</h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowPwdModal(false)}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handlePasswordResetSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Yeni Şifre (En az 6 karakter)</label>
                  <input
                    className={styles.input}
                    type="password"
                    placeholder="••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button 
                  className={`${styles.btn} ${styles.btnOutline}`} 
                  type="button" 
                  onClick={() => setShowPwdModal(false)}
                >
                  İptal
                </button>
                <button 
                  className={styles.btn} 
                  type="submit" 
                  disabled={isResettingPwd}
                >
                  Şifreyi Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: YENİ KULLANICI EKLE */}
      {showAddUserModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddUserModal(false)}>
          <div className={styles.modal} style={{ overflow: "visible" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Yeni Kullanıcı Ekle</h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowAddUserModal(false)}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmittingUser(true);
              const result = await createUser(newUserForm);
              if (result.success) {
                toast.success(result.message);
                setShowAddUserModal(false);
                window.location.reload(); 
              } else {
                toast.error(result.error);
              }
              setIsSubmittingUser(false);
            }}>
              <div className={styles.modalBody}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label className={styles.label}>Ad</label>
                    <input className={styles.input} required value={newUserForm.name} onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })} />
                  </div>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label className={styles.label}>Soyad</label>
                    <input className={styles.input} required value={newUserForm.surname} onChange={(e) => setNewUserForm({ ...newUserForm, surname: e.target.value })} />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>E-posta</label>
                  <input className={styles.input} type="email" required value={newUserForm.email} onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Şifre (Boş bırakılırsa 123456)</label>
                  <input className={styles.input} type="password" placeholder="••••••" value={newUserForm.password} onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })} />
                </div>
                <div className={styles.formGroup} style={{ position: "relative" }}>
                  <label className={styles.label}>Kullanıcı Rolü</label>
                  <div 
                    className={styles.input} 
                    style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc", color: "var(--text-muted)" }}
                  >
                    <span>Yönetici (ADMIN)</span>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button className={`${styles.btn} ${styles.btnOutline}`} type="button" onClick={() => setShowAddUserModal(false)}>İptal</button>
                <button className={styles.btn} type="submit" disabled={isSubmittingUser}>
                  {isSubmittingUser ? "Ekleniyor..." : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
