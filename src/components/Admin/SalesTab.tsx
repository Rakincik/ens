"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";
import { Loader2, DollarSign, ShoppingBag, Users, Package } from "lucide-react";

interface Order {
  id: string;
  userId: string;
  user: { name: string; surname: string; email: string };
  totalAmount: number;
  status: string;
  paymentId: string | null;
  createdAt: string;
  orderItems: { course: { title: string } }[];
}

interface Metrics {
  totalRevenue: number;
  successfulSales: number;
  registeredStudents: number;
  totalProducts: number;
}

export default function SalesTab() {
  const toast = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalRevenue: 0,
    successfulSales: 0,
    registeredStudents: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/sales");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        if (data.metrics) setMetrics(data.metrics);
      } else {
        toast.error("Satış verileri yüklenemedi.");
      }
    } catch (error) {
      toast.error("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
        <Loader2 className="animate-spin" size={32} style={{ color: "var(--color-accent)" }} />
      </div>
    );
  }

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(amount);
  };

  // Helper to render status badge
  const renderStatus = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return <span style={{ padding: "4px 8px", backgroundColor: "#d1fae5", color: "#065f46", borderRadius: "4px", fontSize: "12px", fontWeight: 600 }}>BAŞARILI</span>;
      case "PENDING":
        return <span style={{ padding: "4px 8px", backgroundColor: "#fef3c7", color: "#92400e", borderRadius: "4px", fontSize: "12px", fontWeight: 600 }}>BEKLİYOR</span>;
      case "FAILED":
        return <span style={{ padding: "4px 8px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "4px", fontSize: "12px", fontWeight: 600 }}>BAŞARISIZ</span>;
      default:
        return <span style={{ padding: "4px 8px", backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)", borderRadius: "4px", fontSize: "12px", fontWeight: 600 }}>{status}</span>;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      
      {/* HEADER */}
      <div>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-primary)" }}>Satış Geçmişi & Siparişler</h3>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          Platform üzerindeki satış istatistiklerini ve geçmiş siparişleri takip edin.
        </p>
      </div>

      {/* METRICS CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
        
        {/* Total Revenue */}
        <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DollarSign size={20} />
            </div>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#059669", backgroundColor: "#d1fae5", padding: "4px 8px", borderRadius: "12px" }}>Aktif</span>
          </div>
          <div>
            <h4 style={{ fontSize: "24px", fontWeight: 800, color: "var(--color-primary)" }}>{formatCurrency(metrics.totalRevenue)}</h4>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Toplam Gelir</span>
          </div>
        </div>

        {/* Successful Sales */}
        <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#e0e7ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: "24px", fontWeight: 800, color: "var(--color-primary)" }}>{metrics.successfulSales}</h4>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Başarılı Satışlar</span>
          </div>
        </div>

        {/* Registered Students */}
        <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#fae8ff", color: "#c026d3", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={20} />
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: "24px", fontWeight: 800, color: "var(--color-primary)" }}>{metrics.registeredStudents}</h4>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Kayıtlı Öğrenciler</span>
          </div>
        </div>

        {/* Total Products */}
        <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#d1fae5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Package size={20} />
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: "24px", fontWeight: 800, color: "var(--color-primary)" }}>{metrics.totalProducts}</h4>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Toplam Ürün</span>
          </div>
        </div>

      </div>

      {/* SALES TABLE */}
      <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid var(--border-color)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
            <tr>
              <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>Müşteri</th>
              <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>Eğitim Paketi / Başlık</th>
              <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>Tutar</th>
              <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>Durum</th>
              <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>Tarih</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
                  Henüz satış geçmişi bulunmuyor.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "16px", fontSize: "14px", fontWeight: 600, color: "var(--color-primary)" }}>
                    {order.user.name} {order.user.surname}
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 400, marginTop: "4px" }}>{order.user.email}</div>
                  </td>
                  <td style={{ padding: "16px", fontSize: "13px", color: "var(--text-secondary)" }}>
                    {order.orderItems.map(item => item.course.title).join(", ")}
                  </td>
                  <td style={{ padding: "16px", fontSize: "14px", fontWeight: 700, color: "var(--color-primary)" }}>
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td style={{ padding: "16px" }}>
                    {renderStatus(order.status)}
                  </td>
                  <td style={{ padding: "16px", fontSize: "13px", color: "var(--text-muted)" }}>
                    {new Date(order.createdAt).toLocaleDateString("tr-TR", { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
