import React, { useState, useEffect } from 'react';
import { 
  Truck, MapPin, Clock, CheckCircle2, Navigation, 
  ArrowRight, ShieldCheck, UserCheck, Phone, Check, RefreshCw 
} from 'lucide-react';
import { api, User } from '../api';

interface LogisticsViewProps {
  currentUser: User;
  lang: 'en' | 'ta';
}

export const LogisticsView: React.FC<LogisticsViewProps> = ({ currentUser, lang }) => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [proofNotes, setProofNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadDeliveries = async () => {
    setLoading(true);
    try {
      const data = await api.getDeliveries();
      setDeliveries(data);
      if (data.length > 0 && !selectedDelivery) {
        setSelectedDelivery(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const handleStatusTransition = async (deliveryId: number, nextStatus: string) => {
    setUpdating(true);
    try {
      await api.updateDeliveryStatus(deliveryId, nextStatus, proofNotes || 'Status updated via ZeroPlate Delivery Fleet Portal.');
      await loadDeliveries();
      // Update selected
      const updated = deliveries.find(d => d.id === deliveryId);
      if (updated) {
        setSelectedDelivery({ ...updated, current_status: nextStatus });
      }
      setProofNotes('');
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const getNextStatusAction = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Assigned':
        return { next: 'Picked Up', label: 'Mark Food Picked Up from Kitchen', color: 'bg-amber-600 hover:bg-amber-700' };
      case 'Picked Up':
        return { next: 'In Transit', label: 'Start Transit to NGO Destination', color: 'bg-blue-600 hover:bg-blue-700' };
      case 'In Transit':
        return { next: 'Delivered', label: 'Confirm Food Handover & Delivery', color: 'bg-emerald-600 hover:bg-emerald-700' };
      case 'Delivered':
        return null;
      default:
        return null;
    }
  };

  const currentAction = selectedDelivery ? getNextStatusAction(selectedDelivery.current_status) : null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2E8059]/10 text-[#2E8059]">
              Smart Fleet Dispatch & Route Optimization
            </span>
            <span className="text-xs text-slate-500">Autonomous Cold-Chain Routing</span>
          </div>
          <h2 className="text-xl font-bold text-[#174C3C] mt-1">
            {lang === 'en' ? 'Smart Logistics & Live Delivery Tracking' : 'நுண்ணறிவு தளவாடம் & நேரலை கண்காணிப்பு'}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time route coordination between donor institutions, thermal EV fleet, and recipient shelters.
          </p>
        </div>

        <button
          onClick={loadDeliveries}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-[#E2ECE5] bg-[#F7F8F2] hover:bg-slate-100 text-xs font-bold text-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Fleet Telemetry</span>
        </button>
      </div>

      {/* Main Grid: Map & Dispatch Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Assignments List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-[#E2ECE5] shadow-xs">
            <h3 className="text-sm font-bold text-[#174C3C] mb-3 flex items-center justify-between">
              <span>Active Consignment Dispatches</span>
              <span className="text-[11px] font-normal text-slate-400">{deliveries.length} Consignments</span>
            </h3>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {loading ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading fleet assignments...</div>
              ) : deliveries.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">No active deliveries at the moment.</div>
              ) : (
                deliveries.map((d) => {
                  const isSelected = selectedDelivery?.id === d.id;
                  return (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDelivery(d)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition text-xs ${
                        isSelected 
                          ? 'border-[#2E8059] bg-[#C6E6D2]/15 ring-1 ring-[#2E8059]/40' 
                          : 'border-[#E2ECE5] bg-white hover:bg-[#F7F8F2]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-bold text-[#174C3C] text-sm">{d.food_name}</span>
                          <span className="block text-slate-500 text-[11px]">{d.portions} portions ({d.quantity_kg} kg)</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          d.current_status === 'Delivered' 
                            ? 'bg-purple-100 text-purple-800'
                            : d.current_status === 'In Transit'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {d.current_status}
                        </span>
                      </div>

                      <div className="mt-2.5 space-y-1 text-slate-600 text-[11px]">
                        <div className="flex items-center space-x-1.5 truncate">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                          <span className="truncate">From: {d.pickup_address}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 truncate">
                          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                          <span className="truncate">To: {d.dropoff_address}</span>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Driver: <strong>{d.driver_name}</strong></span>
                        <span className="font-semibold text-emerald-700">{d.est_distance_km} km ({d.est_duration_mins} mins)</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Route Telemetry & Action Workflow */}
        <div className="lg:col-span-7 space-y-5">
          {selectedDelivery ? (
            <>
              {/* Interactive Vector Route Map Visualization */}
              <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#174C3C] flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-[#2E8059]" />
                    Live Route Trajectory & GPS Telemetry
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Route: {selectedDelivery.route_summary || 'Optimized Urban Arterial Road'}
                  </span>
                </div>

                {/* Styled Vector Map Canvas */}
                <div className="h-64 rounded-xl bg-slate-900 relative overflow-hidden flex items-center justify-center p-6 border border-slate-800">
                  {/* Subtle Grid Lines */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#C6E6D2_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  
                  {/* SVG Route Line */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path
                      d="M 120 180 Q 280 60, 480 140"
                      fill="transparent"
                      stroke="#2E8059"
                      strokeWidth="4"
                      strokeDasharray="8 6"
                      className="animate-pulse"
                    />
                  </svg>

                  {/* Institution Origin Marker */}
                  <div className="absolute left-16 bottom-10 flex flex-col items-center z-10">
                    <div className="p-2.5 rounded-full bg-[#174C3C] text-white shadow-lg ring-4 ring-emerald-500/30">
                      <MapPin className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="mt-1 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white font-bold backdrop-blur">
                      Pickup: Loyola Mega Mess
                    </span>
                  </div>

                  {/* Driver Vehicle In-Transit Marker */}
                  <div className="absolute left-[45%] top-[35%] flex flex-col items-center z-20 animate-bounce">
                    <div className="p-2.5 rounded-full bg-[#D5AD58] text-slate-950 shadow-xl ring-4 ring-amber-400/40">
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="mt-1 px-2 py-0.5 rounded bg-amber-400 text-[10px] text-slate-950 font-extrabold shadow-sm">
                      {selectedDelivery.driver_name} ({selectedDelivery.current_status})
                    </span>
                  </div>

                  {/* Recipient NGO Dropoff Marker */}
                  <div className="absolute right-16 top-16 flex flex-col items-center z-10">
                    <div className="p-2.5 rounded-full bg-red-600 text-white shadow-lg ring-4 ring-red-500/30">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="mt-1 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white font-bold backdrop-blur">
                      Dropoff: Akshaya Food Bank
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 bg-black/60 px-2 py-1 rounded backdrop-blur">
                    OpenStreetMap GPS Telemetry • Eco-Van Battery: 88%
                  </div>
                </div>

                {/* Progress Status Workflow Stepper */}
                <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                  {['Assigned', 'Picked Up', 'In Transit', 'Delivered'].map((step, idx) => {
                    const isDone = 
                      (selectedDelivery.current_status === 'Delivered') ||
                      (selectedDelivery.current_status === 'In Transit' && idx <= 2) ||
                      (selectedDelivery.current_status === 'Picked Up' && idx <= 1) ||
                      (selectedDelivery.current_status === 'Assigned' && idx === 0);
                    
                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1 ${
                          isDone 
                            ? 'bg-[#2E8059] text-white ring-2 ring-[#C6E6D2]' 
                            : 'bg-slate-100 text-slate-400'
                        }`}>
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span className={`text-[11px] font-semibold ${isDone ? 'text-[#174C3C]' : 'text-slate-400'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Action & Proof Notes Panel */}
              <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#174C3C]">
                      Delivery Partner Action & Proof of Handover
                    </h4>
                    <p className="text-xs text-slate-500">
                      Update status as consignment moves through pickup, thermal transit, and verified handover.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    Vehicle: {selectedDelivery.vehicle_type}
                  </span>
                </div>

                {selectedDelivery.current_status !== 'Delivered' ? (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Proof of Delivery / Inspector Handover Notes:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Received 50 portions by Sister Mary at Akshaya Bank. Thermal temp 62°C verified."
                        value={proofNotes}
                        onChange={(e) => setProofNotes(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                      />
                    </div>

                    {currentAction && (
                      <button
                        onClick={() => handleStatusTransition(selectedDelivery.id, currentAction.next)}
                        disabled={updating}
                        className={`w-full py-3 px-4 rounded-xl text-white font-bold flex items-center justify-center space-x-2 transition shadow-xs ${currentAction.color}`}
                      >
                        {updating ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>{currentAction.label}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-700 shrink-0" />
                    <div>
                      <h5 className="font-bold text-purple-900">Consignment Fully Delivered & Completed</h5>
                      <p className="text-purple-700 mt-0.5">
                        Timestamp: {selectedDelivery.delivered_timestamp || 'Recently Completed'} • 
                        Meals safely served to community.
                      </p>
                      {selectedDelivery.proof_notes && (
                        <p className="text-slate-600 mt-1 italic">
                          "{selectedDelivery.proof_notes}"
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-xs border border-[#E2ECE5]">
              Select a delivery assignment to view GPS route and status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
