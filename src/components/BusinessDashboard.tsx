import React, { useState, useEffect } from 'react';
import { Business, Listing, Order, ReasonType, SupabaseJobLog } from '../types';
import {
  createListing,
  updateListingStatus,
  markListingSoldOut,
  triggerManualPriceDrop,
  triggerManualExpiry,
  executeScheduledJobs,
  getSupabaseLogs,
  clearSupabaseLogs,
  saveListing,
} from '../services/storage';
import { ReasonBadge } from './ReasonBadge';
import {
  PlusCircle,
  Package,
  Receipt,
  Store,
  Clock,
  CheckCircle,
  PauseCircle,
  PlayCircle,
  XCircle,
  ArrowRight,
  TrendingDown,
  Edit2,
  X,
  Play,
  RotateCcw,
  Database,
  Cpu,
  Layers,
  CheckCheck,
} from 'lucide-react';

interface BusinessDashboardProps {
  listings: Listing[];
  orders: Order[];
  currentBusiness: Business;
  onViewAsCustomer: () => void;
}

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  listings,
  orders,
  currentBusiness,
  onViewAsCustomer,
}) => {
  const [activeTab, setActiveTab] = useState<'my-deals' | 'add-deal' | 'orders' | 'supabase-cron'>('my-deals');

  // Form State for "Add a Deal"
  const [productName, setProductName] = useState('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [cravSavePrice, setCravSavePrice] = useState<number | ''>('');
  const [reason, setReason] = useState<ReasonType>('SELLING SLOWLY');
  const [quantity, setQuantity] = useState<number | ''>(5);
  const [sellUntil, setSellUntil] = useState('7:30 PM');
  const [pickupStart, setPickupStart] = useState('6:00 PM');
  const [pickupEnd, setPickupEnd] = useState('7:30 PM');
  const [pickupAddress, setPickupAddress] = useState(currentBusiness.address);
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80'
  );
  const [description, setDescription] = useState('Fresh bakery batch prepared today with artisanal ingredients.');
  const [explanation, setExplanation] = useState('Surplus batch from the afternoon bake. Normal high quality, sold at discount.');
  const [enableScheduledDrop, setEnableScheduledDrop] = useState(true);
  const [scheduledPrice, setScheduledPrice] = useState<number | ''>('');
  const [scheduledTime, setScheduledTime] = useState('6:30 PM');
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  // Edit Modal State
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  // Supabase Logs State
  const [logs, setLogs] = useState<SupabaseJobLog[]>(getSupabaseLogs());
  const [cronFeedback, setCronFeedback] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setLogs(getSupabaseLogs());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Preset image library for easy testing
  const presets = [
    {
      name: 'Croissant',
      url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Cake Slice',
      url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Sourdough',
      url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Cookies',
      url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Danish Pastry',
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Brioche Bun',
      url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const handlePublishDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !originalPrice || !cravSavePrice || !quantity) return;

    let badgeLabel = 'BAKING SURPLUS • FRESH BATCH';
    if (reason === 'USE BY TODAY') badgeLabel = 'PEAK TASTE TODAY';
    if (reason === 'LOOKS DIFFERENT') badgeLabel = 'UNIQUE SHAPE • FULL TASTE';

    // AUTOMATION 1: Publish listing -> Supabase Database -> Create notification
    const newDeal = createListing({
      business_id: currentBusiness.id,
      business_name: currentBusiness.name,
      business_address: pickupAddress,
      distance: currentBusiness.distance,
      name: productName,
      description: description || 'Freshly made surplus bakery item.',
      image_url: imageUrl,
      original_price: Number(originalPrice),
      price: Number(cravSavePrice),
      reason,
      reason_badge_label: badgeLabel,
      explanation:
        explanation ||
        (reason === 'USE BY TODAY'
          ? 'The food is best consumed today.'
          : reason === 'SELLING SLOWLY'
          ? "The food is normal quality but hasn't sold as quickly as expected."
          : 'Looks unusual or irregular shape, with exact same quality and taste.'),
      pro_tip: 'Best served warmed up in oven for 2 minutes.',
      freshness_notes: 'Freshly baked today • Premium butter',
      quantity: Number(quantity),
      initial_quantity: Number(quantity),
      sell_until: sellUntil,
      pickup_start: pickupStart,
      pickup_end: pickupEnd,
      scheduled_price: enableScheduledDrop && scheduledPrice ? Number(scheduledPrice) : undefined,
      scheduled_time: enableScheduledDrop && scheduledPrice ? scheduledTime : undefined,
      scheduled_applied: false,
    });

    setFormSuccessMessage(`✅ "${newDeal.name}" published! Database saved & customer notification created instantly.`);
    setLogs(getSupabaseLogs());

    setTimeout(() => {
      setFormSuccessMessage(null);
      setActiveTab('my-deals');
    }, 1800);

    // Reset form
    setProductName('');
    setOriginalPrice('');
    setCravSavePrice('');
  };

  const handleSaveEdit = () => {
    if (!editingListing) return;
    const updated = {
      ...editingListing,
      price: Number(editPrice),
      quantity: Number(editQuantity),
      status: Number(editQuantity) <= 0 ? ('SOLD_OUT' as const) : editingListing.status,
    };
    saveListing(updated);
    setEditingListing(null);
  };

  // AUTOMATION 2: Scheduled Price Drop
  const handleTriggerScheduledDrop = (listing: Listing) => {
    const dropPrice = listing.scheduled_price || Math.round(listing.price * 0.8);
    triggerManualPriceDrop(listing.id, dropPrice);
    setLogs(getSupabaseLogs());
    setCronFeedback(`✅ Price drop applied to ${listing.name}! Customer notification dispatched.`);
    setTimeout(() => setCronFeedback(null), 3000);
  };

  // AUTOMATION 3: Expiry
  const handleTriggerExpiry = (listing: Listing) => {
    triggerManualExpiry(listing.id);
    setLogs(getSupabaseLogs());
    setCronFeedback(`⏳ ${listing.name} marked as EXPIRED.`);
    setTimeout(() => setCronFeedback(null), 3000);
  };

  const handleRunAllScheduledJobs = () => {
    const res = executeScheduledJobs();
    setLogs(getSupabaseLogs());
    setCronFeedback(`✅ Scheduled jobs executed: ${res.priceUpdated} price changes, ${res.expired} expired listings.`);
    setTimeout(() => setCronFeedback(null), 3500);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 flex flex-col gap-4 pb-32 overflow-x-hidden">
      {/* Top Business Profile Bar */}
      <div className="bg-[#1E2320] text-white rounded-3xl p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#006030] flex items-center justify-center text-white font-black text-xl shadow-xs">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-white">{currentBusiness.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1B7A43] text-white">
                Partner
              </span>
            </div>
            <p className="text-xs text-[#becabd] truncate max-w-[200px] sm:max-w-xs">
              {currentBusiness.address}
            </p>
          </div>
        </div>

        <button
          onClick={onViewAsCustomer}
          className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition flex items-center gap-1.5 shrink-0"
        >
          <span>Customer View</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#F5F2EB] p-1 rounded-2xl border border-[#EAE6DF] overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('my-deals')}
          className={`flex-1 min-w-[90px] py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'my-deals'
              ? 'bg-white text-[#1E2320] shadow-xs'
              : 'text-[#64748B] hover:text-[#1E2320]'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>My Deals ({listings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('add-deal')}
          className={`flex-1 min-w-[90px] py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'add-deal'
              ? 'bg-white text-[#1E2320] shadow-xs'
              : 'text-[#64748B] hover:text-[#1E2320]'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#1B7A43]" />
          <span>Add Deal</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 min-w-[80px] py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-white text-[#1E2320] shadow-xs'
              : 'text-[#64748B] hover:text-[#1E2320]'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase-cron')}
          className={`flex-1 min-w-[110px] py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'supabase-cron'
              ? 'bg-white text-[#1B7A43] shadow-xs'
              : 'text-[#64748B] hover:text-[#1E2320]'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-[#1B7A43]" />
          <span>Automations</span>
        </button>
      </div>

      {cronFeedback && (
        <div className="p-3 bg-[#E8F5EC] border border-[#1B7A43]/40 text-[#1B7A43] rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCheck className="w-4 h-4 shrink-0" />
          <span>{cronFeedback}</span>
        </div>
      )}

      {/* TAB 1: MY DEALS */}
      {activeTab === 'my-deals' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
            <span>Manage active surplus inventory</span>
            <button
              onClick={() => setActiveTab('supabase-cron')}
              className="font-bold text-[#1B7A43] flex items-center gap-1 hover:underline"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Automations Active (every min)</span>
            </button>
          </div>

          {listings.map(item => {
            const isSoldOut = item.quantity <= 0 || item.status === 'SOLD_OUT';
            const isExpired = item.status === 'EXPIRED';
            const isPaused = item.status === 'PAUSED';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#EAE6DF] p-4 shadow-xs flex flex-col gap-3"
              >
                {/* Top Item Summary */}
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#F5F2EB] shrink-0">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h2 className="font-extrabold text-sm text-[#1E2320] truncate">
                        {item.name}
                      </h2>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          item.status === 'ACTIVE'
                            ? 'bg-[#E8F5EC] text-[#1B7A43]'
                            : item.status === 'PAUSED'
                            ? 'bg-[#FEF3C7] text-[#D97706]'
                            : item.status === 'SOLD_OUT'
                            ? 'bg-[#FEE2E2] text-[#DC2626]'
                            : 'bg-[#F5F2EB] text-[#64748B]'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                      <ReasonBadge reason={item.reason} size="sm" />
                      <span className="text-xs font-bold text-[#1B7A43]">₹{item.price}</span>
                      <span className="text-xs text-[#64748B] line-through">
                        ₹{item.original_price}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-3 text-xs text-[#64748B]">
                      <span>
                        Qty: <strong className="text-[#1E2320]">{item.quantity}</strong>
                      </span>
                      <span>•</span>
                      <span>Sell until: <strong className="text-[#1E2320]">{item.sell_until}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Scheduled Automations Strip */}
                <div className="bg-[#FAF8F5] rounded-xl p-2.5 border border-[#EAE6DF]/70 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span className="font-semibold text-[#1E2320] flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-[#1B7A43]" />
                      Scheduled Job Actions:
                    </span>
                    {item.scheduled_price && !item.scheduled_applied && (
                      <span className="text-[#1B7A43] font-bold">
                        Scheduled: ₹{item.scheduled_price} ({item.scheduled_time || '6 PM'})
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Automation 2: Test Price Drop */}
                    <button
                      onClick={() => handleTriggerScheduledDrop(item)}
                      disabled={isSoldOut || isExpired}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#E8F5EC] text-[#1B7A43] hover:bg-[#d0edd8] transition flex items-center gap-1 disabled:opacity-40"
                      title="Trigger scheduled price drop right now"
                    >
                      <TrendingDown className="w-3 h-3" />
                      <span>
                        {item.scheduled_applied ? 'Price Dropped' : 'Trigger Price Drop'}
                      </span>
                    </button>

                    {/* Automation 3: Test Expiry */}
                    <button
                      onClick={() => handleTriggerExpiry(item)}
                      disabled={isExpired}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#FFF7ED] text-[#EA580C] hover:bg-[#ffedd5] transition flex items-center gap-1 disabled:opacity-40"
                      title="Trigger expiry right now"
                    >
                      <Clock className="w-3 h-3" />
                      <span>{isExpired ? 'Expired' : 'Trigger Expiry'}</span>
                    </button>
                  </div>
                </div>

                {/* Business Control Buttons: Edit / Pause / Mark Sold Out */}
                <div className="flex items-center justify-between pt-1 border-t border-[#EAE6DF]/60 text-xs">
                  <div className="flex items-center gap-1.5">
                    {/* Pause / Resume */}
                    <button
                      onClick={() =>
                        updateListingStatus(item.id, isPaused ? 'ACTIVE' : 'PAUSED')
                      }
                      className="px-3 py-1.5 rounded-lg border border-[#EAE6DF] hover:bg-[#F5F2EB] font-bold text-[#1E2320] flex items-center gap-1 transition"
                    >
                      {isPaused ? (
                        <>
                          <PlayCircle className="w-3.5 h-3.5 text-[#1B7A43]" />
                          <span>Resume</span>
                        </>
                      ) : (
                        <>
                          <PauseCircle className="w-3.5 h-3.5 text-[#64748B]" />
                          <span>Pause</span>
                        </>
                      )}
                    </button>

                    {/* Mark Sold Out */}
                    <button
                      onClick={() => markListingSoldOut(item.id)}
                      disabled={isSoldOut}
                      className="px-3 py-1.5 rounded-lg border border-[#EAE6DF] hover:bg-[#FEE2E2] hover:text-[#DC2626] font-bold text-[#64748B] flex items-center gap-1 transition disabled:opacity-40"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Mark Sold Out</span>
                    </button>
                  </div>

                  {/* Edit */}
                  <button
                    onClick={() => {
                      setEditingListing(item);
                      setEditPrice(item.price);
                      setEditQuantity(item.quantity);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#F5F2EB] hover:bg-[#EAE6DF] font-bold text-[#1E2320] flex items-center gap-1 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: ADD A DEAL */}
      {activeTab === 'add-deal' && (
        <form
          onSubmit={handlePublishDeal}
          className="bg-white rounded-3xl p-5 border border-[#EAE6DF] shadow-xs flex flex-col gap-4"
        >
          <div>
            <h2 className="text-xl font-black text-[#1E2320]">List a New Surplus Deal</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Publishing saves to Supabase and immediately dispatches a customer notification.
            </p>
          </div>

          {formSuccessMessage && (
            <div className="p-3 bg-[#E8F5EC] border border-[#1B7A43]/40 text-[#1B7A43] rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{formSuccessMessage}</span>
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-[#1E2320] mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={productName}
              onChange={e => setProductName(e.target.value)}
              placeholder="e.g. Chocolate Croissant, Sourdough Loaf..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6DF] bg-[#FAF8F5] text-sm text-[#1E2320] focus:outline-none focus:border-[#1B7A43] focus:bg-white"
            />
          </div>

          {/* Image URL & Presets */}
          <div>
            <label className="block text-xs font-bold text-[#1E2320] mb-1">
              Image URL *
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#EAE6DF] bg-[#FAF8F5] text-xs text-[#1E2320] focus:outline-none focus:border-[#1B7A43] focus:bg-white"
            />
            <div className="mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-[10px] font-bold text-[#64748B] shrink-0">Presets:</span>
              {presets.map(p => (
                <button
                  type="button"
                  key={p.name}
                  onClick={() => {
                    setImageUrl(p.url);
                    if (!productName) setProductName(p.name);
                  }}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-[#F5F2EB] hover:bg-[#EAE6DF] font-semibold text-[#1E2320] shrink-0 transition"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing: Original & CravSave Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1E2320] mb-1">
                Original Price (₹) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={originalPrice}
                onChange={e => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="120"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6DF] bg-[#FAF8F5] text-sm text-[#1E2320] focus:outline-none focus:border-[#1B7A43] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B7A43] mb-1">
                CravSave Price (₹) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={cravSavePrice}
                onChange={e => setCravSavePrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="60"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1B7A43]/40 bg-[#FAF8F5] text-sm font-bold text-[#1B7A43] focus:outline-none focus:border-[#1B7A43] focus:bg-white"
              />
            </div>
          </div>

          {/* Reason (3 options strictly per brief) */}
          <div>
            <label className="block text-xs font-bold text-[#1E2320] mb-1.5">
              Reason for Lower Price *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label
                className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-1 transition ${
                  reason === 'USE BY TODAY'
                    ? 'border-[#FED7AA] bg-[#FFF7ED]'
                    : 'border-[#EAE6DF] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="reason"
                    checked={reason === 'USE BY TODAY'}
                    onChange={() => setReason('USE BY TODAY')}
                    className="accent-[#C2410C]"
                  />
                  <span className="font-bold text-xs text-[#C2410C]">Use by Today</span>
                </div>
                <span className="text-[10px] text-[#64748B]">Best consumed today</span>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-1 transition ${
                  reason === 'SELLING SLOWLY'
                    ? 'border-[#A7F3D0] bg-[#ECFDF5]'
                    : 'border-[#EAE6DF] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="reason"
                    checked={reason === 'SELLING SLOWLY'}
                    onChange={() => setReason('SELLING SLOWLY')}
                    className="accent-[#047857]"
                  />
                  <span className="font-bold text-xs text-[#047857]">Selling Slowly</span>
                </div>
                <span className="text-[10px] text-[#64748B]">Normal quality, slower sales</span>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-1 transition ${
                  reason === 'LOOKS DIFFERENT'
                    ? 'border-[#E9D5FF] bg-[#FAF5FF]'
                    : 'border-[#EAE6DF] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="reason"
                    checked={reason === 'LOOKS DIFFERENT'}
                    onChange={() => setReason('LOOKS DIFFERENT')}
                    className="accent-[#7E22CE]"
                  />
                  <span className="font-bold text-xs text-[#7E22CE]">Looks Different</span>
                </div>
                <span className="text-[10px] text-[#64748B]">Irregular shape, same taste</span>
              </label>
            </div>
          </div>

          {/* Quantity & Sell-until time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1E2320] mb-1">
                Quantity Available *
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={e => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="5"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6DF] bg-[#FAF8F5] text-sm text-[#1E2320] focus:outline-none focus:border-[#1B7A43] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E2320] mb-1">
                Sell Until Time *
              </label>
              <input
                type="text"
                required
                value={sellUntil}
                onChange={e => setSellUntil(e.target.value)}
                placeholder="7:30 PM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6DF] bg-[#FAF8F5] text-sm text-[#1E2320] focus:outline-none focus:border-[#1B7A43] focus:bg-white"
              />
            </div>
          </div>

          {/* Pickup Window */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1E2320] mb-1">
                Pickup Start *
              </label>
              <input
                type="text"
                required
                value={pickupStart}
                onChange={e => setPickupStart(e.target.value)}
                placeholder="6:00 PM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6DF] bg-[#FAF8F5] text-sm text-[#1E2320] focus:outline-none focus:border-[#1B7A43] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E2320] mb-1">
                Pickup End *
              </label>
              <input
                type="text"
                required
                value={pickupEnd}
                onChange={e => setPickupEnd(e.target.value)}
                placeholder="7:30 PM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6DF] bg-[#FAF8F5] text-sm text-[#1E2320] focus:outline-none focus:border-[#1B7A43] focus:bg-white"
              />
            </div>
          </div>

          {/* Pickup Address */}
          <div>
            <label className="block text-xs font-bold text-[#1E2320] mb-1">
              Pickup Address *
            </label>
            <input
              type="text"
              required
              value={pickupAddress}
              onChange={e => setPickupAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6DF] bg-[#FAF8F5] text-xs text-[#1E2320] focus:outline-none focus:border-[#1B7A43] focus:bg-white"
            />
          </div>

          {/* Automation 2: Optional Scheduled Price Drop */}
          <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#EAE6DF] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[#1B7A43]" />
                <span className="text-xs font-bold text-[#1E2320]">
                  Scheduled Price Drop (Automation 2)
                </span>
              </div>
              <input
                type="checkbox"
                checked={enableScheduledDrop}
                onChange={e => setEnableScheduledDrop(e.target.checked)}
                className="accent-[#1B7A43] w-4 h-4 rounded cursor-pointer"
              />
            </div>

            {enableScheduledDrop && (
              <div className="grid grid-cols-2 gap-3 mt-1 animate-in fade-in">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                    Scheduled Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={scheduledPrice}
                    onChange={e => setScheduledPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 50"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE6DF] bg-white text-xs font-bold text-[#1B7A43]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                    Trigger Time
                  </label>
                  <input
                    type="text"
                    value={scheduledTime}
                    onChange={e => setScheduledTime(e.target.value)}
                    placeholder="e.g. 6:30 PM"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE6DF] bg-white text-xs font-medium text-[#1E2320]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full h-12 rounded-full bg-[#1B7A43] hover:bg-[#156336] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Deal</span>
          </button>
        </form>
      )}

      {/* TAB 3: ORDERS */}
      {activeTab === 'orders' && (
        <div className="flex flex-col gap-3">
          <div className="text-xs text-[#64748B] px-1">
            Incoming customer pickup reservations
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-[#EAE6DF] text-center flex flex-col items-center">
              <Receipt className="w-8 h-8 text-[#64748B] mb-2" />
              <h3 className="text-base font-bold text-[#1E2320]">No reservations yet</h3>
              <p className="text-xs text-[#64748B] mt-1">
                When customers reserve your surplus deals, they will appear here.
              </p>
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#EAE6DF] p-4 shadow-xs flex flex-col gap-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#EAE6DF]">
                  <div>
                    <span className="font-extrabold text-sm text-[#1E2320]">
                      Order #{order.order_number}
                    </span>
                    <span className="text-xs text-[#64748B] ml-2 font-medium">
                      Customer: {order.customer_name}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      order.status === 'RESERVED'
                        ? 'bg-[#E8F5EC] text-[#1B7A43]'
                        : 'bg-[#F0FDF4] text-[#15803D]'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#1E2320]">
                      {order.quantity}x {order.listing_name}
                    </h3>
                    <div className="text-xs text-[#64748B] mt-0.5">
                      Pickup Window: <strong className="text-[#1E2320]">{order.pickup_window}</strong>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase text-[#64748B]">Verify PIN</div>
                    <div className="text-lg font-black text-[#1B7A43] font-mono tracking-wider">
                      {order.pickup_pin}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EAE6DF]/60 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1B7A43]">Total: ₹{order.total_price}</span>
                  <span className="text-[11px] text-[#64748B]">
                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: SUPABASE SCHEDULED JOBS & EDGE FUNCTIONS */}
      {activeTab === 'supabase-cron' && (
        <div className="flex flex-col gap-4">
          {/* Architecture Card */}
          <div className="bg-[#1E2320] text-white rounded-3xl p-5 shadow-xs flex flex-col gap-3 font-sans">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#80d998]" />
                <h3 className="font-black text-sm text-white">Supabase Architecture</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1B7A43] text-white flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#80d998] animate-ping"></span>
                Cron Active
              </span>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl text-[11px] font-mono text-[#edf2ed] space-y-1">
              <div className="text-[#80d998] font-bold">Google AI Studio → React → Supabase</div>
              <div className="text-[#becabd]">Database & Edge Functions → Scheduled Jobs → In-App Notifications</div>
            </div>

            <button
              onClick={handleRunAllScheduledJobs}
              className="mt-1 py-2.5 rounded-full bg-[#1B7A43] hover:bg-[#156336] text-white font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Scheduled Jobs Now (Tick Cron)</span>
            </button>
          </div>

          {/* 3 Automations Overview */}
          <div className="flex flex-col gap-3">
            {/* 1. New Deal */}
            <div className="bg-white rounded-2xl p-4 border border-[#EAE6DF] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#E8F5EC] text-[#1B7A43] flex items-center justify-center font-black text-xs">
                    1
                  </span>
                  <h4 className="font-bold text-sm text-[#1E2320]">New Deal (Instant DB Hook)</h4>
                </div>
                <span className="text-[10px] font-bold text-[#1B7A43] bg-[#E8F5EC] px-2 py-0.5 rounded">
                  Immediate
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Publish listing → Database → Immediately dispatches customer notification:
                <span className="block mt-1 font-semibold text-[#1E2320]">
                  "🔥 New deal just dropped: Chocolate Croissant — ₹60 at ABC Bakery"
                </span>
              </p>
            </div>

            {/* 2. Scheduled Price Drop */}
            <div className="bg-white rounded-2xl p-4 border border-[#EAE6DF] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center font-black text-xs">
                    2
                  </span>
                  <h4 className="font-bold text-sm text-[#1E2320]">Scheduled Price Drop</h4>
                </div>
                <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFF7ED] px-2 py-0.5 rounded">
                  Every Minute Cron
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Supabase scheduled function checks due price changes:
                <span className="block mt-1 font-mono text-[11px] text-[#047857]">
                  Every minute → Check scheduled price changes → ₹60 → ₹50 → Create notification
                </span>
              </p>
            </div>

            {/* 3. Expiry */}
            <div className="bg-white rounded-2xl p-4 border border-[#EAE6DF] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#FAF5FF] text-[#7E22CE] flex items-center justify-center font-black text-xs">
                    3
                  </span>
                  <h4 className="font-bold text-sm text-[#1E2320]">Listing Expiry</h4>
                </div>
                <span className="text-[10px] font-bold text-[#7E22CE] bg-[#FAF5FF] px-2 py-0.5 rounded">
                  Every Minute Cron
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Supabase checks listings where sell_until has elapsed:
                <span className="block mt-1 font-mono text-[11px] text-[#7E22CE]">
                  Every minute → Find listings where sell_until &lt; now → ACTIVE → EXPIRED
                </span>
              </p>
            </div>
          </div>

          {/* Job Execution Logs */}
          <div className="bg-white rounded-2xl p-4 border border-[#EAE6DF] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#64748B]">
                Edge Functions & Cron Logs ({logs.length})
              </h4>
              <button
                onClick={() => {
                  clearSupabaseLogs();
                  setLogs([]);
                }}
                className="text-[11px] font-bold text-[#EA580C] hover:underline"
              >
                Clear logs
              </button>
            </div>

            {logs.length === 0 ? (
              <div className="text-center py-4 text-xs text-[#64748B]">
                No jobs executed yet. Trigger a job above to view execution logs.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {logs.map(log => (
                  <div
                    key={log.id}
                    className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#EAE6DF] text-xs flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#1B7A43]">
                        {log.job_name}
                      </span>
                      <span className="text-[10px] text-[#64748B]">{log.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#1E2320]">{log.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingListing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-[#EAE6DF] shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#1E2320]">
                Edit {editingListing.name}
              </h3>
              <button
                onClick={() => setEditingListing(null)}
                className="p-1 rounded-full text-[#64748B] hover:bg-[#F5F2EB]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E2320] mb-1">
                Deal Price (₹)
              </label>
              <input
                type="number"
                min="1"
                value={editPrice}
                onChange={e => setEditPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE6DF] text-sm font-bold text-[#1B7A43]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E2320] mb-1">
                Remaining Quantity
              </label>
              <input
                type="number"
                min="0"
                value={editQuantity}
                onChange={e => setEditQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE6DF] text-sm text-[#1E2320]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingListing(null)}
                className="flex-1 py-2 rounded-full border border-[#EAE6DF] text-xs font-bold text-[#1E2320]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="flex-1 py-2 rounded-full bg-[#1B7A43] text-white text-xs font-bold hover:bg-[#156336]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
