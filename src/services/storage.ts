import { Business, Listing, NotificationItem, Order, User, SupabaseJobLog } from '../types';
import { INITIAL_BUSINESSES, INITIAL_LISTINGS, INITIAL_NOTIFICATIONS } from '../data/initialData';

const LISTINGS_KEY = 'cravsave_listings';
const ORDERS_KEY = 'cravsave_orders';
const NOTIFICATIONS_KEY = 'cravsave_notifications';
const SUPABASE_LOGS_KEY = 'cravsave_supabase_job_logs';
const USER_KEY = 'cravsave_current_user';

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyChange() {
  listeners.forEach(cb => {
    try {
      cb();
    } catch (e) {
      console.error('Storage listener error:', e);
    }
  });
}

export function subscribeToStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Current User
export function getCurrentUser(): User {
  const saved = localStorage.getItem(USER_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  const defaultUser: User = {
    id: 'cust_1',
    name: 'Ansh V.',
    email: 'ansh@cravsave.com',
    role: 'customer',
    phone: '+91 98765 43210',
    savingsTotal: 420,
  };
  localStorage.setItem(USER_KEY, JSON.stringify(defaultUser));
  return defaultUser;
}

export function setCurrentUserRole(role: 'customer' | 'business') {
  const user = getCurrentUser();
  user.role = role;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyChange();
}

// Listings
export function getListings(): Listing[] {
  const saved = localStorage.getItem(LISTINGS_KEY);
  if (!saved) {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(INITIAL_LISTINGS));
    return INITIAL_LISTINGS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_LISTINGS;
  }
}

export function getListingById(id: string): Listing | undefined {
  return getListings().find(l => l.id === id);
}

export function saveListing(listing: Listing): void {
  const listings = getListings();
  const index = listings.findIndex(l => l.id === listing.id);
  if (index >= 0) {
    listings[index] = listing;
  } else {
    listings.unshift(listing);
  }
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
  notifyChange();
}

// ==================== AUTOMATION 1: NEW DEAL ====================
// Business publishes: Chocolate Croissant — ₹60
// Database insert -> immediately creates customer notification (no external automation needed!)
export function createListing(newListingData: Omit<Listing, 'id' | 'created_at' | 'status'>): Listing {
  const listings = getListings();
  const id = 'lst_' + Math.random().toString(36).substring(2, 9);
  const newListing: Listing = {
    ...newListingData,
    id,
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
  };
  listings.unshift(newListing);
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));

  // Immediate in-app notification for customers
  addNotification({
    user_id: 'cust_1',
    title: '🔥 New deal just dropped',
    message: `${newListing.name} — ₹${newListing.price} at ${newListing.business_name}. Open CravSave to reserve it.`,
    type: 'listing_created',
    listing_id: newListing.id,
  });

  logSupabaseJob('new_deal_notification', `Published deal: ${newListing.name} (₹${newListing.price}). Dispatched customer notification.`, 1);

  notifyChange();
  return newListing;
}

export function updateListingStatus(id: string, status: Listing['status']): void {
  const listings = getListings();
  const target = listings.find(l => l.id === id);
  if (target) {
    target.status = status;
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
    notifyChange();
  }
}

export function markListingSoldOut(id: string): void {
  const listings = getListings();
  const target = listings.find(l => l.id === id);
  if (target) {
    target.quantity = 0;
    target.status = 'SOLD_OUT';
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
    notifyChange();
  }
}

// Orders
export function getOrders(): Order[] {
  const saved = localStorage.getItem(ORDERS_KEY);
  if (!saved) {
    const initialOrder: Order = {
      id: 'ord_sample_1',
      order_number: 'CS1018',
      listing_id: 'lst_1',
      listing_name: 'Chocolate Croissant',
      listing_image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80',
      business_name: 'ABC Bakery',
      business_address: '104, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru',
      customer_id: 'cust_1',
      customer_name: 'Ansh V.',
      quantity: 1,
      unit_price: 60,
      total_price: 60,
      pickup_window: 'Today, 6:00 PM – 7:30 PM',
      pickup_pin: '4921',
      status: 'RESERVED',
      created_at: new Date(Date.now() - 7200000).toISOString(),
    };
    localStorage.setItem(ORDERS_KEY, JSON.stringify([initialOrder]));
    return [initialOrder];
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
}

export function createReservation(
  listingId: string,
  quantityToReserve: number,
  customerName: string = 'Ansh V.'
): { success: boolean; order?: Order; error?: string } {
  const listings = getListings();
  const listingIndex = listings.findIndex(l => l.id === listingId);

  if (listingIndex < 0 || !listings[listingIndex]) {
    return { success: false, error: 'Listing not found' };
  }
  const listing = listings[listingIndex];

  if (listing.status !== 'ACTIVE') {
    return { success: false, error: 'This deal is no longer active.' };
  }

  if (listing.quantity < quantityToReserve) {
    return {
      success: false,
      error: `Only ${listing.quantity} remaining. Cannot reserve ${quantityToReserve}.`,
    };
  }

  // Decrease quantity
  listing.quantity -= quantityToReserve;
  if (listing.quantity <= 0) {
    listing.status = 'SOLD_OUT';
  }
  listings[listingIndex] = listing;
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));

  // Generate order
  const orderNumSuffix = Math.floor(1000 + Math.random() * 9000);
  const pin = Math.floor(1000 + Math.random() * 9000).toString();
  const newOrder: Order = {
    id: 'ord_' + Math.random().toString(36).substring(2, 9),
    order_number: `CS${orderNumSuffix}`,
    listing_id: listing.id,
    listing_name: listing.name,
    listing_image: listing.image_url,
    business_name: listing.business_name,
    business_address: listing.business_address,
    customer_id: 'cust_1',
    customer_name: customerName,
    quantity: quantityToReserve,
    unit_price: listing.price,
    total_price: listing.price * quantityToReserve,
    pickup_window: `Today, ${listing.pickup_start} – ${listing.pickup_end}`,
    pickup_pin: pin,
    status: 'RESERVED',
    created_at: new Date().toISOString(),
  };

  const orders = getOrders();
  orders.unshift(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

  // Add reservation confirmation notification
  addNotification({
    user_id: 'cust_1',
    title: `✅ Reservation Confirmed #${newOrder.order_number}`,
    message: `${quantityToReserve}x ${listing.name} reserved at ${listing.business_name}. Pickup PIN: ${pin}`,
    type: 'order_reserved',
    listing_id: listing.id,
  });

  notifyChange();
  return { success: true, order: newOrder };
}

// Notifications
export function getNotifications(): NotificationItem[] {
  const saved = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!saved) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_NOTIFICATIONS;
  }
}

export function addNotification(
  notif: Omit<NotificationItem, 'id' | 'read' | 'created_at'>
): NotificationItem {
  const notifs = getNotifications();
  const newItem: NotificationItem = {
    ...notif,
    id: 'notif_' + Math.random().toString(36).substring(2, 9),
    read: false,
    created_at: new Date().toISOString(),
  };
  notifs.unshift(newItem);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
  notifyChange();
  return newItem;
}

export function markNotificationRead(id: string) {
  const notifs = getNotifications();
  const target = notifs.find(n => n.id === id);
  if (target) {
    target.read = true;
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
    notifyChange();
  }
}

export function markAllNotificationsRead() {
  const notifs = getNotifications();
  notifs.forEach(n => (n.read = true));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
  notifyChange();
}

// Businesses
export function getBusinesses(): Business[] {
  return INITIAL_BUSINESSES;
}

// ==================== SUPABASE SCHEDULED JOBS (EDGE FUNCTIONS) ====================

export function getSupabaseLogs(): SupabaseJobLog[] {
  const saved = localStorage.getItem(SUPABASE_LOGS_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
}

export function clearSupabaseLogs() {
  localStorage.setItem(SUPABASE_LOGS_KEY, JSON.stringify([]));
  notifyChange();
}

function logSupabaseJob(
  job_name: SupabaseJobLog['job_name'],
  details: string,
  affected_items_count: number
) {
  const logs = getSupabaseLogs();
  const entry: SupabaseJobLog = {
    id: 'job_' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    job_name,
    details,
    affected_items_count,
  };
  logs.unshift(entry);
  if (logs.length > 30) logs.pop();
  localStorage.setItem(SUPABASE_LOGS_KEY, JSON.stringify(logs));
}

// Helper to check if a "7:30 PM" time string has passed
function isTimePassed(timeStr: string): boolean {
  if (!timeStr) return false;
  try {
    const parts = timeStr.trim().split(' ');
    if (parts.length < 2) return false;
    const [time, modifier] = parts;
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr || '0', 10);

    if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;

    const now = new Date();
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);

    return now >= target;
  } catch (e) {
    return false;
  }
}

// AUTOMATION 2: SCHEDULED PRICE DROP
// Supabase scheduled function checks due price changes:
// Every minute -> Check scheduled price changes -> ₹60 -> ₹50 -> Create notification
export function runScheduledPriceDropJob(forceListingId?: string): { updatedCount: number } {
  const listings = getListings();
  let updatedCount = 0;

  listings.forEach(listing => {
    // Only check active listings that have a scheduled price and haven't applied yet
    if (listing.status === 'ACTIVE' && listing.scheduled_price && !listing.scheduled_applied) {
      const isDue = forceListingId === listing.id || (listing.scheduled_time && isTimePassed(listing.scheduled_time));

      if (isDue) {
        const oldPrice = listing.price;
        const newPrice = listing.scheduled_price;
        listing.price = newPrice;
        listing.scheduled_applied = true;
        updatedCount++;

        // Create customer notification
        addNotification({
          user_id: 'cust_1',
          title: '🔥 Price dropped',
          message: `${listing.name} ~~₹${oldPrice}~~ ₹${newPrice} at ${listing.business_name}. Hurry before it sells out!`,
          type: 'price_drop',
          listing_id: listing.id,
        });

        // Create business notification
        addNotification({
          user_id: 'biz_1',
          title: '✅ Scheduled price drop applied',
          message: `Your scheduled price drop for ${listing.name} (₹${newPrice}) is now live.`,
          type: 'info',
          listing_id: listing.id,
        });
      }
    }
  });

  if (updatedCount > 0) {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
    logSupabaseJob('scheduled_price_drop', `Applied scheduled price changes to ${updatedCount} listing(s).`, updatedCount);
    notifyChange();
  }

  return { updatedCount };
}

// AUTOMATION 3: EXPIRY
// Every minute -> Find listings where sell_until < now -> ACTIVE -> EXPIRED
export function runListingExpiryJob(forceListingId?: string): { expiredCount: number } {
  const listings = getListings();
  let expiredCount = 0;

  listings.forEach(listing => {
    if (listing.status === 'ACTIVE') {
      const isExpired = forceListingId === listing.id || isTimePassed(listing.sell_until);

      if (isExpired) {
        listing.status = 'EXPIRED';
        expiredCount++;

        addNotification({
          user_id: 'biz_1',
          title: '⏳ Deal window closed',
          message: `${listing.name} sell-until window (${listing.sell_until}) has passed. Marked as expired.`,
          type: 'deal_expired',
          listing_id: listing.id,
        });
      }
    }
  });

  if (expiredCount > 0) {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
    logSupabaseJob('listing_expiry_check', `Closed and marked ${expiredCount} listing(s) as EXPIRED.`, expiredCount);
    notifyChange();
  }

  return { expiredCount };
}

// Combined cron worker running every minute
export function executeScheduledJobs() {
  const priceResult = runScheduledPriceDropJob();
  const expiryResult = runListingExpiryJob();
  return { priceUpdated: priceResult.updatedCount, expired: expiryResult.expiredCount };
}

// Background scheduler initialization (ticks every 30 seconds for responsive prototype)
let cronIntervalId: any = null;
export function startSupabaseCronWorker() {
  if (cronIntervalId) return;
  // Initial check
  executeScheduledJobs();
  // Scheduled every 30 seconds
  cronIntervalId = setInterval(() => {
    executeScheduledJobs();
  }, 30000);
}

// Manual immediate triggers for demo/testing
export function triggerManualPriceDrop(listingId: string, newPrice?: number) {
  const listings = getListings();
  const target = listings.find(l => l.id === listingId);
  if (!target) return { success: false, error: 'Listing not found' };

  if (newPrice) {
    target.scheduled_price = newPrice;
    target.scheduled_applied = false;
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
  }
  runScheduledPriceDropJob(listingId);
  return { success: true };
}

export function triggerManualExpiry(listingId: string) {
  runListingExpiryJob(listingId);
  return { success: true };
}

// Reset data to initial demo state
export function resetDemoData() {
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(INITIAL_LISTINGS));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
  localStorage.removeItem(ORDERS_KEY);
  localStorage.removeItem(SUPABASE_LOGS_KEY);
  notifyChange();
}

// Start worker immediately on module load
if (typeof window !== 'undefined') {
  startSupabaseCronWorker();
}
