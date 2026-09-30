import React from 'react';
import { 
  LayoutDashboard, TrendingUp, Package, ShieldAlert, 
  UtensilsCrossed, Users, Truck, Factory, Leaf, Settings, 
  ChevronLeft, ChevronRight, Menu 
} from 'lucide-react';
import { User } from '../api';
import { ZeroPlateLogo } from './ZeroPlateLogo';

interface SidebarProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  lang: 'en' | 'ta';
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  lang,
}) => {
  const allNavItems = [
    {
      id: 'dashboard',
      label: { en: 'Dashboard', ta: 'முகப்பு' },
      icon: LayoutDashboard,
      roles: ['institution', 'ngo', 'delivery', 'admin'],
    },
    {
      id: 'forecast',
      label: { en: 'AI Demand Forecast', ta: 'AI உணவு தேவை' },
      icon: TrendingUp,
      roles: ['institution', 'admin'],
    },
    {
      id: 'inventory',
      label: { en: 'Food Inventory', ta: 'சரக்கு மேலாண்மை' },
      icon: Package,
      roles: ['institution', 'admin'],
    },
    {
      id: 'quality',
      label: { en: 'Food Quality Monitor', ta: 'உணவு தர ஆய்வு' },
      icon: ShieldAlert,
      roles: ['institution', 'admin'],
    },
    {
      id: 'surplus',
      label: { en: 'Surplus Food', ta: 'உபரி உணவு சந்தை' },
      icon: UtensilsCrossed,
      roles: ['institution', 'ngo', 'delivery', 'admin'],
    },
    {
      id: 'ngos',
      label: { en: 'NGO Network', ta: 'தன்னார்வ நெட்வொர்க்' },
      icon: Users,
      roles: ['institution', 'ngo', 'admin'],
    },
    {
      id: 'logistics',
      label: { en: 'Smart Logistics', ta: 'தளவாடம் & விநியோகம்' },
      icon: Truck,
      roles: ['institution', 'ngo', 'delivery', 'admin'],
    },
    {
      id: 'processing',
      label: { en: 'Food Processing', ta: 'பதப்படுத்தும் பிரிவு' },
      icon: Factory,
      roles: ['institution', 'admin'],
    },
    {
      id: 'sustainability',
      label: { en: 'Sustainability Reports', ta: 'நிலைத்தன்மை அறிக்கை' },
      icon: Leaf,
      roles: ['institution', 'ngo', 'delivery', 'admin'],
    },
    {
      id: 'settings',
      label: { en: 'Settings', ta: 'அமைப்புகள்' },
      icon: Settings,
      roles: ['institution', 'ngo', 'delivery', 'admin'],
    },
  ];

  const filteredNavItems = allNavItems.filter((item) =>
    item.roles.includes(currentUser.role)
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#174C3C] text-white transition-all duration-300 ease-in-out border-r border-[#1B2B24] ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#2E8059]/30">
          <div className="flex items-center space-x-3 overflow-hidden">
            <ZeroPlateLogo size={36} theme="dark" />
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-base tracking-wide text-white flex items-center gap-1.5">
                  ZEROPLATE <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-[#2E8059] text-white border border-[#D5AD58]/40">AI</span>
                </span>
                <span className="text-[10px] text-[#D5AD58] font-semibold tracking-wide truncate">
                  Smart Food. Zero Waste.
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-[#C6E6D2] hover:text-white hover:bg-[#2E8059]/40 transition"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#2E8059] text-white shadow-sm ring-1 ring-[#C6E6D2]/30'
                    : 'text-[#C6E6D2]/80 hover:text-white hover:bg-[#2E8059]/30'
                }`}
                title={collapsed ? item.label[lang] : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#D5AD58]' : 'text-[#C6E6D2]'}`} />
                {!collapsed && (
                  <span className="ml-3 truncate">{item.label[lang]}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mission Footer */}
        {!collapsed && (
          <div className="p-3.5 mx-3 mb-4 rounded-xl bg-[#2E8059]/25 border border-[#D5AD58]/30 text-center shadow-xs">
            <p className="text-[11px] font-bold text-[#D5AD58] tracking-wide">
              "Smart Food. Zero Waste."
            </p>
            <p className="text-[9px] text-[#C6E6D2]/80 mt-1">
              ZeroPlate AI Autonomous Network
            </p>
          </div>
        )}
      </aside>
    </>
  );
};
