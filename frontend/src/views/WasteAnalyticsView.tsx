import React from 'react';
import { 
  TrendingDown, DollarSign, Leaf, Award, 
  BarChart3, Calendar, PieChart, ArrowUpRight 
} from 'lucide-react';
import { weeklyWasteData, monthlyWasteData, categoryWasteData, reportSummary } from '../mockData';

interface WasteAnalyticsViewProps {
  onToast: (msg: string) => void;
}

export const WasteAnalyticsView: React.FC<WasteAnalyticsViewProps> = ({ onToast }) => {
  const maxWeeklyKg = Math.max(...weeklyWasteData.map(d => d.preventedKg));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Waste Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Empirical food waste reduction telemetry, category breakdown & cost savings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            Term Waste Reduction: {reportSummary.wasteReductionRate}%
          </span>
        </div>
      </div>

      {/* Top Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Weekly Waste Prevented</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            740 <span className="text-sm font-medium text-slate-500">kg</span>
          </div>
          <div className="mt-1 text-xs text-emerald-700 font-semibold">
            Across 14 institutional batches
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Financial Savings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-800">
            ₹{reportSummary.costSavedInr.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-emerald-700 font-semibold">
            Based on ₹120/kg baseline cost
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Avoided CO₂e Emissions</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {(reportSummary.co2eAvoidedKg / 1000).toFixed(2)} <span className="text-sm font-medium text-slate-500">Tonnes</span>
          </div>
          <div className="mt-1 text-xs text-teal-700 font-semibold">
            2.5 kg CO₂e / kg food diverted
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Waste Reduction Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            {reportSummary.wasteReductionRate}%
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Compared to pre-AI semester baseline
          </div>
        </div>

      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Weekly Food Waste vs. Prevented</h3>
              <p className="text-xs text-slate-400">Past 7 days waste audit (Kilograms)</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Prevented
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-400 inline-block" /> Leftover
              </span>
            </div>
          </div>

          {/* Clean presentation-friendly SVG bar chart */}
          <div className="h-60 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
            {weeklyWasteData.map((d) => {
              const prevHeight = Math.round((d.preventedKg / maxWeeklyKg) * 160);
              const wasteHeight = Math.round((d.wasteKg / maxWeeklyKg) * 160);

              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-44">
                    {/* Prevented Bar */}
                    <div 
                      className="w-1/2 max-w-[24px] bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition relative cursor-pointer"
                      style={{ height: `${prevHeight}px` }}
                      title={`${d.day}: ${d.preventedKg} kg prevented`}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none transition whitespace-nowrap">
                        {d.preventedKg} kg
                      </div>
                    </div>
                    {/* Waste Bar */}
                    <div 
                      className="w-1/2 max-w-[24px] bg-rose-300 rounded-t-md hover:bg-rose-400 transition relative cursor-pointer"
                      style={{ height: `${wasteHeight}px` }}
                      title={`${d.day}: ${d.wasteKg} kg waste`}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none transition whitespace-nowrap">
                        {d.wasteKg} kg
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-600">{d.day}</span>
                </div>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
            <span>Average daily prevention: <strong>105 kg</strong></span>
            <span className="text-emerald-700 font-semibold">Consistently beating 80% prevention target</span>
          </div>
        </div>

        {/* Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Waste Breakdown by Category</h3>
            <p className="text-xs text-slate-400">Distribution across active pantry segments</p>
          </div>

          <div className="space-y-4 pt-2">
            {categoryWasteData.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{cat.category}</span>
                  <span className="font-mono text-slate-500 font-semibold">{cat.percentage}% ({cat.kg} kg)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mt-4">
            <span className="font-semibold text-slate-800">Primary Insight:</span> Vegetables represent 38% of total losses due to improper moisture control. FEFO menu alerts address 85% of this volume.
          </div>
        </div>

      </div>

      {/* Monthly Reduction Trajectory */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">6-Month Waste Reduction Trajectory</h3>
            <p className="text-xs text-slate-400">Monthly total institutional waste (kg) before vs. after ZeroPlate AI</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            -738 kg Monthly Reduction
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-2">
          {monthlyWasteData.map((m) => (
            <div key={m.month} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-center">
              <div className="text-xs font-bold text-slate-700">{m.month} 2026</div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400 line-through">{m.beforeSystemKg} kg</div>
                <div className="text-base font-extrabold text-emerald-700">{m.withZeroPlateKg} kg</div>
              </div>
              <div className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 py-0.5 rounded">
                -{Math.round(((m.beforeSystemKg - m.withZeroPlateKg) / m.beforeSystemKg) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
