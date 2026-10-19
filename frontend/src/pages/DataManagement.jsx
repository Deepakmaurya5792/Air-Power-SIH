import React, { useState } from 'react';
import {
  Database,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  RefreshCw,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function DataManagement() {
  const [activeTab, setActiveTab] = useState('summary');
  const [uploadStatus, setUploadStatus] = useState(null);

  const datasets = [
    {
      name: 'synthetic_health_training.csv',
      purpose: 'AI Model Training (Random Forest Failure Classifier)',
      rows: '4,000',
      columns: 16,
      target: 'failure_next_30_days',
      status: 'Active / Validated'
    },
    {
      name: 'synthetic_aircraft_fleet.csv',
      purpose: 'Fleet Asset Master Registry & Readiness Status',
      rows: '150',
      columns: 8,
      target: 'N/A',
      status: 'Active / Validated'
    },
    {
      name: 'synthetic_sensor_history.csv',
      purpose: 'Daily Multi-Sensor Time-Series Telemetry',
      rows: '1,800',
      columns: 8,
      target: 'anomaly_flag_demo',
      status: 'Active / Validated'
    },
    {
      name: 'synthetic_maintenance_work_orders.csv',
      purpose: 'Engineering Work Orders & Triage Tracking',
      rows: '320',
      columns: 11,
      target: 'N/A',
      status: 'Active / Validated'
    },
    {
      name: 'synthetic_spare_parts_inventory.csv',
      purpose: 'Central Depot Parts Stock & Reorder Levels',
      rows: '40',
      columns: 8,
      target: 'stock_status',
      status: 'Active / Validated'
    }
  ];

  const handleSimulatedUpload = (e) => {
    e.preventDefault();
    setUploadStatus('uploading');
    setTimeout(() => {
      setUploadStatus('success');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-wide flex items-center space-x-2">
          <Database className="w-5 h-5 text-sky-600" />
          <span>Data Ingestion & Dataset Schema Architecture</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Synthetic dataset registries, schema mapping layer, and authorized telemetry ingestion pipeline.
        </p>
      </div>

      {/* Dataset Summary Cards */}
      <div className="tech-panel p-5 rounded-xl space-y-4 bg-white/95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Active Synthetic Data Registries</h3>
          <span className="text-xs font-mono text-emerald-700 font-bold">All 5 Datasets Connected</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {datasets.map((ds) => (
            <div key={ds.name} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-sky-700 truncate max-w-[200px]">
                  {ds.name}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold">
                  {ds.status}
                </span>
              </div>
              <p className="text-xs text-slate-700">{ds.purpose}</p>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] font-mono text-slate-500">
                <span>Rows: {ds.rows}</span>
                <span>Cols: {ds.columns}</span>
                {ds.target !== 'N/A' && <span className="text-sky-700 font-semibold">Target: {ds.target}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSV Ingestion Adapter Simulator */}
      <div className="tech-panel p-5 rounded-xl space-y-4 bg-white/95">
        <div className="pb-3 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Upload className="w-4 h-4 text-sky-600" />
            <span>Authorized Dataset Ingestion & Validation Gateway</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload new operational batches for schema validation and automated ML retraining.
          </p>
        </div>

        <form onSubmit={handleSimulatedUpload} className="space-y-4">
          <div className="border-2 border-dashed border-sky-300 rounded-xl p-8 text-center bg-sky-50/50 hover:bg-sky-50 transition-colors">
            <Upload className="w-8 h-8 text-sky-600 mx-auto mb-2" />
            <p className="text-xs text-slate-800 font-medium">
              Drag and drop telemetry CSV or <span className="text-sky-600 underline cursor-pointer font-bold">browse files</span>
            </p>
            <p className="text-[10px] text-slate-500 mt-1 font-mono">
              Accepted formats: .csv (Max 50MB). Auto-validates against feature schema dictionary.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-amber-800 font-mono font-medium">
              Notice: Uploading a file does not auto-activate production models without explicit approval.
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider font-mono shadow-md cursor-pointer"
            >
              Validate & Ingest Batch
            </button>
          </div>
        </form>

        {uploadStatus === 'success' && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 flex items-center space-x-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Dataset validation succeeded! 100% columns mapped, 0 missing rows. Ready for training queue.</span>
          </div>
        )}
      </div>
    </div>
  );
}
