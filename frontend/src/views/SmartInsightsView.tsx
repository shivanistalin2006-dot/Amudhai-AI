import React, { useState } from 'react';
import { 
  Sparkles, RefreshCw, AlertTriangle, ArrowRight, 
  CheckCircle2, TrendingUp, ShieldCheck, Clock, Lightbulb 
} from 'lucide-react';
import { SmartInsight } from '../mockData';

interface SmartInsightsViewProps {
  insights: SmartInsight[];
  onApplyAction: (insight: SmartInsight) => void;
  onToast: (msg: string) => void;
}

export const SmartInsightsView: React.FC<SmartInsightsViewProps> = ({
  insights,
  onApplyAction,
  onToast,
}) => {
  const [filter, setFilter] = useState<'All' | 'Urgent' | 'Optimization' | 'Consumption'>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onToast('AI inventory analysis recomputed successfully with latest pantry telemetry!');
    }, 800);
  };

  const filteredInsights = filter === 'All' 
    ? insights 
    : insights.filter(ins => ins.category === filter);

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Smart Inventory Intelligence
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Simulated AI Model
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Predictive consumption velocity, microbial time-decay analysis & automated menu suggestions
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs transition"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Analyzing Pantry...' : 'Refresh AI Analysis'}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['All', 'Urgent', 'Optimization', 'Consumption'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              filter === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat} {cat === 'All' ? `(${insights.length})` : ''}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInsights.map((ins) => (
          <div
            key={ins.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                  ins.category === 'Urgent'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : ins.category === 'Optimization'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                }`}>
                  {ins.category === 'Urgent' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {ins.category === 'Optimization' && <ShieldCheck className="w-3.5 h-3.5" />}
                  {ins.category === 'Consumption' && <TrendingUp className="w-3.5 h-3.5" />}
                  {ins.category} Recommendation
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{ins.timestamp}</span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                {ins.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {ins.description}
              </p>

              {/* Action Box */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                    Suggested Action:
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-0.5">
                    {ins.recommendedAction}
                  </div>
                </div>
              </div>

            </div>

            {/* Card Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-700">
                ✨ {ins.impact}
              </span>
              <button
                onClick={() => onApplyAction(ins)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
              >
                Apply Action <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Educational Banner for SIH Judges */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <span>
            <strong>SIH Jury Note:</strong> Recommendations simulate an autonomous machine learning loop combining batch arrival timestamps, academic calendar demand curves, and thermodynamic shelf-life half-life modeling.
          </span>
        </div>
      </div>

    </div>
  );
};
