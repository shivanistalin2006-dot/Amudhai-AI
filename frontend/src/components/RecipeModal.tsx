import React from 'react';
import { X, UtensilsCrossed, CheckCircle2, Clock, Users, ShieldAlert, Sparkles, ChefHat } from 'lucide-react';
import { UseBeforeWasteRecipe } from '../mockData';

interface RecipeModalProps {
  recipe: UseBeforeWasteRecipe | null;
  onClose: () => void;
  onAddToMenu: (recipe: UseBeforeWasteRecipe) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose, onAddToMenu }) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-emerald-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ChefHat className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">{recipe.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Use Before Waste
                </span>
              </div>
              <p className="text-xs text-slate-500">ZeroPlate AI Smart Recipe Substitution</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          
          <p className="text-xs text-slate-600 leading-relaxed">
            {recipe.description}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">Waste Avoidance</span>
              <strong className="text-xs font-bold text-emerald-700">{recipe.wasteAvoidance} ({recipe.wasteSavedKg})</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">Planned Servings</span>
              <strong className="text-xs font-bold text-slate-800">{recipe.servings}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">Prep Duration</span>
              <strong className="text-xs font-bold text-slate-800">{recipe.prepTime}</strong>
            </div>
          </div>

          {/* At-Risk Ingredients Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              Near-Expiry Ingredients Consumed:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recipe.uses.map((ing, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{ing}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chef Advisory Note */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
            <span className="font-bold text-amber-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" /> AI Culinary Advisory:
            </span>
            <p className="text-slate-700 leading-relaxed">
              {recipe.chefNote}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg transition"
          >
            Close
          </button>
          <button
            onClick={() => onAddToMenu(recipe)}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition flex items-center gap-1.5"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" /> Add to Today's Menu
          </button>
        </div>

      </div>
    </div>
  );
};
