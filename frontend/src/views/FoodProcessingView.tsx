import React, { useState, useEffect } from 'react';
import { 
  Factory, Plus, Zap, Clock, TrendingUp, AlertTriangle, 
  CheckCircle2, Gauge, BarChart2, Sparkles, X 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Legend 
} from 'recharts';
import { api } from '../api';

interface FoodProcessingViewProps {
  lang: 'en' | 'ta';
}

export const FoodProcessingView: React.FC<FoodProcessingViewProps> = ({ lang }) => {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New batch form state
  const [newBatch, setNewBatch] = useState({
    batch_code: `BATCH-PRC-2026-${Date.now().toString().slice(-3)}`,
    product_name: 'Organic Mango Pulp Extraction',
    input_raw_material_kg: 500.0,
    useful_output_kg: 445.0,
    machine_downtime_mins: 10,
    energy_consumption_kwh: 48.0,
    date: new Date().toISOString().split('T')[0],
    notes: 'Peels redirected to bio-gas digester; 89% extraction efficiency.',
  });

  const loadBatches = async () => {
    setLoading(true);
    try {
      const data = await api.getProcessingBatches();
      setBatches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createProcessingBatch(newBatch);
      setShowAddModal(false);
      loadBatches();
      // Reset
      setNewBatch({
        batch_code: `BATCH-PRC-2026-${Date.now().toString().slice(-3)}`,
        product_name: 'Organic Tomato Puree & Paste',
        input_raw_material_kg: 600.0,
        useful_output_kg: 540.0,
        machine_downtime_mins: 15,
        energy_consumption_kwh: 52.0,
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const avgEfficiency = batches.length > 0 
    ? (batches.reduce((acc, b) => acc + b.processing_efficiency_pct, 0) / batches.length).toFixed(1)
    : '88.3';

  const totalInput = batches.reduce((acc, b) => acc + b.input_raw_material_kg, 0);
  const totalOutput = batches.reduce((acc, b) => acc + b.useful_output_kg, 0);
  const totalWaste = batches.reduce((acc, b) => acc + b.waste_material_kg, 0);

  const chartData = batches.map(b => ({
    name: b.batch_code.slice(-6),
    Raw_Input: b.input_raw_material_kg,
    Useful_Output: b.useful_output_kg,
    Waste_Loss: b.waste_material_kg,
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2E8059]/10 text-[#2E8059]">
              Industrial Food Manufacturing & Processing
            </span>
            <span className="text-xs text-slate-500">Yield Optimization & Energy KPI</span>
          </div>
          <h2 className="text-xl font-bold text-[#174C3C] mt-1">
            {lang === 'en' ? 'Food Processing Unit & Yield Management' : 'உணவு பதப்படுத்தும் பிரிவு & மகசூல் மேலாண்மை'}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Track input-to-output conversion ratios, minimize processing line scrap, and optimize machine thermal energy.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#174C3C] hover:bg-[#2E8059] text-white text-xs font-bold transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Record Processing Batch</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E2ECE5] shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Avg Processing Efficiency</span>
          <div className="text-2xl font-extrabold text-[#2E8059] mt-1">{avgEfficiency}%</div>
          <span className="text-[10px] text-emerald-600 font-medium">Formula: (Useful / Input) × 100</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2ECE5] shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Raw Material Input</span>
          <div className="text-2xl font-extrabold text-[#174C3C] mt-1">{totalInput} kg</div>
          <span className="text-[10px] text-slate-400">Recorded production lines</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2ECE5] shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Useful Output Yield</span>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">{totalOutput} kg</div>
          <span className="text-[10px] text-slate-400">Packaged product</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs">
          <span className="text-xs font-semibold text-amber-800">Scrap / Biomass Loss</span>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">{totalWaste} kg</div>
          <span className="text-[10px] text-amber-600 font-medium">Re-routed to composting</span>
        </div>
      </div>

      {/* Efficiency Chart */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#174C3C]">
              Batch Material Conversion: Raw Input vs Useful Output vs Waste
            </h3>
            <p className="text-xs text-slate-500">
              Comparative analysis across processed batches.
            </p>
          </div>
          <span className="text-xs font-bold text-[#2E8059] bg-[#C6E6D2]/30 px-2.5 py-1 rounded-lg">
            High Yield Benchmark: &gt;85%
          </span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2ECE5', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="Raw_Input" name="Raw Input (kg)" fill="#174C3C" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Useful_Output" name="Useful Output (kg)" fill="#2E8059" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Waste_Loss" name="Scrap / Waste (kg)" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-2xl border border-[#E2ECE5] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#174C3C]">
            Production Batch Register
          </h3>
          <span className="text-xs text-slate-500">{batches.length} Batches Logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8F2] border-b border-[#E2ECE5] text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Batch Code & Product</th>
                <th className="px-4 py-3.5">Raw Input (kg)</th>
                <th className="px-4 py-3.5">Useful Output (kg)</th>
                <th className="px-4 py-3.5">Efficiency (%)</th>
                <th className="px-4 py-3.5">Energy (kWh)</th>
                <th className="px-4 py-3.5">Downtime</th>
                <th className="px-4 py-3.5">Date & Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batches.map((b) => (
                <tr key={b.id} className="hover:bg-[#F7F8F2]/60 transition">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-[#174C3C]">{b.product_name}</div>
                    <div className="text-[10px] text-slate-400">Code: {b.batch_code}</div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-700">
                    {b.input_raw_material_kg} kg
                  </td>
                  <td className="px-4 py-3.5 font-bold text-[#2E8059]">
                    {b.useful_output_kg} kg
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      b.processing_efficiency_pct >= 88 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.processing_efficiency_pct}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {b.energy_consumption_kwh} kWh
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {b.machine_downtime_mins} mins
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 max-w-xs truncate">
                    <div>{b.date}</div>
                    <div className="text-[10px] text-slate-400 truncate">{b.notes || 'Normal cycle'}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2ECE5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-[#174C3C] flex items-center gap-2">
                <Factory className="w-5 h-5 text-[#2E8059]" />
                Record Industrial Processing Batch
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Product Description</label>
                <input
                  type="text"
                  required
                  value={newBatch.product_name}
                  onChange={(e) => setNewBatch({ ...newBatch, product_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Raw Material Input (kg) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newBatch.input_raw_material_kg}
                    onChange={(e) => setNewBatch({ ...newBatch, input_raw_material_kg: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Useful Output Yield (kg) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newBatch.useful_output_kg}
                    onChange={(e) => setNewBatch({ ...newBatch, useful_output_kg: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Machine Downtime (Minutes)</label>
                  <input
                    type="number"
                    value={newBatch.machine_downtime_mins}
                    onChange={(e) => setNewBatch({ ...newBatch, machine_downtime_mins: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Energy Consumed (kWh)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newBatch.energy_consumption_kwh}
                    onChange={(e) => setNewBatch({ ...newBatch, energy_consumption_kwh: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Operational Notes</label>
                <textarea
                  rows={2}
                  value={newBatch.notes}
                  onChange={(e) => setNewBatch({ ...newBatch, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                  placeholder="Scrap disposal, machine maintenance notes..."
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2E8059] hover:bg-[#174C3C] text-white font-bold transition shadow-xs"
                >
                  Save Batch Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
