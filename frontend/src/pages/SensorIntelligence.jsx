import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Activity,
  Cpu,
  Thermometer,
  Gauge,
  Waves,
  Droplet,
  AlertTriangle,
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  Wrench,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { API_BASE_URL } from '../apiConfig';

const DEFAULT_AIRCRAFT_LIST = ['AIR-001', 'AIR-002', 'AIR-003', 'AIR-004', 'AIR-005', 'AIR-006'];

const DEFAULT_SENSOR_RECORDS = [
  { timestamp: '2024-03-01T08:00:00Z', engine_temperature_c: '542.1', vibration_mm_s: '2.45', oil_pressure_kpa: '56.2', hydraulic_pressure_psi: '3040.0', anomaly_flag_demo: '0', component_id: 'CMP-018' },
  { timestamp: '2024-03-02T08:00:00Z', engine_temperature_c: '548.6', vibration_mm_s: '2.60', oil_pressure_kpa: '55.8', hydraulic_pressure_psi: '3035.0', anomaly_flag_demo: '0', component_id: 'CMP-018' },
  { timestamp: '2024-03-03T08:00:00Z', engine_temperature_c: '555.2', vibration_mm_s: '2.78', oil_pressure_kpa: '54.5', hydraulic_pressure_psi: '3020.0', anomaly_flag_demo: '0', component_id: 'CMP-018' },
  { timestamp: '2024-03-04T08:00:00Z', engine_temperature_c: '566.0', vibration_mm_s: '3.10', oil_pressure_kpa: '53.8', hydraulic_pressure_psi: '3010.0', anomaly_flag_demo: '0', component_id: 'CMP-018' },
  { timestamp: '2024-03-05T08:00:00Z', engine_temperature_c: '578.4', vibration_mm_s: '3.45', oil_pressure_kpa: '52.1', hydraulic_pressure_psi: '2995.0', anomaly_flag_demo: '0', component_id: 'CMP-018' },
  { timestamp: '2024-03-06T08:00:00Z', engine_temperature_c: '595.0', vibration_mm_s: '3.90', oil_pressure_kpa: '50.4', hydraulic_pressure_psi: '2980.0', anomaly_flag_demo: '0', component_id: 'CMP-018' },
  { timestamp: '2024-03-07T08:00:00Z', engine_temperature_c: '632.5', vibration_mm_s: '4.65', oil_pressure_kpa: '46.8', hydraulic_pressure_psi: '2940.0', anomaly_flag_demo: '1', component_id: 'CMP-018' },
  { timestamp: '2024-03-08T08:00:00Z', engine_temperature_c: '648.1', vibration_mm_s: '4.92', oil_pressure_kpa: '44.2', hydraulic_pressure_psi: '2920.0', anomaly_flag_demo: '1', component_id: 'CMP-018' }
];

export default function SensorIntelligence() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const targetId = searchParams.get('id') || 'AIR-001';

  const [selectedAircraft, setSelectedAircraft] = useState(targetId);
  const [aircraftList, setAircraftList] = useState(DEFAULT_AIRCRAFT_LIST);
  const [sensorRecords, setSensorRecords] = useState(DEFAULT_SENSOR_RECORDS);
  const [loading, setLoading] = useState(false);
  const [anomalies, setAnomalies] = useState(
    DEFAULT_SENSOR_RECORDS.filter((r) => r.anomaly_flag_demo === '1')
  );
  const [activeSensor, setActiveSensor] = useState('all'); // 'all', 'temp', 'vibe', 'pressure', 'hydraulic'

  useEffect(() => {
    fetchSensorData(selectedAircraft);
  }, [selectedAircraft]);

  const fetchSensorData = async (craftId) => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${API_BASE_URL}/api/sensors/history?aircraft_id=${craftId}&limit=50`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.records && data.records.length > 0) {
          setSensorRecords(data.records);
          const anom = data.records.filter(
            (r) => r.anomaly_flag_demo === '1' || r.anomaly_flag_demo === 1
          );
          setAnomalies(anom);
        }
        if (data.available_aircraft && data.available_aircraft.length > 0) {
          setAircraftList(data.available_aircraft);
        }
      }
    } catch (err) {
      console.warn('Backend unavailable, showing baseline sensor profile:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const chartData = sensorRecords.map((r) => ({
    date: r.timestamp.split('T')[0].slice(5),
    engine_temp: parseFloat(r.engine_temperature_c),
    vibration: parseFloat(r.vibration_mm_s) * 100, // scaled for visualization
    vibration_raw: parseFloat(r.vibration_mm_s),
    oil_pressure: parseFloat(r.oil_pressure_kpa),
    hydraulic_pressure: parseFloat(r.hydraulic_pressure_psi) / 10, // scaled
    hydraulic_raw: parseFloat(r.hydraulic_pressure_psi),
    is_anomaly: r.anomaly_flag_demo === '1' || r.anomaly_flag_demo === 1,
    component: r.component_id
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-wide flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-sky-600" />
            <span>Aircraft Health & Sensor Intelligence Suite</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Historical 30-day multi-spectral telemetry analysis for synthetic fleet units.
          </p>
        </div>

        {/* Aircraft Selector */}
        <div className="flex items-center space-x-3">
          <label className="text-xs font-mono text-slate-500 font-semibold">Target Asset:</label>
          <select
            value={selectedAircraft}
            onChange={(e) => setSelectedAircraft(e.target.value)}
            className="bg-white border border-sky-300 rounded-lg px-3 py-1.5 text-xs text-sky-800 font-mono focus:outline-none focus:border-sky-500 shadow-xs font-semibold"
          >
            {aircraftList.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sensor Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="tech-panel p-4 rounded-xl border-l-4 border-l-rose-500 bg-white/95">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Engine Temp</span>
            <Thermometer className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">
            {sensorRecords[0]?.engine_temperature_c || '566.0'} °C
          </p>
          <span className="text-[10px] text-slate-500 font-mono">Normal: 500-600 °C</span>
        </div>

        <div className="tech-panel p-4 rounded-xl border-l-4 border-l-amber-500 bg-white/95">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Vibration Index</span>
            <Waves className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-1 font-mono">
            {sensorRecords[0]?.vibration_mm_s || '2.76'} mm/s
          </p>
          <span className="text-[10px] text-slate-500 font-mono">Max Nominal: 4.5 mm/s</span>
        </div>

        <div className="tech-panel p-4 rounded-xl border-l-4 border-l-sky-500 bg-white/95">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Oil Pressure</span>
            <Gauge className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-bold text-sky-700 mt-1 font-mono">
            {sensorRecords[0]?.oil_pressure_kpa || '54.2'} kPa
          </p>
          <span className="text-[10px] text-slate-500 font-mono">Range: 40-65 kPa</span>
        </div>

        <div className="tech-panel p-4 rounded-xl border-l-4 border-l-indigo-500 bg-white/95">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Hydraulic Press.</span>
            <Droplet className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-indigo-700 mt-1 font-mono">
            {sensorRecords[0]?.hydraulic_pressure_psi || '3195.3'} psi
          </p>
          <span className="text-[10px] text-slate-500 font-mono">Target: 3000 psi</span>
        </div>
      </div>

      {/* Main Sensor Trend Chart */}
      <div className="tech-panel p-5 rounded-xl space-y-4 bg-white/95">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">
              Historical 30-Day Sensor Telemetry Waves ({selectedAircraft})
            </h3>
            <p className="text-xs text-slate-500">
              Interactive multi-channel timeseries with calibrated synthetic values.
            </p>
          </div>

          {/* Sensor Filters */}
          <div className="flex items-center space-x-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setActiveSensor('all')}
              className={`px-2.5 py-1 rounded font-mono font-semibold ${
                activeSensor === 'all' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveSensor('temp')}
              className={`px-2.5 py-1 rounded font-mono font-semibold ${
                activeSensor === 'temp' ? 'bg-rose-100 text-rose-800' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Temp
            </button>
            <button
              onClick={() => setActiveSensor('vibe')}
              className={`px-2.5 py-1 rounded font-mono font-semibold ${
                activeSensor === 'vibe' ? 'bg-amber-100 text-amber-800' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vibration
            </button>
            <button
              onClick={() => setActiveSensor('pressure')}
              className={`px-2.5 py-1 rounded font-mono font-semibold ${
                activeSensor === 'pressure' ? 'bg-sky-100 text-sky-800' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pressure
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#64748B" fontSize={10} />
              <YAxis stroke="#64748B" fontSize={10} />
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
              {(activeSensor === 'all' || activeSensor === 'temp') && (
                <Line
                  type="monotone"
                  dataKey="engine_temp"
                  stroke="#E11D48"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  name="Engine Temp (°C)"
                />
              )}
              {(activeSensor === 'all' || activeSensor === 'vibe') && (
                <Line
                  type="monotone"
                  dataKey="vibration"
                  stroke="#D97706"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  name="Vibration (scaled x100)"
                />
              )}
              {(activeSensor === 'all' || activeSensor === 'pressure') && (
                <Line
                  type="monotone"
                  dataKey="oil_pressure"
                  stroke="#0284C7"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  name="Oil Pressure (kPa)"
                />
              )}
              {activeSensor === 'all' && (
                <Line
                  type="monotone"
                  dataKey="hydraulic_pressure"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  name="Hydraulic (scaled /10)"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Anomalies Log */}
      <div className="tech-panel p-5 rounded-xl bg-white/95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 tracking-wide flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>Detected Sensor Anomalies ({anomalies.length} Flagged Events)</span>
          </h3>
          <span className="text-xs font-mono text-slate-500 font-semibold">Target Unit: {selectedAircraft}</span>
        </div>

        {anomalies.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <span>No critical sensor anomalies detected for this aircraft record in the 30-day window.</span>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {anomalies.map((anom, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-rose-800 font-mono">
                      Timestamp: {anom.timestamp.replace('T', ' ')}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-200 text-rose-800 text-[10px] font-mono font-bold">
                      ANOMALY DETECTED
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">
                    Component: <strong className="text-slate-900 font-mono">{anom.component_id}</strong> | Temp: {anom.engine_temperature_c}°C | Vib: {anom.vibration_mm_s} mm/s | Hyd: {anom.hydraulic_pressure_psi} psi
                  </p>
                </div>
                <button
                  onClick={() => navigate('/work-orders')}
                  className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono flex items-center space-x-1 cursor-pointer self-start sm:self-center font-semibold shadow-xs"
                >
                  <span>Dispatch Work Order</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
