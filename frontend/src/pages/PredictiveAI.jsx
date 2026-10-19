import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Cpu,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
  BarChart2,
  HelpCircle,
  Database
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { API_BASE_URL } from '../apiConfig';

export default function PredictiveAI() {
  const [modelMetrics, setModelMetrics] = useState(null);
  const [sampleRecords, setSampleRecords] = useState([]);
  const [selectedSample, setSelectedSample] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [inferring, setInferring] = useState(false);

  // Feature Input State
  const [features, setFeatures] = useState({
    flight_hours: 10128.5,
    engine_temperature_c: 531.0,
    oil_pressure_kpa: 52.6,
    vibration_mm_s: 3.08,
    fuel_flow_kg_h: 898.1,
    hydraulic_pressure_psi: 3077.8,
    brake_temperature_c: 143.7,
    component_age_days: 455,
    previous_failures: 0,
    maintenance_count: 6,
    days_since_maintenance: 467,
    health_index: 76.0
  });

  // Threshold controls
  const [highRiskThreshold, setHighRiskThreshold] = useState(0.65);

  useEffect(() => {
    // 1. Fetch ML Metrics
    fetch(`${API_BASE_URL}/api/ml/metrics`)
      .then((res) => res.json())
      .then((data) => setModelMetrics(data))
      .catch((err) => console.error('Failed to load ML metrics:', err));

    // 2. Fetch Sample records for fast presets
    fetch(`${API_BASE_URL}/api/ml/sample-records?limit=10`)
      .then((res) => res.json())
      .then((data) => setSampleRecords(data.records || []))
      .catch((err) => console.error('Failed to load sample records:', err));
  }, []);

  const handleSampleSelect = (e) => {
    const recId = e.target.value;
    setSelectedSample(recId);
    const found = sampleRecords.find((r) => r.record_id === recId);
    if (found) {
      setFeatures({
        flight_hours: parseFloat(found.flight_hours || 0),
        engine_temperature_c: parseFloat(found.engine_temperature_c || 0),
        oil_pressure_kpa: parseFloat(found.oil_pressure_kpa || 0),
        vibration_mm_s: parseFloat(found.vibration_mm_s || 0),
        fuel_flow_kg_h: parseFloat(found.fuel_flow_kg_h || 0),
        hydraulic_pressure_psi: parseFloat(found.hydraulic_pressure_psi || 0),
        brake_temperature_c: parseFloat(found.brake_temperature_c || 0),
        component_age_days: parseFloat(found.component_age_days || 0),
        previous_failures: parseInt(found.previous_failures || 0, 10),
        maintenance_count: parseInt(found.maintenance_count || 0, 10),
        days_since_maintenance: parseFloat(found.days_since_maintenance || 0),
        health_index: parseFloat(found.health_index || 0)
      });
    }
  };

  const runPrediction = async () => {
    setInferring(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ml/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(features)
      });
      if (res.ok) {
        const result = await res.json();
        setPrediction(result);
      }
    } catch (err) {
      console.error('Inference error:', err);
    } finally {
      setInferring(false);
    }
  };

  const featureImportanceList = modelMetrics?.feature_importances
    ? Object.keys(modelMetrics.feature_importances).map((key) => ({
        name: key,
        importance: parseFloat((modelMetrics.feature_importances[key] * 100).toFixed(1))
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-wide flex items-center space-x-2">
            <BrainCircuit className="w-5 h-5 text-indigo-600" />
            <span>AI Predictive Maintenance Engine // 30-Day Failure Classifier</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Supervised Random Forest ensemble trained on 4,000 multi-spectral synthetic flight records.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-semibold">
            Model: {modelMetrics?.model_version || 'v1.2.0-RF-Ensemble'}
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-semibold">
            ROC-AUC: {modelMetrics?.roc_auc || '0.900'}
          </span>
        </div>
      </div>

      {/* Model Performance Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="tech-panel p-3.5 rounded-xl bg-white/95">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Test Set Accuracy</span>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">
            {modelMetrics ? `${(modelMetrics.accuracy * 100).toFixed(1)}%` : '84.6%'}
          </p>
          <span className="text-[10px] text-slate-500">800 held-out evaluations</span>
        </div>

        <div className="tech-panel p-3.5 rounded-xl bg-white/95">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Precision Score</span>
          <p className="text-2xl font-bold text-sky-600 mt-1 font-mono">
            {modelMetrics ? `${(modelMetrics.precision * 100).toFixed(1)}%` : '67.2%'}
          </p>
          <span className="text-[10px] text-slate-500">Simulated true positives</span>
        </div>

        <div className="tech-panel p-3.5 rounded-xl bg-white/95">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Recall Rate</span>
          <p className="text-2xl font-bold text-teal-600 mt-1 font-mono">
            {modelMetrics ? `${(modelMetrics.recall * 100).toFixed(1)}%` : '64.7%'}
          </p>
          <span className="text-[10px] text-slate-500">Failure capture sensitivity</span>
        </div>

        <div className="tech-panel p-3.5 rounded-xl bg-white/95">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">F1 Harmonic Mean</span>
          <p className="text-2xl font-bold text-indigo-600 mt-1 font-mono">
            {modelMetrics ? `${(modelMetrics.f1_score * 100).toFixed(1)}%` : '65.9%'}
          </p>
          <span className="text-[10px] text-slate-500">Class imbalance balanced</span>
        </div>
      </div>

      {/* Inference Console & Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Feature Tuning Console */}
        <div className="lg:col-span-7 tech-panel p-5 rounded-xl space-y-4 bg-white/95">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900">Component Telemetry Input Simulator</h3>
            </div>

            {/* Preset Selector */}
            <select
              value={selectedSample}
              onChange={handleSampleSelect}
              className="bg-slate-50 border border-sky-300 rounded px-2.5 py-1 text-xs text-sky-800 font-mono focus:outline-none focus:border-sky-500 font-semibold"
            >
              <option value="">Load Training Preset...</option>
              {sampleRecords.map((r) => (
                <option key={r.record_id} value={r.record_id}>
                  {r.record_id} ({r.aircraft_id} / {r.component_id})
                </option>
              ))}
            </select>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
            <div>
              <label className="text-slate-600 font-mono text-[10px] uppercase font-semibold">Engine Temp (°C)</label>
              <input
                type="number"
                value={features.engine_temperature_c}
                onChange={(e) => setFeatures({ ...features, engine_temperature_c: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 mt-1 focus:bg-white focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-mono text-[10px] uppercase font-semibold">Vibration (mm/s)</label>
              <input
                type="number"
                step="0.1"
                value={features.vibration_mm_s}
                onChange={(e) => setFeatures({ ...features, vibration_mm_s: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 mt-1 focus:bg-white focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-mono text-[10px] uppercase font-semibold">Oil Pressure (kPa)</label>
              <input
                type="number"
                value={features.oil_pressure_kpa}
                onChange={(e) => setFeatures({ ...features, oil_pressure_kpa: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 mt-1 focus:bg-white focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-mono text-[10px] uppercase font-semibold">Hydraulic Press (psi)</label>
              <input
                type="number"
                value={features.hydraulic_pressure_psi}
                onChange={(e) => setFeatures({ ...features, hydraulic_pressure_psi: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 mt-1 focus:bg-white focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-mono text-[10px] uppercase font-semibold">Flight Hours</label>
              <input
                type="number"
                value={features.flight_hours}
                onChange={(e) => setFeatures({ ...features, flight_hours: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 mt-1 focus:bg-white focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-mono text-[10px] uppercase font-semibold">Component Age (Days)</label>
              <input
                type="number"
                value={features.component_age_days}
                onChange={(e) => setFeatures({ ...features, component_age_days: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 mt-1 focus:bg-white focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-mono text-[10px] uppercase font-semibold">Brake Temp (°C)</label>
              <input
                type="number"
                value={features.brake_temperature_c}
                onChange={(e) => setFeatures({ ...features, brake_temperature_c: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 mt-1 focus:bg-white focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-mono text-[10px] uppercase font-semibold">Days Since Maint.</label>
              <input
                type="number"
                value={features.days_since_maintenance}
                onChange={(e) => setFeatures({ ...features, days_since_maintenance: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 mt-1 focus:bg-white focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-mono text-[10px] uppercase font-semibold">Health Index (0-100)</label>
              <input
                type="number"
                value={features.health_index}
                onChange={(e) => setFeatures({ ...features, health_index: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 mt-1 focus:bg-white focus:border-sky-500"
              />
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <span className="text-[11px] text-slate-500">Target label: failure_next_30_days</span>
            <button
              onClick={runPrediction}
              disabled={inferring}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {inferring ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>Execute AI Inference</span>
            </button>
          </div>
        </div>

        {/* Right: Live Prediction Output & Explainability */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {prediction ? (
            <div className="tech-panel p-5 rounded-xl border border-sky-300 flex-1 flex flex-col justify-between bg-white/95">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-mono uppercase text-slate-500 font-semibold">Inference Result</span>
                  <span className="text-[10px] font-mono text-slate-500">{prediction.timestamp.split('T')[1].slice(0, 8)} UTC</span>
                </div>

                {/* Risk Gauge Header */}
                <div className="mt-4 p-4 rounded-xl border" style={{ borderColor: `${prediction.risk_color}50`, backgroundColor: `${prediction.risk_color}10` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider font-mono" style={{ color: prediction.risk_color }}>
                        {prediction.risk_level}
                      </span>
                      <p className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">
                        {(prediction.failure_probability * 100).toFixed(1)}%
                      </p>
                    </div>
                    {prediction.failure_probability >= 0.5 ? (
                      <AlertTriangle className="w-8 h-8 text-rose-500" />
                    ) : (
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-700 mt-2 font-medium">{prediction.recommendation}</p>
                </div>

                {/* Top Contributing Factors */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide font-mono mb-2">
                    Primary Contributing Telemetry
                  </h4>
                  <div className="space-y-1.5">
                    {prediction.top_contributing_factors.map((factor, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-xs">
                        <span className="font-mono text-slate-700">{factor.feature}</span>
                        <span className="font-mono text-sky-700 font-bold">{factor.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-amber-700 font-mono font-medium">
                NOTICE: Simulated AI probability. Not validated aircraft safety limit.
              </div>
            </div>
          ) : (
            <div className="tech-panel p-8 rounded-xl border border-dashed border-sky-300 text-center flex-1 flex flex-col justify-center items-center bg-white/95">
              <BrainCircuit className="w-12 h-12 text-slate-400 mb-3" />
              <h4 className="text-sm font-bold text-slate-700">Ready for Telemetry Inference</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Adjust the sensor parameters on the left or select a training preset to calculate failure risk.
              </p>
            </div>
          )}

          {/* Feature Importances Chart */}
          <div className="tech-panel p-4 rounded-xl bg-white/95">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide font-mono mb-2">
              Global Feature Importance (Random Forest Gini)
            </h4>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureImportanceList.slice(0, 6)} layout="vertical" margin={{ top: 5, right: 20, left: 35, bottom: 5 }}>
                  <XAxis type="number" stroke="#64748B" fontSize={9} />
                  <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={9} />
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
                  <Bar dataKey="importance" fill="#6366F1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
