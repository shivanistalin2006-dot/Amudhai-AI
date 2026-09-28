import React from 'react';
import { 
  Settings, UserCheck, ShieldCheck, Database, 
  Cpu, KeyRound, Globe, CheckCircle2, Building 
} from 'lucide-react';
import { User } from '../api';

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
    { role: 'Platform Admin', username: 'platform_admin', pass: 'super123', org: 'Amudhai Ecosystem HQ' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2E8059]/10 text-[#2E8059]">
            System Configuration
          </span>
          <span className="text-xs text-slate-500">Amudhai v2.4.0 Live</span>
        </div>
        <h2 className="text-xl font-bold text-[#174C3C] mt-1">
          {lang === 'en' ? 'Platform Settings & Ecosystem Architecture' : 'தள அமைப்புகள் & கட்டமைப்பு'}
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Manage organization credentials, role access policies, and backend telemetry endpoints.
        </p>
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
            <span className="text-[11px] text-blue-700">amudhai.db • Persistent</span>
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
