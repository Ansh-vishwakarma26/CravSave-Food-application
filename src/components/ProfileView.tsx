import React, { useState } from 'react';
import { User } from '../types';
import {
  Receipt,
  Heart,
  Bell,
  Settings,
  Store,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { resetDemoData } from '../services/storage';

interface ProfileViewProps {
  currentUser: User;
  onGoToOrders: () => void;
  onGoToAlerts: () => void;
  onSwitchToBusiness: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onGoToOrders,
  onGoToAlerts,
  onSwitchToBusiness,
}) => {
  const [wishlistCount] = useState(3);
  const [resetMessage, setResetMessage] = useState(false);

  const handleReset = () => {
    resetDemoData();
    setResetMessage(true);
    setTimeout(() => setResetMessage(false), 2500);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 flex flex-col gap-4 pb-32 overflow-x-hidden">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#EAE6DF] shadow-xs flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#006030] text-white flex items-center justify-center font-black text-2xl ring-4 ring-[#E8F5EC]">
          {currentUser.name ? currentUser.name[0] : 'U'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-[#1E2320]">{currentUser.name}</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5EC] text-[#1B7A43] uppercase">
              {currentUser.role}
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">{currentUser.email}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1B7A43]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>₹420 saved on 6 meals</span>
          </div>
        </div>
      </div>

      {/* Switch to Business Mode Banner */}
      <div
        onClick={onSwitchToBusiness}
        className="bg-gradient-to-r from-[#1E2320] to-[#2c322e] text-white rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:opacity-95 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm">Switch to Business Portal</div>
            <div className="text-[11px] text-[#becabd]">
              List surplus items, manage orders & schedule price drops
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-white/70" />
      </div>

      {/* Profile Navigation List */}
      <div className="bg-white rounded-2xl border border-[#EAE6DF] shadow-xs overflow-hidden divide-y divide-[#EAE6DF]">
        {/* My Orders */}
        <button
          onClick={onGoToOrders}
          className="w-full p-4 flex items-center justify-between hover:bg-[#FAF8F5] transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8F5EC] text-[#1B7A43] flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#1E2320]">My Orders & Pickups</div>
              <div className="text-[11px] text-[#64748B]">Active reservations and pickup PINs</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#64748B]" />
        </button>

        {/* Wishlist */}
        <div className="w-full p-4 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#1E2320]">Wishlist & Favorite Bakeries</div>
              <div className="text-[11px] text-[#64748B]">ABC Bakery, The Bake House ({wishlistCount})</div>
            </div>
          </div>
          <span className="text-xs font-bold text-[#64748B]">{wishlistCount}</span>
        </div>

        {/* Notifications */}
        <button
          onClick={onGoToAlerts}
          className="w-full p-4 flex items-center justify-between hover:bg-[#FAF8F5] transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FAF5FF] text-[#7E22CE] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#1E2320]">Notifications & Alerts</div>
              <div className="text-[11px] text-[#64748B]">Deal alerts & automated drop triggers</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#64748B]" />
        </button>

        {/* Settings */}
        <div className="w-full p-4 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F5F2EB] text-[#1E2320] flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#1E2320]">Settings & Preferences</div>
              <div className="text-[11px] text-[#64748B]">Neighborhood, diet (Eggless, Sourdough)</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#64748B]" />
        </div>
      </div>

      {/* Honest Surplus Guarantee Explainer */}
      <div className="bg-[#F5F2EB] rounded-2xl p-4 border border-[#EAE6DF] text-xs text-[#3F4940] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#1B7A43] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#1E2320] font-bold">CravSave Promise: </strong>
          Good food shouldn't go to waste. Always fresh, clearly explained, and priced fairly for the neighborhood. No courier delivery—grab it in person!
        </div>
      </div>

      {/* Demo helper */}
      <div className="pt-2 flex flex-col items-center">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#C2410C] transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Demo Data</span>
        </button>
        {resetMessage && (
          <span className="text-[11px] text-[#1B7A43] font-semibold mt-1">
            Demo data refreshed!
          </span>
        )}
      </div>
    </div>
  );
};
