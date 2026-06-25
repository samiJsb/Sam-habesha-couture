export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF' | 'CUSTOMER';
  phoneNumber?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in Ethiopian Birr (ETB)
  category: string; // e.g., 'traditional', 'drinks', 'coffee', 'breakfast'
  image: string;
  rating: number;
  preparationTime: number; // in minutes
  spicyLevel?: 0 | 1 | 2 | 3; // specially for Ethiopian traditional food (Injera, Wot)
  isAvailable: boolean;
  isPopular: boolean;
  isChefRecommendation: boolean;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY_FOR_PICKUP' | 'OUT_FOR_DELIVERY' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: {
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'TELEBIRR' | 'CBE_BIRR' | 'CHAPA' | 'CASH_ON_DELIVERY';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  deliveryType: 'DELIVERY' | 'PICKUP';
  deliveryAddress?: string;
  couponCode?: string;
  createdAt: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guestsCount: number;
  occasion?: string;
  specialRequests?: string;
  status: 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'COMPLETED';
  tableNumber?: number;
  createdAt: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface Coupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrderValue?: number;
  isActive: boolean;
  expiresAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string; // e.g., 'kg', 'liters', 'units'
  threshold: number; // alert below this level
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface PaymentReceipt {
  paymentId: string;
  orderId: string;
  transactionReference: string;
  amount: number;
  currency: 'ETB';
  provider: 'TELEBIRR' | 'CBE_BIRR' | 'CHAPA' | 'COD';
  payerName: string;
  payerPhoneOrWallet: string;
  timestamp: string;
  qrCodeMock?: string;
}
