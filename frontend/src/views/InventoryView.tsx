import React, { useState } from 'react';
import { 
  Search, Plus, Filter, QrCode, AlertTriangle, 
  CheckCircle2, Clock, Thermometer, ShieldAlert 
} from 'lucide-react';
import { InventoryItem } from '../mockData';

interface InventoryViewProps {
  inventory: InventoryItem[];
  onOpenAddModal: () => void;
  onSelectBatch: (item: InventoryItem) => void;
  onToast: (msg: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  onOpenAddModal,
  onSelectBatch,
  onToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const categories = ['All', 'Vegetables', 'Dairy', 'Grains', 'Pulses', 'Oils & Spices'];
  const statuses = ['All', 'Fresh', 'Expiring Soon', 'High Risk'];

  // Filter items
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Smart Inventory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Algorithmic First-Expiry, First-Out (FEFO) food pantry & batch ledger
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Search Box */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ingredient, batch ID, or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 transition"
            />
          </div>

          {/* Status Dropdown/Pills */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedStatus === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 pl-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-3.5 px-4">Ingredient Name</th>
                <th className="py-3.5 px-3">Batch ID</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Quantity</th>
                <th className="py-3.5 px-3">Expiry Date</th>
                <th className="py-3.5 px-3">Supplier & Origin</th>
                <th className="py-3.5 px-3">Storage Unit</th>
                <th className="py-3.5 px-3">Waste Risk</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 font-medium">
                    No matching food inventory items found.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    
                    {/* Name */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {item.name}
                    </td>

                    {/* Batch ID */}
                    <td className="py-3.5 px-3 font-mono text-slate-500 font-medium">
                      {item.batchId}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="py-3.5 px-3 font-semibold text-slate-900">
                      {item.quantity} {item.unit}
                    </td>

                    {/* Expiry Date */}
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-800">{item.expiryDate}</div>
                      <div className={`text-[10px] font-bold ${
                        item.expiryDaysRemaining <= 2 
                          ? 'text-rose-600' 
                          : item.expiryDaysRemaining <= 5 
                          ? 'text-amber-600' 
                          : 'text-slate-400'
                      }`}>
                        {item.expiryDaysRemaining} days remaining
                      </div>
                    </td>

                    {/* Supplier */}
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-slate-800 truncate max-w-[140px]">{item.supplier}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{item.sourceLocation}</div>
                    </td>

                    {/* Storage */}
                    <td className="py-3.5 px-3">
                      <div className="text-slate-800">{item.storageCondition}</div>
                      <div className="text-[10px] font-mono text-cyan-700 font-bold">{item.storageTemp}</div>
                    </td>

                    {/* Waste Risk */}
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1 font-bold text-[11px] ${
                        item.wasteRisk === 'High' ? 'text-rose-600' : item.wasteRisk === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {item.wasteRisk === 'High' ? (
                          <AlertTriangle className="w-3 h-3 text-rose-500" />
                        ) : (
                          <ShieldAlert className="w-3 h-3 text-emerald-500" />
                        )}
                        {item.wasteRisk}
                      </span>
                    </td>

                    {/* Status Badge (Requirement #3) */}
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        item.status === 'Fresh'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.status === 'Expiring Soon'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'Fresh' ? 'bg-emerald-500' : item.status === 'Expiring Soon' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                        {item.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectBatch(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
                      >
                        <QrCode className="w-3.5 h-3.5" /> Passport
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <span>Showing {filteredInventory.length} of {inventory.length} inventory batches</span>
          <span className="text-emerald-700 font-semibold">
            All records sorted according to First-Expiry, First-Out (FEFO) protocol
          </span>
        </div>
      </div>

    </div>
  );
};
