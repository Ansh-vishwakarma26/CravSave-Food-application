export type ReasonType = 'USE BY TODAY' | 'SELLING SLOWLY' | 'LOOKS DIFFERENT';

export type ListingStatus = 'ACTIVE' | 'PAUSED' | 'SOLD_OUT' | 'EXPIRED';

export type OrderStatus = 'RESERVED' | 'PICKED_UP' | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'business';
  phone?: string;
  savingsTotal?: number;
}

export interface Business {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  distance: string;
  rating?: number;
  phone?: string;
  isVerified?: boolean;
}

export interface Listing {
  id: string;
  business_id: string;
  business_name: string;
  business_address: string;
  distance: string;
  name: string;
  description: string;
  image_url: string;
  original_price: number;
  price: number;
  reason: ReasonType;
  reason_badge_label?: string; // e.g. "PEAK TASTE TODAY", "OVERBAKED BATCH", "UNIQUE SHAPE"
  explanation: string; // e.g. "Made fresh today. It hasn't sold as quickly as expected."
  pro_tip?: string; // e.g. "Pop in a toaster oven for 2-3 mins..."
  freshness_notes?: string; // e.g. "Best till today • Peak fresh window • Freshly ganached"
  quantity: number;
  initial_quantity: number;
  sell_until: string; // e.g. "7:30 PM"
  pickup_start: string; // e.g. "6:00 PM"
  pickup_end: string; // e.g. "7:30 PM"
  status: ListingStatus;
  scheduled_price?: number; // Automation 2: Scheduled price drop
  scheduled_time?: string;  // e.g. "6:00 PM"
  scheduled_applied?: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string; // e.g. "CS1024"
  listing_id: string;
  listing_name: string;
  listing_image: string;
  business_name: string;
  business_address: string;
  customer_id: string;
  customer_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  pickup_window: string;
  pickup_pin: string; // 4-digit pin e.g. "8492"
  status: OrderStatus;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'listing_created' | 'price_drop' | 'deal_expired' | 'order_reserved' | 'info';
  listing_id?: string;
  read: boolean;
  created_at: string;
}

export interface SupabaseJobLog {
  id: string;
  timestamp: string;
  job_name: 'scheduled_price_drop' | 'listing_expiry_check' | 'new_deal_notification';
  details: string;
  affected_items_count: number;
}

