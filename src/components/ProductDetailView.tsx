import React, { useState } from 'react';
import { Listing } from '../types';
import { ReasonBadge } from './ReasonBadge';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Sparkles,
  Store,
  Flame,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  QrCode,
} from 'lucide-react';

interface ProductDetailViewProps {
  listing: Listing;
  onBack: () => void;
  onProceedToCheckout: (listing: Listing, quantity: number) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  listing,
  onBack,
  onProceedToCheckout,
}) => {
  const [quantity, setQuantity] = useState(1);

  const discountPercent = Math.round(
    ((listing.original_price - listing.price) / listing.original_price) * 100
  );

  const maxAvailable = Math.max(0, listing.quantity);
  const isAvailable = listing.status === 'ACTIVE' && maxAvailable > 0;

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleIncrement = () => {
    if (quantity < maxAvailable) setQuantity(q => q + 1);
  };

  const totalPrice = listing.price * quantity;

  return (
    <div className="w-full max-w-xl mx-auto min-h-screen bg-[#FAF8F5] pb-32 flex flex-col overflow-x-hidden">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE6DF] px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1 rounded-full text-[#1E2320] hover:bg-[#F5F2EB] transition"
          aria-label="Back to deals"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-[#1B7A43] flex items-center justify-center text-white">
            <span className="font-black text-xs">C</span>
          </div>
          <span className="font-extrabold text-sm text-[#1E2320]">
            Crav<span className="text-[#1B7A43]">Sav</span> Item Details
          </span>
        </div>

        <div className="w-8 h-8 rounded-full bg-[#006030] text-white flex items-center justify-center font-bold text-xs ring-2 ring-white">
          U
        </div>
      </div>

      {/* Large Hero Image */}
      <div className="relative w-full aspect-[16/11] bg-[#F5F2EB] overflow-hidden">
        <img
          src={listing.image_url}
          alt={listing.name}
          className={`w-full h-full object-cover ${!isAvailable ? 'grayscale opacity-60' : ''}`}
        />
        <div className="absolute top-3 left-3">
          <ReasonBadge
            reason={listing.reason}
            customLabel={listing.reason_badge_label}
            size="md"
          />
        </div>
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-[#1E2320] bg-white/95 backdrop-blur-xs rounded-full shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#64748B]" />
            Sell until {listing.sell_until}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex flex-col gap-4">
        {/* Title & Description */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2320] tracking-tight">
            {listing.name}
          </h1>
          <p className="mt-1 text-sm text-[#64748B] leading-relaxed">
            {listing.description}
          </p>

          {/* Price Row */}
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-3xl font-black text-[#1B7A43] tracking-tight">
              ₹{listing.price}
            </span>
            <span className="text-lg font-medium text-[#64748B] line-through">
              ₹{listing.original_price}
            </span>
            <span className="px-2.5 py-0.5 text-xs font-bold text-[#C2410C] bg-[#FFF7ED] border border-[#FED7AA] rounded-md">
              Save {discountPercent}%
            </span>
          </div>

          {/* Stock & freshness subline */}
          <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-[#EA580C]">
            <Flame className="w-3.5 h-3.5 fill-current text-[#EA580C]" />
            <span>Only {listing.quantity} left in surplus</span>
            <span className="text-[#A1A9A4]">•</span>
            <span className="text-[#64748B] font-normal">
              {listing.freshness_notes || 'Original morning bake'}
            </span>
          </div>
        </div>

        {/* Section: Why Cheaper? (Transparent reason) */}
        <div className="bg-white rounded-2xl p-4 border border-[#EAE6DF] shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1B7A43]">
              Why Cheaper?
            </span>
            <ReasonBadge reason={listing.reason} size="sm" />
          </div>
          <p className="text-xs sm:text-sm text-[#1E2320] leading-relaxed">
            {listing.explanation}
          </p>
        </div>

        {/* Section: What to expect */}
        <div className="bg-white rounded-2xl p-4 border border-[#EAE6DF] shadow-xs">
          <h2 className="text-base font-bold text-[#1E2320] mb-3">What to expect</h2>
          <div className="bg-[#F5F2EB] rounded-xl p-3.5 border border-[#EAE6DF]/60 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FFEAD5] text-[#EA580C] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs sm:text-sm text-[#1E2320] leading-relaxed">
              <strong className="text-[#C2410C] font-bold">Pro Tip: </strong>
              {listing.pro_tip ||
                'Pop in a toaster oven for 2–3 mins or microwave for 15s to get that warm, gooey freshness.'}
            </div>
          </div>
        </div>

        {/* Section: Pickup Details */}
        <div className="bg-white rounded-2xl p-4 border border-[#EAE6DF] shadow-xs flex flex-col gap-3.5">
          <h2 className="text-base font-bold text-[#1E2320]">Pickup Details</h2>

          {/* Store details */}
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DF]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5EC] text-[#1B7A43] flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#1E2320]">{listing.business_name}</div>
                <div className="text-[10px] font-bold tracking-wider text-[#1B7A43] uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Surplus Partner
                </div>
              </div>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold text-[#EA580C] bg-[#FFF7ED] rounded-full border border-[#FED7AA]">
              ⚡ {listing.distance}
            </span>
          </div>

          {/* Store Address */}
          <div className="flex items-start gap-3 text-xs sm:text-sm">
            <MapPin className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-[#64748B]">Store Address</div>
              <div className="text-[#1E2320] font-medium leading-snug">{listing.business_address}</div>
            </div>
          </div>

          {/* Pickup Window */}
          <div className="flex items-start gap-3 text-xs sm:text-sm">
            <Clock className="w-4 h-4 text-[#1B7A43] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-[#64748B]">Pickup Window</div>
              <div className="text-[#1B7A43] font-bold leading-snug">
                Today, {listing.pickup_start} – {listing.pickup_end}
              </div>
            </div>
          </div>

          {/* Fast checkout banner */}
          <div className="bg-[#E8F5EC]/60 rounded-xl p-3 border border-[#1B7A43]/20 flex items-start gap-2.5">
            <QrCode className="w-4 h-4 text-[#1B7A43] shrink-0 mt-0.5" />
            <p className="text-xs text-[#1E2320] leading-snug">
              <strong className="text-[#1B7A43]">Fast Checkout: </strong>
              Flash your 4-digit CravSave reservation pin directly at the counter for instantaneous pickup.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Ribbon */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE6DF] px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-xl mx-auto flex flex-col gap-2">
          {isAvailable ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-[#64748B] uppercase">
                  Quantity (Max {maxAvailable})
                </span>

                {/* Quantity Stepper */}
                <div className="flex items-center bg-[#F5F2EB] rounded-full p-1 border border-[#EAE6DF]">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1E2320] shadow-xs disabled:opacity-40 hover:bg-neutral-50 transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-9 text-center font-bold text-sm text-[#1E2320]">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= maxAvailable}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1E2320] shadow-xs disabled:opacity-40 hover:bg-neutral-50 transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Primary CTA */}
              <button
                onClick={() => onProceedToCheckout(listing, quantity)}
                className="w-full h-13 rounded-full bg-[#1B7A43] hover:bg-[#156336] active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2 shadow-md transition"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Reserve & Pay ₹{totalPrice}</span>
              </button>

              <div className="text-center text-[11px] font-medium text-[#64748B]">
                No delivery • Pick up by {listing.sell_until}
              </div>
            </>
          ) : (
            <div className="text-center py-2">
              <button
                disabled
                className="w-full h-12 rounded-full bg-[#EAE6DF] text-[#64748B] font-bold text-sm cursor-not-allowed"
              >
                This Deal Is No Longer Available
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
