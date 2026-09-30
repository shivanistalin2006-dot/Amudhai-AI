import React from 'react';
import { 
  LayoutDashboard, Package, Sparkles, BarChart3, 
  QrCode, FileText, ChevronLeft, ChevronRight, Leaf 
} from 'lucide-react';
import { ZeroPlateLogo } from './ZeroPlateLogo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  alertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  alertCount,
}) => {
  // Exactly the 6 core tabs requested by user
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Package,
      badge: null,
    },
    {
      id: 'insights',
      label: 'Smart Insights',
      icon: Sparkles,
      badge: 'AI',
    },
    {
      id: 'analytics',
      label: 'Waste Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'qr',
      label: 'QR Traceability',
      icon: QrCode,
      badge: null,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 bg-white border-r border-slate-200 transition-all duration-300 flex flex-col justify-between ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Branding */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <ZeroPlateLogo size={36} className="rounded-xl flex-shrink-0 shadow-xs" />
              {!collapsed && (
                <div className="truncate">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-base tracking-tight text-slate-900">ZeroPlate</span>
                    <span className="font-extrabold text-base text-emerald-600">AI</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                    Smart Food Tech
                  </p>
                </div>
              )}
            </div>

            {/* Collapse toggle (desktop only) */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Items List */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition group ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition ${
                      isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between text-left truncate">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded bg-emerald-100 text-emerald-800">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Card */}
        {!collapsed && (
          <div className="p-3 m-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" /> SIH 2024 Demo
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Clean frontend prototype demonstration with zero backend dependencies.
            </p>
          </div>
        )}
      </aside>
    </>
  );
};
