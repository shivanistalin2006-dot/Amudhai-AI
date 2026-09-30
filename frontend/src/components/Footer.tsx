import React from 'react';
import { ZeroPlateLogo } from './ZeroPlateLogo';
import { Leaf, ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

interface FooterProps {
  lang: 'en' | 'ta';
  onNavigate?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate }) => {
  return (
    <footer className="mt-12 border-t border-[#E2ECE5] bg-white/80 backdrop-blur-sm text-slate-700 transition">
      {/* Top Subtle Golden Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#174C3C] via-[#D5AD58] to-[#2E8059]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <ZeroPlateLogo size={36} />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-[#174C3C] tracking-tight">ZeroPlate</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#2E8059] text-white border border-[#D5AD58]/50">
                    AI
                  </span>
                </div>
                <p className="text-[11px] font-bold text-[#D5AD58] tracking-wider uppercase">
                  Smart Food. Zero Waste.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-md">
              AI-Powered Smart Food Waste Reduction and Sustainable Redistribution Ecosystem.
              Connecting institutional dining, food banks, and cold-chain fleets into a zero-waste autonomous network.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#C6E6D2]/40 text-[#174C3C] border border-[#2E8059]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E8059] animate-pulse" />
                AI Demand Forecasting Live
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-50 text-[#174C3C] border border-[#D5AD58]/40">
                <ShieldCheck className="w-3 h-3 text-[#D5AD58]" />
                FSSAI 4-Hour Safety Protocol
              </span>
            </div>
          </div>

          {/* Quick Ecosystem Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#174C3C] uppercase tracking-wider">
              {lang === 'en' ? 'Core Modules' : 'முக்கிய பிரிவுகள்'}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onNavigate?.('forecast')}
                  className="hover:text-[#2E8059] transition flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#D5AD58]" />
                  ML Demand Forecaster
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('inventory')}
                  className="hover:text-[#2E8059] transition"
                >
                  Smart FEFO Inventory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('surplus')}
                  className="hover:text-[#2E8059] transition"
                >
                  Surplus Marketplace
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('logistics')}
                  className="hover:text-[#2E8059] transition"
                >
                  Autonomous Dispatch & Fleet
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('sustainability')}
                  className="hover:text-[#2E8059] transition"
                >
                  UNEP ESG Carbon Report
                </button>
              </li>
            </ul>
          </div>

          {/* Environmental Mission & Standards */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#174C3C] uppercase tracking-wider">
              {lang === 'en' ? 'Impact Standards' : 'தாக்க அளவீடுகள்'}
            </h4>
            <div className="p-3 rounded-2xl bg-[#F7F8F2] border border-[#E2ECE5] space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center justify-between font-semibold text-[#174C3C]">
                <span>CO2e Avoided</span>
                <span className="text-[#2E8059]">2.5 kg/kg</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-[#174C3C]">
                <span>Water Conserved</span>
                <span className="text-[#2E8059]">1,500 L/kg</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-[#174C3C]">
                <span>Value Saved</span>
                <span className="text-[#D5AD58]">₹120/kg</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              Validated against UNEP Food Waste Index & FAO 2026 Sustainability Benchmarks.
            </p>
          </div>
        </div>

        {/* Bottom Copyright & Credit Row */}
        <div className="mt-8 pt-4 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 ZeroPlate AI. All Rights Reserved. • Smart Food. Zero Waste.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[11px]">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Zero Food Waste
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
