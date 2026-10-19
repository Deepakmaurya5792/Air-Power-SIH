import React, { useState } from 'react';
import {
  Box,
  Cpu,
  Layers,
  Thermometer,
  Waves,
  ShieldAlert,
  ChevronRight,
  Info
} from 'lucide-react';

export default function DigitalTwin() {
  const [selectedSubsystem, setSelectedSubsystem] = useState('turbofan');

  const subsystems = {
    turbofan: {
      name: 'Turbofan Engine Core (CMP-018)',
      health: '92%',
      status: 'Nominal',
      color: '#059669',
      temp: '566.0 °C',
      vibration: '2.76 mm/s',
      oilPressure: '54.2 kPa',
      notes: 'Operating in optimal thermodynamic envelope. Next borescope scheduled in 45 flight hours.'
    },
    avionics: {
      name: 'Tactical Radar & Telemetry Pod',
      health: '98%',
      status: 'Optimal',
      color: '#0284C7',
      temp: '42.1 °C',
      vibration: '0.42 mm/s',
      oilPressure: 'N/A',
      notes: 'Active phased array self-test passed with 0 bit errors.'
    },
    hydraulics: {
      name: 'Flight Control Actuators & Hydraulics',
      health: '78%',
      status: 'Advisory',
      color: '#D97706',
      temp: '88.4 °C',
      vibration: '3.12 mm/s',
      oilPressure: '3,077 psi',
      notes: 'Minor micro-oscillation in port elevon circuit. Pre-emptive seal replacement recommended.'
    },
    landingGear: {
      name: 'Main Undercarriage & Brake Assembly',
      health: '85%',
      status: 'Good',
      color: '#059669',
      temp: '143.7 °C',
      vibration: '1.80 mm/s',
      oilPressure: '2,950 psi',
      notes: 'Brake pad wear index at 28% capacity remaining.'
    }
  };

  const current = subsystems[selectedSubsystem];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-wide flex items-center space-x-2">
          <Box className="w-5 h-5 text-sky-600" />
          <span>Interactive Digital Twin // Fictional Airframe Virtual Model</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Component-oriented data-driven virtual representation mapping live telemetry onto structural nodes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Airframe SVG Schematic */}
        <div className="lg:col-span-8 tech-panel p-6 rounded-xl flex flex-col justify-between bg-white/95">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-xs font-mono text-slate-600 font-semibold">TACTICAL SCHEMATIC // AIR-001 (MULTI-ROLE DEMO)</span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold">STATUS: TELEMETRY STREAM ONLINE</span>
          </div>

          {/* SVG Aircraft Silhouette with Hotspots */}
          <div className="relative py-12 flex items-center justify-center">
            <svg
              viewBox="0 0 800 500"
              className="w-full max-w-2xl h-auto filter drop-shadow-[0_4px_20px_rgba(14,165,233,0.15)]"
            >
              {/* Aircraft fuselage */}
              <path
                d="M400,30 L430,120 L440,240 L580,310 L580,350 L440,330 L430,420 L480,450 L480,470 L400,455 L320,470 L320,450 L370,420 L360,330 L220,350 L220,310 L360,240 L370,120 Z"
                fill="#F1F5F9"
                stroke="#0284C7"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Cockpit canopy */}
              <ellipse cx="400" cy="140" rx="18" ry="40" fill="#CBD5E1" stroke="#0284C7" strokeWidth="2" />

              {/* Subsystem Hotspots */}
              {/* 1. Avionics Nose */}
              <circle
                cx="400"
                cy="60"
                r="14"
                className="cursor-pointer transition-all hover:scale-125"
                fill={selectedSubsystem === 'avionics' ? '#0284C7' : '#38BDF8'}
                onClick={() => setSelectedSubsystem('avionics')}
              />
              <circle cx="400" cy="60" r="22" stroke="#0284C7" strokeWidth="1.5" fill="none" opacity="0.6" className="animate-ping" />

              {/* 2. Turbofan Core */}
              <circle
                cx="400"
                cy="290"
                r="16"
                className="cursor-pointer transition-all hover:scale-125"
                fill={selectedSubsystem === 'turbofan' ? '#059669' : '#10B981'}
                onClick={() => setSelectedSubsystem('turbofan')}
              />
              <circle cx="400" cy="290" r="26" stroke="#059669" strokeWidth="1.5" fill="none" opacity="0.6" className="animate-ping" />

              {/* 3. Hydraulics Wing Actuators */}
              <circle
                cx="500"
                cy="320"
                r="12"
                className="cursor-pointer transition-all hover:scale-125"
                fill={selectedSubsystem === 'hydraulics' ? '#D97706' : '#F59E0B'}
                onClick={() => setSelectedSubsystem('hydraulics')}
              />
              <circle
                cx="300"
                cy="320"
                r="12"
                className="cursor-pointer transition-all hover:scale-125"
                fill={selectedSubsystem === 'hydraulics' ? '#D97706' : '#F59E0B'}
                onClick={() => setSelectedSubsystem('hydraulics')}
              />

              {/* 4. Undercarriage Landing Gear */}
              <circle
                cx="400"
                cy="380"
                r="12"
                className="cursor-pointer transition-all hover:scale-125"
                fill={selectedSubsystem === 'landingGear' ? '#059669' : '#10B981'}
                onClick={() => setSelectedSubsystem('landingGear')}
              />
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-200 text-xs">
            <span className="text-slate-500 font-mono font-semibold">Select Hotspot:</span>
            {Object.keys(subsystems).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedSubsystem(key)}
                className={`px-3 py-1 rounded font-mono text-xs cursor-pointer font-semibold ${
                  selectedSubsystem === key
                    ? 'bg-sky-50 text-sky-800 border border-sky-400'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {subsystems[key].name.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Subsystem Telemetry Panel */}
        <div className="lg:col-span-4 tech-panel p-5 rounded-xl space-y-4 flex flex-col justify-between bg-white/95">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-mono text-slate-500 uppercase font-semibold">Subsystem Telemetry</span>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                style={{ backgroundColor: `${current.color}15`, color: current.color, border: `1px solid ${current.color}40` }}
              >
                {current.status}
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-base font-bold text-slate-900">{current.name}</h3>
              <p className="text-3xl font-extrabold mt-2 font-mono" style={{ color: current.color }}>
                {current.health} Health Index
              </p>
            </div>

            <div className="mt-6 space-y-2.5 text-xs">
              <div className="flex justify-between p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Core Temp:</span>
                <span className="font-mono text-slate-900 font-bold">{current.temp}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Vibration Signature:</span>
                <span className="font-mono text-slate-900 font-bold">{current.vibration}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Operating Pressure:</span>
                <span className="font-mono text-slate-900 font-bold">{current.oilPressure}</span>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-lg bg-sky-50 border border-sky-200 text-xs">
              <span className="font-mono text-sky-800 font-semibold text-[11px] uppercase">Engineering Log</span>
              <p className="text-slate-700 mt-1 leading-relaxed">{current.notes}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
            VIRTUAL MODEL // Data-driven digital twin demonstration.
          </div>
        </div>
      </div>
    </div>
  );
}
