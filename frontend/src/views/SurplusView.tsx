import React, { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, Plus, Search, Filter, Clock, MapPin, 
  ShieldCheck, AlertCircle, Check, X, ArrowRight, Truck, 
  Sparkles, CheckCircle2, ChevronRight, Phone, AlertTriangle 
} from 'lucide-react';
import { api, User } from '../api';

interface SurplusViewProps {
  currentUser: User;
  onNavigate: (tab: string) => void;
  lang: 'en' | 'ta';
}

export const SurplusView: React.FC<SurplusViewProps> = ({ currentUser, onNavigate, lang }) => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Publish Surplus Modal State
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [newSurplus, setNewSurplus] = useState({
    institution_id: 1,
    food_name: 'Steamed Basmati Rice & Paneer Butter Masala',
    category: 'Cooked Meals',
    quantity_kg: 20.0,
    portions: 50,
    food_image_url: '/hero_banner.jpg',
    pickup_address: 'Loyola College Mega Mess Gate 3, Sterling Road, Nungambakkam',
    lat: 13.0645,
    lng: 80.2335,
    prep_datetime: new Date().toISOString().replace('T', ' ').slice(0, 16),
    pickup_deadline: new Date(Date.now() + 3.5 * 3600000).toISOString().replace('T', ' ').slice(0, 16),
    storage_condition: 'Thermal Insulated SS Containers (65°C+)',
    allergens: 'Contains Dairy (Paneer/Butter)',
    safety_verified: true,
    verified_by: 'Chef Ramanathan (FSSAI Certified)',
    contact_phone: '+91 98400 11223',
    est_value_inr: 3000.0,
  });

  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await api.getSurplus(categoryFilter, statusFilter);
      setListings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, [categoryFilter, statusFilter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.publishSurplus(newSurplus);
      setShowPublishModal(false);
      loadListings();
      showToast('Surplus food published! Nearby NGOs have been alerted.');
    } catch (err: any) {
      alert(err.message || 'Error publishing surplus');
    }
  };

  const handleAcceptDonation = async (listingId: number) => {
    setActionLoading(listingId);
    try {
      // NGO id 1 = Akshaya Food Bank
      const res = await api.acceptDonation(listingId, 1);
      showToast(`Success: Donation accepted! Assigned to delivery driver: ${res.assigned_driver}`);
      loadListings();
    } catch (err: any) {
      alert(err.message || 'Could not accept donation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectDonation = async (listingId: number) => {
    const reason = prompt('Please enter reason for rejection (e.g. at full capacity, distance, dietary mismatch):');
    if (!reason) return;
    try {
      await api.rejectDonation(listingId, 1, reason);
      showToast('Donation rejected. Listing remains open for other NGOs.');
      loadListings();
    } catch (err: any) {
      alert(err.message || 'Error rejecting donation');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300">● Available for Claim</span>;
      case 'Accepted':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 ring-1 ring-blue-300">🤝 Claimed by NGO</span>;
      case 'In Transit':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 ring-1 ring-amber-300">🚚 In Transit</span>;
      case 'Delivered':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">✅ Delivered & Fed</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs bg-slate-100">{status}</span>;
    }
  };

  const isNgo = currentUser.role === 'ngo';
  const isInstitution = currentUser.role === 'institution' || currentUser.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-700 text-white flex items-center justify-between shadow-xl animate-fade-in text-xs font-bold">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-[#D5AD58]" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2E8059]/10 text-[#2E8059]">
              Verified Safe Food Redistribution
            </span>
            <span className="text-xs text-slate-500">Live Marketplace</span>
          </div>
          <h2 className="text-xl font-bold text-[#174C3C] mt-1">
            {lang === 'en' ? 'Surplus Food Redistribution & NGO Marketplace' : 'உபரி உணவு மறுபகிர்வு & தன்னார்வ சந்தை'}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Connecting institutional kitchens directly with verified food banks and shelters before food becomes waste.
          </p>
        </div>

        {isInstitution && (
          <button
            onClick={() => setShowPublishModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#174C3C] hover:bg-[#2E8059] text-white text-xs font-bold transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Safe Surplus Food</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2ECE5] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-500">Filter By Status:</span>
          {['all', 'Available', 'Accepted', 'In Transit', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                statusFilter === st 
                  ? 'bg-[#2E8059] text-white shadow-2xs' 
                  : 'bg-[#F7F8F2] text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st === 'all' ? 'All Listings' : st}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#E2ECE5] bg-[#F7F8F2] font-semibold text-slate-700"
          >
            <option value="all">All Food Categories</option>
            <option value="Cooked Meals">Cooked Meals</option>
            <option value="Bakery & Breads">Bakery & Breads</option>
            <option value="Fresh Produce">Fresh Produce</option>
            <option value="Dairy">Dairy</option>
          </select>
        </div>
      </div>

      {/* Marketplace Listings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            Loading active surplus food listings...
          </div>
        ) : listings.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-dashed border-[#E2ECE5]">
            No surplus food listings match the current filters.
          </div>
        ) : (
          listings.map((item) => {
            const isAvailable = item.status === 'Available';
            return (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border border-[#E2ECE5] shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Card Header & Status */}
                  <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold text-[#174C3C] mt-0.5 line-clamp-1">
                        {item.food_name}
                      </h3>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>

                  {/* Quantity & Time Details */}
                  <div className="p-4 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2 bg-[#F7F8F2] p-3 rounded-xl border border-[#E2ECE5]/60">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Portions Available</span>
                        <span className="text-base font-extrabold text-[#174C3C]">
                          {item.portions} <span className="text-xs font-normal text-slate-500">portions</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Weight (kg)</span>
                        <span className="text-base font-extrabold text-[#2E8059]">
                          {item.quantity_kg} <span className="text-xs font-normal text-slate-500">kg</span>
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-slate-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="truncate">{item.pickup_address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="font-semibold text-amber-800">
                          Pickup Deadline: {item.pickup_deadline}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-emerald-700 font-medium">
                          Safety: {item.verified_by || 'Verified by Head Chef'}
                        </span>
                      </div>
                      {item.allergens && (
                        <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <strong>Allergens:</strong> {item.allergens}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 pt-0">
                  {isAvailable ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAcceptDonation(item.id)}
                        disabled={actionLoading === item.id}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#2E8059] hover:bg-[#174C3C] text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-xs"
                      >
                        {actionLoading === item.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Claim for NGO</span>
                          </>
                        )}
                      </button>

                      {isNgo && (
                        <button
                          onClick={() => handleRejectDonation(item.id)}
                          className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition"
                          title="Decline this donation"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                      <span className="text-slate-500 text-[11px]">
                        Status: <strong>{item.status}</strong>
                      </span>
                      <button
                        onClick={() => onNavigate('logistics')}
                        className="text-[#2E8059] font-bold hover:underline flex items-center space-x-1 text-[11px]"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Route →</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Publish Surplus Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2ECE5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-[#174C3C] flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-[#2E8059]" />
                Publish Verified Surplus Food
              </h3>
              <button onClick={() => setShowPublishModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Food Item Name *</label>
                <input
                  type="text"
                  required
                  value={newSurplus.food_name}
                  onChange={(e) => setNewSurplus({ ...newSurplus, food_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category *</label>
                  <select
                    value={newSurplus.category}
                    onChange={(e) => setNewSurplus({ ...newSurplus, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                  >
                    <option value="Cooked Meals">Cooked Meals</option>
                    <option value="Bakery & Breads">Bakery & Breads</option>
                    <option value="Fresh Produce">Fresh Produce</option>
                    <option value="Dairy">Dairy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={newSurplus.contact_phone}
                    onChange={(e) => setNewSurplus({ ...newSurplus, contact_phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Portions (Meals) *</label>
                  <input
                    type="number"
                    required
                    value={newSurplus.portions}
                    onChange={(e) => setNewSurplus({ ...newSurplus, portions: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Approx Weight (kg) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newSurplus.quantity_kg}
                    onChange={(e) => setNewSurplus({ ...newSurplus, quantity_kg: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pickup Location & Address *</label>
                <input
                  type="text"
                  required
                  value={newSurplus.pickup_address}
                  onChange={(e) => setNewSurplus({ ...newSurplus, pickup_address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Preparation Time</label>
                  <input
                    type="text"
                    value={newSurplus.prep_datetime}
                    onChange={(e) => setNewSurplus({ ...newSurplus, prep_datetime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Pickup Deadline (Safe Window) *</label>
                  <input
                    type="text"
                    required
                    value={newSurplus.pickup_deadline}
                    onChange={(e) => setNewSurplus({ ...newSurplus, pickup_deadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="safetyCheck"
                  checked={newSurplus.safety_verified}
                  onChange={(e) => setNewSurplus({ ...newSurplus, safety_verified: e.target.checked })}
                  className="w-4 h-4 text-[#2E8059] rounded accent-[#2E8059]"
                />
                <label htmlFor="safetyCheck" className="text-emerald-900 font-semibold cursor-pointer">
                  FSSAI Food Safety Verified: Food is freshly cooked, hygienic, and safe for human consumption.
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2E8059] hover:bg-[#174C3C] text-white font-bold transition shadow-xs"
                >
                  Publish to NGO Network
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
