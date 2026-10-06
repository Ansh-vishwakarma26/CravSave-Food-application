import React from 'react';
import { Listing } from '../types';
import { ReasonBadge } from './ReasonBadge';
import { Clock, ArrowRight, Flame } from 'lucide-react';

interface DealCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
}

export const DealCard: React.FC<DealCardProps> = ({ listing, onSelect }) => {
  const discountPercent = Math.round(
    ((listing.original_price - listing.price) / listing.original_price) * 100
  );

  const isSoldOut = listing.quantity <= 0 || listing.status === 'SOLD_OUT';
  const isExpired = listing.status === 'EXPIRED';
  const isPaused = listing.status === 'PAUSED';
  const isAvailable = listing.status === 'ACTIVE' && listing.quantity > 0;

  return (
    <div
      onClick={() => onSelect(listing)}
      className="group cursor-pointer bg-white rounded-2xl border border-[#EAE6DF] shadow-[0_2px_8px_-2px_rgba(30,35,32,0.04),0_1px_2px_0_rgba(30,35,32,0.02)] overflow-hidden transition-all duration-200 hover:shadow-md hover:border-[#1B7A43]/40"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F5F2EB]">
        <img
          src={listing.image_url}
          alt={listing.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            !isAvailable ? 'grayscale opacity-60' : ''
          }`}
          loading="lazy"
        />

        {/* Top-Left: Reason Badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <ReasonBadge
            reason={listing.reason}
            customLabel={listing.reason_badge_label}
            size="sm"
          />
        </div>

        {/* Top-Right: Sell Until Badge */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-[#1E2320] bg-white/95 backdrop-blur-xs rounded-full shadow-xs">
            <Clock className="w-3 h-3 text-[#64748B]" />
            Until {listing.sell_until}
          </span>
        </div>

        {/* Bottom-Left: Stock Badge */}
        {isAvailable && (
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold text-[#C2410C] bg-[#FFF7ED]/95 backdrop-blur-xs border border-[#FED7AA] rounded-full shadow-xs">
              <Flame className="w-3 h-3 fill-current text-[#EA580C]" />
              Only {listing.quantity} left
            </span>
          </div>
        )}

        {/* Sold out / Expired Overlay banner */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="px-4 py-1.5 rounded-full bg-white font-extrabold text-xs text-[#1E2320] shadow-md uppercase tracking-wider">
              {isSoldOut ? 'Sold Out' : isExpired ? 'This Deal Has Ended' : 'Temporarily Paused'}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-3.5 sm:p-4 flex flex-col gap-2">
        {/* Row 1: Bakery info & Pickup Window */}
        <div className="flex items-center justify-between text-xs text-[#64748B]">
          <div className="flex items-center gap-1.5 font-medium truncate">
            <span className="font-semibold text-[#1E2320]">{listing.business_name}</span>
            <span>•</span>
            <span>{listing.distance}</span>
          </div>
          <span className="px-2 py-0.5 bg-[#F5F2EB] text-[#1E2320] text-[11px] font-semibold rounded-md shrink-0">
            Pickup {listing.pickup_start.replace(':00', '')}–{listing.pickup_end.replace(':00', '')}
          </span>
        </div>

        {/* Row 2: Title */}
        <h3 className="font-bold text-[17px] text-[#1E2320] leading-snug group-hover:text-[#1B7A43] transition">
          {listing.name}
        </h3>

        {/* Row 3: Freshness / Transparency Micro-notes */}
        <div className="flex items-center gap-1.5 text-xs text-[#64748B] truncate">
          <Clock className="w-3.5 h-3.5 shrink-0 text-[#EA580C]" />
          <span className="truncate">
            {listing.freshness_notes || `Best till today • Peak fresh window`}
          </span>
        </div>

        {/* Row 4: Pricing & Grab Deal button */}
        <div className="pt-2 border-t border-[#EAE6DF]/60 flex items-center justify-between gap-2">
          {/* Prices */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-extrabold text-[#1B7A43] tracking-tight">
              ₹{listing.price}
            </span>
            <span className="text-sm font-medium text-[#64748B] line-through">
              ₹{listing.original_price}
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold text-[#C2410C] bg-[#FFF7ED] border border-[#FED7AA] rounded-md">
              <Flame className="w-2.5 h-2.5 fill-current text-[#EA580C]" />
              {discountPercent}% OFF
            </span>
          </div>

          {/* Grab Deal CTA */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(listing);
            }}
            disabled={!isAvailable}
            className={`px-3.5 py-2 rounded-full font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-xs ${
              isAvailable
                ? 'bg-[#006030] text-white hover:bg-[#1B7A43] active:scale-95'
                : 'bg-[#EAE6DF] text-[#64748B] cursor-not-allowed'
            }`}
          >
            <span>{isAvailable ? 'Grab Deal' : 'Unavailable'}</span>
            {isAvailable && <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />}
          </button>
        </div>
      </div>
    </div>
  );
};
