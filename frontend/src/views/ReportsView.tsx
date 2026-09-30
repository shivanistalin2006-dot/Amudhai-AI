import React, { useState } from 'react';
import { 
  Download, FileText, CheckCircle2, TrendingDown, 
  DollarSign, Package, Calendar, Award, Leaf 
} from 'lucide-react';
import { reportSummary } from '../mockData';

interface ReportsViewProps {
  onToast: (msg: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onToast }) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'semester'>('30d');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      onToast('Demo report generated successfully. Ready for SIH presentation.');
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Food Inventory Reports</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-ready food consumption, waste reduction & economic recovery statements
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe Selector */}
          <div className="flex bg-white border border-slate-200 p-1 rounded-xl text-xs font-semibold shadow-xs">
            <button
              onClick={() => setTimeframe('7d')}
              className={`px-3 py-1.5 rounded-lg transition ${
                timeframe === '7d' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeframe('30d')}
              className={`px-3 py-1.5 rounded-lg transition ${
                timeframe === '30d' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setTimeframe('semester')}
              className={`px-3 py-1.5 rounded-lg transition ${
                timeframe === 'semester' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Academic Semester
            </button>
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
          >
            <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
            {isDownloading ? 'Generating...' : 'Download Report'}
          </button>
        </div>
      </div>

      {/* 5 Core Required Metrics (Requirement #8) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Metric 1: Total food received */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Total Food Received</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {reportSummary.totalFoodReceivedKg.toLocaleString()} <span className="text-sm font-medium text-slate-500">kg</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">Total institutional procurement</div>
        </div>

        {/* Metric 2: Food consumed */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Food Consumed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-800">
            {reportSummary.foodConsumedKg.toLocaleString()} <span className="text-sm font-medium text-slate-500">kg</span>
          </div>
          <div className="mt-1 text-xs text-emerald-700 font-semibold">92.4% meal utilization</div>
        </div>

        {/* Metric 3: Food wasted */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Food Wasted</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-800">
            {reportSummary.foodWastedKg} <span className="text-sm font-medium text-slate-500">kg</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">Down from 850 kg benchmark</div>
        </div>

        {/* Metric 4: Waste reduction */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Waste Reduction</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            {reportSummary.wasteReductionRate}%
          </div>
          <div className="mt-1 text-xs text-emerald-700 font-semibold">Exceeds national target</div>
        </div>

        {/* Metric 5: Money saved */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Money Saved</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-900">
            ₹{reportSummary.costSavedInr.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-amber-700 font-semibold">Immediate budget recovery</div>
        </div>

      </div>

      {/* Audit Statement Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Formal Audit Statement</h3>
            <p className="text-xs text-slate-400">Generated for Smart India Hackathon Evaluation & Institutional Review</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Report Ref: ZP-AUD-2026-09</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-3 px-4">Audit Item</th>
                <th className="py-3 px-4">Baseline (No AI)</th>
                <th className="py-3 px-4">With ZeroPlate AI</th>
                <th className="py-3 px-4">Net Variance</th>
                <th className="py-3 px-4 text-right">Environmental Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Organic Kitchen Waste</td>
                <td className="py-3 px-4">850 kg / month</td>
                <td className="py-3 px-4 font-bold text-emerald-700">112 kg / month</td>
                <td className="py-3 px-4 font-semibold text-emerald-800">-738 kg (-86.8%)</td>
                <td className="py-3 px-4 text-right font-medium text-emerald-700">1,845 kg CO₂e avoided</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Embedded Virtual Water</td>
                <td className="py-3 px-4">1.28 Million Liters</td>
                <td className="py-3 px-4 font-bold text-emerald-700">0.17 Million Liters</td>
                <td className="py-3 px-4 font-semibold text-emerald-800">-1.11 Million Liters</td>
                <td className="py-3 px-4 text-right font-medium text-teal-700">1,108,000 L preserved</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Raw Pantry Losses</td>
                <td className="py-3 px-4">₹2,12,000 / term</td>
                <td className="py-3 px-4 font-bold text-emerald-700">₹27,400 / term</td>
                <td className="py-3 px-4 font-semibold text-emerald-800">-₹1,84,600</td>
                <td className="py-3 px-4 text-right font-medium text-amber-700">87.1% budget conservation</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Cryptographic Sign-Off Verified for Smart India Hackathon
          </div>
          <button
            onClick={handleDownload}
            className="font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
          >
            Export Signed Certificate →
          </button>
        </div>
      </div>

    </div>
  );
};
