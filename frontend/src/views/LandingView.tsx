import React from 'react';
import { 
  ArrowRight, ShieldCheck, Sparkles, QrCode, 
  BarChart3, CheckCircle2, Leaf, Clock, TrendingDown 
} from 'lucide-react';
import { ZeroPlateLogo } from '../components/ZeroPlateLogo';

interface LandingViewProps {
  onGetStarted: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 flex flex-col justify-between">
      
      {/* Top Bar */}
      <header className="max-w-6xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ZeroPlateLogo size={38} className="rounded-xl shadow-xs" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">ZeroPlate</span>
              <span className="font-extrabold text-xl text-emerald-600">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium -mt-1">Smart Food Tech</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SIH 2024 Finalist Prototype
          </span>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition"
          >
            Open Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto w-full px-6 py-12 flex-1 flex flex-col justify-center">
        
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-800 border border-emerald-300 shadow-xs">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            AI-Powered Smart Food Inventory & Waste Reduction
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Smart Food Inventory. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
              Less Waste. More Impact.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            ZeroPlate AI transforms institutional kitchens through predictive First-Expiry, First-Out (FEFO) inventory tracking, simulated AI menu repurposing, and digital QR batch traceability.
          </p>

          {/* Action CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
            <span className="text-xs text-slate-400 font-medium">
              Live Demo • Frontend-Only Interactive Prototype
            </span>
          </div>

        </div>

        {/* Feature Cards Grid (Demonstrating the SIH Presentation Story) */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Smart FEFO Inventory</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Prioritizes food batches by expiry date so near-expiry items are cooked first, preventing spoilage before it happens.
            </p>
            <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-4 h-4" /> 75% raw pantry loss reduction
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">AI Action Insights</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generates instant culinary recommendations—like altering tomorrow’s menu to use near-expiry country tomatoes for rasam.
            </p>
            <div className="text-xs text-amber-700 font-semibold flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-4 h-4" /> Real-time menu repurposing
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
              <QrCode className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Smart Batch Passports</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete digital traceability from farm source to institutional kitchen with verified storage temperature logs and QR verification.
            </p>
            <div className="text-xs text-cyan-700 font-semibold flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-4 h-4" /> End-to-end food safety
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full px-6 py-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          ZeroPlate AI • Smart India Hackathon Presentation Prototype
        </div>
        <div className="flex items-center gap-4">
          <span>Problem ID: 26234</span>
          <span>•</span>
          <span className="text-emerald-700 font-semibold">Zero Hardware / Pure Software UI</span>
        </div>
      </footer>

    </div>
  );
};
