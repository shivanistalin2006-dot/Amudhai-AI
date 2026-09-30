import React from 'react';
import { 
  Package, AlertTriangle, TrendingDown, DollarSign, 
  ShieldCheck, ArrowRight, Sparkles, Clock, CheckCircle2,
  Activity, UtensilsCrossed, ChefHat, Eye, ArrowUpRight, BarChart2
} from 'lucide-react';
import { 
  InventoryItem, SmartInsight, recentActivities, reportSummary,
  aiWastePrediction7Days, aiSmartRecommendations, useBeforeWasteRecipes,
  SmartRecommendationItem, UseBeforeWasteRecipe
} from '../mockData';

interface DashboardViewProps {
  inventory: InventoryItem[];
  insights: SmartInsight[];
  onNavigate: (tab: string) => void;
  onOpenAlerts: () => void;
  onSelectBatch: (item: InventoryItem) => void;
  onViewRecipe: (recipe: UseBeforeWasteRecipe) => void;
  onToast: (msg: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  inventory,
  insights,
  onNavigate,
  onOpenAlerts,
  onSelectBatch,
  onViewRecipe,
  onToast,
}) => {
  // Calculations from inventory state
  const totalKg = inventory.reduce((acc, curr) => acc + (curr.unit === 'kg' ? curr.quantity : curr.quantity * 1.03), 0);
  const expiringSoonCount = inventory.filter(i => i.status === 'Expiring Soon' || i.status === 'High Risk').length;
  const highRiskCount = inventory.filter(i => i.status === 'High Risk').length;

  const handleUseInMenu = (rec: SmartRecommendationItem) => {
    onToast(`Added ${rec.name} (${rec.batchId}) to today's priority menu.`);
  };

  const handleAddRecipeToMenu = (recipe: UseBeforeWasteRecipe) => {
    onToast(`"${recipe.name}" added to today's priority menu.`);
  };

  const handleViewBatchById = (batchId: string) => {
    const found = inventory.find(i => i.batchId === batchId) || inventory[0];
    onSelectBatch(found);
  };

  return (
    <div className="space-y-6">
      
      {/* High-Risk Food Waste Alert Banner */}
      {highRiskCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 font-bold">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 text-sm">
                  ⚠️ {expiringSoonCount} batches require immediate attention
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  Critical
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Spinach & Milk batches near 24h threshold. Cook tonight to avoid ₹6,200 loss.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAlerts}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 transition flex items-center gap-1 shadow-xs"
            >
              Review Actions <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 5 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI 1 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Total Food Inventory</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {Math.round(totalKg).toLocaleString()} <span className="text-sm font-medium text-slate-500">kg</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> {inventory.length} active batches
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Expiring Soon (&lt;3d)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-900 tracking-tight">
            {expiringSoonCount} <span className="text-sm font-medium text-slate-500">batches</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" /> 135 kg needs FEFO burn
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Waste Prevented</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            1,420 <span className="text-sm font-medium text-slate-500">kg</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-teal-700 font-semibold">
            <span className="font-bold">+{reportSummary.wasteReductionRate}%</span> reduction rate
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Estimated Cost Saved</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-800 tracking-tight">
            ₹{(reportSummary.costSavedInr / 1000).toFixed(1)}k
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
            <span>Verified grocery savings</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Food Waste Risk</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Low Risk <span className="text-xs font-bold text-emerald-600">(13.2%)</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '13.2%' }}></div>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* FEATURE 1 — AI WASTE PREDICTION (NEW!) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <BarChart2 className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">AI Waste Prediction</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                Next 7 Days
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Category-level spoilage likelihood forecast based on batch arrival timestamps and storage temperatures.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full self-start sm:self-auto">
            {aiWastePrediction7Days.label}
          </span>
        </div>

        {/* Content Grid: Chart + Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 items-center">
          
          {/* Visual Category Risk Bars (8 cols) */}
          <div className="lg:col-span-8 space-y-3.5">
            {aiWastePrediction7Days.categories.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-800">{cat.category}</strong>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      cat.risk === 'HIGH'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : cat.risk === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {cat.risk} RISK
                    </span>
                  </div>
                  <div className="font-mono text-slate-600 font-semibold">
                    <strong>{cat.predictedKg} kg</strong> <span className="text-slate-400">({cat.percentage}%)</span> • Est. Loss ₹{cat.potentialLossInr}
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} 
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary Card (4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-gradient-to-br from-rose-50/60 via-amber-50/40 to-slate-50 border border-rose-200/70 space-y-3">
            <div className="text-xs font-bold text-rose-900 uppercase tracking-wide">
              Predicted Spoilage Summary
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {aiWastePrediction7Days.totalPredictedKg} <span className="text-base font-medium text-slate-500">kg</span>
              </div>
              <p className="text-xs text-rose-700 font-bold mt-0.5">
                Potential Loss: ₹{aiWastePrediction7Days.totalPotentialLossInr.toLocaleString()}
              </p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Early consumption via our <strong className="text-slate-800">Use Before Waste</strong> recipes below can recover up to 92% of this volume.
            </p>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* FEATURE 2 — AI SMART RECOMMENDATIONS (NEW!) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">AI Smart Recommendations</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Actionable batch-level guidance: prioritizing ingredients before they reach microbial risk limits
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-semibold hidden sm:inline">
            Direct Kitchen Actions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {aiSmartRecommendations.map((rec) => (
            <div 
              key={rec.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-sm transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{rec.icon}</span>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{rec.name}</h4>
                      <span className="text-[11px] font-mono text-slate-400">{rec.batchId}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    rec.risk === 'HIGH'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {rec.risk}
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-medium mb-1">
                  Expiry: <strong className="text-slate-800">{rec.expiry}</strong>
                </div>

                <p className="text-xs text-slate-600 leading-snug">
                  {rec.recommendation}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2">
                <button
                  onClick={() => handleUseInMenu(rec)}
                  className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition text-center shadow-xs"
                >
                  Use in Today's Menu
                </button>
                <button
                  onClick={() => handleViewBatchById(rec.batchId)}
                  className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
                  title="View Smart Batch Passport"
                >
                  View Batch
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FEATURE 3 — RECIPE / MENU SUGGESTIONS ("Use Before Waste") (NEW!) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <UtensilsCrossed className="w-4 h-4 text-amber-700" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Use Before Waste</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Menu Optimization
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              When ingredients are close to expiry, cook dishes that consume those ingredients before spoilage occurs.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            3–4 Chef Suggestions
          </span>
        </div>

        {/* 4 Recipe Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {useBeforeWasteRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-amber-300 hover:shadow-sm transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                
                {/* Recipe Header */}
                <div className="flex items-start justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                    {recipe.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {recipe.wasteAvoidance} Avoidance
                  </span>
                </div>

                {/* Ingredients at Risk Box */}
                <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                    Ingredients at Risk:
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-xs font-semibold text-slate-800">
                    {recipe.atRiskIngredients.map((ing, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-white rounded border border-amber-200 text-[11px]">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Uses List */}
                <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
                  {recipe.uses.map((u, i) => (
                    <div key={i} className="truncate">{u}</div>
                  ))}
                </div>

                <div className="text-[11px] text-emerald-700 font-bold flex items-center justify-between pt-1">
                  <span>Saves {recipe.wasteSavedKg}</span>
                  <span className="text-slate-400 font-normal">{recipe.servings}</span>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2">
                <button
                  onClick={() => handleAddRecipeToMenu(recipe)}
                  className="flex-1 py-1.5 px-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition text-center shadow-xs"
                >
                  Add to Today's Menu
                </button>
                <button
                  onClick={() => onViewRecipe(recipe)}
                  className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
                >
                  View Recipe
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Recent Activity & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): AI Insights Overview */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Active Pantry Advisory</h3>
              </div>
              <button
                onClick={() => onNavigate('insights')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                View All Insights ({insights.length}) →
              </button>
            </div>

            <div className="space-y-3">
              {insights.slice(0, 3).map((ins) => (
                <div 
                  key={ins.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 hover:border-emerald-200 transition space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-800">{ins.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ins.category === 'Urgent' 
                        ? 'bg-rose-100 text-rose-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {ins.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{ins.description}</p>
                  <div className="text-[11px] font-semibold text-emerald-800 pt-1">
                    💡 {ins.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>FEFO Kitchen Engine v2.4 Active</span>
            <button
              onClick={() => onNavigate('inventory')}
              className="font-semibold text-emerald-700 hover:underline"
            >
              Open Smart Inventory Table →
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): Recent Kitchen Activity */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Recent Kitchen Activity</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Live Feed</span>
            </div>

            <div className="space-y-4">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{act.title}</span>
                      <span className="text-[10px] text-slate-400">{act.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-900">QR Traceability Ready</p>
                <p className="text-[11px] text-emerald-700">Scan batch passports for full farm origin</p>
              </div>
              <button
                onClick={() => onNavigate('qr')}
                className="px-3 py-1.5 text-xs font-bold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition"
              >
                Inspect QR
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
