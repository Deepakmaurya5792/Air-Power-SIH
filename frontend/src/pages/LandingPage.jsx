import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Activity,
  Cpu,
  BrainCircuit,
  Wrench,
  TrendingUp,
  ArrowRight,
  Database,
  Layers,
  ChevronRight,
  Radio,
  Box,
  Package,
  FileCheck
} from 'lucide-react';
import CinematicBackground from '../components/CinematicBackground';

export default function LandingPage() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 relative overflow-x-hidden flex flex-col justify-between scroll-smooth">
      <CinematicBackground intensity="dramatic" />

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-sky-100 shadow-xs">
        <div className="max-w-7xl mx-auto w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/50 flex items-center justify-center text-sky-600 shadow-sm">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-slate-900">AIR POWER</h1>
              <p className="text-[10px] text-sky-600 tracking-widest font-mono uppercase font-semibold">
                Predictive Maintenance & Fleet Intelligence
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-mono uppercase tracking-wider text-slate-600">
            <a
              href="#intelligence"
              onClick={(e) => { e.preventDefault(); scrollTo('intelligence'); }}
              className="hover:text-sky-600 transition-colors font-semibold cursor-pointer"
            >
              Intelligence
            </a>
            <a
              href="#capabilities"
              onClick={(e) => { e.preventDefault(); scrollTo('capabilities'); }}
              className="hover:text-sky-600 transition-colors font-semibold cursor-pointer"
            >
              Capabilities
            </a>
            <a
              href="#architecture"
              onClick={(e) => { e.preventDefault(); scrollTo('architecture'); }}
              className="hover:text-sky-600 transition-colors font-semibold cursor-pointer"
            >
              Architecture
            </a>
            <span className="px-2.5 py-1 rounded-full border border-emerald-500/40 bg-emerald-50 text-emerald-700 flex items-center space-x-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
              <span>Telemetry Active</span>
            </span>
          </nav>

          <button
            onClick={() => navigate('/command-center')}
            className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] flex items-center space-x-2 cursor-pointer"
          >
            <span>Launch Command Center</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12 flex-1 flex flex-col justify-center items-center text-center">
        {/* Classification / Tech Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-sky-400/40 bg-sky-50 text-sky-800 text-xs font-mono mb-8 backdrop-blur-md shadow-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-sky-600" />
          <span>SYNTHETIC DEFENCE PLATFORM // AERO-TACTICAL READINESS</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-[1.1]">
          Predict Failure. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-teal-600 to-indigo-600">
            Preserve Readiness.
          </span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
          AI-driven predictive maintenance and integrated fleet analytics engineered to eliminate unplanned downtime, forecast spare parts shortages, and maximize defence readiness.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => navigate('/command-center')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-sm tracking-wider uppercase shadow-[0_4px_20px_rgba(14,165,233,0.35)] transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Launch Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/predictive-ai')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-sky-400/50 bg-white/80 hover:bg-sky-50 text-sky-800 font-semibold text-sm tracking-wider uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
          >
            <BrainCircuit className="w-4 h-4 text-sky-600" />
            <span>Explore ML Intelligence</span>
          </button>
        </div>

        {/* Tactical Status Cards Grid */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl text-left">
          <div className="tech-panel p-4 rounded-xl border border-sky-300 hover:shadow-md transition-shadow">
            <span className="text-[10px] text-sky-700 font-mono uppercase tracking-widest font-bold">Active Fleet Assets</span>
            <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">150</p>
            <p className="text-xs text-slate-500 mt-1">Fighter, Transport, Rotary</p>
          </div>
          <div className="tech-panel p-4 rounded-xl border border-emerald-300 hover:shadow-md transition-shadow">
            <span className="text-[10px] text-emerald-700 font-mono uppercase tracking-widest font-bold">Fleet Availability</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1 font-mono">62.7%</p>
            <p className="text-xs text-slate-500 mt-1">94 Mission-Ready Craft</p>
          </div>
          <div className="tech-panel p-4 rounded-xl border border-indigo-300 hover:shadow-md transition-shadow">
            <span className="text-[10px] text-indigo-700 font-mono uppercase tracking-widest font-bold">ML Model Precision</span>
            <p className="text-2xl font-bold text-indigo-600 mt-1 font-mono">90.0% AUC</p>
            <p className="text-xs text-slate-500 mt-1">Random Forest 30-Day Failure</p>
          </div>
          <div className="tech-panel p-4 rounded-xl border border-amber-300 hover:shadow-md transition-shadow">
            <span className="text-[10px] text-amber-700 font-mono uppercase tracking-widest font-bold">Sensor Anomaly Stream</span>
            <p className="text-2xl font-bold text-amber-600 mt-1 font-mono">1,800</p>
            <p className="text-xs text-slate-500 mt-1">Continuous Telemetry Points</p>
          </div>
        </div>
      </main>

      {/* Capabilities Overview Section */}
      <section id="capabilities" className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full scroll-mt-20">
        <div className="text-center mb-12">
          <span className="text-xs text-sky-600 font-mono tracking-widest uppercase font-bold">Defence Aviation Capabilities</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Comprehensive Aviation Lifecycle Management</h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-3">
            Real-time telemetry, mission forecasting, automated dispatch, and parts supply intelligence combined into an operational defense cockpit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="tech-panel p-6 rounded-xl border border-sky-200 hover:border-sky-400 hover:shadow-lg transition-all bg-white/95">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 border border-sky-100">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI Failure Prediction</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Trained on multi-dimensional telemetry (vibration, oil pressure, thermal gradients) to predict 30-day component breakdown probability before flight hazard occurs.
            </p>
            <button
              onClick={() => navigate('/predictive-ai')}
              className="mt-4 text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center space-x-1 cursor-pointer font-mono uppercase"
            >
              <span>Explore AI Model</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="tech-panel p-6 rounded-xl border border-teal-200 hover:border-teal-400 hover:shadow-lg transition-all bg-white/95">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 border border-teal-100">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Dynamic Availability Forecasting</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Monte Carlo & scenario simulation engines estimating 14-day sortie readiness under variable supply-chain and maintenance turn-around constraints.
            </p>
            <button
              onClick={() => navigate('/availability-forecast')}
              className="mt-4 text-xs font-semibold text-teal-600 hover:text-teal-800 flex items-center space-x-1 cursor-pointer font-mono uppercase"
            >
              <span>Simulate Scenarios</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="tech-panel p-6 rounded-xl border border-indigo-200 hover:border-indigo-400 hover:shadow-lg transition-all bg-white/95">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Interactive Kanban & Work Orders</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Role-oriented triage system linking scheduled inspections, maintenance units (Unit-A, B, C), and spare parts inventory availability in real-time.
            </p>
            <button
              onClick={() => navigate('/work-orders')}
              className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer font-mono uppercase"
            >
              <span>Open Work Orders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Secondary Capabilities Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="tech-panel p-5 rounded-xl border border-slate-200 bg-white/90 flex items-start space-x-3">
            <Activity className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">Multi-Channel Telemetry Stream</h4>
              <p className="text-xs text-slate-500 mt-1">Real-time vibration, oil pressure, and hydraulic telemetry tracking with automated threshold alerting.</p>
            </div>
          </div>
          <div className="tech-panel p-5 rounded-xl border border-slate-200 bg-white/90 flex items-start space-x-3">
            <Package className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">Spare Parts & Supply Chain</h4>
              <p className="text-xs text-slate-500 mt-1">Automated reorder triggers, lead-time tracking, and depot stock balance controls across squadrons.</p>
            </div>
          </div>
          <div className="tech-panel p-5 rounded-xl border border-slate-200 bg-white/90 flex items-start space-x-3">
            <Box className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">Interactive Digital Twin</h4>
              <p className="text-xs text-slate-500 mt-1">Component schematic inspection for turbofan cores, radar arrays, and landing gear subsystems.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Section */}
      <section id="intelligence" className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full scroll-mt-20 border-t border-sky-100">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-indigo-400/40 bg-indigo-50 text-indigo-800 text-xs font-mono font-semibold mb-3">
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI TELEMETRY ENSEMBLE // SUPERVISED LEARNING</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Supervised Failure Prediction & Sensor Intelligence
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-3">
            Trained Random Forest ensemble analyzing multi-dimensional sensor telemetry to predict component breakdown 30 days in advance with high precision.
          </p>
        </div>

        {/* Model Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="tech-panel p-5 rounded-xl border border-indigo-200 bg-white/95">
            <span className="text-[10px] text-indigo-600 font-mono uppercase tracking-wider font-bold">ROC-AUC Score</span>
            <p className="text-3xl font-extrabold text-indigo-700 font-mono mt-1">90.04%</p>
            <p className="text-xs text-slate-500 mt-1">Discriminative power across flight cycles</p>
          </div>
          <div className="tech-panel p-5 rounded-xl border border-sky-200 bg-white/95">
            <span className="text-[10px] text-sky-600 font-mono uppercase tracking-wider font-bold">Classification Accuracy</span>
            <p className="text-3xl font-extrabold text-sky-700 font-mono mt-1">84.62%</p>
            <p className="text-xs text-slate-500 mt-1">Evaluated on 800 unseen test records</p>
          </div>
          <div className="tech-panel p-5 rounded-xl border border-emerald-200 bg-white/95">
            <span className="text-[10px] text-emerald-600 font-mono uppercase tracking-wider font-bold">F1 Performance Score</span>
            <p className="text-3xl font-extrabold text-emerald-700 font-mono mt-1">65.93%</p>
            <p className="text-xs text-slate-500 mt-1">Balanced precision & anomaly recall</p>
          </div>
          <div className="tech-panel p-5 rounded-xl border border-amber-200 bg-white/95">
            <span className="text-[10px] text-amber-600 font-mono uppercase tracking-wider font-bold">Inference Latency</span>
            <p className="text-3xl font-extrabold text-amber-700 font-mono mt-1">&lt; 25 ms</p>
            <p className="text-xs text-slate-500 mt-1">FastAPI async inference pipeline</p>
          </div>
        </div>

        {/* Feature Importance & Pipeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Feature Weights Chart Panel */}
          <div className="tech-panel p-6 rounded-2xl border border-slate-200 bg-white/95 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Key Telemetry Feature Weights</h3>
                <p className="text-xs text-slate-500">Trained Random Forest Gini impurity importance</p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-sky-50 text-sky-700 rounded-md border border-sky-200">
                12 Features Total
              </span>
            </div>

            <div className="space-y-3.5 mt-5">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="font-semibold text-slate-800">Component Age (Days)</span>
                  <span className="text-sky-700 font-bold">42.7%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full" style={{ width: '42.7%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="font-semibold text-slate-800">Engine Core Temperature (°C)</span>
                  <span className="text-indigo-700 font-bold">10.1%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full" style={{ width: '10.1%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="font-semibold text-slate-800">Degradation Health Index</span>
                  <span className="text-emerald-700 font-bold">8.5%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full" style={{ width: '8.5%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="font-semibold text-slate-800">Total Flight Hours Accumulated</span>
                  <span className="text-teal-700 font-bold">7.9%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-500 to-cyan-600 h-full rounded-full" style={{ width: '7.9%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="font-semibold text-slate-800">Vibration Amplitude (mm/s)</span>
                  <span className="text-amber-700 font-bold">5.1%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 h-full rounded-full" style={{ width: '5.1%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="font-semibold text-slate-800">Oil System Pressure (kPa)</span>
                  <span className="text-blue-700 font-bold">4.9%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-sky-600 h-full rounded-full" style={{ width: '4.9%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* AI Workflow & Live Tuning Promo */}
          <div className="space-y-4">
            <div className="tech-panel p-5 rounded-xl border border-sky-200 bg-white/95">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Telemetry Ingestion & Anomaly Scoring</h4>
                  <p className="text-xs text-slate-500">Continuous flight streams mapped into 12 standardized feature vectors.</p>
                </div>
              </div>
            </div>

            <div className="tech-panel p-5 rounded-xl border border-indigo-200 bg-white/95">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Ensemble Decision Trees (v1.2.0-RF)</h4>
                  <p className="text-xs text-slate-500">100 estimators calculate consensus breakdown risk probability within 30 days.</p>
                </div>
              </div>
            </div>

            <div className="tech-panel p-5 rounded-xl border border-emerald-200 bg-white/95">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Automated Work-Order Triage</h4>
                  <p className="text-xs text-slate-500">Exceeded thresholds automatically create triage work orders and assign depot technicians.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <button
                onClick={() => navigate('/predictive-ai')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center space-x-2 cursor-pointer"
              >
                <span>Launch Interactive AI Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/aircraft-health')}
                className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs tracking-wider uppercase transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <span>View Telemetry Streams</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full scroll-mt-20 border-t border-sky-100">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-teal-400/40 bg-teal-50 text-teal-800 text-xs font-mono font-semibold mb-3">
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            <span>TRI-TIER DISTRIBUTED SYSTEM // ZERO DOWNTIME</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Platform Architecture & Real-Time Data Flow
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-3">
            High-performance decoupled microservices stack designed for real-time telemetry processing, low latency ML inference, and mission-critical reliability.
          </p>
        </div>

        {/* Visual Architecture Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Tier 1: Client */}
          <div className="tech-panel p-6 rounded-2xl border-2 border-sky-200 bg-white/95 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 px-3 py-1 bg-sky-500 text-white font-mono text-[10px] font-bold rounded-bl-xl uppercase tracking-widest">
              Port 5173
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 border border-sky-100">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-sky-700 font-bold uppercase tracking-wider">Tier 1 // Presentation</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">React 19 + JSX Web UI</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Vite-powered ultra-fast frontend rendering high-FPS tactical canvas radar, Recharts timeseries graphs, and role-based operational modules.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">React 19</span>
                <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">Vite 8</span>
                <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">Tailwind CSS</span>
                <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">HTML5 Canvas</span>
              </div>
            </div>
          </div>

          {/* Tier 2: Gateway */}
          <div className="tech-panel p-6 rounded-2xl border-2 border-teal-200 bg-white/95 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 px-3 py-1 bg-teal-600 text-white font-mono text-[10px] font-bold rounded-bl-xl uppercase tracking-widest">
              Port 8000
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 border border-teal-100">
                <Radio className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-teal-700 font-bold uppercase tracking-wider">Tier 2 // API Gateway</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Node.js Express Gateway</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Central orchestration bus handling REST endpoints, live telemetry mutation streams, CSV dataset parsing, and work order Kanban persistence.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">Express 5</span>
                <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">CSV-Parser</span>
                <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">REST Ingestion</span>
                <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">CORS Gateway</span>
              </div>
            </div>
          </div>

          {/* Tier 3: ML Engine */}
          <div className="tech-panel p-6 rounded-2xl border-2 border-indigo-200 bg-white/95 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-600 text-white font-mono text-[10px] font-bold rounded-bl-xl uppercase tracking-widest">
              Port 8001
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-indigo-700 font-bold uppercase tracking-wider">Tier 3 // ML Inference</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Python FastAPI ML Service</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Async high-throughput Python inference engine hosting the serialized Scikit-Learn Random Forest ensemble with sub-25ms response times.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">FastAPI</span>
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">Uvicorn</span>
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">Scikit-Learn</span>
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">Joblib Models</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Architecture & Ingestion Bar */}
        <div className="tech-panel p-6 rounded-2xl border border-slate-200 bg-white/95 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Synthetic Telemetry Datasets & Schema Ingestion</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                5 validated CSV schemas: Fleet Master (150 craft), Sensor Readings (1,800 rows), Work Orders (320 items), Inventory (40 parts), and Model Training sets.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => navigate('/data-management')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Inspect Datasets</span>
            </button>
            <button
              onClick={() => navigate('/command-center')}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs tracking-wider uppercase transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <span>Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Architecture Disclaimer Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-slate-50/90 px-6 py-8 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-sky-600" />
              <p className="font-mono text-slate-800 font-bold uppercase tracking-wider">AIR POWER DEFENCE ANALYTICS // VERSION 1.2.0</p>
            </div>
            <p className="text-[11px] text-amber-700 mt-1 max-w-xl">
              PROTOTYPE NOTICE: All aircraft records, telemetry, predictions, and operational metrics are simulated using synthetic data. Do not use for real flight decisions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-mono">
            <button
              onClick={() => scrollTo('intelligence')}
              className="hover:text-sky-600 transition-colors cursor-pointer"
            >
              Intelligence
            </button>
            <span className="hidden sm:inline text-slate-300">|</span>
            <button
              onClick={() => scrollTo('capabilities')}
              className="hover:text-sky-600 transition-colors cursor-pointer"
            >
              Capabilities
            </button>
            <span className="hidden sm:inline text-slate-300">|</span>
            <button
              onClick={() => scrollTo('architecture')}
              className="hover:text-sky-600 transition-colors cursor-pointer"
            >
              Architecture
            </button>
            <span className="hidden sm:inline text-slate-300">|</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-sky-600 transition-colors cursor-pointer text-sky-600 font-bold"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

