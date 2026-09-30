import React from 'react';
import { 
  Bell, Menu, Home, Sparkles, AlertTriangle, 
  ExternalLink, CheckCircle2 
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onToggleMobile: () => void;
  onOpenAlerts: () => void;
  onGoToLanding: () => void;
  alertCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onToggleMobile,
  onOpenAlerts,
  onGoToLanding,
  alertCount,
}) => {
  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { 
      title: 'Ecosystem Dashboard', 
      subtitle: 'Real-time institutional food inventory & waste prevention metrics' 
    },
    inventory: { 
      title: 'Smart Food Inventory', 
      subtitle: 'First-Expiry, First-Out (FEFO) batch tracking and kitchen rotation' 
    },
    insights: { 
      title: 'AI Smart Inventory Intelligence', 
      subtitle: 'Simulated machine learning recommendations & automated menu substitutions' 
    },
    analytics: { 
      title: 'Waste Analytics & Impact', 
      subtitle: 'Historical waste reduction trends, category breakdown & savings' 
    },
    qr: { 
      title: 'Smart Batch Passport & QR Traceability', 
      subtitle: 'Digital food batch authentication & farm-to-fork origin' 
    },
    reports: { 
      title: 'Audit & Compliance Reports', 
      subtitle: 'Audit-ready food utilization and economic conservation statements' 
    },
  };

  const current = tabTitles[activeTab] || { 
    title: 'ZeroPlate AI', 
    subtitle: 'Smart Food Inventory. Less Waste. More Impact.' 
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight leading-tight">
            {current.title}
          </h1>
          <p className="hidden sm:block text-[11px] text-slate-400 font-medium">
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Alerts Button */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center gap-1.5"
          title="Food waste alerts"
        >
          <Bell className="w-4 h-4 text-slate-600" />
          {alertCount > 0 && (
            <span className="flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs">
              {alertCount}
            </span>
          )}
          <span className="hidden md:inline text-xs font-semibold text-slate-700">
            Alerts
          </span>
        </button>

        {/* SIH Status Tag */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>SIH #26234</span>
        </div>

        {/* Return to Landing Button */}
        <button
          onClick={onGoToLanding}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          title="Return to Presentation Landing Page"
        >
          <Home className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Landing</span>
        </button>

      </div>

    </header>
  );
};
