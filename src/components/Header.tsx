import React, { useState } from 'react';
import { Bell, ChevronDown, Store, User as UserIcon, MapPin } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User;
  onToggleRole: () => void;
  onOpenAlerts: () => void;
  unreadCount: number;
  currentLocation?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onToggleRole,
  onOpenAlerts,
  unreadCount,
  currentLocation = 'Indiranagar',
}) => {
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);

  const locations = ['Indiranagar', 'Koramangala', 'HSR Layout', 'Lavelle Road'];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE6DF] px-4 py-3">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        {/* Brand & Location */}
        <div className="flex items-center gap-3">
          {/* CravSave Logo */}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-full bg-[#1B7A43] flex items-center justify-center text-white shadow-sm ring-2 ring-[#E8F5EC]">
              {/* Organic leaf / loop icon */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-[#1E2320] leading-none">
                Crav<span className="text-[#1B7A43]">Sav</span>
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-[#64748B] uppercase">Cravings. Savings.</span>
            </div>
          </div>

          {/* Location Picker */}
          <div className="relative border-l border-[#EAE6DF] pl-3">
            <button
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              className="flex items-center gap-1 text-left text-xs hover:opacity-80 transition"
              title="Change neighborhood"
            >
              <div>
                <div className="flex items-center gap-0.5 font-bold text-[#1B7A43] leading-tight">
                  <span>{selectedLocation}</span>
                  <ChevronDown className="w-3 h-3 text-[#1B7A43]" />
                </div>
                <div className="text-[10px] text-[#64748B] leading-none">Bengaluru</div>
              </div>
            </button>

            {showLocationMenu && (
              <div className="absolute top-full left-0 mt-2 w-44 bg-white border border-[#EAE6DF] rounded-xl shadow-lg p-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="text-[10px] uppercase font-bold text-[#64748B] px-2 py-1">Available Neighborhoods</div>
                {locations.map(loc => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setShowLocationMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between ${
                      selectedLocation === loc ? 'bg-[#E8F5EC] text-[#1B7A43] font-bold' : 'hover:bg-[#F5F2EB] text-[#1E2320]'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#64748B]" />
                      {loc}
                    </span>
                    {selectedLocation === loc && <span className="w-1.5 h-1.5 rounded-full bg-[#1B7A43]"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right actions: Role Switcher & Notifications & Avatar */}
        <div className="flex items-center gap-2.5">
          {/* Business / Customer Toggle */}
          <button
            onClick={onToggleRole}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition border ${
              currentUser.role === 'business'
                ? 'bg-[#1E2320] text-white border-[#1E2320]'
                : 'bg-white text-[#1B7A43] border-[#1B7A43]/30 hover:bg-[#E8F5EC]'
            }`}
            title="Switch between Customer and Business mode"
          >
            {currentUser.role === 'business' ? (
              <>
                <Store className="w-3.5 h-3.5" />
                <span>Business Mode</span>
              </>
            ) : (
              <>
                <UserIcon className="w-3.5 h-3.5" />
                <span>Customer</span>
              </>
            )}
          </button>

          {/* Bell Notifications */}
          <button
            onClick={onOpenAlerts}
            className="relative p-2 rounded-full text-[#1E2320] hover:bg-[#F5F2EB] transition"
            aria-label="Alerts"
          >
            <Bell className="w-5 h-5 text-[#1E2320]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EA580C] ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#006030] text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-xs">
            {currentUser.name ? currentUser.name[0] : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

