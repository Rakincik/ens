"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";
import { Loader2, Mail, CheckCircle, Clock } from "lucide-react";

interface SupportMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function SupportTab() {
  const toast = useToast();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/support");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      } else {
        toast.error("Mesajlar yüklenemedi.");
      }
    } catch (error) {
      toast.error("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead: !currentStatus }),
      });
      if (res.ok) {
        setMessages(messages.map((m) => (m.id === id ? { ...m, isRead: !currentStatus } : m)));
        toast.success(currentStatus ? "Okunmadı olarak işaretlendi." : "Okundu olarak işaretlendi.");
      } else {
        toast.error("Durum güncellenemedi.");
      }
    } catch (error) {
      toast.error("Bağlantı hatası oluştu.");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
        <Loader2 className="animate-spin" size={32} style={{ color: "var(--color-accent)" }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-primary)" }}>Destek Mesajları</h3>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          İletişim formundan gelen mesajları görüntüleyin ve yanıtlayın.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {messages.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", backgroundColor: "var(--bg-secondary)", borderRadius: "8px", color: "var(--text-muted)" }}>
            Henüz hiç mesaj bulunmuyor.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                backgroundColor: msg.isRead ? "var(--bg-primary)" : "var(--bg-secondary)",
                border: "1px solid",
                borderColor: msg.isRead ? "var(--border-color)" : "var(--color-accent)",
                borderRadius: "8px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                transition: "all 0.2s",
                opacity: msg.isRead ? 0.7 : 1,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontWeight: 700, color: "var(--color-primary)", fontSize: "15px" }}>{msg.name}</span>
                  <div style={{ display: "flex", gap: "12px", fontSize: "13px", color: "var(--text-secondary)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Mail size={14} /> {msg.email}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={14} /> {msg.phone}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {new Date(msg.createdAt).toLocaleString("tr-TR")}
                  </span>
                  <button
                    onClick={() => toggleReadStatus(msg.id, msg.isRead)}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "6px 12px", borderRadius: "6px",
                      fontSize: "12px", fontWeight: 600, cursor: "pointer",
                      backgroundColor: msg.isRead ? "var(--bg-secondary)" : "var(--color-primary-light)",
                      color: msg.isRead ? "var(--text-secondary)" : "var(--color-primary)",
                      border: "1px solid", borderColor: msg.isRead ? "var(--border-color)" : "var(--color-primary-light)",
                    }}
                  >
                    <CheckCircle size={14} />
                    {msg.isRead ? "Okunmadı İşaretle" : "Okundu İşaretle"}
                  </button>
                </div>
              </div>
              <div style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--text-secondary)", backgroundColor: "#fff", padding: "16px", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
                {msg.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
