import React from 'react';
import { 
  Package, AlertTriangle, TrendingDown, DollarSign, 
  ShieldCheck, ArrowRight, Sparkles, Clock, CheckCircle2,
  Calendar, Building, ChevronRight, Activity
} from 'lucide-react';
import { InventoryItem, SmartInsight, recentActivities, reportSummary } from '../mockData';

interface DashboardViewProps {
  inventory: InventoryItem[];
  insights: SmartInsight[];
  onNavigate: (tab: string) => void;
  onOpenAlerts: () => void;
  onSelectBatch: (item: InventoryItem) => void;
  onToast: (msg: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  inventory,
  insights,
  onNavigate,
  onOpenAlerts,
  onSelectBatch,
  onToast,
}) => {
  // Calculations from inventory state
  const totalKg = inventory.reduce((acc, curr) => acc + (curr.unit === 'kg' ? curr.quantity : curr.quantity * 1.03), 0);
  const expiringSoonCount = inventory.filter(i => i.status === 'Expiring Soon' || i.status === 'High Risk').length;
  const highRiskCount = inventory.filter(i => i.status === 'High Risk').length;

  return (
    <div className="space-y-6">
      
      {/* High-Risk Food Waste Alert Banner (Requirement #7 & #2) */}
      {highRiskCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 font-bold">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 text-sm">
                  ⚠️ {expiringSoonCount} batches require immediate attention
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  Critical
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Spinach & Milk batches near 24h threshold. Cook tonight to avoid ₹6,200 loss.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAlerts}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 transition flex items-center gap-1 shadow-xs"
            >
              Review Actions <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top 5 KPI Cards (Requirement #2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI 1: Total Food Inventory */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Total Food Inventory</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {Math.round(totalKg).toLocaleString()} <span className="text-sm font-medium text-slate-500">kg</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> {inventory.length} active batches
          </div>
        </div>

        {/* KPI 2: Items Expiring Soon */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Expiring Soon (&lt;3d)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-900 tracking-tight">
            {expiringSoonCount} <span className="text-sm font-medium text-slate-500">batches</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" /> 135 kg needs FEFO burn
          </div>
        </div>

        {/* KPI 3: Waste Prevented */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Waste Prevented</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {reportSummary.foodConsumedKg - reportSummary.foodWastedKg > 0 ? '1,420' : '980'} <span className="text-sm font-medium text-slate-500">kg</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-teal-700 font-semibold">
            <span className="font-bold">+{reportSummary.wasteReductionRate}%</span> reduction vs base
          </div>
        </div>

        {/* KPI 4: Cost Saved */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Estimated Cost Saved</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-800 tracking-tight">
            ₹{(reportSummary.costSavedInr / 1000).toFixed(1)}k
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
            <span>Verified grocery savings</span>
          </div>
        </div>

        {/* KPI 5: Food Waste Risk */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Food Waste Risk</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Low Risk <span className="text-xs font-bold text-emerald-600">(13.2%)</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '13.2%' }}></div>
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: AI Recommendations & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): AI Smart Insights Showcase */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Top AI Kitchen Insights</h3>
              </div>
              <button
                onClick={() => onNavigate('insights')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                View All ({insights.length}) <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {insights.slice(0, 3).map((ins) => (
                <div 
                  key={ins.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 hover:border-emerald-200 transition space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-800">{ins.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ins.category === 'Urgent' 
                        ? 'bg-rose-100 text-rose-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {ins.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{ins.description}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-semibold text-emerald-800">
                      💡 {ins.recommendedAction}
                    </span>
                    <button
                      onClick={() => onToast(`Applied recommendation: "${ins.recommendedAction}"`)}
                      className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-white border border-emerald-300 rounded-md hover:bg-emerald-50 transition"
                    >
                      Apply Action
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>FEFO Kitchen Engine v2.4 Active</span>
            <button
              onClick={() => onNavigate('inventory')}
              className="font-semibold text-emerald-700 hover:underline"
            >
              Open Smart Inventory Table →
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): Small Recent Activity Section */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Recent Kitchen Activity</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Live Feed</span>
            </div>

            <div className="space-y-4">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{act.title}</span>
                      <span className="text-[10px] text-slate-400">{act.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-900">QR Traceability Ready</p>
                <p className="text-[11px] text-emerald-700">Scan batch passports for full farm origin</p>
              </div>
              <button
                onClick={() => onNavigate('qr')}
                className="px-3 py-1.5 text-xs font-bold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition"
              >
                Inspect QR
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
