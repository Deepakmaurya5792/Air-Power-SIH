import React, { useState, useEffect } from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Plus,
  Minus,
  ArrowDownRight,
  TrendingDown,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

export default function SpareParts() {
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({ totalTypes: 0, totalStockQuantity: 0, reorderCount: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`${API_BASE_URL}/api/inventory?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setInventory(data.parts || []);
        setStats({
          totalTypes: data.totalTypes,
          totalStockQuantity: data.totalStockQuantity,
          reorderCount: data.reorderCount
        });
      }
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [statusFilter]);

  const updateStock = async (partId, delta) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/${partId}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta })
      });
      if (res.ok) {
        const result = await res.json();
        setInventory((prev) =>
          prev.map((p) => (p.part_id === partId ? result.part : p))
        );
      }
    } catch (err) {
      console.error('Stock update failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-wide flex items-center space-x-2">
            <Package className="w-5 h-5 text-sky-600" />
            <span>Spare Parts & Aviation Logistics Inventory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Component provisioning, supplier lead times, and automated reorder triggers.
          </p>
        </div>

        <button
          onClick={fetchInventory}
          className="px-3 py-1.5 rounded-lg border border-sky-300 bg-white hover:bg-sky-50 text-xs font-mono text-sky-800 flex items-center space-x-1.5 self-start md:self-center shadow-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="tech-panel p-4 rounded-xl bg-white/95">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Part Line Items</span>
          <p className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">{stats.totalTypes}</p>
          <span className="text-[10px] text-slate-500">Standard aerospace SKUs</span>
        </div>

        <div className="tech-panel p-4 rounded-xl bg-white/95">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Total Stock Available</span>
          <p className="text-3xl font-extrabold text-sky-700 mt-1 font-mono">{stats.totalStockQuantity}</p>
          <span className="text-[10px] text-slate-500">Total units in central depot</span>
        </div>

        <div className="tech-panel p-4 rounded-xl border-l-4 border-l-amber-500 bg-white/95">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Reorder Alerts Triggered</span>
          <p className="text-3xl font-extrabold text-amber-700 mt-1 font-mono">{stats.reorderCount}</p>
          <span className="text-[10px] text-amber-800 font-mono font-semibold">Stock &le; Reorder Level</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="tech-panel p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 bg-white/95">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search part ID, part name, component..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchInventory()}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="All">Status: All</option>
            <option value="In Stock">In Stock</option>
            <option value="Reorder">Reorder Alert</option>
          </select>
        </div>
      </div>

      {/* Parts Table */}
      <div className="tech-panel rounded-xl overflow-hidden bg-white/95">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-mono uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Part ID</th>
                <th className="py-3 px-4">Part Description</th>
                <th className="py-3 px-4">Compatible Component</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Reorder Lvl</th>
                <th className="py-3 px-4">Lead Time</th>
                <th className="py-3 px-4">Unit Cost (Demo INR)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map((part) => (
                <tr key={part.part_id} className="hover:bg-sky-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-sky-700">{part.part_id}</td>
                  <td className="py-3 px-4 text-slate-900 font-medium">{part.part_name}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{part.compatible_component_demo}</td>
                  <td className="py-3 px-4 font-mono text-slate-900 font-bold">{part.stock_quantity}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{part.reorder_level}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{part.supplier_lead_time_days} days</td>
                  <td className="py-3 px-4 font-mono text-emerald-700 font-semibold">
                    ₹{Number(part.unit_cost_demo_inr).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    {part.stock_status === 'Reorder' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300">
                        REORDER
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                        IN STOCK
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center space-x-1">
                      <button
                        onClick={() => updateStock(part.part_id, -1)}
                        className="p-1 rounded bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 cursor-pointer"
                        title="Issue 1 Part"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => updateStock(part.part_id, 1)}
                        className="p-1 rounded bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-300 cursor-pointer"
                        title="Receive 1 Part"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
