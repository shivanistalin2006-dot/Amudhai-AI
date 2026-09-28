import React, { useState, useEffect } from 'react';
import { 
  Sparkles, TrendingUp, Calendar, Users, Utensils, 
  ShieldCheck, AlertCircle, ArrowRight, Check, History,
  Save, ChefHat, Info
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Legend 
} from 'recharts';
import { api } from '../api';

interface ForecastViewProps {
  onSurplusSuggested?: (kg: number) => void;
  lang: 'en' | 'ta';
}

export const ForecastView: React.FC<ForecastViewProps> = ({ onSurplusSuggested, lang }) => {
  // Input parameters
  const [kitchenId, setKitchenId] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealPeriod, setMealPeriod] = useState('Lunch');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [expectedAttendance, setExpectedAttendance] = useState(850);
  const [holidayEvent, setHolidayEvent] = useState('Regular Working Day');
  const [weatherCond, setWeatherCond] = useState('Clear & Sunny (31°C)');
  const [bufferPercent, setBufferPercent] = useState(5.0);

  // Results state
  const [loading, setLoading] = useState(false);
  const [forecastResult, setForecastResult] = useState<any>(null);
  const [accepted, setAccepted] = useState(false);

  // Actuals Recording Form
  const [actualPrepared, setActualPrepared] = useState(850);
  const [actualConsumed, setActualConsumed] = useState(815);
  const [actualWasteKg, setActualWasteKg] = useState(14.0);
  const [actualSurplusKg, setActualSurplusKg] = useState(22.0);
  const [actualNotes, setActualNotes] = useState('Surplus Vegetable Biryani packed for Akshaya Food Bank.');
  const [recordSuccess, setRecordSuccess] = useState(false);

  // Fetch forecast initially
  const handleGenerateForecast = async () => {
    setLoading(true);
    setAccepted(false);
    try {
      const res = await api.predictDemand({
        kitchen_id: kitchenId,
        date,
        meal_period: mealPeriod,
        expected_attendance: expectedAttendance,
        day_of_week: dayOfWeek,
        holiday_event: holidayEvent,
        weather_cond: weatherCond,
        buffer_percent: bufferPercent,
      });
      setForecastResult(res);
      // Pre-fill actuals form with recommendations
      setActualPrepared(res.recommended_prep);
      setActualConsumed(res.predicted_meals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGenerateForecast();
  }, []);

  const handleRecordActuals = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.recordActuals({
        kitchen_id: kitchenId,
        date,
        meal_period: mealPeriod,
        meals_prepared: Number(actualPrepared),
        meals_consumed: Number(actualConsumed),
        waste_kg: Number(actualWasteKg),
        surplus_kg: Number(actualSurplusKg),
        notes: actualNotes,
      });
      setRecordSuccess(true);
      if (onSurplusSuggested && actualSurplusKg > 0) {
        onSurplusSuggested(actualSurplusKg);
      }
      setTimeout(() => setRecordSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const comparisonData = forecastResult ? [
    {
      metric: 'Attendance Plan',
      Headcount: expectedAttendance,
      AI_Predicted: forecastResult.predicted_meals,
      Recommended_Prep: forecastResult.recommended_prep,
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2E8059]/10 text-[#2E8059] border border-[#2E8059]/20">
              Scikit-Learn ML Model v1.4
            </span>
            <span className="text-xs text-slate-500">Institutional Mess Trained</span>
          </div>
          <h2 className="text-xl font-bold text-[#174C3C] mt-1">
            {lang === 'en' ? 'AI Meal Demand Forecasting & Overproduction Prevention' : 'AI உணவு தேவை முன்கணிப்பு & தயாரிப்பு மேலாண்மை'}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Optimize production batches before cooking begins. Prevent kitchen waste at the source.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="p-2.5 rounded-xl bg-[#C6E6D2]/30 border border-[#C6E6D2] text-xs font-semibold text-[#174C3C]">
            Model Confidence: <span className="text-emerald-700 font-extrabold">{forecastResult?.confidence_score || 94.8}%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs & AI Forecast Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Forecasting Parameters */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-[#174C3C] flex items-center gap-1.5">
              <ChefHat className="w-4 h-4 text-[#2E8059]" />
              Production Parameters
            </h3>
            <span className="text-[11px] text-slate-400">Step 1: Input Forecast Inputs</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Select Kitchen Unit</label>
              <select
                value={kitchenId}
                onChange={(e) => setKitchenId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] bg-[#F7F8F2] font-semibold text-[#174C3C] focus:outline-none focus:ring-2 focus:ring-[#2E8059]"
              >
                <option value={1}>Loyola Main Dining Hall (Capacity: 1500)</option>
                <option value={2}>Annapoorna Central Catering (Capacity: 1200)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Target Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] bg-[#F7F8F2] font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Meal Period</label>
                <select
                  value={mealPeriod}
                  onChange={(e) => setMealPeriod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] bg-[#F7F8F2] font-medium text-slate-800"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Day of Week</label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] bg-[#F7F8F2] font-medium text-slate-800"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Event / Calendar</label>
                <select
                  value={holidayEvent}
                  onChange={(e) => setHolidayEvent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] bg-[#F7F8F2] font-medium text-slate-800"
                >
                  <option value="Regular Working Day">Regular Working Day</option>
                  <option value="Semester Exam Week">Semester Exam Week (-8%)</option>
                  <option value="Campus Festival / Sports">Campus Festival (+15%)</option>
                  <option value="Long Weekend / Holiday">Long Weekend / Holiday (-25%)</option>
                </select>
              </div>
            </div>

            {/* Expected Attendance Slider */}
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700">Expected Registered Headcount:</span>
                <span className="text-[#174C3C] font-bold text-sm">{expectedAttendance} persons</span>
              </div>
              <input
                type="range"
                min="200"
                max="1500"
                step="25"
                value={expectedAttendance}
                onChange={(e) => setExpectedAttendance(Number(e.target.value))}
                className="w-full accent-[#2E8059]"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>200</span>
                <span>850 (Avg)</span>
                <span>1500</span>
              </div>
            </div>

            {/* Safety Buffer Slider */}
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700">Safety Buffer Margin:</span>
                <span className="text-[#2E8059] font-bold text-sm">+{bufferPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={bufferPercent}
                onChange={(e) => setBufferPercent(Number(e.target.value))}
                className="w-full accent-[#2E8059]"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0% (Tight)</span>
                <span>5% (FSSAI Ideal)</span>
                <span>15% (Conservative)</span>
              </div>
            </div>

            <button
              onClick={handleGenerateForecast}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#174C3C] hover:bg-[#2E8059] text-white font-bold flex items-center justify-center space-x-2 transition shadow-xs"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#D5AD58]" />
                  <span>Recalculate AI Demand Forecast</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output: AI Predictions & Recommendations */}
        <div className="lg:col-span-7 space-y-5">
          {forecastResult && (
            <>
              {/* Output Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-[#E2ECE5] shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500">Expected Headcount</span>
                  <div className="text-xl font-extrabold text-slate-700 mt-1">{expectedAttendance}</div>
                  <span className="text-[10px] text-slate-400">Raw registration</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-emerald-800">Predicted Consumption</span>
                  <div className="text-xl font-extrabold text-[#2E8059] mt-1">{forecastResult.predicted_meals}</div>
                  <span className="text-[10px] text-emerald-600 font-medium">Actual meal demand</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#174C3C] text-white shadow-xs">
                  <span className="text-[11px] font-medium text-[#C6E6D2]">Recommended Prep</span>
                  <div className="text-xl font-extrabold text-[#D5AD58] mt-1">{forecastResult.recommended_prep}</div>
                  <span className="text-[10px] text-[#C6E6D2]">With {bufferPercent}% buffer</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-amber-800">Prevented Waste</span>
                  <div className="text-xl font-extrabold text-amber-600 mt-1">
                    ~{Math.max(0, expectedAttendance - forecastResult.recommended_prep) * 0.35} kg
                  </div>
                  <span className="text-[10px] text-amber-700 font-medium">Overproduction saved</span>
                </div>
              </div>

              {/* AI Recommendation Alert Panel */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#174C3C]/10 via-[#2E8059]/10 to-transparent border border-[#2E8059]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-[#2E8059] text-white shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-[#D5AD58]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#174C3C]">
                      AI Production Advisory
                    </h4>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {forecastResult.recommendation_text}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setAccepted(true)}
                  disabled={accepted}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center space-x-1.5 ${
                    accepted 
                      ? 'bg-emerald-600 text-white cursor-default' 
                      : 'bg-[#2E8059] hover:bg-[#174C3C] text-white shadow-xs'
                  }`}
                >
                  {accepted ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Recommendation Accepted</span>
                    </>
                  ) : (
                    <>
                      <span>Accept & Schedule Kitchen</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Ingredient Requirements Breakdown */}
              <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs">
                <h4 className="text-xs font-bold text-[#174C3C] mb-3 flex items-center justify-between">
                  <span>Batch Ingredient Requirement Estimation ({forecastResult.recommended_prep} Meals)</span>
                  <span className="text-[10px] font-normal text-slate-400">Scaled to standard mess ratios</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {forecastResult.ingredient_requirements?.map((ing: any, i: number) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#F7F8F2] border border-[#E2ECE5] text-center">
                      <span className="text-[11px] font-medium text-slate-600 truncate block">{ing.ingredient}</span>
                      <div className="text-sm font-bold text-[#174C3C] mt-1">
                        {ing.quantity} <span className="text-xs font-normal text-slate-500">{ing.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Post-Meal Production Recording Form */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#174C3C] flex items-center gap-1.5">
              <History className="w-4 h-4 text-[#2E8059]" />
              Post-Meal Actuals Recording & Model Retraining
            </h3>
            <p className="text-xs text-slate-500">
              Record real consumption outcomes after meal service. Continually trains the scikit-learn forecasting model.
            </p>
          </div>
          {recordSuccess && (
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold animate-pulse">
              <Check className="w-3.5 h-3.5" />
              <span>Saved to database! Surplus notified to NGOs.</span>
            </div>
          )}
        </div>

        <form onSubmit={handleRecordActuals} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Meals Prepared</label>
            <input
              type="number"
              value={actualPrepared}
              onChange={(e) => setActualPrepared(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] font-bold text-[#174C3C]"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Meals Consumed</label>
            <input
              type="number"
              value={actualConsumed}
              onChange={(e) => setActualConsumed(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] font-bold text-emerald-700"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Plate Waste (kg)</label>
            <input
              type="number"
              step="0.5"
              value={actualWasteKg}
              onChange={(e) => setActualWasteKg(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] font-bold text-red-600"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Safe Surplus (kg)</label>
            <input
              type="number"
              step="0.5"
              value={actualSurplusKg}
              onChange={(e) => setActualSurplusKg(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] font-bold text-amber-600"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-3 rounded-xl bg-[#2E8059] hover:bg-[#174C3C] text-white font-bold flex items-center justify-center space-x-1.5 transition shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Record & Retrain Model</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
