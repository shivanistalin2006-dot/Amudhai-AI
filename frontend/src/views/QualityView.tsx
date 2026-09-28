import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, Thermometer, Droplets, 
  Camera, Upload, CheckCircle2, ShieldAlert, Sparkles, 
  Info, Clock, Plus, Activity 
} from 'lucide-react';
import { api } from '../api';

interface QualityViewProps {
  lang: 'en' | 'ta';
}

export const QualityView: React.FC<QualityViewProps> = ({ lang }) => {
  const [qualityData, setQualityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [imageResult, setImageResult] = useState<any>(null);

  // Manual Reading Form
  const [newItem, setNewItem] = useState({
    item_name: 'Hot Sambhar Rice & Poriyal',
    batch_code: `BATCH-HOT-${Date.now().toString().slice(-4)}`,
    storage_temp_c: 64.2,
    storage_humidity_percent: 52.0,
    storage_duration_hrs: 1.5,
    use_by_datetime: new Date(Date.now() + 4 * 3600000).toISOString().replace('T', ' ').slice(0, 16),
    visual_assessment_status: 'Safe (Verified)',
    inspector_notes: 'Sensory checks passed: aroma, color, and steam heat compliant.',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getQualityReadings();
      setQualityData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addQualityReading(newItem);
      loadData();
      alert('Quality inspection log saved successfully.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateVisionScan = async () => {
    setAnalyzingImage(true);
    try {
      const res = await api.analyzeFoodImage();
      setImageResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2E8059]/10 text-[#2E8059]">
              IoT Telemetry & Food Safety
            </span>
            <span className="text-xs text-slate-500">FSSAI Compliance Standards</span>
          </div>
          <h2 className="text-xl font-bold text-[#174C3C] mt-1">
            {lang === 'en' ? 'Food Quality & Cold-Chain IoT Monitoring' : 'உணவு தரம் & குளிர்பதன IoT கண்காணிப்பு'}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Monitor hot-holding and cold-storage chambers in real time. Validate safety before donation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-ping"></span>
            3 Live IoT Streams Connected
          </span>
        </div>
      </div>

      {/* Mandatory Safety Warning Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-start space-x-3.5 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            Mandatory Food Safety Verification Notice
          </h4>
          <p className="text-xs text-amber-800 mt-0.5 font-medium leading-relaxed">
            "AI image assessment is indicative only. Food safety must be verified through appropriate food handling, storage, and inspection procedures."
          </p>
          <p className="text-[11px] text-amber-700 mt-1">
            Hot cooked food must be maintained above 60°C; cold storage must remain below 5°C. Only FSSAI verified safe food may be redistributed to NGOs.
          </p>
        </div>
      </div>

      {/* Live IoT Sensor Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {qualityData?.sensors?.map((sensor: any, idx: number) => {
          const isWarning = sensor.status.includes('Warning');
          return (
            <div 
              key={idx} 
              className={`p-4 rounded-2xl bg-white border ${isWarning ? 'border-amber-400 ring-2 ring-amber-100' : 'border-[#E2ECE5]'} shadow-xs flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">{sensor.sensor_id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isWarning ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {sensor.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#174C3C] mt-1.5">{sensor.location}</h4>
                <p className="text-[11px] text-slate-400">Target Range: {sensor.target_temp}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Thermometer className={`w-4 h-4 ${isWarning ? 'text-amber-500' : 'text-[#2E8059]'}`} />
                  <div>
                    <span className="text-lg font-extrabold text-slate-800">{sensor.current_temp}°C</span>
                    <span className="text-[10px] text-slate-400 block">Temperature</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <div>
                    <span className="text-lg font-extrabold text-slate-800">{sensor.humidity}%</span>
                    <span className="text-[10px] text-slate-400 block">Relative Humidity</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Grid: Vision Scan & Manual Inspection Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Computer Vision Assessment Demonstration */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-[#174C3C] flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#2E8059]" />
              AI Visual Surface & Discoloration Scan
            </h3>
            <span className="text-[10px] text-slate-400">Computer Vision Module</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F8F2] border border-dashed border-[#C6E6D2] text-center space-y-3">
            <img 
              src="/hero_banner.jpg" 
              alt="Batch Sample" 
              className="w-full h-40 object-cover rounded-xl shadow-xs"
            />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={handleSimulateVisionScan}
                disabled={analyzingImage}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#2E8059] hover:bg-[#174C3C] text-white text-xs font-bold transition flex items-center justify-center space-x-2"
              >
                {analyzingImage ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#D5AD58]" />
                    <span>Run AI Visual Assessment</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {imageResult && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900">Surface Texture Analysis</span>
                <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 font-bold text-[10px]">
                  Clarity: {imageResult.visual_clarity_score}%
                </span>
              </div>
              <p className="text-emerald-800">Status: <strong>{imageResult.surface_texture_status}</strong></p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {imageResult.recommended_action}
              </p>
              <div className="pt-2 border-t border-emerald-200/60 text-[10px] text-amber-800 italic">
                * Note: {imageResult.disclaimer}
              </div>
            </div>
          )}
        </div>

        {/* Manual Inspection Entry Form */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-[#174C3C] flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#2E8059]" />
              Record Manual Quality Inspection
            </h3>
            <span className="text-[10px] text-slate-400">Chef & In-Charge Verification</span>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Food Item Name</label>
                <input
                  type="text"
                  required
                  value={newItem.item_name}
                  onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Batch Code</label>
                <input
                  type="text"
                  required
                  value={newItem.batch_code}
                  onChange={(e) => setNewItem({ ...newItem, batch_code: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newItem.storage_temp_c}
                  onChange={(e) => setNewItem({ ...newItem, storage_temp_c: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Humidity (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newItem.storage_humidity_percent}
                  onChange={(e) => setNewItem({ ...newItem, storage_humidity_percent: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Holding (Hrs)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={newItem.storage_duration_hrs}
                  onChange={(e) => setNewItem({ ...newItem, storage_duration_hrs: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Inspector Sensory Notes</label>
              <textarea
                rows={2}
                value={newItem.inspector_notes}
                onChange={(e) => setNewItem({ ...newItem, inspector_notes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                placeholder="Aroma, visual inspection, temperature check details..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#174C3C] hover:bg-[#2E8059] text-white font-bold transition shadow-xs"
            >
              Verify & Save Quality Record
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
