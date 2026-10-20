import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  Bell,
  Sliders,
  Database,
  Lock,
  UserCheck,
  RefreshCw,
  Clock
} from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

const DEFAULT_LOGS = [
  { id: 'AUD-001', action: 'SYSTEM_BOOT', details: 'AIR POWER telemetry stream initialized with synthetic seed data', timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'System Admin' },
  { id: 'AUD-002', action: 'ML_MODEL_SYNC', details: 'Predictive RF model v1.2.0 synchronized with inference gateway', timestamp: new Date(Date.now() - 1800000).toISOString(), user: 'AI Pipeline' },
  { id: 'AUD-003', action: 'WORK_ORDER_DISPATCH', details: 'Priority repair order WO-101 created for AIR-003 (Turbofan)', timestamp: new Date(Date.now() - 900000).toISOString(), user: 'Maintenance Officer' },
  { id: 'AUD-004', action: 'INVENTORY_REORDER_ALERT', details: 'Automated reorder trigger generated for PART-004 (Brake Discs)', timestamp: new Date(Date.now() - 300000).toISOString(), user: 'Automated Logistics' }
];

export default function SettingsPage() {
  const [logs, setLogs] = useState(DEFAULT_LOGS);
  const [threshold, setThreshold] = useState(65);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/audit-logs`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setLogs(data);
      })
      .catch((err) => console.warn('Using baseline audit logs:', err.message));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-wide flex items-center space-x-2">
          <Settings className="w-5 h-5 text-sky-600" />
          <span>System Settings & Immutable Audit Trail</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Configure telemetry thresholds, role authorizations, and review system audit records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Configurations */}
        <div className="tech-panel p-5 rounded-xl space-y-4 bg-white/95">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-sky-600" />
              <span>Operational Risk Parameters</span>
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-mono text-slate-700 mb-1 font-semibold">
                <span>Critical Risk Probability Alert Threshold:</span>
                <span className="text-rose-600 font-bold">{threshold}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="90"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full accent-rose-600"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Predictions above this probability automatically flag the aircraft on the Command Center watchlist.
              </p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <p className="font-semibold text-slate-800">Live Telemetry Auto-Polling</p>
                <p className="text-[10px] text-slate-500">Stream simulated sensor ticks every 10 seconds.</p>
              </div>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={() => setAutoRefresh(!autoRefresh)}
                className="w-4 h-4 accent-sky-600 cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-800">
              <span className="font-mono font-bold text-[11px] block">SECURITY CLEARANCE LEVEL 3</span>
              <p className="text-[11px] mt-0.5">
                Model activation requires multi-factor approval from Maintenance Wing Commander.
              </p>
            </div>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="tech-panel p-5 rounded-xl space-y-4 bg-white/95">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>Immutable Audit Event Trail</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500 font-semibold">{logs.length} logged events</span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sky-700 text-[11px]">{log.action}</span>
                  <span className="font-mono text-slate-500 text-[10px]">
                    {log.timestamp ? log.timestamp.split('T')[1].slice(0, 8) : '00:00:00'} UTC
                  </span>
                </div>
                <p className="text-slate-700 text-[11px]">{log.details}</p>
                <span className="text-[10px] text-slate-500 font-mono">User: {log.user}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
