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
  Lock,
  Layers,
  ChevronRight,
  Radio
} from 'lucide-react';
import CinematicBackground from '../components/CinematicBackground';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden flex flex-col justify-between">
      <CinematicBackground intensity="dramatic" />

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
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
          <a href="#intelligence" className="hover:text-sky-600 transition-colors">Intelligence</a>
          <a href="#capabilities" className="hover:text-sky-600 transition-colors">Capabilities</a>
          <a href="#architecture" className="hover:text-sky-600 transition-colors">Architecture</a>
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
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center items-center text-center">
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
          <div className="tech-panel p-4 rounded-xl border border-sky-300">
            <span className="text-[10px] text-sky-700 font-mono uppercase tracking-widest font-bold">Active Fleet Assets</span>
            <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">150</p>
            <p className="text-xs text-slate-500 mt-1">Fighter, Transport, Rotary</p>
          </div>
          <div className="tech-panel p-4 rounded-xl border border-emerald-300">
            <span className="text-[10px] text-emerald-700 font-mono uppercase tracking-widest font-bold">Fleet Availability</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1 font-mono">62.7%</p>
            <p className="text-xs text-slate-500 mt-1">94 Mission-Ready Craft</p>
          </div>
          <div className="tech-panel p-4 rounded-xl border border-indigo-300">
            <span className="text-[10px] text-indigo-700 font-mono uppercase tracking-widest font-bold">ML Model Precision</span>
            <p className="text-2xl font-bold text-indigo-600 mt-1 font-mono">90.0% AUC</p>
            <p className="text-xs text-slate-500 mt-1">Random Forest 30-Day Failure</p>
          </div>
          <div className="tech-panel p-4 rounded-xl border border-amber-300">
            <span className="text-[10px] text-amber-700 font-mono uppercase tracking-widest font-bold">Sensor Anomaly Stream</span>
            <p className="text-2xl font-bold text-amber-600 mt-1 font-mono">1,800</p>
            <p className="text-xs text-slate-500 mt-1">Continuous Telemetry Points</p>
          </div>
        </div>
      </main>

      {/* Features Overview */}
      <section id="capabilities" className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <span className="text-xs text-sky-600 font-mono tracking-widest uppercase font-bold">Defence Aviation Capabilities</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">Comprehensive Aviation Lifecycle Management</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="tech-panel p-6 rounded-xl border border-sky-200 hover:border-sky-400 transition-all bg-white/95">
            <BrainCircuit className="w-8 h-8 text-sky-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">AI Failure Prediction</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Trained on multi-dimensional telemetry (vibration, oil pressure, thermal gradients) to predict 30-day component breakdown probability before flight hazard occurs.
            </p>
          </div>

          <div className="tech-panel p-6 rounded-xl border border-teal-200 hover:border-teal-400 transition-all bg-white/95">
            <TrendingUp className="w-8 h-8 text-teal-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">Dynamic Availability Forecasting</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Monte Carlo & scenario simulation engines estimating 14-day sortie readiness under variable supply-chain and maintenance turn-around constraints.
            </p>
          </div>

          <div className="tech-panel p-6 rounded-xl border border-indigo-200 hover:border-indigo-400 transition-all bg-white/95">
            <Wrench className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">Interactive Kanban & Work Orders</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Role-oriented triage system linking scheduled inspections, maintenance units (Unit-A, B, C), and spare parts inventory availability in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Disclaimer Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-slate-50/90 px-6 py-6 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <p className="font-mono text-slate-700 font-bold uppercase">AIR POWER DEFENCE ANALYTICS // VERSION 1.2.0</p>
            <p className="text-[11px] text-amber-700 mt-1">
              PROTOTYPE NOTICE: All aircraft records, telemetry, predictions, and operational metrics are simulated using synthetic data. Do not use for real flight decisions.
            </p>
          </div>
          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <span className="text-sky-700 font-semibold">Node.js Express Gateway</span>
            <span className="text-slate-400">|</span>
            <span className="text-indigo-700 font-semibold">FastAPI ML Engine</span>
            <span className="text-slate-400">|</span>
            <span className="text-teal-700 font-semibold">React JSX Frontend</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
