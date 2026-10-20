import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plane,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  PackageCheck,
  TrendingUp,
  Cpu,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { API_BASE_URL } from '../apiConfig';

const DEFAULT_KPI_DATA = {
  totalAircraft: 150,
  missionReady: 94,
  underMaintenance: 25,
  awaitingParts: 6,
  available: 94,
  inspectionDue: 25,
  availabilityRate: 62.7,
  openWorkOrders: 181,
  highPriorityOrders: 14,
  lowStockParts: 8,
  anomalyCount: 114,
  statusDistribution: [
    { name: 'Available', value: 94, color: '#10B981' },
    { name: 'Under Maintenance', value: 25, color: '#EF4444' },
    { name: 'Awaiting Parts', value: 19, color: '#F59E0B' },
    { name: 'Inspection Due', value: 12, color: '#38BDF8' }
  ],
  typeDistribution: [
    { name: 'Fighter', count: 62 },
    { name: 'Transport', count: 35 },
    { name: 'Helicopter', count: 31 },
    { name: 'Reconnaissance', count: 22 }
  ],
  is_simulation_mode: true
};

const DEFAULT_TREND_DATA = [
  { date: 'Day -13', historical: 74.2, forecast: null },
  { date: 'Day -11', historical: 75.8, forecast: null },
  { date: 'Day -9', historical: 71.3, forecast: null },
  { date: 'Day -7', historical: 68.9, forecast: null },
  { date: 'Day -5', historical: 66.4, forecast: null },
  { date: 'Day -3', historical: 64.1, forecast: null },
  { date: 'Day -1', historical: 62.7, forecast: 62.7 },
  { date: 'Day +2', historical: null, forecast: 65.2 },
  { date: 'Day +4', historical: null, forecast: 68.4 },
  { date: 'Day +6', historical: null, forecast: 71.0 },
  { date: 'Day +8', historical: null, forecast: 74.5 },
  { date: 'Day +10', historical: null, forecast: 78.1 },
  { date: 'Day +12', historical: null, forecast: 81.3 },
  { date: 'Day +14', historical: null, forecast: 84.6 }
];

export default function CommandCenter() {
  const navigate = useNavigate();
  const [kpiData, setKpiData] = useState(DEFAULT_KPI_DATA);
  const [trendData, setTrendData] = useState(DEFAULT_TREND_DATA);
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('14d');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const [kpiRes, trendRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/kpi/summary`, { signal: controller.signal }),
        fetch(`${API_BASE_URL}/api/kpi/availability-trend`, { signal: controller.signal })
      ]);
      clearTimeout(timeoutId);

      if (kpiRes.ok && trendRes.ok) {
        const kpi = await kpiRes.json();
        const trend = await trendRes.json();
        setKpiData(kpi);
        if (trend.trend && trend.trend.length > 0) {
          setTrendData(trend.trend);
        }
        setIsLive(true);
      }
    } catch (err) {
      console.warn('Backend offline or slow start, displaying operational seed dataset:', err.message);
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner Alert */}
      <div className="tech-panel p-4 rounded-xl border border-sky-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/95 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
              Operational Fleet Readiness Status // Sector Alpha
            </h2>
            <p className="text-xs text-slate-600">
              Real-time synchronization with active synthetic telemetry stream. Model version:{' '}
              <span className="text-sky-700 font-mono font-bold">v1.2.0-RF</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border ${
              isLive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-amber-50 text-amber-700 border-amber-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>{isLive ? 'LIVE TELEMETRY' : 'SEED TELEMETRY'}</span>
          </span>

          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg border border-sky-200 bg-sky-50 hover:bg-sky-100 text-xs font-mono text-sky-800 flex items-center space-x-1.5 transition-colors cursor-pointer font-semibold disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Syncing...' : 'Sync Live'}</span>
          </button>
          <button
            onClick={() => navigate('/predictive-ai')}
            className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-[0_2px_12px_rgba(14,165,233,0.3)] cursor-pointer"
          >
            <span>Run ML Inference</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Aircraft */}
        <div
          onClick={() => navigate('/fleet')}
          className="tech-panel tech-panel-interactive p-4 rounded-xl cursor-pointer bg-white/95"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">Total Fleet Assets</span>
            <Plane className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">{kpiData.totalAircraft}</p>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>Mission Ready:</span>
            <span className="font-semibold text-emerald-600">{kpiData.missionReady} ({kpiData.availabilityRate}%)</span>
          </div>
        </div>

        {/* Under Maintenance */}
        <div
          onClick={() => navigate('/work-orders')}
          className="tech-panel tech-panel-interactive p-4 rounded-xl cursor-pointer bg-white/95"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">Under Maintenance</span>
            <Wrench className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-3xl font-extrabold text-rose-600 mt-2 font-mono">{kpiData.underMaintenance}</p>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>Awaiting Parts:</span>
            <span className="font-semibold text-amber-600">{kpiData.awaitingParts} Units</span>
          </div>
        </div>

        {/* Open Work Orders */}
        <div
          onClick={() => navigate('/work-orders')}
          className="tech-panel tech-panel-interactive p-4 rounded-xl cursor-pointer bg-white/95"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">Open Work Orders</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600 mt-2 font-mono">{kpiData.openWorkOrders}</p>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>High Priority / Escalated:</span>
            <span className="font-semibold text-rose-600">{kpiData.highPriorityOrders} orders</span>
          </div>
        </div>

        {/* Sensor Anomalies & Low Stock */}
        <div
          onClick={() => navigate('/sensor-intelligence')}
          className="tech-panel tech-panel-interactive p-4 rounded-xl cursor-pointer bg-white/95"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">Telemetry Anomalies</span>
            <Cpu className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold text-indigo-600 mt-2 font-mono">{kpiData.anomalyCount}</p>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>Critical Parts Low Stock:</span>
            <span className="font-semibold text-amber-600">{kpiData.lowStockParts} Items</span>
          </div>
        </div>
      </div>

      {/* Main Charts Section: Availability Forecast & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Availability Trend & 14-day Simulation */}
        <div className="lg:col-span-2 tech-panel p-5 rounded-xl flex flex-col justify-between bg-white/95">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-wide flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-sky-600" />
                <span>Fleet Availability Forecast // Historical vs. Simulated Projection</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Readiness Benchmark: <span className="text-emerald-600 font-mono font-bold">85.0%</span>
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-sky-50 text-sky-700 border border-sky-300 font-semibold">
                Solid: Historical
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-300 font-semibold">
                Dashed: Forecast
              </span>
            </div>
          </div>

          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="availHistorical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284C7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0284C7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="availForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} domain={[50, 95]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: 'rgba(14, 165, 233, 0.4)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#0F172A',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="historical"
                  stroke="#0284C7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#availHistorical)"
                  name="Historical (%)"
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="#6366F1"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#availForecast)"
                  name="Simulated Forecast (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100">
            <span>Projection confidence interval: ±3.2% based on standard repair lead times.</span>
            <button
              onClick={() => navigate('/forecast')}
              className="text-sky-600 hover:text-sky-700 font-mono font-semibold flex items-center space-x-1"
            >
              <span>Detailed Scenario Modeling</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Fleet Status Donut */}
        <div className="tech-panel p-5 rounded-xl flex flex-col justify-between bg-white/95">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">Fleet Status Distribution</h3>
            <p className="text-xs text-slate-500">Current triage categorization</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={kpiData.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {kpiData.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: 'rgba(14, 165, 233, 0.4)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#0F172A',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            {kpiData.statusDistribution.map((item) => (
              <div
                key={item.name}
                onClick={() => navigate(`/fleet?status=${encodeURIComponent(item.name)}`)}
                className="flex items-center space-x-2 cursor-pointer hover:bg-slate-100 p-1 rounded transition-colors"
              >
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[11px] text-slate-700 truncate">{item.name}</span>
                <span className="text-[11px] font-mono text-slate-900 ml-auto font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Aircraft Type Breakdown & Priority Escalations Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Aircraft Type Distribution */}
        <div className="tech-panel p-5 rounded-xl bg-white/95">
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">Aircraft Categories</h3>
            <span className="text-xs text-slate-500 font-mono font-semibold">150 Units Total</span>
          </div>

          <div className="h-48 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpiData.typeDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: 'rgba(14, 165, 233, 0.4)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#0F172A',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="count" fill="#0284C7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Escalations Panel */}
        <div className="lg:col-span-2 tech-panel p-5 rounded-xl bg-white/95">
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 tracking-wide flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Critical Fleet Watchlist & Next Inspections</span>
            </h3>
            <button
              onClick={() => navigate('/fleet')}
              className="text-xs text-sky-600 hover:text-sky-700 font-mono font-bold flex items-center space-x-1"
            >
              <span>View Full Fleet</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3 space-y-2.5">
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-800 font-mono">AIR-003 // Fighter (demo)</span>
                <p className="text-[11px] text-slate-700">Under Maintenance at Unit-C. High vibration profile logged.</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-700 border border-rose-300">
                HIGH RISK
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-800 font-mono">AIR-004 // Helicopter (demo)</span>
                <p className="text-[11px] text-slate-700">Inspection due: 0 days (OVERDUE). Assigned to Unit-C.</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                INSPECTION DUE
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 font-mono">AIR-001 // Transport (demo)</span>
                <p className="text-[11px] text-slate-700">Available & Mission Ready. 11,800 Flight Hours Total.</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                MISSION READY
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
