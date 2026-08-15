"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ShoppingBag, ArrowLeft, Trash2, Lock } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "./sepet.module.css";

export default function CheckoutPage() {
  const { cartItems, appliedCoupon, getCartTotal, getDiscountAmount, getCartSubtotal, removeFromCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");

  const [binData, setBinData] = useState<any>(null);
  const [lastFetchedBin, setLastFetchedBin] = useState("");
  const [installment, setInstallment] = useState("0");
  const [installmentsData, setInstallmentsData] = useState<any>(null);
  
  // Taksit seçeneklerini saklamak ve fiyatı hesaplamak için yardımcı fonksiyon
  const getAvailableInstallments = () => {
    if (!binData || binData.cardType !== "credit") return [{ count: "0", label: "Tek Çekim", rate: 1 }];
    
    let options = [{ count: "0", label: "Tek Çekim", rate: 1 }];
    let hasDynamicData = false;
    
    if (installmentsData && installmentsData.installments) {
        const family = binData.cardFamily || binData.brand || binData.bank;
        let list: any[] = [];
        
        if (Array.isArray(installmentsData.installments)) {
           list = installmentsData.installments;
        } else if (typeof installmentsData.installments === "object") {
           // Örneğin { "Bonus": [...], "Axess": [...] } formatındaysa
           if (family && installmentsData.installments[family]) {
               list = installmentsData.installments[family];
           } else {
               const keys = Object.keys(installmentsData.installments);
               if (keys.length > 0) list = installmentsData.installments[keys[0]];
           }
        }
        
        if (Array.isArray(list) && list.length > 0) {
           hasDynamicData = true;
           list.forEach((item: any) => {
              const count = String(item.installment || item.count || item.taksit);
              const rate = parseFloat(item.rate || item.oran || "1") || 1;
              if (count && count !== "0" && count !== "1") {
                  options.push({ count, label: `${count} Taksit`, rate });
              }
           });
        }
    }
    
    // PayTR'dan dinamik taksit oranları okunamadıysa, geçici (demo) oranlar ekle
    if (!hasDynamicData) {
        return [
            { count: "0", label: "Tek Çekim", rate: 1 },
            { count: "2", label: "2 Taksit", rate: 1.05 },
            { count: "3", label: "3 Taksit", rate: 1.07 },
            { count: "6", label: "6 Taksit", rate: 1.10 },
            { count: "9", label: "9 Taksit", rate: 1.15 },
            { count: "12", label: "12 Taksit", rate: 1.20 }
        ];
    }
    
    return options;
  };

  const getFinalAmount = () => {
    const subtotal = getCartSubtotal();
    const options = getAvailableInstallments();
    const selected = options.find(opt => opt.count === installment);
    if (selected && selected.rate) {
       return subtotal * selected.rate;
    }
    return subtotal;
  };

  // Taksit Oranlarını Çek (Mağazaya Özel Vade Farkları Tablosu)
  useEffect(() => {
    const fetchInstallments = async () => {
      try {
        const res = await fetch("/api/checkout/installments", { method: "POST" });
        const data = await res.json();
        if (data.status === "success") {
          setInstallmentsData(data);
        }
      } catch (err) {
        console.error("Taksit API Ağ/Parse Hatası:", err);
      }
    };
    fetchInstallments();
  }, []);

  // BIN Sorgusu
  useEffect(() => {
    const fetchBinData = async () => {
      const rawNumber = cardNumber.replace(/\s/g, "");
      if (rawNumber.length >= 6) {
        const bin = rawNumber.substring(0, 6);
        if (bin === lastFetchedBin) return;
        
        setLastFetchedBin(bin);
        try {
          const res = await fetch("/api/checkout/bin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ binNumber: bin })
          });
          const data = await res.json();
          if (data.status === "success") {
            setBinData(data);
            if (data.cardType === "debit" || data.businessCard === "yes") {
              setInstallment("0"); // Banka kartına taksit olmaz
            }
          } else {
            console.error("BIN Servisi Hata Döndü:", data);
            setBinData(null);
            setInstallment("0");
          }
        } catch (err) {
          console.error("BIN Sorgusu Ağ/Parse Hatası:", err);
          setBinData(null);
          setInstallment("0");
        }
      } else {
        setBinData(null);
        setLastFetchedBin("");
        setInstallment("0");
      }
    };

    fetchBinData();
  }, [cardNumber, lastFetchedBin]);

  // Oturum kontrolü
  useEffect(() => {
    if (!authLoading && !user) {
      toast.warning("Ödeme sayfasına erişebilmek için giriş yapmanız gerekmektedir.");
      router.push("/auth/login?redirect=/sepet");
    }
  }, [user, authLoading, router, toast]);

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    
    if(!cardNumber || !cardHolder || !expMonth || !expYear || !cvv) {
      toast.error("Lütfen tüm kredi kartı bilgilerini eksiksiz doldurun.");
      return;
    }
    
    if (cardNumber.replace(/\s/g, '').length < 15 || cvv.length < 3) {
      toast.error("Kredi kartı numaranız veya güvenlik kodunuz eksik.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/checkout/paytr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: cartItems.map((item) => ({ id: item.id, title: item.title, price: item.price })),
          user: user,
          totalAmount: getFinalAmount(),
          installment_count: installment,
          card_type: binData?.cardFamily || binData?.brand || binData?.bank || "",
          successUrl: `${window.location.origin}/odeme/basarili`,
          failUrl: `${window.location.origin}/odeme/hata`,
        }),
      });

      const data = await response.json();
      
      if(!response.ok) {
        toast.error(data.error || "Ödeme başlatılamadı. Lütfen daha sonra tekrar deneyin.");
        setIsSubmitting(false);
        return;
      }
      
      const { paytrData } = data;
      
      // PayTR Direkt API Form Submission
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://www.paytr.com/odeme";
      
      // Add CC info
      const ccData = {
        cc_owner: cardHolder,
        card_number: cardNumber.replace(/\s/g, ''),
        expiry_month: expMonth,
        expiry_year: expYear,
        cvv: cvv
      };
      
      for (const key in ccData) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = ccData[key as keyof typeof ccData];
        form.appendChild(input);
      }
      
      // Add paytrData (merchant_id, user_ip, hash etc)
      for (const key in paytrData) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = paytrData[key];
        form.appendChild(input);
      }
      
      document.body.appendChild(form);
      form.submit();
      
    } catch(err) {
      console.error(err);
      toast.error("Beklenmeyen bir ağ hatası oluştu.");
      setIsSubmitting(false);
    }
  }

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className={styles.checkoutWrapper}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Yönlendiriliyorsunuz...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.checkoutWrapper}>
        <div className="container">
          <Link href="/" style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            color: "var(--text-secondary)",
            marginBottom: "24px",
            width: "fit-content"
          }}>
            <ArrowLeft size={16} />
            <span>Alışverişe Devam Et</span>
          </Link>

          <h1 className={styles.title}>Güvenli Ödeme Sayfası</h1>

          {cartItems.length === 0 ? (
            <div className={styles.card} style={{ textAlign: "center", padding: "64px 24px" }}>
              <ShoppingBag size={48} style={{ color: "var(--border-color-dark)", marginBottom: "16px", margin: "0 auto" }} />
              <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>Sepetinizde ürün bulunmamaktadır.</p>
              <Link href="/" className={styles.actionBtn} style={{ padding: "12px 24px", borderRadius: "var(--radius-md)" }}>
                Eğitimleri İncele
              </Link>
            </div>
          ) : (
            <div className={styles.layout}>
              {/* Sol Sütun: Sipariş Özeti */}
              <div className={styles.card}>
                <h2 className={styles.sectionTitle}>
                  <ShoppingBag size={18} />
                  <span>Sipariş Özeti ({cartItems.length})</span>
                </h2>

                <div className={styles.itemsList}>
                  {cartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className={styles.item}
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        padding: "16px", 
                        backgroundColor: "#fff", 
                        border: "1px solid var(--border-color)", 
                        borderRadius: "16px", 
                        marginBottom: "16px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        {item.image ? (
                          <img 
                            src={item.image.startsWith('http') ? item.image.replace('toa.muro.click', 'www.turkceoabtdeyiz.com') : item.image} 
                            alt={item.title} 
                            style={{ 
                              width: "120px", 
                              height: "120px", 
                              objectFit: "contain",
                              backgroundColor: "var(--bg-secondary)", 
                              borderRadius: "12px",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
                            }} 
                          />
                        ) : (
                          <div style={{ width: "120px", height: "120px", backgroundColor: "var(--surface-active)", borderRadius: "12px" }} />
                        )}
                      </div>
                      
                      <div style={{ flex: 1, paddingLeft: "24px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Eğitim Paketi</span>
                        <h4 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", lineHeight: "1.3" }}>{item.title}</h4>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px", flexShrink: 0, paddingLeft: "16px" }}>
                        <span style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
                          {item.price.toLocaleString("tr-TR", {
                            style: "currency",
                            currency: "TRY",
                          })}
                        </span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          style={{ 
                            background: "rgba(239, 68, 68, 0.1)", 
                            border: "none", 
                            color: "var(--color-error)", 
                            cursor: "pointer", 
                            padding: "8px 12px",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "13px",
                            fontWeight: 600,
                            transition: "all 0.2s"
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = "var(--color-error)"; e.currentTarget.style.color = "#fff"; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"; e.currentTarget.style.color = "var(--color-error)"; }}
                          title="Sepetten Çıkar"
                        >
                          <Trash2 size={16} />
                          Kaldır
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.pricingDetail} style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px dashed var(--border-color)" }}>
                  <div className={styles.pricingRow}>
                    <span>Ara Toplam</span>
                    <span>
                      {getCartTotal().toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                    </span>
                  </div>
                  {getDiscountAmount() > 0 && (
                    <div className={styles.pricingRow} style={{ color: "var(--color-success)", marginTop: "8px" }}>
                      <span>Kupon İndirimi ({appliedCoupon?.code})</span>
                      <span>
                        -{" "}
                        {getDiscountAmount().toLocaleString("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        })}
                      </span>
                    </div>
                  )}
                  <div className={styles.totalRow} style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
                    <span style={{ fontSize: "18px", fontWeight: 700 }}>Genel Toplam</span>
                    <span style={{ fontSize: "24px", fontWeight: 800, color: "var(--color-primary)" }}>
                      {getFinalAmount().toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sağ Sütun: Kredi Kartı Ödemesi */}
              <div className={styles.card} style={{ display: "flex", flexDirection: "column", padding: "32px", boxShadow: "0 10px 40px rgba(0,0,0,0.06)", border: "1px solid rgba(184, 144, 71, 0.15)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>
                  <h2 className={styles.sectionTitle} style={{ margin: 0, fontSize: "18px" }}>
                    <CreditCard size={20} style={{ color: "var(--color-primary)" }} />
                    <span>Kart Bilgileri</span>
                  </h2>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <img src="/PayTR_Logo/visa.png" alt="Visa" style={{ height: "16px", objectFit: "contain" }} />
                    <img src="/PayTR_Logo/mastercard.png" alt="Mastercard" style={{ height: "20px", objectFit: "contain" }} />
                    <img src="/PayTR_Logo/troy.png" alt="Troy" style={{ height: "22px", objectFit: "contain" }} />
                  </div>
                </div>

                <form onSubmit={handlePayment} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* Kart Üzerindeki İsim */}
                  <div style={{ position: "relative" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Kart Üzerindeki İsim</label>
                    <input 
                      type="text" 
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      placeholder="AD SOYAD"
                      required
                      style={{ 
                        width: "100%", 
                        padding: "16px", 
                        backgroundColor: "#fff",
                        border: "1px solid #cbd5e1", 
                        borderRadius: "10px", 
                        outline: "none", 
                        fontSize: "15px", 
                        fontWeight: 500,
                        color: "#1e293b",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                        transition: "all 0.2s" 
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(184, 144, 71, 0.15)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "#cbd5e1"; e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.02)"; }}
                    />
                  </div>

                  {/* Kart Numarası */}
                  <div style={{ position: "relative" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Kart Numarası</label>
                    <div style={{ position: "relative" }}>
                      <input 
                        type="text" 
                        value={cardNumber}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, "");
                          val = val.substring(0, 16);
                          let formatted = val.match(/.{1,4}/g)?.join(" ") || "";
                          setCardNumber(formatted);
                        }}
                        placeholder="0000 0000 0000 0000"
                        required
                        maxLength={19}
                        style={{ 
                          width: "100%", 
                          padding: "16px 16px 16px 44px", 
                          backgroundColor: "#fff",
                          border: "1px solid #cbd5e1", 
                          borderRadius: "10px", 
                          outline: "none", 
                          fontSize: "16px", 
                          letterSpacing: "1px", 
                          fontWeight: 600,
                          color: "#1e293b",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                          transition: "all 0.2s" 
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(184, 144, 71, 0.15)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#cbd5e1"; e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.02)"; }}
                      />
                      <CreditCard size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    </div>
                    {binData && binData.status === "success" && (
                      <div style={{ fontSize: "12px", color: "var(--color-success)", fontWeight: 600, display: "flex", gap: "6px", alignItems: "center", marginTop: "8px" }}>
                        <div style={{ width: "8px", height: "8px", backgroundColor: "var(--color-success)", borderRadius: "50%" }} />
                        <span>{binData.bank} - {binData.cardType === "credit" ? "Kredi Kartı" : "Banka Kartı"} {binData.businessCard === "yes" && "(Ticari Kart)"}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "16px" }}>
                    {/* Son Kullanma Tarihi */}
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Son Kullanma</label>
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <input 
                          type="text" 
                          value={expMonth}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, "").substring(0, 2);
                            setExpMonth(val);
                          }}
                          placeholder="AY"
                          required
                          maxLength={2}
                          style={{ 
                            width: "100%", 
                            padding: "16px", 
                            backgroundColor: "#fff",
                            border: "1px solid #cbd5e1",
                            borderRadius: "10px",
                            outline: "none", 
                            fontSize: "15px", 
                            fontWeight: 600,
                            color: "#1e293b",
                            textAlign: "center",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                            transition: "all 0.2s" 
                          }}
                          onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(184, 144, 71, 0.15)"; }}
                          onBlur={(e) => { e.target.style.borderColor = "#cbd5e1"; e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.02)"; }}
                        />
                        <span style={{ color: "#94a3b8", fontSize: "18px", fontWeight: 300 }}>/</span>
                        <input 
                          type="text" 
                          value={expYear}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, "").substring(0, 2);
                            setExpYear(val);
                          }}
                          placeholder="YIL"
                          required
                          maxLength={2}
                          style={{ 
                            width: "100%", 
                            padding: "16px", 
                            backgroundColor: "#fff",
                            border: "1px solid #cbd5e1",
                            borderRadius: "10px",
                            outline: "none", 
                            fontSize: "15px", 
                            fontWeight: 600,
                            color: "#1e293b",
                            textAlign: "center",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                            transition: "all 0.2s"  
                          }}
                          onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(184, 144, 71, 0.15)"; }}
                          onBlur={(e) => { e.target.style.borderColor = "#cbd5e1"; e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.02)"; }}
                        />
                      </div>
                    </div>

                    {/* CVV */}
                    <div style={{ width: "100px" }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>CVV</label>
                      <input 
                        type="password" 
                        value={cvv}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, "").substring(0, 3);
                          setCvv(val);
                        }}
                        placeholder="***"
                        required
                        maxLength={3}
                        style={{ 
                          width: "100%", 
                          padding: "16px", 
                          backgroundColor: "#fff",
                          border: "1px solid #cbd5e1", 
                          borderRadius: "10px", 
                          outline: "none", 
                          fontSize: "15px", 
                          fontWeight: 600,
                          color: "#1e293b",
                          textAlign: "center", 
                          letterSpacing: "2px",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                          transition: "all 0.2s" 
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(184, 144, 71, 0.15)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#cbd5e1"; e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.02)"; }}
                      />
                    </div>
                  </div>

                  {/* Taksit Seçenekleri */}
                  {binData && binData.cardType === "credit" && (
                    <div style={{ marginTop: "4px" }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Taksit Seçenekleri</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {getAvailableInstallments().map(opt => {
                          const totalForInstallment = getCartSubtotal() * opt.rate;
                          const monthlyPayment = opt.count === "0" ? totalForInstallment : totalForInstallment / parseInt(opt.count);
                          
                          return (
                          <label 
                            key={opt.count}
                            style={{ 
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "space-between",
                              padding: "16px", 
                              border: installment === opt.count ? "2px solid var(--color-primary)" : "1px solid #cbd5e1",
                              borderRadius: "12px",
                              cursor: "pointer",
                              backgroundColor: installment === opt.count ? "rgba(184, 144, 71, 0.05)" : "#fff",
                              transition: "all 0.2s",
                              boxShadow: installment === opt.count ? "0 2px 12px rgba(184, 144, 71, 0.12)" : "0 1px 3px rgba(0,0,0,0.02)"
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                              <div style={{ 
                                width: "20px", height: "20px", borderRadius: "50%", 
                                border: installment === opt.count ? "6px solid var(--color-primary)" : "2px solid #cbd5e1",
                                backgroundColor: "#fff", transition: "all 0.2s",
                                flexShrink: 0
                              }} />
                              <input 
                                type="radio" 
                                name="installment" 
                                value={opt.count} 
                                checked={installment === opt.count}
                                onChange={(e) => setInstallment(e.target.value)}
                                style={{ display: "none" }}
                              />
                              <span style={{ fontSize: "14px", fontWeight: 700, color: installment === opt.count ? "var(--color-primary)" : "#1e293b" }}>
                                {opt.label}
                              </span>
                            </div>
                            
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                                <span style={{ fontSize: "14px", fontWeight: 700, color: installment === opt.count ? "var(--color-primary)" : "#1e293b" }}>
                                   {opt.count === "0" 
                                      ? totalForInstallment.toLocaleString("tr-TR", {style: "currency", currency: "TRY"}) 
                                      : `${monthlyPayment.toLocaleString("tr-TR", {style: "currency", currency: "TRY"})} x ${opt.count} Ay`}
                                </span>
                                {opt.count !== "0" && opt.rate > 1 && (
                                   <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 500 }}>
                                      Toplam: {totalForInstallment.toLocaleString("tr-TR", {style: "currency", currency: "TRY"})}
                                   </span>
                                )}
                            </div>
                          </label>
                        )})}
                      </div>
                    </div>
                  )}

                  <div style={{ 
                    marginTop: "8px", 
                    padding: "16px", 
                    backgroundColor: "#faf9f6", 
                    borderRadius: "12px", 
                    border: "1px solid rgba(184, 144, 71, 0.2)", 
                    display: "flex", 
                    gap: "16px", 
                    alignItems: "center" 
                  }}>
                    <img src="/PayTR_Logo/PayTR---2025-New-Logo-Color.png" alt="PayTR" style={{ height: "24px", objectFit: "contain", flexShrink: 0 }} />
                    <div style={{ borderLeft: "1px solid rgba(184, 144, 71, 0.2)", paddingLeft: "16px" }}>
                      <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                        Kart bilgileriniz <strong>256-bit SSL</strong> ile şifrelenir. <br/><strong>3D Secure</strong> ile %100 güvenli ödeme.
                      </p>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{ 
                      width: "100%", 
                      padding: "18px", 
                      backgroundColor: "var(--color-primary)", 
                      color: "#fff", 
                      border: "none", 
                      borderRadius: "12px", 
                      fontSize: "16px", 
                      fontWeight: 700, 
                      marginTop: "8px",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      opacity: isSubmitting ? 0.7 : 1,
                      transition: "all 0.3s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      boxShadow: "0 4px 15px rgba(184, 144, 71, 0.3)"
                    }}
                    onMouseOver={(e) => {
                      if(!isSubmitting) e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseOut={(e) => {
                      if(!isSubmitting) e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className={styles.spinner} style={{ width: "20px", height: "20px", borderTopColor: "#fff", borderRightColor: "rgba(255,255,255,0.3)", borderBottomColor: "rgba(255,255,255,0.3)", borderLeftColor: "rgba(255,255,255,0.3)" }} />
                        <span>Güvenli Bağlantı Kuruluyor...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        <span>{getFinalAmount().toLocaleString("tr-TR", { style: "currency", currency: "TRY" })} Güvenli Öde</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
