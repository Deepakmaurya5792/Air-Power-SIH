import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Plane,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  AlertOctagon,
  Clock,
  Wrench,
  Grid,
  List,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

const DEFAULT_FLEET = [
  { aircraft_id: 'AIR-001', aircraft_type: 'Transport', status: 'Mission Ready', flight_hours_total: '11820', last_maintenance_date: '2024-02-10', next_inspection_due_days: '45', assigned_maintenance_unit: 'Unit-A (demo)', health_index: '88.5' },
  { aircraft_id: 'AIR-002', aircraft_type: 'Fighter', status: 'Mission Ready', flight_hours_total: '9450', last_maintenance_date: '2024-02-18', next_inspection_due_days: '32', assigned_maintenance_unit: 'Unit-B (demo)', health_index: '92.0' },
  { aircraft_id: 'AIR-003', aircraft_type: 'Fighter', status: 'Under Maintenance', flight_hours_total: '10600', last_maintenance_date: '2024-01-20', next_inspection_due_days: '5', assigned_maintenance_unit: 'Unit-C (demo)', health_index: '64.2' },
  { aircraft_id: 'AIR-004', aircraft_type: 'Helicopter', status: 'Inspection Due', flight_hours_total: '8300', last_maintenance_date: '2024-01-05', next_inspection_due_days: '0', assigned_maintenance_unit: 'Unit-C (demo)', health_index: '71.0' },
  { aircraft_id: 'AIR-005', aircraft_type: 'Reconnaissance', status: 'Mission Ready', flight_hours_total: '7200', last_maintenance_date: '2024-03-01', next_inspection_due_days: '60', assigned_maintenance_unit: 'Unit-A (demo)', health_index: '95.4' },
  { aircraft_id: 'AIR-006', aircraft_type: 'Fighter', status: 'Awaiting Parts', flight_hours_total: '12100', last_maintenance_date: '2024-01-15', next_inspection_due_days: '12', assigned_maintenance_unit: 'Unit-B (demo)', health_index: '58.0' },
  { aircraft_id: 'AIR-007', aircraft_type: 'Transport', status: 'Mission Ready', flight_hours_total: '14300', last_maintenance_date: '2024-02-25', next_inspection_due_days: '40', assigned_maintenance_unit: 'Unit-A (demo)', health_index: '86.0' },
  { aircraft_id: 'AIR-008', aircraft_type: 'Helicopter', status: 'Mission Ready', flight_hours_total: '6500', last_maintenance_date: '2024-03-05', next_inspection_due_days: '55', assigned_maintenance_unit: 'Unit-B (demo)', health_index: '91.2' },
  { aircraft_id: 'AIR-009', aircraft_type: 'Fighter', status: 'Under Maintenance', flight_hours_total: '10950', last_maintenance_date: '2024-01-30', next_inspection_due_days: '8', assigned_maintenance_unit: 'Unit-C (demo)', health_index: '67.8' },
  { aircraft_id: 'AIR-010', aircraft_type: 'Reconnaissance', status: 'Mission Ready', flight_hours_total: '8800', last_maintenance_date: '2024-02-20', next_inspection_due_days: '38', assigned_maintenance_unit: 'Unit-A (demo)', health_index: '89.1' },
  { aircraft_id: 'AIR-011', aircraft_type: 'Fighter', status: 'Mission Ready', flight_hours_total: '9900', last_maintenance_date: '2024-03-02', next_inspection_due_days: '50', assigned_maintenance_unit: 'Unit-B (demo)', health_index: '93.5' },
  { aircraft_id: 'AIR-012', aircraft_type: 'Transport', status: 'Awaiting Parts', flight_hours_total: '13200', last_maintenance_date: '2024-01-10', next_inspection_due_days: '15', assigned_maintenance_unit: 'Unit-C (demo)', health_index: '61.4' }
];

export default function FleetOverview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [fleet, setFleet] = useState(DEFAULT_FLEET);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  // Filters
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [unitFilter, setUnitFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const fetchFleet = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (typeFilter !== 'All') params.append('type', typeFilter);
      if (unitFilter !== 'All') params.append('unit', unitFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${API_BASE_URL}/api/fleet?${params.toString()}`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.aircraft && data.aircraft.length > 0) {
          setFleet(data.aircraft);
          setPage(1);
          return;
        }
      }
      throw new Error('Using fallback fleet');
    } catch (err) {
      let filtered = [...DEFAULT_FLEET];
      if (statusFilter !== 'All') filtered = filtered.filter(f => f.status.toLowerCase().includes(statusFilter.toLowerCase()));
      if (typeFilter !== 'All') filtered = filtered.filter(f => f.aircraft_type.toLowerCase() === typeFilter.toLowerCase());
      if (unitFilter !== 'All') filtered = filtered.filter(f => f.assigned_maintenance_unit.includes(unitFilter));
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(f => f.aircraft_id.toLowerCase().includes(q) || f.aircraft_type.toLowerCase().includes(q));
      }
      setFleet(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFleet();
  }, [statusFilter, typeFilter, unitFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFleet();
  };

  const exportCsv = () => {
    if (!fleet.length) return;
    const headers = Object.keys(fleet[0]).join(',');
    const rows = fleet.map(row => Object.values(row).map(val => `"${val}"`).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `air_power_fleet_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination slice
  const totalPages = Math.ceil(fleet.length / pageSize) || 1;
  const paginatedFleet = fleet.slice((page - 1) * pageSize, page * pageSize);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">AVAILABLE</span>;
      case 'Under Maintenance':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-300">MAINTENANCE</span>;
      case 'Awaiting Parts':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300">PARTS DUE</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-wide flex items-center space-x-2">
            <Plane className="w-5 h-5 text-sky-600" />
            <span>Tactical Fleet Registry & Asset Directory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Displaying simulated inventory of 150 aircraft units across multi-domain roles.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View toggle */}
          <div className="flex items-center bg-white border border-sky-300 rounded-lg p-1 shadow-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-sky-50 text-sky-700 font-bold' : 'text-slate-400 hover:text-slate-700'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded ${viewMode === 'card' ? 'bg-sky-50 text-sky-700 font-bold' : 'text-slate-400 hover:text-slate-700'}`}
              title="Card View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={exportCsv}
            className="px-3 py-1.5 rounded-lg border border-sky-300 bg-white hover:bg-sky-50 text-xs font-mono text-sky-800 flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="tech-panel p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 bg-white/95">
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Aircraft ID, type, unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 text-xs font-mono font-semibold"
          >
            Filter
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="All">Status: All</option>
            <option value="Available">Available</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Awaiting Parts">Awaiting Parts</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="All">Type: All</option>
            <option value="Fighter (demo)">Fighter</option>
            <option value="Transport (demo)">Transport</option>
            <option value="Helicopter (demo)">Helicopter</option>
            <option value="Trainer (demo)">Trainer</option>
          </select>

          {/* Unit Filter */}
          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="All">Unit: All</option>
            <option value="Unit-A (demo)">Unit-A</option>
            <option value="Unit-B (demo)">Unit-B</option>
            <option value="Unit-C (demo)">Unit-C</option>
          </select>

          <span className="text-xs font-mono text-slate-500 font-semibold">
            Found: <strong className="text-slate-900">{fleet.length}</strong>
          </span>
        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh] space-x-3 text-sky-600">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="font-mono text-xs font-semibold">Loading Fleet Inventory...</span>
        </div>
      ) : fleet.length === 0 ? (
        <div className="tech-panel p-12 text-center rounded-xl bg-white/95">
          <AlertOctagon className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Matching Aircraft Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting filters or adjusting search parameters.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="tech-panel rounded-xl overflow-hidden bg-white/95">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-mono uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Aircraft ID</th>
                  <th className="py-3 px-4">Role / Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Flight Hours</th>
                  <th className="py-3 px-4">Last Maint.</th>
                  <th className="py-3 px-4">Next Inspection</th>
                  <th className="py-3 px-4">Assigned Unit</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedFleet.map((craft) => (
                  <tr
                    key={craft.aircraft_id}
                    onClick={() => navigate(`/aircraft-health?id=${craft.aircraft_id}`)}
                    className="hover:bg-sky-50/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-sky-700 group-hover:text-sky-900">
                      {craft.aircraft_id}
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{craft.aircraft_type}</td>
                    <td className="py-3 px-4">{getStatusBadge(craft.status)}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{Number(craft.flight_hours_total).toLocaleString()} hrs</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{craft.last_maintenance_date}</td>
                    <td className="py-3 px-4">
                      <span className={`font-mono font-semibold ${parseInt(craft.next_inspection_due_days, 10) <= 7 ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                        {craft.next_inspection_due_days} days
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{craft.assigned_maintenance_unit}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/aircraft-health?id=${craft.aircraft_id}`);
                        }}
                        className="p-1 rounded hover:bg-sky-100 text-slate-500 hover:text-sky-700"
                        title="View Telemetry & Health"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedFleet.map((craft) => (
            <div
              key={craft.aircraft_id}
              onClick={() => navigate(`/aircraft-health?id=${craft.aircraft_id}`)}
              className="tech-panel tech-panel-interactive p-4 rounded-xl cursor-pointer bg-white/95"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-base font-bold text-sky-700 font-mono">{craft.aircraft_id}</span>
                  <p className="text-xs text-slate-700 font-medium">{craft.aircraft_type}</p>
                </div>
                {getStatusBadge(craft.status)}
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span>Flight Hours:</span>
                  <span className="font-mono text-slate-800 font-semibold">{Number(craft.flight_hours_total).toLocaleString()} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span>Inspection In:</span>
                  <span className={`font-mono font-semibold ${parseInt(craft.next_inspection_due_days, 10) <= 7 ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                    {craft.next_inspection_due_days} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Maintenance Unit:</span>
                  <span className="font-mono text-slate-700">{craft.assigned_maintenance_unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 font-medium">
        <span>
          Showing page <strong className="text-slate-800">{page}</strong> of <strong className="text-slate-800">{totalPages}</strong> ({fleet.length} total aircraft)
        </span>
        <div className="flex items-center space-x-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sky-50 cursor-pointer shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sky-50 cursor-pointer shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
