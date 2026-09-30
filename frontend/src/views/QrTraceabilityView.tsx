import React, { useState } from 'react';
import { 
  QrCode, ShieldCheck, MapPin, Calendar, Thermometer, 
  Building, CheckCircle2, ArrowRight, Eye, RefreshCw, Printer 
} from 'lucide-react';
import { InventoryItem } from '../mockData';

interface QrTraceabilityViewProps {
  inventory: InventoryItem[];
  onSelectBatch: (item: InventoryItem) => void;
  onToast: (msg: string) => void;
}

export const QrTraceabilityView: React.FC<QrTraceabilityViewProps> = ({
  inventory,
  onSelectBatch,
  onToast,
}) => {
  // Default to sample batch BATCH-1042 (Requirement #6)
  const defaultBatch = inventory.find(i => i.batchId === 'BATCH-1042') || inventory[0];
  const [selectedBatch, setSelectedBatch] = useState<InventoryItem>(defaultBatch);
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);

  const handleSimulateScan = () => {
    setIsSimulatingScan(true);
    setTimeout(() => {
      setIsSimulatingScan(false);
      onSelectBatch(selectedBatch);
      onToast(`QR Scan Verified: Batch ${selectedBatch.batchId} authenticated via cryptographic hash!`);
    }, 700);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Smart Batch Passport</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 border border-cyan-300">
              QR Traceability Demo
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Farm-to-fork origin verification, storage telemetry & digital inspection compliance
          </p>
        </div>

        {/* Quick Batch Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Switch Sample Batch:</label>
          <select
            value={selectedBatch.batchId}
            onChange={(e) => {
              const b = inventory.find(i => i.batchId === e.target.value);
              if (b) setSelectedBatch(b);
            }}
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {inventory.map(item => (
              <option key={item.id} value={item.batchId}>
                {item.batchId} - {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Showcase Card (Sample Batch BATCH-1042) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left: Large Visual Styled QR Code Card */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200/80 rounded-2xl text-center space-y-4">
            
            <div className="relative p-4 bg-white rounded-2xl shadow-md border border-slate-200">
              {/* Scaled Crisp Vector QR code */}
              <svg className="w-48 h-48" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* 3 Corner Alignment Targets */}
                <rect x="8" y="8" width="34" height="34" rx="4" fill="#0F172A" />
                <rect x="14" y="14" width="22" height="22" fill="white" />
                <rect x="18" y="18" width="14" height="14" rx="2" fill="#059669" />

                <rect x="78" y="8" width="34" height="34" rx="4" fill="#0F172A" />
                <rect x="84" y="14" width="22" height="22" fill="white" />
                <rect x="88" y="18" width="14" height="14" rx="2" fill="#059669" />

                <rect x="8" y="78" width="34" height="34" rx="4" fill="#0F172A" />
                <rect x="14" y="84" width="22" height="22" fill="white" />
                <rect x="18" y="88" width="14" height="14" rx="2" fill="#059669" />

                {/* Simulated Data Points Matrix */}
                <rect x="48" y="10" width="6" height="6" fill="#0F172A" />
                <rect x="58" y="10" width="8" height="6" fill="#059669" />
                <rect x="48" y="22" width="8" height="6" fill="#0F172A" />
                <rect x="68" y="18" width="6" height="8" fill="#0F172A" />
                <rect x="52" y="32" width="14" height="6" fill="#0F172A" />

                <rect x="10" y="48" width="6" height="14" fill="#059669" />
                <rect x="24" y="52" width="8" height="6" fill="#0F172A" />
                <rect x="36" y="48" width="6" height="12" fill="#0F172A" />
                
                {/* Center Tech Node Logo */}
                <rect x="46" y="46" width="28" height="28" rx="6" fill="#059669" />
                <circle cx="60" cy="60" r="8" fill="white" />
                <circle cx="60" cy="60" r="4" fill="#059669" />

                <rect x="82" y="48" width="8" height="6" fill="#0F172A" />
                <rect x="96" y="52" width="8" height="14" fill="#059669" />
                <rect x="82" y="66" width="16" height="6" fill="#0F172A" />

                <rect x="48" y="82" width="6" height="8" fill="#0F172A" />
                <rect x="60" y="86" width="12" height="6" fill="#059669" />
                <rect x="48" y="98" width="14" height="6" fill="#0F172A" />
                <rect x="74" y="90" width="8" height="12" fill="#0F172A" />
                <rect x="86" y="84" width="8" height="8" fill="#059669" />
                <rect x="98" y="94" width="8" height="8" fill="#0F172A" />
              </svg>
            </div>

            <div>
              <div className="font-mono text-sm font-bold text-slate-800">{selectedBatch.batchId}</div>
              <p className="text-xs text-slate-400">Digital Food Safety Batch Identifier</p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full pt-1">
              <button
                onClick={handleSimulateScan}
                disabled={isSimulatingScan}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingScan ? 'animate-spin' : ''}`} />
                {isSimulatingScan ? 'Verifying...' : 'Simulate Scan'}
              </button>
              <button
                onClick={() => onSelectBatch(selectedBatch)}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Eye className="w-3.5 h-3.5" /> View Passport
              </button>
            </div>

          </div>

          {/* Right: Detailed Batch Specifications (Requirement #6) */}
          <div className="md:col-span-7 space-y-4">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  Verified Batch Profile
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                  {selectedBatch.name}
                </h3>
                <span className="text-xs text-slate-500">
                  Category: <strong>{selectedBatch.category}</strong> • Net Quantity: <strong>{selectedBatch.quantity} {selectedBatch.unit}</strong>
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                selectedBatch.status === 'Fresh'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : selectedBatch.status === 'Expiring Soon'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {selectedBatch.status} ({selectedBatch.expiryDaysRemaining} days remaining)
              </span>
            </div>

            {/* Spec items grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                  <Building className="w-3.5 h-3.5 text-emerald-600" /> Supplier & Farm Name
                </div>
                <div className="font-bold text-slate-800 text-sm">{selectedBatch.supplier}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Source Location
                </div>
                <div className="font-bold text-slate-800 text-sm">{selectedBatch.sourceLocation}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Received Date
                </div>
                <div className="font-bold text-slate-800 text-sm">{selectedBatch.receivedDate}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" /> Expiry Date
                </div>
                <div className="font-bold text-slate-800 text-sm">{selectedBatch.expiryDate}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-cyan-600" /> Storage Temperature
                </div>
                <div className="font-bold text-cyan-700 text-sm">{selectedBatch.storageTemp}</div>
                <div className="text-[10px] text-slate-400">{selectedBatch.storageCondition}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Current Safety Status
                </div>
                <div className="font-bold text-slate-800 text-sm">FSSAI Certified Safe</div>
                <div className="text-[10px] text-slate-400">Zero microbiological flags</div>
              </div>

            </div>

            {/* Action recommendation banner */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
              <span className="font-bold text-amber-900 block mb-0.5">FEFO Kitchen Priority:</span>
              <p className="text-slate-700">{selectedBatch.recommendedAction}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-mono">
                Cryptographic Passport Hash: 7f83b165...
              </span>
              <button
                onClick={() => onToast(`Batch passport #${selectedBatch.batchId} sent to printer!`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                <Printer className="w-3.5 h-3.5" /> Print QR Badge
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
