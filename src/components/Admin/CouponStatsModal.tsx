"use client";

import { useState, useMemo } from "react";
import { X, TrendingUp, Calendar, CreditCard, Clock, Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "@/app/admin/dashboard/admin.module.css";

interface Order {
  id: string;
  totalAmount: number;
  createdAt: string;
}

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  usageCount: number;
  orders?: Order[];
}

interface CouponStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon: Coupon;
}

export default function CouponStatsModal({ isOpen, onClose, coupon }: CouponStatsModalProps) {
  const [timeFilter, setTimeFilter] = useState<"day" | "month" | "year">("month");

  const orders = coupon.orders || [];

  // Derived stats
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.totalAmount, 0), [orders]);
  const usageCount = coupon.usageCount;

  const chartData = useMemo(() => {
    const dataMap: { [key: string]: { name: string; revenue: number; usages: number } } = {};
    const now = new Date();

    if (timeFilter === "day") {
      // Son 7 gün
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = d.toLocaleDateString("tr-TR", { weekday: 'short' }); // Pzt, Sal vb.
        const dateStr = d.toISOString().split("T")[0];
        dataMap[dateStr] = { name: dayName, revenue: 0, usages: 0 };
      }
    } else if (timeFilter === "month") {
      // Bu yılın 12 ayı
      const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
      months.forEach((m, index) => {
        dataMap[index.toString()] = { name: m, revenue: 0, usages: 0 };
      });
    } else if (timeFilter === "year") {
      // Son 5 yıl
      const currentYear = now.getFullYear();
      for (let i = 4; i >= 0; i--) {
        const year = (currentYear - i).toString();
        dataMap[year] = { name: year, revenue: 0, usages: 0 };
      }
    }

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      
      if (timeFilter === "day") {
        const dateStr = date.toISOString().split("T")[0];
        if (dataMap[dateStr]) {
          dataMap[dateStr].revenue += order.totalAmount;
          dataMap[dateStr].usages += 1;
        }
      } else if (timeFilter === "month") {
        if (date.getFullYear() === now.getFullYear()) {
          const monthIdx = date.getMonth().toString();
          if (dataMap[monthIdx]) {
            dataMap[monthIdx].revenue += order.totalAmount;
            dataMap[monthIdx].usages += 1;
          }
        }
      } else if (timeFilter === "year") {
        const yearStr = date.getFullYear().toString();
        if (dataMap[yearStr]) {
          dataMap[yearStr].revenue += order.totalAmount;
          dataMap[yearStr].usages += 1;
        }
      }
    });

    return Object.values(dataMap);
  }, [orders, timeFilter]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose} style={{ zIndex: 3000 }}>
      <div 
        className={`${styles.modal} ${styles.modalWide}`}
        style={{ maxWidth: "800px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ 
              width: "40px", height: "40px", 
              backgroundColor: "rgba(184, 144, 71, 0.1)", 
              borderRadius: "8px", 
              display: "flex", alignItems: "center", justifyContent: "center", 
              color: "var(--color-primary)" 
            }}>
              <Activity size={20} />
            </div>
            <div>
              <h3 className={styles.modalTitle}>Performans Özeti</h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500, fontFamily: "monospace", marginTop: "2px" }}>{coupon.code}</p>
            </div>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.modalBody}>
          {/* Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "8px" }}>
            <div style={{ 
              background: "linear-gradient(135deg, rgba(184, 144, 71, 0.05) 0%, rgba(184, 144, 71, 0.15) 100%)", 
              borderRadius: "12px", 
              padding: "20px", 
              border: "1px solid rgba(184, 144, 71, 0.2)" 
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-primary)", marginBottom: "8px" }}>
                <CreditCard size={18} />
                <h4 style={{ fontWeight: 600, margin: 0, fontSize: "14px" }}>Toplam Ciro</h4>
              </div>
              <p style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)", margin: "4px 0" }}>
                {totalRevenue.toLocaleString("tr-TR")} TL
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, fontWeight: 500 }}>Bu kupon kodundan elde edilen gelir</p>
            </div>

            <div style={{ 
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.03) 0%, rgba(30, 41, 59, 0.08) 100%)", 
              borderRadius: "12px", 
              padding: "20px", 
              border: "1px solid var(--border-color)" 
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-primary)", marginBottom: "8px" }}>
                <TrendingUp size={18} />
                <h4 style={{ fontWeight: 600, margin: 0, fontSize: "14px" }}>Kullanım Sayısı</h4>
              </div>
              <p style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)", margin: "4px 0" }}>
                {usageCount}
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, fontWeight: 500 }}>Başarılı siparişlerde kullanım</p>
            </div>
          </div>

          {/* Chart Section */}
          <div style={{ backgroundColor: "white", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h4 style={{ fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px", margin: 0, fontSize: "15px" }}>
                <Calendar size={18} color="var(--text-muted)" />
                Zaman Çizelgesi
              </h4>
              
              {/* Filters */}
              <div style={{ display: "flex", backgroundColor: "var(--bg-secondary)", padding: "4px", borderRadius: "8px" }}>
                {(["day", "month", "year"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    style={{
                      padding: "6px 16px",
                      fontSize: "13px",
                      fontWeight: 600,
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      backgroundColor: timeFilter === filter ? "white" : "transparent",
                      color: timeFilter === filter ? "var(--color-primary)" : "var(--text-muted)",
                      boxShadow: timeFilter === filter ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                    }}
                  >
                    {filter === "day" ? "Gün" : filter === "month" ? "Ay" : "Yıl"}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: "300px", width: "100%", marginTop: "16px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b89047" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#b89047" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(val) => `${val} ₺`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: number, name: string) => [
                      name === "revenue" ? `${value.toLocaleString("tr-TR")} ₺` : value,
                      name === "revenue" ? "Ciro" : "Kullanım"
                    ]}
                    labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#b89047" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#b89047' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
