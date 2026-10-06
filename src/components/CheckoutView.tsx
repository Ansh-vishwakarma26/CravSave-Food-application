import React, { useState, useEffect } from 'react';
import { Listing, Order } from '../types';
import { createReservation } from '../services/storage';
import {
  ArrowLeft,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Store,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface CheckoutViewProps {
  listing: Listing;
  quantity: number;
  onBack: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  listing,
  quantity,
  onBack,
  onOrderSuccess,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 minutes hold
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const unitPrice = listing.price;
  const subtotal = unitPrice * quantity;
  const platformFee = 0;
  const total = subtotal + platformFee;
  const discountPercent = Math.round(
    ((listing.original_price - listing.price) / listing.original_price) * 100
  );

  const handleConfirmReservation = () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    // Call storage reservation creator
    const res = createReservation(listing.id, quantity, 'Ansh V.');
    if (res.success && res.order) {
      setTimeout(() => {
        setIsSubmitting(false);
        onOrderSuccess(res.order!);
      }, 400);
    } else {
      setIsSubmitting(false);
      setErrorMsg(res.error || 'Failed to complete reservation. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto min-h-screen bg-[#FAF8F5] pb-32 overflow-x-hidden">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE6DF] px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1 rounded-full text-[#1E2320] hover:bg-[#F5F2EB] transition"
          aria-label="Back"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-[#1B7A43] flex items-center justify-center text-white">
            <span className="font-black text-xs">C</span>
          </div>
          <span className="font-extrabold text-sm text-[#1E2320]">
            Crav<span className="text-[#1B7A43]">Sav</span> Pickup Reservation
          </span>
        </div>

        <div className="w-8 h-8 rounded-full bg-[#006030] text-white flex items-center justify-center font-bold text-xs ring-2 ring-white">
          U
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-4 flex flex-col gap-4">
        {/* Express Hold Banner */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#EA580C] uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5 animate-pulse" />
          <span>Express Hold • {formatTimer(secondsLeft)} Left</span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-black text-[#1E2320] tracking-tight">
            Pickup Reservation Checkout
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Review surplus item specifics & secure your batch allotment.
          </p>
        </div>

        {/* Error message if any */}
        {errorMsg && (
          <div className="p-3 bg-[#FEE2E2] border border-[#F87171] text-[#991B1B] rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Honest Surplus Guarantee Banner */}
        <div className="bg-gradient-to-r from-[#E8F5EC] to-[#F0FDF4] rounded-2xl p-3.5 border border-[#1B7A43]/20 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white shadow-xs text-[#1B7A43] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#1B7A43]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1B7A43]">Honest Surplus Guarantee</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#1B7A43]/15 text-[#1B7A43]">
                100%
              </span>
            </div>
            <p className="text-xs text-[#3F4940] mt-0.5 leading-relaxed">
              Zero markups or clearance bins. Fresh batch overflow at fair neighborhood prices 🌱
            </p>
          </div>
        </div>

        {/* Selected Product Card */}
        <div className="bg-white rounded-2xl p-4 border border-[#EAE6DF] shadow-xs flex items-start gap-3.5">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F5F2EB] shrink-0">
            <img
              src={listing.image_url}
              alt={listing.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-xs text-[#64748B]">
              <span className="font-semibold text-[#1E2320]">{listing.business_name}</span>
              <span className="text-[11px]">↗ {listing.distance}</span>
            </div>

            <h3 className="text-base font-bold text-[#1E2320] mt-0.5 truncate">
              {listing.name}
            </h3>

            <div className="mt-1">
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-[#047857] bg-[#ECFDF5] border border-[#A7F3D0] rounded-md uppercase">
                {listing.reason_badge_label || listing.reason}
              </span>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-black text-[#1B7A43]">₹{listing.price}</span>
              <span className="text-xs text-[#64748B] line-through">₹{listing.original_price}</span>
              <span className="px-1.5 py-0.2 text-[10px] font-bold text-[#047857] bg-[#E8F5EC] rounded">
                {discountPercent}% OFF
              </span>
              <span className="ml-auto text-xs font-bold text-[#64748B]">
                Qty: {quantity}
              </span>
            </div>
          </div>
        </div>

        {/* Pickup Spot Details */}
        <div className="bg-white rounded-2xl p-4 border border-[#EAE6DF] shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-[#1E2320]">
              <Store className="w-4 h-4 text-[#1B7A43]" />
              <span>Pickup Spot</span>
            </div>
            <span className="px-2.5 py-0.5 text-[10px] font-bold text-[#C2410C] bg-[#FFF7ED] border border-[#FED7AA] rounded-full uppercase">
              Store Pickup Only
            </span>
          </div>

          <div className="flex items-start gap-2.5 text-xs">
            <MapPin className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#1E2320]">{listing.business_name}, {listing.distance}</div>
              <div className="text-[#64748B] text-[11px] mt-0.5 leading-snug">
                {listing.business_address}
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-[#FFFBEB] rounded-xl border border-[#FDE68A] flex items-start gap-2 text-xs">
            <Clock className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#92400E]">
                Today • {listing.pickup_start} – {listing.pickup_end}
              </span>
              <div className="text-[11px] text-[#B45309]">Doors close strictly at {listing.pickup_end}</div>
            </div>
          </div>

          <div className="p-2.5 bg-[#FFF1F2] rounded-xl border border-[#FECDD3] flex items-center gap-2 text-xs text-[#BE123C]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Grab it in person! No courier delivery on batch surplus.</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-4 border border-[#EAE6DF] shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="font-bold text-sm text-[#1E2320]">Payment Method</div>
            <span className="text-[11px] font-bold text-[#1B7A43]">Instant 1-Tap</span>
          </div>

          <div className="p-3 bg-[#F0FDF4] rounded-xl border border-[#86EFAC] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-[#1B7A43] text-white text-[11px] font-extrabold rounded">
                UPI
              </span>
              <div>
                <div className="text-xs font-bold text-[#1E2320]">UPI • GPay / PhonePe / Paytm</div>
                <div className="text-[10px] text-[#15803D]">Zero processing surcharge • Prototype test mode</div>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-[#1B7A43]" />
          </div>
        </div>

        {/* Price Transparency */}
        <div className="bg-white rounded-2xl p-4 border border-[#EAE6DF] shadow-xs flex flex-col gap-2.5">
          <h2 className="font-bold text-sm text-[#1E2320]">Price Transparency</h2>

          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>Item Subtotal ({quantity} {quantity === 1 ? 'item' : 'items'})</span>
            <span className="font-semibold text-[#1E2320]">₹{subtotal}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <span>Platform & Packaging Fee</span>
              <span className="px-1.5 py-0.2 bg-[#E8F5EC] text-[#1B7A43] text-[10px] font-bold rounded">
                Free
              </span>
            </span>
            <span className="font-semibold text-[#1B7A43]">₹0</span>
          </div>

          <div className="pt-2 border-t border-[#EAE6DF] flex items-baseline justify-between">
            <span className="font-extrabold text-sm text-[#1E2320]">Total to Pay</span>
            <span className="text-2xl font-black text-[#1B7A43]">₹{total}</span>
          </div>

          <div className="mt-1 p-2.5 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0] flex items-start gap-2 text-[11px] text-[#166534]">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#166534]" />
            <span>
              <strong>Cancellation Policy: </strong>Free cancellation up to 30 mins before pickup window starts.
            </span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Confirm Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE6DF] px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-xl mx-auto flex flex-col gap-1.5">
          <button
            onClick={handleConfirmReservation}
            disabled={isSubmitting}
            className="w-full h-13 rounded-full bg-[#1B7A43] hover:bg-[#156336] active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2 shadow-md transition disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Securing Reservation...</span>
            ) : (
              <span>Confirm Reservation • ₹{total}</span>
            )}
          </button>
          <div className="text-center text-[10px] font-medium text-[#64748B]">
            No payment taken today • Present PIN at pickup counter
          </div>
        </div>
      </div>
    </div>
  );
};
