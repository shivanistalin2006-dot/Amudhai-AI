import React, { useState } from 'react';
import { 
  TrendingDown, TrendingUp, Utensils, AlertTriangle, 
  CheckCircle2, DollarSign, CloudRain, Sparkles, Filter, 
  Calendar, Building2, PackageCheck, Truck 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { ZeroPlateLogo } from '../components/ZeroPlateLogo';

interface DashboardViewProps {
  summaryData: any;
  loading: boolean;
  onNavigate: (tab: string) => void;
  lang: 'en' | 'ta';
}

const COLORS = ['#2E8059', '#D5AD58', '#4F46E5', '#EF4444', '#06B6D4'];

export const DashboardView: React.FC<DashboardViewProps> = ({
  summaryData,
  loading,
  onNavigate,
  lang,
}) => {
  const [dateFilter, setDateFilter] = useState('7days');
  const [mealFilter, setMealFilter] = useState('all');
  const [instFilter, setInstFilter] = useState('all');

  if (loading || !summaryData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#2E8059] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Loading ZeroPlate AI Live Ecosystem Data...</p>
        </div>
      </div>
    );
  }

  const { kpis, charts, live_activities } = summaryData;

  const kpiCards = [
    {
      title: lang === 'en' ? 'Meals Prepared' : 'தயாரிக்கப்பட்ட உணவுகள்',
      value: kpis.total_prepared.toLocaleString(),
      sub: lang === 'en' ? 'Institutional kitchens' : 'மைய சமையலறைகள்',
      icon: Utensils,
      color: 'text-[#174C3C]',
      bg: 'bg-[#C6E6D2]/30',
      border: 'border-[#C6E6D2]',
    },
    {
      title: lang === 'en' ? 'Meals Consumed' : 'உட்கொள்ளப்பட்ட உணவுகள்',
      value: kpis.total_consumed.toLocaleString(),
      sub: `${((kpis.total_consumed / Math.max(1, kpis.total_prepared)) * 100).toFixed(1)}% consumption rate`,
      icon: CheckCircle2,
      color: 'text-[#2E8059]',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
    },
    {
      title: lang === 'en' ? 'Food Waste Generated' : 'உணவு கழிவு (கிலோ)',
      value: `${kpis.waste_generated_kg} kg`,
      sub: lang === 'en' ? 'Target: <15 kg/day' : 'இலக்கு: <15 கிலோ/நாள்',
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    {
      title: lang === 'en' ? 'Food Redistributed' : 'மறுபகிர்வு செய்யப்பட்ட உணவு',
      value: `${kpis.redistributed_kg} kg`,
      sub: `${kpis.meals_delivered} meals fed to communities`,
      icon: PackageCheck,
      color: 'text-emerald-700',
      bg: 'bg-emerald-100/60',
      border: 'border-emerald-300',
    },
    {
      title: lang === 'en' ? 'CO2e Emissions Avoided' : 'தவிர்க்கப்பட்ட CO2 உமிழ்வு',
      value: `${kpis.co2e_avoided_kg} kg`,
      sub: lang === 'en' ? 'UNEP factor 2.5 kg/kg' : 'சுற்றுச்சூழல் பாதுகாப்பு',
      icon: CloudRain,
      color: 'text-teal-700',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
    },
    {
      title: lang === 'en' ? 'Economic Value Saved' : 'சேமிக்கப்பட்ட மதிப்பு',
      value: `₹${kpis.money_saved_inr.toLocaleString()}`,
      sub: lang === 'en' ? 'Based on ₹120/kg meal rate' : 'வளங்கள் சேமிப்பு',
      icon: DollarSign,
      color: 'text-[#D5AD58]',
      bg: 'bg-amber-50/80',
      border: 'border-amber-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Filters */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-[#E2ECE5] shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative overflow-hidden">
        {/* Subtle decorative golden/emerald accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#174C3C] via-[#D5AD58] to-[#2E8059]" />

        <div className="flex items-start gap-4">
          <div className="hidden sm:block p-2 bg-[#F7F8F2] rounded-2xl border border-[#D5AD58]/40 shadow-xs ring-2 ring-[#C6E6D2]/30 shrink-0">
            <ZeroPlateLogo size={46} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#174C3C] text-[#F7F8F2] border border-[#D5AD58]/50 flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 text-[#D5AD58]" />
                ZeroPlate AI
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C6E6D2]/50 text-[#174C3C]">
                Smart Food. Zero Waste.
              </span>
              <span className="text-xs text-slate-400">Live Synchronized Telemetry</span>
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-[#174C3C] mt-1.5 tracking-tight">
              {lang === 'en' ? 'Ecosystem Sustainability & Redistribution Hub' : 'உணவு கழிவு தடுப்பு & மறுபகிர்வு மேலாண்மை'}
            </h2>

            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              AI-Powered Smart Food Waste Reduction and Sustainable Redistribution Ecosystem. Real-time telemetry from Loyola Mega Mess, Hotel Annapoorna, and verified NGO food banks.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#F7F8F2] border border-[#E2ECE5] rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <select 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-slate-700 font-medium"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="today">Today's Cycle</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#F7F8F2] border border-[#E2ECE5] rounded-xl">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <select 
              value={instFilter} 
              onChange={(e) => setInstFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-slate-700 font-medium"
            >
              <option value="all">All Institutions</option>
              <option value="loyola">Loyola Mega Mess</option>
              <option value="annapoorna">Hotel Annapoorna Grand</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#F7F8F2] border border-[#E2ECE5] rounded-xl">
            <Utensils className="w-3.5 h-3.5 text-slate-500" />
            <select 
              value={mealFilter} 
              onChange={(e) => setMealFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-slate-700 font-medium"
            >
              <option value="all">All Meal Cycles</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div 
              key={i} 
              className={`p-4 rounded-2xl bg-white border ${card.border} shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 leading-tight">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-lg ${card.bg}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <div className="mt-2.5">
                <span className="text-xl font-extrabold text-[#174C3C] tracking-tight">
                  {card.value}
                </span>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                  {card.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Production vs Consumption Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#174C3C]">
                Daily Food Production vs. Actual Consumption
              </h3>
              <p className="text-xs text-slate-500">
                Track production efficiency and overproduction gap over recent cycles.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('forecast')}
              className="flex items-center space-x-1 text-xs font-semibold text-[#2E8059] hover:underline"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run AI Forecast</span>
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.daily_production} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2ECE5', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="prepared" name="Meals Prepared" fill="#174C3C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="consumed" name="Meals Consumed" fill="#2E8059" radius={[4, 4, 0, 0]} />
                <Bar dataKey="waste_kg" name="Waste (kg)" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste Breakdown by Category */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#174C3C]">
              Food Waste by Category
            </h3>
            <p className="text-xs text-slate-500 mb-2">
              Composition of preventable kitchen & plate waste.
            </p>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.waste_by_category}
                  dataKey="percentage"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {charts.waste_by_category.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2ECE5', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {charts.waste_by_category.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="text-slate-600 truncate">{item.category}: <strong>{item.percentage}%</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Waste Trend & Live Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waste Trend vs Target Benchmark */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#174C3C]">
                Waste Trend & FSSAI Target Benchmark
              </h3>
              <p className="text-xs text-slate-500">
                Daily waste generation (kg) plotted against target reduction benchmark (10 kg).
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              ↓ 34.8% Reduction Rate
            </span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.waste_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E8059" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2E8059" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2ECE5', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="waste" name="Waste (kg)" stroke="#2E8059" strokeWidth={2} fillOpacity={1} fill="url(#wasteGrad)" />
                <Area type="monotone" dataKey="target" name="Target Benchmark (kg)" stroke="#D5AD58" strokeDasharray="4 4" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Ecosystem Activity Stream */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#174C3C]">
              Live Ecosystem Stream
            </h3>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-56 pr-1">
            {live_activities.map((act: any, idx: number) => (
              <div key={idx} className="p-2.5 rounded-xl bg-[#F7F8F2] border border-[#E2ECE5] text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#174C3C]">{act.title}</span>
                  <span className="text-[10px] text-slate-400">{act.time}</span>
                </div>
                <p className="text-slate-600 mt-1 line-clamp-2">{act.desc}</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    {act.status}
                  </span>
                  <button 
                    onClick={() => onNavigate(act.type === 'surplus' ? 'surplus' : 'logistics')}
                    className="text-[10px] text-[#2E8059] font-medium hover:underline"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Donation Fulfillment: <strong>92.4%</strong></span>
            <button 
              onClick={() => onNavigate('surplus')}
              className="text-[#2E8059] font-semibold hover:underline"
            >
              Open Surplus Marketplace →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
