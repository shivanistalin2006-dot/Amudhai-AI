import React, { useState, useEffect } from 'react';
import { 
  Leaf, Download, CloudRain, Droplets, DollarSign, 
  TrendingDown, CheckCircle2, ShieldCheck, FileText, 
  Building, Calendar, Sparkles, Printer 
} from 'lucide-react';
import { api } from '../api';

interface SustainabilityViewProps {
  lang: 'en' | 'ta';
}

export const SustainabilityView: React.FC<SustainabilityViewProps> = ({ lang }) => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await api.getSustainabilityReport();
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handleDownloadCsv = () => {
    window.open('/api/sustainability/download-csv', '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !report) {
    return (
      <div className="py-16 text-center text-xs text-slate-400">
        Loading sustainability ESG telemetry...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2E8059]/10 text-[#2E8059]">
              Verified ESG Sustainability & Social Impact
            </span>
            <span className="text-xs text-slate-500">UNEP / FAO Standard Factors</span>
          </div>
          <h2 className="text-xl font-bold text-[#174C3C] mt-1">
            {lang === 'en' ? 'Sustainability Reports & Environmental ESG Analytics' : 'நிலைத்தன்மை & சுற்றுச்சூழல் ESG அறிக்கை'}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Transparently measure environmental conservation, emissions avoided, water saved, and meals fed.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-[#2E8059] bg-[#C6E6D2]/30 hover:bg-[#C6E6D2]/60 text-xs font-bold text-[#174C3C] transition"
          >
            <Download className="w-4 h-4 text-[#2E8059]" />
            <span>Export ESG CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#174C3C] hover:bg-[#2E8059] text-white text-xs font-bold transition shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main KPI Impact Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">Total Waste Prevented</span>
            <Leaf className="w-4 h-4 text-[#2E8059]" />
          </div>
          <div className="text-2xl font-extrabold text-[#174C3C] mt-2">
            {report.waste_prevented_kg.toLocaleString()} kg
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
            {report.reduction_percentage}% reduction vs baseline
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-white border border-teal-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-800">CO2e Emissions Avoided</span>
            <CloudRain className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-teal-900 mt-2">
            {report.co2e_avoided_kg.toLocaleString()} kg
          </div>
          <span className="text-[11px] text-teal-600 block mt-0.5">
            2.5 kg CO2e factor per kg food
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800">Virtual Water Saved</span>
            <Droplets className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-900 mt-2">
            {(report.water_saved_liters / 1000).toLocaleString()} kL
          </div>
          <span className="text-[11px] text-blue-600 block mt-0.5">
            1,500 L agricultural water / kg
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">Economic Value Saved</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-900 mt-2">
            ₹{report.financial_saved_inr.toLocaleString()}
          </div>
          <span className="text-[11px] text-amber-600 block mt-0.5">
            {report.meals_delivered.toLocaleString()} community meals fed
          </span>
        </div>
      </div>

      {/* Structured ESG Report Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2ECE5] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base font-bold text-[#174C3C]">
              Institutional Food Waste Reduction Assessment Report
            </h3>
            <p className="text-xs text-slate-500">
              Audit Period: {report.reporting_period} • Loyola College Mega Mess & Hotel Annapoorna
            </p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Verified ESG Protocol
          </span>
        </div>

        {/* Calculation Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8F2] border-b border-[#E2ECE5] text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Metric Category</th>
                <th className="px-4 py-3">Measured Quantity</th>
                <th className="px-4 py-3">Factor & Conversion Benchmark</th>
                <th className="px-4 py-3">Net Sustainability Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3.5 font-bold text-[#174C3C]">Food Waste Avoidance</td>
                <td className="px-4 py-3.5 font-semibold text-slate-800">{report.waste_prevented_kg} kg</td>
                <td className="px-4 py-3.5 text-slate-500">{report.calculation_factors.formula_reduction}</td>
                <td className="px-4 py-3.5 font-bold text-emerald-700">{report.reduction_percentage}% Net Reduction</td>
              </tr>
              <tr>
                <td className="px-4 py-3.5 font-bold text-[#174C3C]">Greenhouse Gas (GHG) Reduction</td>
                <td className="px-4 py-3.5 font-semibold text-slate-800">{report.waste_prevented_kg} kg diverted</td>
                <td className="px-4 py-3.5 text-slate-500">{report.calculation_factors.co2e_factor}</td>
                <td className="px-4 py-3.5 font-bold text-teal-700">{report.co2e_avoided_kg} kg CO2e Avoided</td>
              </tr>
              <tr>
                <td className="px-4 py-3.5 font-bold text-[#174C3C]">Water Resource Conservation</td>
                <td className="px-4 py-3.5 font-semibold text-slate-800">{report.waste_prevented_kg} kg food conserved</td>
                <td className="px-4 py-3.5 text-slate-500">{report.calculation_factors.water_factor}</td>
                <td className="px-4 py-3.5 font-bold text-blue-700">{report.water_saved_liters.toLocaleString()} Liters Saved</td>
              </tr>
              <tr>
                <td className="px-4 py-3.5 font-bold text-[#174C3C]">Social Nourishment & Meals</td>
                <td className="px-4 py-3.5 font-semibold text-slate-800">{report.meals_delivered} meal portions</td>
                <td className="px-4 py-3.5 text-slate-500">Redistributed to 5 verified Chennai shelters & NGOs</td>
                <td className="px-4 py-3.5 font-bold text-purple-700">Zero-Hunger Goal Aligned</td>
              </tr>
              <tr>
                <td className="px-4 py-3.5 font-bold text-[#174C3C]">Economic Value Recovery</td>
                <td className="px-4 py-3.5 font-semibold text-slate-800">Institutional mess budget</td>
                <td className="px-4 py-3.5 text-slate-500">{report.calculation_factors.financial_factor}</td>
                <td className="px-4 py-3.5 font-bold text-amber-700">₹{report.financial_saved_inr.toLocaleString()} Recovered</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Transparent Methodology Disclosure */}
        <div className="p-4 rounded-xl bg-[#F7F8F2] border border-[#E2ECE5] text-xs text-slate-600 space-y-1.5">
          <h4 className="font-bold text-[#174C3C] flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#2E8059]" />
            Methodology & Data Quality Notes
          </h4>
          <p>
            {report.data_quality_notes} Baseline period defined as unoptimized semester operations averaging 2,200 kg monthly food waste.
          </p>
          <p className="text-[11px] text-slate-500">
            Conversion factors derived from FAO (Food and Agriculture Organization) Global Food Loss Indices and UNEP Food Waste Index reports.
          </p>
        </div>
      </div>
    </div>
  );
};
