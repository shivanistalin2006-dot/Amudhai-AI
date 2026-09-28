import React, { useState } from 'react';
import { 
  Bell, Check, ChevronDown, LogOut, ShieldCheck, 
  Sparkles, ExternalLink, RefreshCw 
} from 'lucide-react';
import { User } from '../api';

interface NavbarProps {
  currentUser: User;
  onSwitchUser: (username: string, role: string) => void;
  activeTab: string;
  notifications: any[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onRefreshData: () => void;
  lang: 'en' | 'ta';
  setLang: (lang: 'en' | 'ta') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchUser,
  activeTab,
  notifications,
  unreadCount,
  onMarkAllRead,
  onRefreshData,
  lang,
  setLang,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const getPageTitle = (tab: string) => {
    const titles: Record<string, { en: string; ta: string }> = {
      dashboard: { en: 'Dashboard & Eco-Metrics', ta: 'முகப்பு & சுற்றுச்சூழல் அளவீடுகள்' },
      forecast: { en: 'AI Demand Forecasting', ta: 'AI உணவு தேவை முன்கணிப்பு' },
      inventory: { en: 'Smart FEFO Inventory', ta: 'அறிவார்ந்த உணவு சரக்கு மேலாண்மை' },
      quality: { en: 'Food Quality & IoT Sensors', ta: 'உணவு தரம் & IoT சென்சார்கள்' },
      surplus: { en: 'Surplus Food Marketplace', ta: 'உபரி உணவு & மறுபகிர்வு சந்தை' },
      ngos: { en: 'NGO Network & Smart Matching', ta: 'தன்னார்வ அமைப்புகள் & AI பொருத்தம்' },
      logistics: { en: 'Smart Logistics & Dispatch', ta: 'நுண்ணறிவு தளவாடம் & நேரலை கண்காணிப்பு' },
      processing: { en: 'Food Processing Units', ta: 'உணவு பதப்படுத்தும் பிரிவு மேலாண்மை' },
      sustainability: { en: 'Sustainability & ESG Report', ta: 'நிலைத்தன்மை & ESG அறிக்கைகள்' },
      settings: { en: 'Platform Settings', ta: 'அமைப்புகள்' }
    };
    return titles[tab] ? titles[tab][lang] : 'AMUDHAI Platform';
  };

  const demoAccounts = [
    { role: 'institution', username: 'kitchen_admin', label: 'Loyola College Mega Mess', sub: 'Institution Admin' },
    { role: 'ngo', username: 'ngo_user', label: 'Akshaya Food Bank Chennai', sub: 'Verified NGO' },
    { role: 'delivery', username: 'delivery_driver', label: 'Murugan K. (GreenExpress)', sub: 'Delivery Fleet' },
    { role: 'admin', username: 'platform_admin', label: 'Amudhai Ecosystem Admin', sub: 'Platform HQ' },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/95 backdrop-blur border-b border-[#E2ECE5] shadow-xs">
      {/* Left: Active Page Title */}
      <div className="flex items-center space-x-3">
        <h1 className="text-lg md:text-xl font-bold text-[#174C3C] tracking-tight">
          {getPageTitle(activeTab)}
        </h1>
        <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#C6E6D2]/50 text-[#174C3C] border border-[#2E8059]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E8059] mr-1.5 animate-pulse"></span>
          AI Engine Active
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-3">
        {/* Language Switcher */}
        <button
          onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#E2ECE5] bg-[#F7F8F2] text-[#174C3C] hover:bg-[#C6E6D2]/40 transition"
          title="Switch Language"
        >
          {lang === 'en' ? 'தமிழ்' : 'English'}
        </button>

        {/* Refresh Data */}
        <button
          onClick={onRefreshData}
          className="p-2 text-slate-500 hover:text-[#174C3C] hover:bg-slate-100 rounded-lg transition"
          title="Refresh Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowRoleMenu(false);
            }}
            className="relative p-2 text-slate-600 hover:text-[#174C3C] hover:bg-slate-100 rounded-lg transition"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D5AD58] text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-[#E2ECE5] py-2 z-50">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <span className="font-semibold text-sm text-[#174C3C]">In-App Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={onMarkAllRead}
                    className="text-xs text-[#2E8059] hover:underline font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`px-4 py-3 hover:bg-[#F7F8F2] transition text-left ${!n.is_read ? 'bg-[#C6E6D2]/10' : ''}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{n.title}</span>
                        {!n.is_read && <span className="w-2 h-2 rounded-full bg-[#2E8059]"></span>}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Demo Role Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowNotifMenu(false);
            }}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-[#C6E6D2] bg-[#F7F8F2] hover:bg-[#C6E6D2]/30 transition text-left"
          >
            <div className="w-7 h-7 rounded-full bg-[#174C3C] text-white flex items-center justify-center font-bold text-xs">
              {currentUser.organization_name.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-[#174C3C] truncate max-w-[140px]">
                {currentUser.organization_name}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                {currentUser.role}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#E2ECE5] py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Quick Switch Demo Role
                </span>
              </div>
              {demoAccounts.map((acc) => (
                <button
                  key={acc.username}
                  onClick={() => {
                    onSwitchUser(acc.username, acc.role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs transition ${
                    currentUser.username === acc.username ? 'bg-[#C6E6D2]/30 text-[#174C3C] font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <p className="font-semibold">{acc.label}</p>
                    <p className="text-[10px] text-slate-500">{acc.sub}</p>
                  </div>
                  {currentUser.username === acc.username && <Check className="w-4 h-4 text-[#2E8059]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
