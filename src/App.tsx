import React, { useState, useEffect } from 'react';
import { Listing, Order, User, NotificationItem } from './types';
import {
  getListings,
  getOrders,
  getNotifications,
  getCurrentUser,
  setCurrentUserRole,
  subscribeToStore,
  getBusinesses,
} from './services/storage';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { DealsHome } from './components/DealsHome';
import { ProductDetailView } from './components/ProductDetailView';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrdersView } from './components/OrdersView';
import { AlertsView } from './components/AlertsView';
import { ProfileView } from './components/ProfileView';
import { BusinessDashboard } from './components/BusinessDashboard';

type CustomerScreen = 'tabs' | 'item-details' | 'checkout';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(getCurrentUser());
  const [listings, setListings] = useState<Listing[]>(getListings());
  const [orders, setOrders] = useState<Order[]>(getOrders());
  const [notifications, setNotifications] = useState<NotificationItem[]>(getNotifications());

  // Customer Navigation State
  const [customerScreen, setCustomerScreen] = useState<CustomerScreen>('tabs');
  const [activeTab, setActiveTab] = useState<TabType>('deals');
  const [activeListing, setActiveListing] = useState<Listing | null>(null);
  const [checkoutQuantity, setCheckoutQuantity] = useState<number>(1);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Sync with storage on changes
  useEffect(() => {
    const unsubscribe = subscribeToStore(() => {
      setListings(getListings());
      setOrders(getOrders());
      setNotifications(getNotifications());
      setCurrentUser(getCurrentUser());
    });
    return () => unsubscribe();
  }, []);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const currentBusiness = getBusinesses()[0]; // ABC Bakery default

  const handleToggleRole = () => {
    const nextRole = currentUser.role === 'customer' ? 'business' : 'customer';
    setCurrentUserRole(nextRole);
    if (nextRole === 'customer') {
      setCustomerScreen('tabs');
      setActiveTab('deals');
    }
  };

  // Open item details as clean full screen
  const handleSelectListing = (listing: Listing) => {
    setActiveListing(listing);
    setCustomerScreen('item-details');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Proceed to checkout as clean full screen
  const handleProceedToCheckout = (listing: Listing, quantity: number) => {
    setActiveListing(listing);
    setCheckoutQuantity(quantity);
    setCustomerScreen('checkout');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Back from item details to deals tab
  const handleBackFromDetails = () => {
    setCustomerScreen('tabs');
    setActiveListing(null);
  };

  // Back from checkout to item details
  const handleBackFromCheckout = () => {
    setCustomerScreen('item-details');
  };

  // Reservation confirmed
  const handleOrderSuccess = (order: Order) => {
    setConfirmedOrder(order);
    setCustomerScreen('tabs');
    setActiveListing(null);
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] text-[#1E2320] flex flex-col font-sans overflow-x-hidden selection:bg-[#E8F5EC] selection:text-[#1B7A43]">
      {/* Top Header (only show when on main tabs or business mode) */}
      {(currentUser.role === 'business' || customerScreen === 'tabs') && (
        <Header
          currentUser={currentUser}
          onToggleRole={handleToggleRole}
          onOpenAlerts={() => {
            setCustomerScreen('tabs');
            setActiveTab('alerts');
          }}
          unreadCount={unreadNotificationsCount}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1 w-full overflow-x-hidden">
        {currentUser.role === 'business' ? (
          /* Business Dashboard */
          <BusinessDashboard
            listings={listings}
            orders={orders}
            currentBusiness={currentBusiness}
            onViewAsCustomer={() => setCurrentUserRole('customer')}
          />
        ) : (
          /* Customer Mode */
          <>
            {/* Screen 1: Item Details */}
            {customerScreen === 'item-details' && activeListing && (
              <ProductDetailView
                listing={activeListing}
                onBack={handleBackFromDetails}
                onProceedToCheckout={handleProceedToCheckout}
              />
            )}

            {/* Screen 2: Checkout / Reserve & Pay */}
            {customerScreen === 'checkout' && activeListing && (
              <CheckoutView
                listing={activeListing}
                quantity={checkoutQuantity}
                onBack={handleBackFromCheckout}
                onOrderSuccess={handleOrderSuccess}
              />
            )}

            {/* Screen 3: Primary Tab Views */}
            {customerScreen === 'tabs' && (
              <>
                {activeTab === 'deals' && (
                  <DealsHome
                    listings={listings}
                    onSelectListing={handleSelectListing}
                  />
                )}

                {activeTab === 'orders' && (
                  <OrdersView
                    orders={orders}
                    onBrowseDeals={() => setActiveTab('deals')}
                  />
                )}

                {activeTab === 'alerts' && (
                  <AlertsView
                    notifications={notifications}
                    onSelectListing={listingId => {
                      const found = listings.find(l => l.id === listingId);
                      if (found) handleSelectListing(found);
                    }}
                  />
                )}

                {activeTab === 'account' && (
                  <ProfileView
                    currentUser={currentUser}
                    onGoToOrders={() => setActiveTab('orders')}
                    onGoToAlerts={() => setActiveTab('alerts')}
                    onSwitchToBusiness={() => setCurrentUserRole('business')}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Order Confirmation Modal */}
      {confirmedOrder && (
        <OrderConfirmationModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
          onGoToOrders={() => {
            setConfirmedOrder(null);
            setCustomerScreen('tabs');
            setActiveTab('orders');
          }}
        />
      )}

      {/* Customer Bottom Navigation Bar (only show on primary tabs) */}
      {currentUser.role === 'customer' && customerScreen === 'tabs' && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={tab => {
            setActiveTab(tab);
          }}
          unreadCount={unreadNotificationsCount}
        />
      )}
    </div>
  );
}
