import React from 'react';
import { Tag, Receipt, Bell, User } from 'lucide-react';

export type TabType = 'deals' | 'orders' | 'alerts' | 'account';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadCount = 0,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE6DF] py-2 px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
      <div className="max-w-xl mx-auto flex items-center justify-around">
        {/* Deals */}
        <button
          onClick={() => onTabChange('deals')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'deals' ? 'text-[#1B7A43]' : 'text-[#64748B] hover:text-[#1E2320]'
          }`}
        >
          <div className="relative">
            <Tag className={`w-5 h-5 ${activeTab === 'deals' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className={`text-[11px] font-semibold tracking-tight ${activeTab === 'deals' ? 'font-bold' : ''}`}>
            Deals
          </span>
        </button>

        {/* My Orders */}
        <button
          onClick={() => onTabChange('orders')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'orders' ? 'text-[#1B7A43]' : 'text-[#64748B] hover:text-[#1E2320]'
          }`}
        >
          <div className="relative">
            <Receipt className={`w-5 h-5 ${activeTab === 'orders' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className={`text-[11px] font-semibold tracking-tight ${activeTab === 'orders' ? 'font-bold' : ''}`}>
            My Orders
          </span>
        </button>

        {/* Alerts */}
        <button
          onClick={() => onTabChange('alerts')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'alerts' ? 'text-[#1B7A43]' : 'text-[#64748B] hover:text-[#1E2320]'
          }`}
        >
          <div className="relative">
            <Bell className={`w-5 h-5 ${activeTab === 'alerts' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#EA580C] ring-2 ring-white" />
            )}
          </div>
          <span className={`text-[11px] font-semibold tracking-tight ${activeTab === 'alerts' ? 'font-bold' : ''}`}>
            Alerts
          </span>
        </button>

        {/* Account */}
        <button
          onClick={() => onTabChange('account')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'account' ? 'text-[#1B7A43]' : 'text-[#64748B] hover:text-[#1E2320]'
          }`}
        >
          <div className="relative">
            <User className={`w-5 h-5 ${activeTab === 'account' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className={`text-[11px] font-semibold tracking-tight ${activeTab === 'account' ? 'font-bold' : ''}`}>
            Account
          </span>
        </button>
      </div>
    </nav>
  );
};
