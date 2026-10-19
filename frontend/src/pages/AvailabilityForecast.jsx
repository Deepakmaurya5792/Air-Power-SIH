import React, { useState } from 'react';
import {
  TrendingUp,
  Sliders,
  Shield,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export default function AvailabilityForecast() {
  const [leadTimeReduction, setLeadTimeReduction] = useState(25); // in percent
  const [turnaroundImprovement, setTurnaroundImprovement] = useState(15); // in percent

  // Simulated 14-day projection data under dynamic scenarios
  const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10', 'Day 11', 'Day 12', 'Day 13', 'Day 14'];
  const baselineAvail = [62.7, 63.1, 64.0, 63.8, 64.5, 65.2, 65.8, 66.4, 66.9, 67.5, 68.1, 68.6, 69.0, 69.5];

  const forecastData = days.map((day, idx) => {
    const base = baselineAvail[idx];
    const scenarioBonus = (leadTimeReduction * 0.15) + (turnaroundImprovement * 0.22);
    const optimized = parseFloat(Math.min(96, base + (idx * 0.5) + scenarioBonus).toFixed(1));

    return {
      day,
      baseline: base,
      optimized: optimized,
      target: 85.0
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-wide flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-sky-600" />
          <span>Fleet Sortie Availability Forecasting & Scenario Simulator</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Predictive multi-variable simulations for operational readiness based on repair turnaround times and supply-chain logistics.
        </p>
      </div>

      {/* Scenario Controls & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="tech-panel p-5 rounded-xl space-y-5 bg-white/95">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
            <Sliders className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">Intervention Scenarios</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-700 font-mono mb-1 font-semibold">
                <span>Spare Parts Lead Time Reduction:</span>
                <span className="text-sky-700 font-bold">{leadTimeReduction}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={leadTimeReduction}
                onChange={(e) => setLeadTimeReduction(parseInt(e.target.value, 10))}
                className="w-full accent-sky-600"
              />
              <p className="text-[10px] text-slate-500 mt-1">Simulates expedited depot procurement delivery cycles.</p>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-mono mb-1 font-semibold">
                <span>Depot Turnaround Efficiency:</span>
                <span className="text-teal-700 font-bold">{turnaroundImprovement}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={turnaroundImprovement}
                onChange={(e) => setTurnaroundImprovement(parseInt(e.target.value, 10))}
                className="w-full accent-teal-600"
              />
              <p className="text-[10px] text-slate-500 mt-1">Simulates AI pre-emptive tooling & early fault isolation.</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 text-xs space-y-1">
            <span className="font-mono text-sky-800 font-bold text-[11px]">SCENARIO IMPACT</span>
            <p className="text-slate-700">
              Projected 14-day fleet readiness increases from <strong className="text-slate-900">69.5%</strong> to{' '}
              <strong className="text-emerald-700">{forecastData[13].optimized}%</strong> (+{(forecastData[13].optimized - 69.5).toFixed(1)}%).
            </p>
          </div>
        </div>

        {/* 14-Day Simulation Chart */}
        <div className="lg:col-span-2 tech-panel p-5 rounded-xl space-y-4 bg-white/95">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Projected Readiness Curve (Next 14 Days)</h3>
              <p className="text-xs text-slate-500">Baseline vs. AI Optimized Predictive Intervention</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold">
              Benchmark: 85.0%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#E2E8F0" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} domain={[55, 95]} />
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
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="#64748B"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  name="Current Schedule Baseline (%)"
                />
                <Line
                  type="monotone"
                  dataKey="optimized"
                  stroke="#059669"
                  strokeWidth={2.5}
                  name="AI Optimized Readiness Scenario (%)"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#D97706"
                  strokeDasharray="2 2"
                  strokeWidth={1.5}
                  dot={false}
                  name="Target Benchmark (85%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-2 flex items-center space-x-2">
            <Info className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
            <span>Assumes regular sortie duty hours and constant supplier lead schedules.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
