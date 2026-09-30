import React from 'react';
import { X, AlertTriangle, ArrowRight, ShieldAlert, Check } from 'lucide-react';
import { InventoryItem } from '../mockData';

interface AlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
  onSelectBatch: (item: InventoryItem) => void;
  onToast: (msg: string) => void;
}

export const AlertsDrawer: React.FC<AlertsDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onSelectBatch,
  onToast,
}) => {
  if (!isOpen) return null;

  // Filter high-risk and near-expiry items
  const alertItems = items.filter(
    (item) => item.status === 'High Risk' || item.status === 'Expiring Soon'
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-4 bg-amber-500/10 border-b border-amber-200/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Food Waste Alerts</h3>
                <p className="text-xs text-amber-900 font-medium">
                  {alertItems.length} batches require immediate attention
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Alert List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Proactive Waste Prevention:</span> Immediate kitchen action prevents landfill decay and recovers food cost before microbial expiration.
            </div>

            {alertItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50/70 transition space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono text-slate-500">{item.batchId}</span>
                    <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                    {item.expiryDaysRemaining} Day{item.expiryDaysRemaining > 1 ? 's' : ''} Left
                  </span>
                </div>

                <div className="text-xs text-slate-600 grid grid-cols-2 gap-2 bg-white/70 p-2.5 rounded-lg border border-rose-100">
                  <div>
                    <span className="text-slate-400">Remaining:</span>{' '}
                    <strong className="text-slate-800">{item.quantity} {item.unit}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Storage:</span>{' '}
                    <strong className="text-slate-800">{item.storageTemp}</strong>
                  </div>
                </div>

                <div className="text-xs text-amber-950 bg-amber-50 border border-amber-200 p-2.5 rounded-lg">
                  <div className="font-semibold text-amber-900 flex items-center gap-1 mb-0.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-700" /> Recommended Action:
                  </div>
                  <p className="text-slate-700">{item.recommendedAction}</p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      onToast(`Menu substitution scheduled for ${item.name}! Chef notified.`);
                    }}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" /> Apply to Today's Menu
                  </button>
                  <button
                    onClick={() => {
                      onSelectBatch(item);
                      onClose();
                    }}
                    className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition flex items-center gap-1"
                  >
                    Passport <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>FEFO Policy Active</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
