import React from 'react';
import { X, QrCode, ShieldCheck, MapPin, Calendar, Thermometer, Building, CheckCircle2, Printer } from 'lucide-react';
import { InventoryItem } from '../mockData';

interface BatchPassportModalProps {
  item: InventoryItem | null;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const BatchPassportModal: React.FC<BatchPassportModalProps> = ({ item, onClose, onToast }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-lg">Smart Batch Passport</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Verified Traceability
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">FSSAI Batch ID: {item.batchId}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* Top highlight card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl">
            <div>
              <span className="text-xs text-emerald-800 font-medium">Ingredient Name</span>
              <p className="text-lg font-bold text-slate-900">{item.name}</p>
              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-white text-slate-600 font-medium border border-slate-200">
                {item.category}
              </span>
            </div>
            <div>
              <span className="text-xs text-emerald-800 font-medium">Stock Quantity</span>
              <p className="text-lg font-bold text-slate-900">{item.quantity} {item.unit}</p>
              <p className="text-xs text-slate-500">Net certified weight</p>
            </div>
            <div>
              <span className="text-xs text-emerald-800 font-medium">Current Status</span>
              <div className="mt-1">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  item.status === 'Fresh' 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : item.status === 'Expiring Soon'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    item.status === 'Fresh' ? 'bg-emerald-500' : item.status === 'Expiring Soon' ? 'bg-amber-500' : 'bg-rose-500'
                  }`} />
                  {item.status} ({item.expiryDaysRemaining} days left)
                </span>
              </div>
            </div>
          </div>

          {/* QR Code and Farm Origin Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Visual QR Code Card */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div className="relative p-3 bg-white rounded-lg shadow-sm border border-slate-200">
                {/* SVG QR Code Simulation */}
                <svg className="w-36 h-36" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer corner squares */}
                  <rect x="10" y="10" width="30" height="30" rx="4" fill="#0F172A" />
                  <rect x="16" y="16" width="18" height="18" fill="white" />
                  <rect x="20" y="20" width="10" height="10" rx="1" fill="#059669" />

                  <rect x="80" y="10" width="30" height="30" rx="4" fill="#0F172A" />
                  <rect x="86" y="16" width="18" height="18" fill="white" />
                  <rect x="90" y="20" width="10" height="10" rx="1" fill="#059669" />

                  <rect x="10" y="80" width="30" height="30" rx="4" fill="#0F172A" />
                  <rect x="16" y="86" width="18" height="18" fill="white" />
                  <rect x="20" y="90" width="10" height="10" rx="1" fill="#059669" />

                  {/* Mock Data matrix points */}
                  <rect x="48" y="12" width="6" height="6" fill="#0F172A" />
                  <rect x="58" y="12" width="6" height="6" fill="#059669" />
                  <rect x="48" y="24" width="6" height="6" fill="#0F172A" />
                  <rect x="66" y="24" width="6" height="6" fill="#0F172A" />
                  <rect x="54" y="34" width="12" height="6" fill="#0F172A" />

                  <rect x="12" y="48" width="6" height="12" fill="#059669" />
                  <rect x="26" y="52" width="6" height="6" fill="#0F172A" />
                  <rect x="36" y="48" width="6" height="12" fill="#0F172A" />
                  
                  <rect x="48" y="48" width="8" height="8" rx="2" fill="#10B981" />
                  <rect x="62" y="48" width="6" height="6" fill="#0F172A" />
                  <rect x="52" y="60" width="12" height="6" fill="#0F172A" />
                  <rect x="70" y="56" width="6" height="10" fill="#059669" />

                  <rect x="82" y="48" width="8" height="6" fill="#0F172A" />
                  <rect x="98" y="52" width="6" height="12" fill="#0F172A" />
                  <rect x="84" y="66" width="14" height="6" fill="#059669" />

                  <rect x="48" y="82" width="6" height="6" fill="#0F172A" />
                  <rect x="60" y="86" width="10" height="6" fill="#0F172A" />
                  <rect x="48" y="96" width="12" height="6" fill="#059669" />
                  <rect x="72" y="90" width="6" height="12" fill="#0F172A" />
                  <rect x="86" y="86" width="8" height="8" fill="#0F172A" />
                  <rect x="100" y="94" width="6" height="6" fill="#059669" />
                </svg>
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-600">Scan via Smartphone App</p>
              <p className="text-[11px] text-slate-400">SIH Traceability Prototype</p>
            </div>

            {/* Traceability Details */}
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <Building className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-400 font-medium">Certified Supplier & Farm</div>
                  <div className="text-sm font-semibold text-slate-800">{item.supplier}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-400 font-medium">Source Location</div>
                  <div className="text-sm font-semibold text-slate-800">{item.sourceLocation}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Received Date
                  </div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">{item.receivedDate}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" /> Expiry Date
                  </div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">{item.expiryDate}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <Thermometer className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-400 font-medium">Storage Location & Telemetry</div>
                  <div className="text-sm font-semibold text-slate-800">
                    {item.storageCondition} • <span className="text-cyan-700 font-bold">{item.storageTemp}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Action Recommendation Callout */}
          {item.recommendedAction && (
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                  AI Action Recommendation
                </span>
                <p className="text-sm text-amber-900 mt-0.5 font-medium">
                  {item.recommendedAction}
                </p>
              </div>
            </div>
          )}

          {/* Compliance stamps */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Cryptographic Integrity Verified (SHA-256)
            </span>
            <span>ZeroPlate AI v2.4</span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={() => onToast(`Batch passport #${item.batchId} sent to print queue.`)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition"
          >
            <Printer className="w-4 h-4" /> Print Label
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
