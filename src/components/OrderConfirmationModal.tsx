import React from 'react';
import { Order } from '../types';
import { CheckCircle2, Clock, MapPin, Store, ArrowRight, ShieldCheck } from 'lucide-react';

interface OrderConfirmationModalProps {
  order: Order;
  onClose: () => void;
  onGoToOrders: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onGoToOrders,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#EAE6DF] flex flex-col items-center text-center">
        {/* Success checkmark badge */}
        <div className="w-16 h-16 rounded-full bg-[#E8F5EC] text-[#1B7A43] flex items-center justify-center mb-4 ring-8 ring-[#F0FDF4]">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-[#1B7A43]">
          Reservation Confirmed
        </span>
        <h2 className="text-2xl font-black text-[#1E2320] mt-0.5 tracking-tight">
          Order #{order.order_number}
        </h2>
        <p className="text-xs text-[#64748B] mt-1">
          Your batch allotment has been secured. Pick up in person!
        </p>

        {/* 4-digit pickup PIN container */}
        <div className="w-full mt-4 bg-[#FAF8F5] border border-[#EAE6DF] rounded-2xl p-4 flex flex-col items-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            Pickup Counter PIN
          </span>
          <div className="text-3xl font-black tracking-widest text-[#1B7A43] mt-1 font-mono">
            {order.pickup_pin}
          </div>
          <span className="text-[10px] text-[#64748B] mt-1">
            Flash this 4-digit code to the bakery attendant
          </span>
        </div>

        {/* Order Details summary */}
        <div className="w-full mt-4 bg-white rounded-2xl border border-[#EAE6DF] p-4 text-left flex flex-col gap-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DF]">
            <div className="font-bold text-sm text-[#1E2320]">
              {order.quantity}x {order.listing_name}
            </div>
            <div className="font-black text-sm text-[#1B7A43]">₹{order.total_price}</div>
          </div>

          <div className="flex items-start gap-2.5 text-xs">
            <Store className="w-4 h-4 text-[#1B7A43] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#1E2320]">{order.business_name}</div>
              <div className="text-[#64748B] text-[11px]">{order.business_address}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <Clock className="w-4 h-4 text-[#EA580C] shrink-0" />
            <div>
              <span className="text-[#64748B]">Pickup Window: </span>
              <strong className="text-[#1E2320] font-bold">{order.pickup_window}</strong>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#EAE6DF] text-xs">
            <span className="text-[#64748B]">Status</span>
            <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-[#E8F5EC] text-[#1B7A43]">
              {order.status}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full mt-5 flex flex-col gap-2">
          <button
            onClick={onGoToOrders}
            className="w-full h-12 rounded-full bg-[#1B7A43] hover:bg-[#156336] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition"
          >
            <span>View in My Orders</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full h-11 rounded-full bg-[#F5F2EB] hover:bg-[#EAE6DF] text-[#1E2320] font-bold text-sm transition"
          >
            Browse More Deals
          </button>
        </div>
      </div>
    </div>
  );
};
