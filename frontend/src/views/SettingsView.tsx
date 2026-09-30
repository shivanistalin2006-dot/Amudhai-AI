import React from 'react';
import { 
  Settings, UserCheck, ShieldCheck, Database, 
  Cpu, KeyRound, Globe, CheckCircle2, Building 
} from 'lucide-react';
import { User } from '../api';
import { ZeroPlateLogo } from '../components/ZeroPlateLogo';

interface SettingsViewProps {
  currentUser: User;
  onSwitchUser: (username: string, role: string) => void;
  lang: 'en' | 'ta';
  setLang: (lang: 'en' | 'ta') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  onSwitchUser,
  lang,
  setLang,
}) => {
  const credentials = [
    { role: 'Institution Admin', username: 'kitchen_admin', pass: 'admin123', org: 'Loyola College Mega Mess' },
    { role: 'NGO / Food Bank', username: 'ngo_user', pass: 'ngo123', org: 'Akshaya Food Bank Chennai' },
    { role: 'Delivery Partner', username: 'delivery_driver', pass: 'driver123', org: 'GreenExpress Eco-Van' },
    { role: 'Platform Admin', username: 'platform_admin', pass: 'super123', org: 'ZeroPlate Ecosystem HQ' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-[#E2ECE5] shadow-xs relative overflow-hidden flex items-start gap-4">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#174C3C] via-[#D5AD58] to-[#2E8059]" />
        <div className="hidden sm:block p-2 bg-[#F7F8F2] rounded-2xl border border-[#D5AD58]/40 shadow-xs shrink-0">
          <ZeroPlateLogo size={42} />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#174C3C] text-white border border-[#D5AD58]/40">
              ZeroPlate AI Platform
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2E8059]/10 text-[#2E8059]">
              Smart Food. Zero Waste.
            </span>
            <span className="text-xs text-slate-500">v2.4.0 Live</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#174C3C] mt-1.5 tracking-tight">
            {lang === 'en' ? 'Platform Settings & Ecosystem Architecture' : 'தள அமைப்புகள் & கட்டமைப்பு'}
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            AI-Powered Smart Food Waste Reduction and Sustainable Redistribution Ecosystem. Manage organization credentials, access policies, and backend telemetry endpoints.
          </p>
        </div>
      </div>

      {/* Active User Card */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#174C3C] flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#2E8059]" />
          Active Session Identity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-[#F7F8F2] border border-[#E2ECE5]">
            <span className="text-slate-400 block text-[10px]">Organization Name</span>
            <span className="font-bold text-slate-800 text-sm">{currentUser.organization_name}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F8F2] border border-[#E2ECE5]">
            <span className="text-slate-400 block text-[10px]">Access Role</span>
            <span className="font-bold text-[#2E8059] uppercase tracking-wider text-sm">{currentUser.role}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F8F2] border border-[#E2ECE5]">
            <span className="text-slate-400 block text-[10px]">Username</span>
            <span className="font-semibold text-slate-700">{currentUser.username}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F8F2] border border-[#E2ECE5]">
            <span className="text-slate-400 block text-[10px]">Email Contact</span>
            <span className="font-semibold text-slate-700">{currentUser.email}</span>
          </div>
        </div>
      </div>

      {/* Demo Credentials Reference */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-[#174C3C] flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#2E8059]" />
            Sample Role Credentials for Demonstration
          </h3>
          <span className="text-[11px] text-slate-400">One-click switch available</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8F2] border-b border-[#E2ECE5] text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-3 py-2.5">Role</th>
                <th className="px-3 py-2.5">Organization</th>
                <th className="px-3 py-2.5">Username</th>
                <th className="px-3 py-2.5">Password</th>
                <th className="px-3 py-2.5 text-right">Switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {credentials.map((c) => (
                <tr key={c.username} className="hover:bg-slate-50 transition">
                  <td className="px-3 py-2.5 font-bold text-[#174C3C]">{c.role}</td>
                  <td className="px-3 py-2.5 text-slate-600">{c.org}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-800">{c.username}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-500">{c.pass}</td>
                  <td className="px-3 py-2.5 text-right">
                    <button
                      onClick={() => onSwitchUser(c.username, c.role.toLowerCase().includes('institution') ? 'institution' : c.role.toLowerCase().includes('ngo') ? 'ngo' : c.role.toLowerCase().includes('delivery') ? 'delivery' : 'admin')}
                      className="px-2.5 py-1 rounded-lg bg-[#C6E6D2]/40 hover:bg-[#2E8059] text-[#174C3C] hover:text-white font-bold text-[11px] transition"
                    >
                      Login as this
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backend & AI Health Status */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs space-y-3 text-xs">
        <h3 className="text-sm font-bold text-[#174C3C] flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#2E8059]" />
          Backend & AI Engine Verification
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="font-bold text-emerald-900 block">FastAPI Backend</span>
            <span className="text-[11px] text-emerald-700">Port 8000 • Operational</span>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
            <span className="font-bold text-blue-900 block">SQLAlchemy & SQLite DB</span>
            <span className="text-[11px] text-blue-700">zeroplate.db • Persistent</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <span className="font-bold text-amber-900 block">Scikit-Learn ML Regressor</span>
            <span className="text-[11px] text-amber-700">Model v1.4 • Trained</span>
          </div>
        </div>
      </div>
    </div>
  );
};
