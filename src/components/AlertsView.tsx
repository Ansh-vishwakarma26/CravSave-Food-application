import React from 'react';
import { NotificationItem } from '../types';
import { markNotificationRead, markAllNotificationsRead } from '../services/storage';
import { Bell, Flame, CheckCircle, Tag, CheckCheck, Clock } from 'lucide-react';

interface AlertsViewProps {
  notifications: NotificationItem[];
  onSelectListing?: (listingId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ notifications, onSelectListing }) => {
  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'listing_created':
        return <Flame className="w-4 h-4 text-[#EA580C]" />;
      case 'price_drop':
        return <Tag className="w-4 h-4 text-[#1B7A43]" />;
      case 'order_reserved':
        return <CheckCircle className="w-4 h-4 text-[#1B7A43]" />;
      default:
        return <Bell className="w-4 h-4 text-[#64748B]" />;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 flex flex-col gap-4 pb-32 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1E2320] tracking-tight">Notifications</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Automated alerts powered by n8n workflows
          </p>
        </div>

        {notifications.some(n => !n.read) && (
          <button
            onClick={() => markAllNotificationsRead()}
            className="flex items-center gap-1 text-xs font-bold text-[#1B7A43] hover:underline"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-[#EAE6DF] text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#64748B] mb-3">
            <Bell className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-[#1E2320]">No alerts yet</h2>
          <p className="text-xs text-[#64748B] mt-1 max-w-xs">
            You'll receive instant updates when fresh bakery deals drop or prices decrease!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.listing_id && onSelectListing) {
                  onSelectListing(notif.listing_id);
                }
              }}
              className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                notif.read
                  ? 'bg-white border-[#EAE6DF]'
                  : 'bg-[#FAFDF9] border-[#1B7A43]/30 shadow-xs'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  notif.type === 'listing_created'
                    ? 'bg-[#FFF7ED]'
                    : notif.type === 'price_drop'
                    ? 'bg-[#E8F5EC]'
                    : 'bg-[#F5F2EB]'
                }`}
              >
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xs sm:text-sm font-bold text-[#1E2320] truncate">
                    {notif.title}
                  </h2>
                  <span className="text-[10px] text-[#64748B] shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(notif.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-[#3F4940] mt-1 leading-snug">
                  {notif.message}
                </p>
              </div>

              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-[#1B7A43] shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
