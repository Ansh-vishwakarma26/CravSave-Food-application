import React from 'react';
import { Order } from '../types';
import { Clock, MapPin, Store, Receipt, ArrowRight, CheckCircle2 } from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  onBrowseDeals: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, onBrowseDeals }) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 flex flex-col gap-4 pb-32 overflow-x-hidden">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-[#1E2320] tracking-tight">My Reservations</h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Show your 4-digit pickup PIN at the bakery counter to collect.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-[#EAE6DF] text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#64748B] mb-3">
            <Receipt className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-[#1E2320]">No reservations yet</h2>
          <p className="text-xs text-[#64748B] mt-1 max-w-xs">
            Reserve delicious surplus food from your neighborhood bakeries at up to 50% off!
          </p>
          <button
            onClick={onBrowseDeals}
            className="mt-4 px-5 py-2.5 rounded-full bg-[#1B7A43] text-white font-bold text-xs flex items-center gap-1.5 hover:bg-[#156336] transition shadow-xs"
          >
            <span>Explore Deals Near You</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-[#EAE6DF] p-4 shadow-xs flex flex-col gap-3 hover:border-[#1B7A43]/40 transition"
            >
              {/* Header row: Order # & Status */}
              <div className="flex items-center justify-between pb-2.5 border-b border-[#EAE6DF]">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#1E2320]">
                    Order #{order.order_number}
                  </span>
                  <span className="text-[10px] text-[#64748B]">
                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    order.status === 'RESERVED'
                      ? 'bg-[#E8F5EC] text-[#1B7A43]'
                      : order.status === 'PICKED_UP'
                      ? 'bg-[#F0FDF4] text-[#15803D]'
                      : 'bg-[#FEE2E2] text-[#991B1B]'
                  }`}
                >
                  {order.status === 'RESERVED' ? '● Reserved' : order.status}
                </span>
              </div>

              {/* Product and PIN row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F5F2EB] shrink-0">
                    <img
                      src={order.listing_image}
                      alt={order.listing_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-[#1E2320] leading-snug">
                      {order.quantity}x {order.listing_name}
                    </h2>
                    <div className="text-xs font-black text-[#1B7A43] mt-0.5">
                      ₹{order.total_price}
                    </div>
                  </div>
                </div>

                {/* PIN chip */}
                <div className="bg-[#FAF8F5] border border-[#EAE6DF] rounded-xl px-3 py-1.5 text-center shrink-0">
                  <div className="text-[9px] uppercase font-bold text-[#64748B]">Pickup PIN</div>
                  <div className="text-base font-black text-[#1B7A43] font-mono tracking-wider">
                    {order.pickup_pin}
                  </div>
                </div>
              </div>

              {/* Business & Pickup Window */}
              <div className="bg-[#F5F2EB] rounded-xl p-3 flex flex-col gap-1.5 text-xs">
                <div className="flex items-center gap-2 text-[#1E2320] font-semibold">
                  <Store className="w-3.5 h-3.5 text-[#1B7A43]" />
                  <span>{order.business_name}</span>
                </div>
                <div className="flex items-center gap-2 text-[#64748B] text-[11px]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{order.business_address}</span>
                </div>
                <div className="flex items-center gap-2 text-[#C2410C] font-medium text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>Pickup: {order.pickup_window}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
