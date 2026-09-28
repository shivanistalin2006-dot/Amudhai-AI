import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Search, Filter, AlertTriangle, 
  Clock, ShieldAlert, CheckCircle2, Trash2, Edit2, 
  ArrowDownUp, X, Sparkles, Building 
} from 'lucide-react';
import { api } from '../api';

interface InventoryViewProps {
  lang: 'en' | 'ta';
}

export const InventoryView: React.FC<InventoryViewProps> = ({ lang }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Vegetables',
    quantity: 50,
    unit: 'kg',
    supplier: '',
    batch_number: `BAT-${Date.now().toString().slice(-6)}`,
    purchase_date: new Date().toISOString().split('T')[0],
    expiry_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    storage_location: 'Cold Storage Unit A',
    min_threshold: 20,
  });

  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await api.getInventory(statusFilter, categoryFilter, search);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadInventory();
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createInventoryItem(newItem);
      setShowAddModal(false);
      loadInventory();
      // Reset form
      setNewItem({
        name: '',
        category: 'Vegetables',
        quantity: 50,
        unit: 'kg',
        supplier: '',
        batch_number: `BAT-${Date.now().toString().slice(-6)}`,
        purchase_date: new Date().toISOString().split('T')[0],
        expiry_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        storage_location: 'Cold Storage Unit A',
        min_threshold: 20,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (confirm('Are you sure you want to delete this inventory item?')) {
      try {
        await api.deleteInventoryItem(id);
        loadInventory();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Fresh':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">● Fresh</span>;
      case 'Near Expiry':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">⚠️ Near Expiry</span>;
      case 'Expired':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-800">⛔ Expired (Unsafe)</span>;
      case 'Low Stock':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800">🔻 Low Stock</span>;
      default:
        return <span>{status}</span>;
    }
  };

  // FEFO Priority Items: Expiring in <= 3 days
  const fefoAlerts = items.filter(i => i.status === 'Near Expiry' || i.status === 'Low Stock');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2ECE5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2E8059]/10 text-[#2E8059]">
              FEFO Protocol Enforced
            </span>
            <span className="text-xs text-slate-500">First-Expiry, First-Out Optimization</span>
          </div>
          <h2 className="text-xl font-bold text-[#174C3C] mt-1">
            {lang === 'en' ? 'Smart Food Inventory & FEFO Expiry Management' : 'அறிவார்ந்த உணவு சரக்கு & காலாவதி மேலாண்மை'}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Prioritize stock consumption by earliest expiry to eliminate raw ingredient spoilage.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#174C3C] hover:bg-[#2E8059] text-white text-xs font-bold transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Stock Batch</span>
        </button>
      </div>

      {/* FEFO Warning Banner if Near-Expiry items exist */}
      {fefoAlerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 flex items-start space-x-3 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-amber-900">
              FEFO Action Required: {fefoAlerts.length} Batch(es) Requiring Priority Consumption
            </h4>
            <p className="text-amber-800 mt-0.5">
              The following ingredients are approaching their use-by window. Prioritize these batches for today's lunch/dinner preparation:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {fefoAlerts.map(item => (
                <span key={item.id} className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 font-semibold shadow-2xs">
                  {item.name} ({item.quantity} {item.unit}) - Expires: {item.expiry_date}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2ECE5] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full md:max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search stock item, batch number, or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E2ECE5] bg-[#F7F8F2] focus:outline-none focus:ring-2 focus:ring-[#2E8059]"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#F7F8F2] border border-[#E2ECE5] rounded-xl">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-slate-700 font-medium"
            >
              <option value="all">All Categories</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Grains & Rice">Grains & Rice</option>
              <option value="Pulses & Legumes">Pulses & Legumes</option>
              <option value="Dairy">Dairy</option>
              <option value="Spices & Oils">Spices & Oils</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#F7F8F2] border border-[#E2ECE5] rounded-xl">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-slate-700 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="Fresh">Fresh</option>
              <option value="Near Expiry">Near Expiry</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-[#E2ECE5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8F2] border-b border-[#E2ECE5] text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Ingredient / Item</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Available Stock</th>
                <th className="px-4 py-3.5">FEFO Expiry Date</th>
                <th className="px-4 py-3.5">Storage Location</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Loading inventory records...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No inventory records match the selected filters.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F7F8F2]/60 transition">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-[#174C3C]">{item.name}</div>
                      <div className="text-[10px] text-slate-400">Batch: {item.batch_number} • {item.supplier || 'Standard Supplier'}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">
                      {item.category}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-800 text-sm">{item.quantity}</span> {item.unit}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-700">{item.expiry_date}</div>
                      <div className="text-[10px] text-slate-400">Purchased: {item.purchase_date}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {item.storage_location}
                    </td>
                    <td className="px-4 py-3.5">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete stock item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2ECE5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-[#174C3C] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#2E8059]" />
                Add New Inventory Stock Batch
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ingredient / Food Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sona Masoori Rice, Country Tomatoes"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category *</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Grains & Rice">Grains & Rice</option>
                    <option value="Pulses & Legumes">Pulses & Legumes</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Spices & Oils">Spices & Oils</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Supplier / Vendor</label>
                  <input
                    type="text"
                    placeholder="e.g. Koyambedu Agro Market"
                    value={newItem.supplier}
                    onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Quantity *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Unit</label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                  >
                    <option value="kg">kg</option>
                    <option value="L">L</option>
                    <option value="bags">bags</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Min Threshold</label>
                  <input
                    type="number"
                    value={newItem.min_threshold}
                    onChange={(e) => setNewItem({ ...newItem, min_threshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Purchase Date</label>
                  <input
                    type="date"
                    value={newItem.purchase_date}
                    onChange={(e) => setNewItem({ ...newItem, purchase_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Expiry Date (FEFO) *</label>
                  <input
                    type="date"
                    required
                    value={newItem.expiry_date}
                    onChange={(e) => setNewItem({ ...newItem, expiry_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Storage Location</label>
                <input
                  type="text"
                  placeholder="e.g. Cold Room 2 (4°C), Dry Storage Silo"
                  value={newItem.storage_location}
                  onChange={(e) => setNewItem({ ...newItem, storage_location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2ECE5] text-slate-800"
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
                  Add to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
