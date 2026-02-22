export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock_count: number;
  image_url: string;
  is_active: boolean;
}

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'DISPATCHED' | 'DELIVERED' | 'FAILED';

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price_at_purchase: number;
}

export interface Order {
  id: string;
  user_id: string;
  user_phone: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  items: OrderItem[];
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
}
