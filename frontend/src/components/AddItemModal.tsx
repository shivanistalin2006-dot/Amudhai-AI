import React, { useState } from 'react';
import { X, PlusCircle, Sparkles } from 'lucide-react';
import { InventoryItem } from '../mockData';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: InventoryItem) => void;
  onToast: (msg: string) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAdd, onToast }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryItem['category']>('Vegetables');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [expiryDate, setExpiryDate] = useState('2026-10-06');
  const [supplier, setSupplier] = useState('');
  const [sourceLocation, setSourceLocation] = useState('Chennai Local Farm Hub');
  const [storageCondition, setStorageCondition] = useState('Cold Storage Room #2');
  const [storageTemp, setStorageTemp] = useState('12°C');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quantity) {
      alert('Please enter ingredient name and quantity.');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newBatchId = `BATCH-${randomSuffix}`;

    // Calculate days remaining
    const today = new Date('2026-09-30');
    const exp = new Date(expiryDate);
    const diffTime = exp.getTime() - today.getTime();
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    let status: InventoryItem['status'] = 'Fresh';
    let risk: InventoryItem['wasteRisk'] = 'Low';
    if (diffDays <= 2) {
      status = 'High Risk';
      risk = 'High';
    } else if (diffDays <= 5) {
      status = 'Expiring Soon';
      risk = 'Medium';
    }

    const newItem: InventoryItem = {
      id: String(Date.now()),
      batchId: newBatchId,
      name,
      category,
      quantity: Number(quantity),
      unit,
      expiryDate,
      expiryDaysRemaining: diffDays,
      supplier: supplier || 'Verified Regional Supplier',
      sourceLocation,
      receivedDate: '2026-09-30',
      storageCondition,
      storageTemp,
      wasteRisk: risk,
      status,
      recommendedAction: diffDays <= 3 ? "Prioritize in upcoming meal menu under FEFO" : "Standard storage monitoring"
    };

    onAdd(newItem);
    onToast(`Added new batch #${newBatchId} (${name}, ${quantity} ${unit}) to inventory!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Add New Food Item</h3>
              <p className="text-xs text-slate-500">Register new batch into FEFO inventory</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ingredient Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Country Tomatoes, Toor Dal, Paneer"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Dairy">Dairy</option>
                <option value="Grains">Grains</option>
                <option value="Pulses">Pulses</option>
                <option value="Oils & Spices">Oils & Spices</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expiry Date *
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              >
                <option value="kg">kg (Kilograms)</option>
                <option value="Liters">Liters</option>
                <option value="Crates">Crates</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supplier & Farm Name
            </label>
            <input
              type="text"
              placeholder="e.g. ABC Farms, Nilgiris Organics"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Storage Unit
              </label>
              <select
                value={storageCondition}
                onChange={(e) => setStorageCondition(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              >
                <option value="Cold Storage Room #2">Cold Storage Room #2</option>
                <option value="Chilled Walk-in Cooler">Chilled Walk-in Cooler</option>
                <option value="Dry Grain Silo A">Dry Grain Silo A</option>
                <option value="Dry Pantry Racks">Dry Pantry Racks</option>
                <option value="Crisper Unit 03">Crisper Unit 03</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Temp
              </label>
              <input
                type="text"
                value={storageTemp}
                onChange={(e) => setStorageTemp(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
            <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>AI will automatically assign a Smart Batch Passport QR code and monitor FEFO burn rate.</span>
          </div>

          {/* Footer buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
            >
              Register Item
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
