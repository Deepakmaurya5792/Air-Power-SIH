import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  UserCheck,
  Tag,
  Package,
  X
} from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

const COLUMNS = ['Open', 'In Progress', 'Waiting for Parts', 'Completed'];

const DEFAULT_WORK_ORDERS = [
  { work_order_id: 'WO-101', aircraft_id: 'AIR-003', component_id: 'CMP-018', maintenance_type: 'Corrective', priority: 'High', status: 'In Progress', estimated_repair_hours: '36', required_part_id: 'PART-004', maintenance_unit: 'Unit-C (demo)', notes: 'Turbofan core excessive vibration detected in post-flight debrief.', created_at: '2024-03-01' },
  { work_order_id: 'WO-102', aircraft_id: 'AIR-004', component_id: 'CMP-007', maintenance_type: 'Preventive', priority: 'Medium', status: 'Waiting for Parts', estimated_repair_hours: '18', required_part_id: 'PART-002', maintenance_unit: 'Unit-C (demo)', notes: 'Awaiting hydraulic seal actuators from central logistics depot.', created_at: '2024-03-02' },
  { work_order_id: 'WO-103', aircraft_id: 'AIR-006', component_id: 'CMP-012', maintenance_type: 'Condition-Based', priority: 'High', status: 'Open', estimated_repair_hours: '24', required_part_id: 'PART-001', maintenance_unit: 'Unit-B (demo)', notes: 'Telemetry anomaly flag: Engine thermal envelope exceeded benchmark.', created_at: '2024-03-03' },
  { work_order_id: 'WO-104', aircraft_id: 'AIR-001', component_id: 'CMP-001', maintenance_type: 'Preventive', priority: 'Low', status: 'Completed', estimated_repair_hours: '12', required_part_id: 'PART-003', maintenance_unit: 'Unit-A (demo)', notes: 'Routine 200-hour borescope inspection completed with nominal clearance.', created_at: '2024-02-28' }
];

export default function WorkOrders() {
  const [workOrders, setWorkOrders] = useState(DEFAULT_WORK_ORDERS);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modal create work order
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    aircraft_id: 'AIR-001',
    component_id: 'CMP-001',
    maintenance_type: 'Preventive',
    priority: 'Medium',
    status: 'Open',
    estimated_repair_hours: '24',
    required_part_id: 'PART-001',
    maintenance_unit: 'Unit-A (demo)',
    notes: 'Routine scheduled maintenance inspection'
  });

  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${API_BASE_URL}/api/work-orders`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.workOrders && data.workOrders.length > 0) {
          setWorkOrders(data.workOrders);
        }
      }
    } catch (err) {
      console.warn('Backend unavailable, using seed work orders:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const handleStatusChange = async (orderId, nextStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/work-orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setWorkOrders((prev) =>
          prev.map((w) => (w.work_order_id === orderId ? { ...w, status: nextStatus } : w))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/work-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const created = await res.json();
        setWorkOrders([created, ...workOrders]);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to create work order:', err);
    }
  };

  const filteredOrders = workOrders.filter((w) => {
    const matchQuery =
      w.work_order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.aircraft_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.component_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPriority = priorityFilter === 'All' || w.priority === priorityFilter;
    return matchQuery && matchPriority;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-300">HIGH PRIORITY</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-300">LOW</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-wide flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-sky-600" />
            <span>Tactical Maintenance Work Orders // Triage Operations</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch, track, and update repair queues across engineering maintenance units.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-md cursor-pointer self-start md:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>New Work Order</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="tech-panel p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 bg-white/95">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search order ID, aircraft, component..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="All">Priority: All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <span className="text-xs font-mono text-slate-500 font-semibold">
            Total Orders: <strong className="text-slate-900">{filteredOrders.length}</strong>
          </span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((column) => {
          const columnOrders = filteredOrders.filter((w) => w.status === column);
          return (
            <div key={column} className="tech-panel p-4 rounded-xl flex flex-col h-[700px] bg-white/95">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800">
                  {column}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-300">
                  {columnOrders.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {columnOrders.map((order) => (
                  <div
                    key={order.work_order_id}
                    className="p-3.5 rounded-lg bg-slate-50/80 border border-slate-200 hover:border-sky-400 transition-all space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-700 font-mono">
                        {order.work_order_id}
                      </span>
                      {getPriorityBadge(order.priority)}
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-slate-900 font-semibold flex items-center justify-between">
                        <span>Aircraft: {order.aircraft_id}</span>
                        <span className="text-[10px] font-mono text-slate-500">{order.component_id}</span>
                      </p>
                      <p className="text-slate-600 text-[11px] leading-snug">{order.notes}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Est: {order.estimated_repair_hours}h</span>
                      <span>{order.maintenance_unit}</span>
                    </div>

                    {/* Quick Move Status Selector */}
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono font-semibold">Move:</span>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.work_order_id, e.target.value)}
                        className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-[10px] text-sky-800 font-mono focus:outline-none font-semibold"
                      >
                        {COLUMNS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Dialog for Create Work Order */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="tech-panel p-6 rounded-2xl max-w-lg w-full border border-sky-300 shadow-2xl relative bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Wrench className="w-4 h-4 text-sky-600" />
                <span>Create Maintenance Work Order</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-mono text-[10px] uppercase font-semibold">Aircraft ID</label>
                  <input
                    type="text"
                    required
                    value={formData.aircraft_id}
                    onChange={(e) => setFormData({ ...formData, aircraft_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 mt-1 focus:bg-white focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-mono text-[10px] uppercase font-semibold">Component ID</label>
                  <input
                    type="text"
                    required
                    value={formData.component_id}
                    onChange={(e) => setFormData({ ...formData, component_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 mt-1 focus:bg-white focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-mono text-[10px] uppercase font-semibold">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 mt-1 focus:bg-white focus:border-sky-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-600 font-mono text-[10px] uppercase font-semibold">Unit</label>
                  <select
                    value={formData.maintenance_unit}
                    onChange={(e) => setFormData({ ...formData, maintenance_unit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 mt-1 focus:bg-white focus:border-sky-500"
                  >
                    <option value="Unit-A (demo)">Unit-A</option>
                    <option value="Unit-B (demo)">Unit-B</option>
                    <option value="Unit-C (demo)">Unit-C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-mono text-[10px] uppercase font-semibold">Required Spare Part ID</label>
                <input
                  type="text"
                  value={formData.required_part_id}
                  onChange={(e) => setFormData({ ...formData, required_part_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 mt-1 focus:bg-white focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-mono text-[10px] uppercase font-semibold">Engineering Notes</label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 mt-1 focus:bg-white focus:border-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-slate-100 text-slate-700 font-mono hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold uppercase tracking-wider font-mono shadow-md"
                >
                  Confirm & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
