"use client";

import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import styles from "@/app/admin/dashboard/admin.module.css";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isDeleting?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Silme Onayı",
  message = "Bu öğeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
  isDeleting = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={styles.modal} 
        style={{ maxWidth: "400px", padding: "0", overflow: "hidden" }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader} style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: "var(--bg-secondary)" }}>
          <h3 className={styles.modalTitle} style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-error)" }}>
            <AlertTriangle size={18} />
            {title}
          </h3>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className={styles.modalBody} style={{ padding: "32px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "64px", height: "64px", backgroundColor: "#fee2e2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
            <Trash2 size={28} color="var(--color-error)" />
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
            {message}
          </p>
        </div>
        
        <div className={styles.modalFooter} style={{ borderTop: "1px solid var(--border-color)", backgroundColor: "var(--bg-secondary)", display: "flex", gap: "12px", padding: "16px 24px" }}>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className={`${styles.btn} ${styles.btnOutlineMuted}`}
            style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className={`${styles.btn} ${styles.btnDanger}`}
            style={{ flex: 1, display: "flex", justifyContent: "center", gap: "8px" }}
          >
            {isDeleting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Trash2 size={16} />
            )}
            {isDeleting ? "Siliniyor..." : "Sil"}
          </button>
        </div>
      </div>
    </div>
  );
}
