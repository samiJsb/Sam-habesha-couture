import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem, Order, Reservation, InventoryItem, Coupon } from '../types/restaurant';

interface RestaurantContextType {
  menu: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  reservations: Reservation[];
  inventory: InventoryItem[];
  loading: boolean;
  coupon: Coupon | null;
  activeNotification: string | null;
  
  // Cart Actions
  addToCart: (item: MenuItem, qty?: number, note?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQty: (itemId: string, qty: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  
  // API Core requests
  fetchMenu: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchReservations: () => Promise<void>;
  fetchInventory: () => Promise<void>;
  submitOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    deliveryType: 'DELIVERY' | 'PICKUP';
    deliveryAddress?: string;
    paymentMethod: 'TELEBIRR' | 'CBE_BIRR' | 'CHAPA' | 'CASH_ON_DELIVERY';
  }) => Promise<{ success: boolean; redirectUrl?: string; order?: Order }>;
  submitReservation: (resvData: {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guestsCount: number;
    occasion?: string;
    specialRequests?: string;
  }) => Promise<boolean>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  updateReservationStatus: (id: string, status: string, tableNumber?: number) => Promise<void>;
  addMenuItem: (itemData: Omit<MenuItem, 'id' | 'rating' | 'isAvailable'>) => Promise<boolean>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  useEffect(() => {
    const initData = async () => {
      try {
        await Promise.all([
          fetchMenu(),
          fetchOrders(),
          fetchReservations(),
          fetchInventory()
        ]);
      } catch (e) {
        console.error("Initialization Failed:", e);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setMenu(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/reservations');
      const data = await res.json();
      setReservations(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      setInventory(data);
    } catch (e) {
      console.error(e);
    }
  };

  // Cart logic
  const addToCart = (item: MenuItem, qty = 1, note = "") => {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === item.id);
      if (exists) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + qty } : c
        );
      }
      return [...prev, { id: item.id, menuItem: item, quantity: qty, specialInstructions: note }];
    });
    triggerNotification(`Added ${item.name} to order queue.`);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.id !== itemId));
  };

  const updateCartQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.id === itemId ? { ...c, quantity: qty } : c))
    );
  };

  const clearCart = () => setCart([]);

  const applyCoupon = (code: string): boolean => {
    const formattedCode = code.trim().toUpperCase();
    if (formattedCode === 'GURSHA15' || formattedCode === 'CHAPA20' || formattedCode === 'BOONA') {
      const val = formattedCode === 'CHAPA20' ? 20 : 15;
      setCoupon({
        code: formattedCode,
        discountType: 'PERCENTAGE',
        value: val,
        isActive: true,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
      });
      triggerNotification(`Coupon ${formattedCode} applied successfully!`);
      return true;
    }
    return false;
  };

  const submitOrder = async (orderData: {
    customerName: string;
    customerPhone: string;
    deliveryType: 'DELIVERY' | 'PICKUP';
    deliveryAddress?: string;
    paymentMethod: 'TELEBIRR' | 'CBE_BIRR' | 'CHAPA' | 'CASH_ON_DELIVERY';
  }) => {
    try {
      const mappedItems = cart.map((c) => ({
        menuItemId: c.id,
        name: c.menuItem.name,
        quantity: c.quantity
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderData,
          items: mappedItems,
          couponCode: coupon?.code
        })
      });

      const data = await res.json();
      if (data.success) {
        setCart([]);
        setCoupon(null);
        await fetchOrders();
        triggerNotification(`Order created successfully with ID: ${data.order.id}`);
        return { success: true, redirectUrl: data.redirectUrl, order: data.order };
      }
      return { success: false };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  };

  const submitReservation = async (resvData: {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guestsCount: number;
    occasion?: string;
    specialRequests?: string;
  }) => {
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resvData)
      });
      const data = await res.json();
      if (data.success) {
        await fetchReservations();
        triggerNotification(`Reservation request submitted. Awaiting staff approval!`);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      await fetchOrders();
      triggerNotification(`Order ${id} is now ${status.replace(/_/g, " ")}`);
    } catch (e) {
      console.error(e);
    }
  };

  const updateReservationStatus = async (id: string, status: string, tableNumber?: number) => {
    try {
      await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, tableNumber })
      });
      await fetchReservations();
      triggerNotification(`Reservation status modified.`);
    } catch (e) {
      console.error(e);
    }
  };

  const addMenuItem = async (itemData: Omit<MenuItem, 'id' | 'rating' | 'isAvailable'>) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      const data = await res.json();
      if (data.success) {
        await fetchMenu();
        triggerNotification(`New menu dish ${itemData.name} registered!`);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const triggerNotification = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => {
      setActiveNotification(null);
    }, 4500);
  };

  return (
    <RestaurantContext.Provider
      value={{
        menu,
        cart,
        orders,
        reservations,
        inventory,
        loading,
        coupon,
        activeNotification,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        applyCoupon,
        fetchMenu,
        fetchOrders,
        fetchReservations,
        fetchInventory,
        submitOrder,
        submitReservation,
        updateOrderStatus,
        updateReservationStatus,
        addMenuItem
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}
