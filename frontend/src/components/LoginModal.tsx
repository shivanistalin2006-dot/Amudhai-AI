import React, { useState } from 'react';
import { X, Lock, User as UserIcon, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { ZeroPlateLogo } from './ZeroPlateLogo';
import { User } from '../api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSwitchUser: (username: string, role: string) => void;
  lang: 'en' | 'ta';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSwitchUser,
  lang,
}) => {
  const [username, setUsername] = useState(currentUser.username);
  const [password, setPassword] = useState('admin123');

  if (!isOpen) return null;

  const demoAccounts = [
    {
      role: 'institution',
      roleLabel: 'Institution Admin',
      username: 'kitchen_admin',
      pass: 'admin123',
      org: 'Loyola College Mega Mess',
      badge: 'Demand Forecast & Surplus',
    },
    {
      role: 'ngo',
      roleLabel: 'NGO / Food Bank',
      username: 'ngo_user',
      pass: 'ngo123',
      org: 'Akshaya Food Bank Chennai',
      badge: 'Real-time Meal Matching',
    },
    {
      role: 'delivery',
      roleLabel: 'Delivery Fleet',
      username: 'delivery_driver',
      pass: 'driver123',
      org: 'GreenExpress Eco-Van 01',
      badge: 'GPS Route Dispatch',
    },
    {
      role: 'admin',
      roleLabel: 'Platform Administrator',
      username: 'platform_admin',
      pass: 'super123',
      org: 'ZeroPlate Ecosystem HQ',
      badge: 'Full Telemetry & ESG',
    },
  ];

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = demoAccounts.find((a) => a.username === username);
    if (found) {
      onSwitchUser(found.username, found.role);
    } else {
      onSwitchUser(username, 'institution');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#E2ECE5] max-w-lg w-full overflow-hidden flex flex-col relative">
        {/* Top Accent Bar with Gold / Emerald Gradient */}
        <div className="h-2 w-full bg-gradient-to-r from-[#174C3C] via-[#2E8059] to-[#D5AD58]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header / Brand identity */}
        <div className="p-6 md:p-8 pb-4 text-center flex flex-col items-center">
          <div className="p-3 bg-[#F7F8F2] rounded-2xl border border-[#D5AD58]/40 shadow-xs mb-3 ring-4 ring-[#C6E6D2]/30">
            <ZeroPlateLogo size={56} theme="light" />
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <h2 className="text-2xl font-extrabold text-[#174C3C] tracking-tight">ZeroPlate</h2>
            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[#2E8059] text-white border border-[#D5AD58]/50 shadow-xs">
              AI
            </span>
          </div>

          <p className="text-xs font-bold tracking-widest text-[#D5AD58] uppercase mt-1">
            Smart Food. Zero Waste.
          </p>

          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            AI-Powered Smart Food Waste Reduction and Sustainable Redistribution Ecosystem
          </p>
        </div>

        {/* Content Tabs / Body */}
        <div className="px-6 md:px-8 pb-8 space-y-5">
          {/* Quick 1-Click Role Logins */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D5AD58]" />
                {lang === 'en' ? 'Quick Sign-In by Role' : 'ஒரு கிளிக்கில் உள்நுழைக'}
              </span>
              <span className="text-[10px] text-[#2E8059] font-semibold bg-[#C6E6D2]/40 px-2 py-0.5 rounded-full">
                Demo Auth
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoAccounts.map((acc) => {
                const isActive = currentUser.username === acc.username;
                return (
                  <button
                    key={acc.username}
                    type="button"
                    onClick={() => {
                      onSwitchUser(acc.username, acc.role);
                      onClose();
                    }}
                    className={`p-3 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                      isActive
                        ? 'border-[#2E8059] bg-[#C6E6D2]/25 ring-2 ring-[#2E8059]/20'
                        : 'border-[#E2ECE5] bg-[#F7F8F2] hover:bg-emerald-50/50 hover:border-[#2E8059]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#174C3C]">{acc.roleLabel}</span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-[#2E8059] ring-2 ring-[#2E8059]/30" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium truncate mt-0.5">{acc.org}</p>
                    </div>
                    <span className="text-[10px] text-[#2E8059] font-medium mt-2 flex items-center justify-between pt-1 border-t border-slate-200/50">
                      {acc.badge}
                      <ArrowRight className="w-3 h-3 text-[#D5AD58]" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleManualSubmit} className="pt-3 border-t border-slate-100 space-y-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'en' ? 'Or Enter Credentials' : 'அல்லது கணக்கு விவரங்களை உள்ளிடவும்'}
            </div>

            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E2ECE5] bg-[#F7F8F2] focus:outline-none focus:ring-2 focus:ring-[#2E8059] focus:bg-white transition"
              />
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E2ECE5] bg-[#F7F8F2] focus:outline-none focus:ring-2 focus:ring-[#2E8059] focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#174C3C] hover:bg-[#2E8059] text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2 border border-[#D5AD58]/40"
            >
              <ShieldCheck className="w-4 h-4 text-[#D5AD58]" />
              {lang === 'en' ? 'Sign In to ZeroPlate AI' : 'ஜீரோபிளேட் தளத்தில் நுழைக'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
