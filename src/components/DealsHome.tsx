import React, { useState } from 'react';
import { Listing, ReasonType } from '../types';
import { DealCard } from './DealCard';
import { Search, Navigation, Sparkles, Filter, X } from 'lucide-react';

interface DealsHomeProps {
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
  currentLocation?: string;
}

export const DealsHome: React.FC<DealsHomeProps> = ({
  listings,
  onSelectListing,
  currentLocation = 'Indiranagar',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | ReasonType>('All');

  // Filter listings
  const filteredListings = listings.filter(item => {
    // Search filter
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Reason filter
    const matchesReason =
      selectedFilter === 'All' || item.reason === selectedFilter;

    return matchesSearch && matchesReason;
  });

  const filterOptions: Array<{ label: string; value: 'All' | ReasonType }> = [
    { label: 'All', value: 'All' },
    { label: 'Use by Today', value: 'USE BY TODAY' },
    { label: 'Selling Slowly', value: 'SELLING SLOWLY' },
    { label: 'Looks Different', value: 'LOOKS DIFFERENT' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto px-4 pt-3 pb-32 flex flex-col gap-4 overflow-x-hidden">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search fresh sourdough, pastries, cakes..."
          className="w-full h-12 pl-10 pr-9 rounded-2xl bg-white border border-[#EAE6DF] text-xs sm:text-sm text-[#1E2320] shadow-[0_2px_8px_-2px_rgba(30,35,32,0.03)] placeholder:text-[#64748B] focus:outline-none focus:border-[#1B7A43] focus:ring-2 focus:ring-[#1B7A43]/15 transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#64748B] hover:text-[#1E2320]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Horizontal Reason Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {filterOptions.map(option => {
          const isSelected = selectedFilter === option.value;
          return (
            <button
              key={option.value}
              onClick={() => setSelectedFilter(option.value)}
              className={`h-9 px-4 rounded-full text-xs font-bold shrink-0 transition-all shadow-2xs ${
                isSelected
                  ? 'bg-[#1E2320] text-white shadow-xs'
                  : 'bg-white text-[#1E2320] border border-[#EAE6DF] hover:bg-[#F5F2EB]'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Deals Near You Headline row matching Image 3 */}
      <div className="flex items-baseline justify-between pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1E2320] tracking-tight">
            Deals near you
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5 font-medium">
            {filteredListings.length} {filteredListings.length === 1 ? 'item' : 'items'} available today within 2 km
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-[#1B7A43]">
          <Navigation className="w-3.5 h-3.5 fill-current text-[#1B7A43]" />
          <span>{currentLocation}</span>
        </div>
      </div>

      {/* Food Deal Cards Feed */}
      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-[#EAE6DF] text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#64748B] mb-2">
            <Filter className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-[#1E2320]">No deals match this filter</h2>
          <p className="text-xs text-[#64748B] mt-1 max-w-xs">
            Try choosing "All" or search for a different bakery item.
          </p>
          <button
            onClick={() => {
              setSelectedFilter('All');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-bold text-[#1B7A43] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredListings.map(item => (
            <DealCard
              key={item.id}
              listing={item}
              onSelect={onSelectListing}
            />
          ))}
        </div>
      )}

      {/* Community Impact Banner matching Image 3 */}
      <div className="mt-2 bg-gradient-to-r from-[#DCFCE7] via-[#E8F5EC] to-[#F0FDF4] rounded-2xl p-4 border border-[#86EFAC]/40 shadow-xs flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-[#006030] text-white flex items-center justify-center shrink-0 shadow-xs">
          {/* Sprout / recycle eco icon */}
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4a1 1 0 00.78 1.6H10a1 1 0 001-1v-4.87c0-.55-.45-1-1-1H7.83l.89-.89C9.64 12.33 10.78 12 12 12c2.21 0 4 1.79 4 4 0 .55.45 1 1 1s1-.45 1-1c0-3.31-2.69-6-6-6-1.57 0-3 .61-4.08 1.62l-.7-.7C9.37 9.77 10.63 9 12 9c3.31 0 6 2.69 6 6 0 .55.45 1 1 1s1-.45 1-1c0-4.97-4.03-9-9-9z" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h2 className="font-extrabold text-sm sm:text-base text-[#1E2320]">
              348 kg saved this week!
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#006030] text-white shrink-0">
              Community Win
            </span>
          </div>
          <p className="text-xs text-[#3F4940] mt-0.5 leading-snug">
            Indiranagar conscious food lovers turning surplus into smiles. You rock! ✨🧁
          </p>
        </div>
      </div>
    </div>
  );
};
