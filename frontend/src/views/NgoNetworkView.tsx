import React, { useState, useEffect } from 'react';
import { 
  Users, Search, ShieldCheck, MapPin, Phone, 
  Utensils, Sparkles, Building, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { api } from '../api';

interface NgoNetworkViewProps {
  onNavigate: (tab: string) => void;
  lang: 'en' | 'ta';
}

export const NgoNetworkView: React.FC<NgoNetworkViewProps> = ({ onNavigate, lang }) => {
  const [ngos, setNgos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedListingForMatch, setSelectedListingForMatch] = useState<number>(1);
  const [matches, setMatches] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  const loadNgos = async () => {
    setLoading(true);
    try {
      const data = await api.getNgos();
      setNgos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMatches = async (listingId: number) => {
    setLoadingMatches(true);
    try {
      const res = await api.getNgoMatches(listingId);
      setMatches(res.matches || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    loadNgos();
    loadMatches(1);
  }, []);

  const filteredNgos = ngos.filter((ngo) => {
    const matchesSearch = ngo.name.toLowerCase().includes(search.toLowerCase()) || 
                          ngo.address.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || ngo.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2E8059]/10 text-[#2E8059]">
              Verified NGO Partner Directory
            </span>
            <span className="text-xs text-slate-500">Autonomous Geo-Dispatch</span>
          </div>
          <h2 className="text-xl font-bold text-[#174C3C] mt-1">
            {lang === 'en' ? 'NGO Network & AI Smart Matching Engine' : 'தன்னார்வ நெட்வொர்க் & AI பொருத்த அமைப்பு'}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Transparently match kitchen surplus to nearby charities, food banks, and community shelters based on proximity and capacity.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-600 bg-[#F7F8F2] px-3 py-1.5 rounded-xl border border-[#E2ECE5]">
            Verified NGOs: <strong>{ngos.length}</strong>
          </span>
        </div>
      </div>

      {/* AI Smart Matcher Highlight Card */}
      <div className="bg-gradient-to-r from-[#174C3C] to-[#2E8059] rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur shrink-0">
              <Sparkles className="w-5 h-5 text-[#D5AD58]" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide">
                AI Smart Matching Algorithm in Action
              </h3>
              <p className="text-xs text-[#C6E6D2]">
                Ranked by distance (35%), category compatibility (25%), daily capacity (20%), and verification status (20%).
              </p>
            </div>
          </div>

          <div className="text-xs flex items-center space-x-2">
            <span className="text-[#C6E6D2]">Matching For:</span>
            <select
              value={selectedListingForMatch}
              onChange={(e) => {
                const id = Number(e.target.value);
                setSelectedListingForMatch(id);
                loadMatches(id);
              }}
              className="bg-[#174C3C] border border-[#C6E6D2]/40 rounded-xl px-2.5 py-1 text-white text-xs font-semibold focus:outline-none"
            >
              <option value={1}>Surplus #1: Veg Biryani (60 portions)</option>
              <option value={2}>Surplus #2: Sambar Rice (80 portions)</option>
            </select>
          </div>
        </div>

        {/* Matches Horizontal Scroll / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {loadingMatches ? (
            <div className="col-span-full py-4 text-center text-xs text-[#C6E6D2]">
              Calculating optimal NGO matches...
            </div>
          ) : (
            matches.slice(0, 3).map((m, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur rounded-xl p-3.5 border border-white/15 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white text-sm">{m.ngo_name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#D5AD58] text-slate-900 font-extrabold text-[10px]">
                      {m.match_score}% Match
                    </span>
                  </div>
                  <p className="text-[11px] text-[#C6E6D2] line-clamp-1">{m.address}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.match_reasons?.map((r: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-black/20 text-[#C6E6D2] text-[10px]">
                        ✓ {r}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-[#C6E6D2]">{m.distance_km} km away</span>
                  <button
                    onClick={() => onNavigate('surplus')}
                    className="text-[#D5AD58] font-bold hover:underline"
                  >
                    View in Marketplace →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Directory Filter & Search */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2ECE5] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex-1 w-full md:max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search NGO name, location, or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E2ECE5] bg-[#F7F8F2] focus:outline-none focus:ring-2 focus:ring-[#2E8059]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#E2ECE5] bg-[#F7F8F2] font-semibold text-slate-700"
          >
            <option value="all">All Organization Types</option>
            <option value="Food Bank">Food Bank</option>
            <option value="Shelter">Shelter</option>
            <option value="Community Kitchen">Community Kitchen</option>
            <option value="Orphanage">Orphanage</option>
          </select>
        </div>
      </div>

      {/* NGO Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            Loading NGO directory...
          </div>
        ) : filteredNgos.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            No NGOs match the search criteria.
          </div>
        ) : (
          filteredNgos.map((ngo) => (
            <div key={ngo.id} className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {ngo.type}
                    </span>
                    <h3 className="text-sm font-bold text-[#174C3C] mt-0.5">
                      {ngo.name}
                    </h3>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    <ShieldCheck className="w-3 h-3 mr-1 text-[#2E8059]" />
                    Verified
                  </span>
                </div>

                <div className="mt-3.5 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span className="truncate">{ngo.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{ngo.phone} ({ngo.contact_person})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Utensils className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Daily Capacity: <strong>{ngo.capacity_meals_daily} meals/day</strong></span>
                  </div>
                </div>

                <div className="mt-3 p-2.5 bg-[#F7F8F2] rounded-xl border border-[#E2ECE5] text-[11px] text-slate-600">
                  <strong className="text-slate-700">Accepted Food:</strong> {ngo.accepted_categories}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold text-[11px]">Ready for Dispatch</span>
                <button
                  onClick={() => onNavigate('surplus')}
                  className="px-3 py-1.5 rounded-xl bg-[#2E8059]/10 hover:bg-[#2E8059] text-[#2E8059] hover:text-white font-bold transition text-[11px]"
                >
                  Allocate Food →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
