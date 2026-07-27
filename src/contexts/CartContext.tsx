"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/contexts/ToastContext";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string | null;
  isCouponEligible: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "AMOUNT";
  discountValue: number;
  courseId: string | null;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  getCartTotal: () => number;
  getDiscountAmount: () => number;
  getCartSubtotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("turkceoabtdeyiz_cart");
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch (error) {
          console.error("Failed to parse cart items:", error);
        }
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const toast = useToast();
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("turkceoabtdeyiz_cart", JSON.stringify(items));
  };

  const addToCart = (item: CartItem) => {
    // Sepette zaten var mı kontrolü (Aynı ders paketinden 2 adet olamaz)
    const exists = cartItems.find((cartItem) => cartItem.id === item.id);
    if (exists) {
      toast.warning("Bu eğitim paketi zaten sepetinizde bulunuyor.");
      setIsCartOpen(true);
      return;
    }

    const newCart = [...cartItems, item];
    saveCart(newCart);
    toast.success(`"${item.title}" sepete eklendi.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    const item = cartItems.find((cartItem) => cartItem.id === itemId);
    const newCart = cartItems.filter((cartItem) => cartItem.id !== itemId);
    saveCart(newCart);
    
    if (item) {
      toast.info(`"${item.title}" sepetten çıkarıldı.`);
    }

    // Sepet boşaldıysa kuponu kaldır
    if (newCart.length === 0) {
      setAppliedCoupon(null);
    }
  };

  const clearCart = () => {
    saveCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    if (cartItems.length === 0) {
      toast.error("Kupon uygulamak için sepetinizde ürün bulunmalıdır.");
      return false;
    }

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, cartItems: cartItems.map(item => item.id) }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Kupon uygulanamadı.");
        return false;
      }

      setAppliedCoupon(data.coupon);
      toast.success(`"${code}" kuponu başarıyla uygulandı.`);
      return true;
    } catch (error) {
      toast.error("Kupon doğrulama sırasında bir hata oluştu.");
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info("İndirim kuponu kaldırıldı.");
  };

  // Sepetteki tüm ürünlerin düz toplam fiyatı
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  // İndirim tutarı hesaplama
  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;

    let discountableAmount = 0;

    if (appliedCoupon.courseId) {
      // Ürüne özel kupon: Sadece ilgili ürün sepette varsa ve kupon kullanımına açıksa indirim uygula
      const targetItem = cartItems.find(
        (item) => item.id === appliedCoupon.courseId && item.isCouponEligible
      );
      if (targetItem) {
        discountableAmount = targetItem.price;
      } else {
        return 0; // İlgili ürün sepette yok veya kupona kapalı
      }
    } else {
      // Genel sepet kuponu: Sadece kupon kullanımına açık ürünlerin toplamına indirim uygula
      discountableAmount = cartItems
        .filter((item) => item.isCouponEligible)
        .reduce((sum, item) => sum + item.price, 0);
    }

    if (appliedCoupon.discountType === "PERCENTAGE") {
      return (discountableAmount * appliedCoupon.discountValue) / 100;
    } else {
      // Sabit tutar indirimi, toplam tutarı aşamaz
      return Math.min(appliedCoupon.discountValue, discountableAmount);
    }
  };

  // İndirim düşülmüş son ödenecek tutar
  const getCartSubtotal = () => {
    const total = getCartTotal();
    const discount = getDiscountAmount();
    return Math.max(0, total - discount);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        getCartTotal,
        getDiscountAmount,
        getCartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
