require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 8000;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8001';
const JWT_SECRET = process.env.JWT_SECRET || 'airpower_default_jwt_secret_token_123';
const API_KEY = process.env.API_KEY || 'airpower_tactical_telemetry_key_xyz987';

app.use(cors());
app.use(express.json());

const DATASET_DIR = path.join(__dirname, '..', 'DATASET', 'air_power_synthetic_dataset');

// In-memory data store with live mutation capability
let fleetData = [];
let sensorHistoryData = [];
let workOrdersData = [];
let sparePartsData = [];
let healthTrainingData = [];
let auditLogs = [
  { id: 'AUD-001', action: 'SYSTEM_BOOT', details: 'AIR POWER telemetry stream initialized with synthetic seed data', timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'System Admin' },
  { id: 'AUD-002', action: 'ML_MODEL_SYNC', details: 'Predictive RF model v1.2.0 synchronized with inference gateway', timestamp: new Date(Date.now() - 1800000).toISOString(), user: 'AI Pipeline' }
];

function loadCsv(fileName) {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(DATASET_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`Dataset file not found: ${filePath}`);
      return resolve([]);
    }
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

async function initializeData() {
  try {
    fleetData = await loadCsv('synthetic_aircraft_fleet.csv');
    sensorHistoryData = await loadCsv('synthetic_sensor_history.csv');
    workOrdersData = await loadCsv('synthetic_maintenance_work_orders.csv');
    sparePartsData = await loadCsv('synthetic_spare_parts_inventory.csv');
    healthTrainingData = await loadCsv('synthetic_health_training.csv');
    console.log(`[Data Init] Loaded ${fleetData.length} aircraft, ${sensorHistoryData.length} sensor rows, ${workOrdersData.length} work orders, ${sparePartsData.length} spare parts.`);
  } catch (error) {
    console.error('Error loading datasets:', error);
  }
}

initializeData();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'AIR POWER Fleet Intelligence Gateway',
    timestamp: new Date().toISOString(),
    simulation_mode: true,
    data_counts: {
      aircraft: fleetData.length,
      sensor_records: sensorHistoryData.length,
      work_orders: workOrdersData.length,
      spare_parts: sparePartsData.length
    }
  });
});

// 1. KPI & Overview Summary
app.get('/api/kpi/summary', (req, res) => {
  const totalAircraft = fleetData.length;
  const missionReady = fleetData.filter(a => a.mission_ready === '1' || a.mission_ready === 1).length;
  const underMaintenance = fleetData.filter(a => a.status === 'Under Maintenance').length;
  const awaitingParts = fleetData.filter(a => a.status === 'Awaiting Parts').length;
  const available = fleetData.filter(a => a.status === 'Available').length;
  const inspectionDue = fleetData.filter(a => parseInt(a.next_inspection_due_days, 10) <= 7).length;

  const openWorkOrders = workOrdersData.filter(w => w.status !== 'Completed').length;
  const highPriorityOrders = workOrdersData.filter(w => w.priority === 'High' && w.status !== 'Completed').length;
  const lowStockParts = sparePartsData.filter(p => parseInt(p.stock_quantity, 10) <= parseInt(p.reorder_level, 10)).length;

  const availabilityRate = totalAircraft > 0 ? ((missionReady / totalAircraft) * 100).toFixed(1) : '0.0';

  // Sensor anomalies count
  const anomalyCount = sensorHistoryData.filter(s => s.anomaly_flag_demo === '1' || s.anomaly_flag_demo === 1).length;

  // Status distribution
  const statusDistribution = [
    { name: 'Available', value: available, color: '#10B981' },
    { name: 'Under Maintenance', value: underMaintenance, color: '#EF4444' },
    { name: 'Awaiting Parts', value: awaitingParts, color: '#F59E0B' },
    { name: 'Inspection Due', value: inspectionDue, color: '#38BDF8' }
  ];

  // Aircraft Type distribution
  const typeMap = {};
  fleetData.forEach(a => {
    typeMap[a.aircraft_type] = (typeMap[a.aircraft_type] || 0) + 1;
  });
  const typeDistribution = Object.keys(typeMap).map(type => ({
    name: type,
    count: typeMap[type]
  }));

  res.json({
    totalAircraft,
    missionReady,
    underMaintenance,
    awaitingParts,
    available,
    inspectionDue,
    availabilityRate: parseFloat(availabilityRate),
    openWorkOrders,
    highPriorityOrders,
    lowStockParts,
    anomalyCount,
    statusDistribution,
    typeDistribution,
    is_simulation_mode: true
  });
});

// 2. Availability History & Forecast
app.get('/api/kpi/availability-trend', (req, res) => {
  // Generate realistic historical daily availability and 14-day projection
  const points = [];
  const today = new Date();
  
  // 14 days historical
  for (let i = 14; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const baseRate = 72.5;
    const variation = Math.sin(i * 0.7) * 4.2 + (Math.cos(i) * 2.1);
    const historicalVal = parseFloat((baseRate + variation).toFixed(1));
    points.push({
      date: dateStr,
      historical: historicalVal,
      forecast: null,
      confidenceLower: null,
      confidenceUpper: null,
      type: 'Historical'
    });
  }

  // 14 days projection
  const lastHistorical = points[points.length - 1].historical;
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    // Scenario standard projection
    const expected = parseFloat((lastHistorical + (i * 0.45) - (i > 8 ? 2.5 : 0)).toFixed(1));
    const ciDelta = parseFloat((1.2 + i * 0.25).toFixed(1));
    points.push({
      date: dateStr,
      historical: null,
      forecast: expected,
      confidenceLower: parseFloat((expected - ciDelta).toFixed(1)),
      confidenceUpper: parseFloat((expected + ciDelta).toFixed(1)),
      type: 'Simulated Forecast'
    });
  }

  res.json({
    trend: points,
    benchmarkTarget: 85.0,
    unit: 'Percentage (%)',
    is_simulated_forecast: true
  });
});

// 3. Fleet Endpoints
app.get('/api/fleet', (req, res) => {
  const { status, type, unit, search } = req.query;
  let results = [...fleetData];

  if (status && status !== 'All') {
    results = results.filter(a => a.status === status);
  }
  if (type && type !== 'All') {
    results = results.filter(a => a.aircraft_type === type);
  }
  if (unit && unit !== 'All') {
    results = results.filter(a => a.assigned_maintenance_unit === unit);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(a => 
      a.aircraft_id.toLowerCase().includes(q) || 
      a.aircraft_type.toLowerCase().includes(q) ||
      a.assigned_maintenance_unit.toLowerCase().includes(q)
    );
  }

  res.json({
    total: results.length,
    aircraft: results,
    is_simulation_mode: true
  });
});

app.get('/api/fleet/:id', (req, res) => {
  const { id } = req.params;
  const aircraft = fleetData.find(a => a.aircraft_id === id);
  if (!aircraft) {
    return res.status(404).json({ error: 'Aircraft record not found' });
  }

  const aircraftSensors = sensorHistoryData.filter(s => s.aircraft_id === id);
  const aircraftOrders = workOrdersData.filter(w => w.aircraft_id === id);
  const healthRecords = healthTrainingData.filter(h => h.aircraft_id === id);

  res.json({
    aircraft,
    sensors: aircraftSensors,
    workOrders: aircraftOrders,
    healthRecords,
    is_simulation_mode: true
  });
});

// 4. Sensors Intelligence
app.get('/api/sensors/history', (req, res) => {
  const { aircraft_id, limit } = req.query;
  let data = [...sensorHistoryData];
  if (aircraft_id && aircraft_id !== 'All') {
    data = data.filter(s => s.aircraft_id === aircraft_id);
  }
  if (limit) {
    data = data.slice(0, parseInt(limit, 10));
  }
  res.json({
    count: data.length,
    records: data,
    available_aircraft: [...new Set(sensorHistoryData.map(s => s.aircraft_id))]
  });
});

app.get('/api/sensors/anomalies', (req, res) => {
  const anomalies = sensorHistoryData.filter(s => s.anomaly_flag_demo === '1' || s.anomaly_flag_demo === 1);
  res.json({
    total_anomalies: anomalies.length,
    anomalies: anomalies.slice(0, 50)
  });
});

// 5. Work Orders
app.get('/api/work-orders', (req, res) => {
  const { status, priority, unit, search } = req.query;
  let results = [...workOrdersData];

  if (status && status !== 'All') {
    results = results.filter(w => w.status === status);
  }
  if (priority && priority !== 'All') {
    results = results.filter(w => w.priority === priority);
  }
  if (unit && unit !== 'All') {
    results = results.filter(w => w.maintenance_unit === unit);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(w =>
      w.work_order_id.toLowerCase().includes(q) ||
      w.aircraft_id.toLowerCase().includes(q) ||
      w.component_id.toLowerCase().includes(q) ||
      (w.notes && w.notes.toLowerCase().includes(q))
    );
  }

  res.json({
    total: results.length,
    workOrders: results
  });
});

app.post('/api/work-orders', (req, res) => {
  const newOrder = {
    work_order_id: `WO-${String(workOrdersData.length + 1).padStart(5, '0')}`,
    aircraft_id: req.body.aircraft_id || 'AIR-001',
    opened_date: new Date().toISOString().split('T')[0],
    component_id: req.body.component_id || 'CMP-001',
    maintenance_type: req.body.maintenance_type || 'Corrective',
    priority: req.body.priority || 'Medium',
    status: req.body.status || 'Open',
    estimated_repair_hours: req.body.estimated_repair_hours || '24',
    required_part_id: req.body.required_part_id || 'PART-001',
    maintenance_unit: req.body.maintenance_unit || 'Unit-A (demo)',
    notes: req.body.notes || 'Routine check flagged by predictive intelligence'
  };

  workOrdersData.unshift(newOrder);
  auditLogs.unshift({
    id: `AUD-${Date.now()}`,
    action: 'CREATE_WORK_ORDER',
    details: `Work order ${newOrder.work_order_id} created for ${newOrder.aircraft_id}`,
    timestamp: new Date().toISOString(),
    user: 'Engineer'
  });

  res.status(201).json(newOrder);
});

app.patch('/api/work-orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = workOrdersData.find(w => w.work_order_id === id);
  if (!order) {
    return res.status(404).json({ error: 'Work order not found' });
  }

  const prev = order.status;
  order.status = status;
  auditLogs.unshift({
    id: `AUD-${Date.now()}`,
    action: 'UPDATE_WORK_ORDER_STATUS',
    details: `Work order ${id} status moved from ${prev} to ${status}`,
    timestamp: new Date().toISOString(),
    user: 'Technician Lead'
  });

  res.json({ success: true, workOrder: order });
});

// 6. Spare Parts Inventory
app.get('/api/inventory', (req, res) => {
  const { search, status } = req.query;
  let results = [...sparePartsData];

  if (status && status !== 'All') {
    results = results.filter(p => p.stock_status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p => 
      p.part_id.toLowerCase().includes(q) ||
      p.part_name.toLowerCase().includes(q) ||
      p.compatible_component_demo.toLowerCase().includes(q)
    );
  }

  const totalTypes = results.length;
  const totalStockQuantity = results.reduce((acc, p) => acc + parseInt(p.stock_quantity || 0, 10), 0);
  const reorderCount = results.filter(p => p.stock_status === 'Reorder').length;

  res.json({
    totalTypes,
    totalStockQuantity,
    reorderCount,
    parts: results
  });
});

app.patch('/api/inventory/:id/stock', (req, res) => {
  const { id } = req.params;
  const { delta, newQuantity } = req.body;
  const part = sparePartsData.find(p => p.part_id === id);
  if (!part) {
    return res.status(404).json({ error: 'Part not found' });
  }

  let qty = parseInt(part.stock_quantity, 10);
  if (typeof newQuantity === 'number') {
    qty = newQuantity;
  } else if (typeof delta === 'number') {
    qty = Math.max(0, qty + delta);
  }

  part.stock_quantity = qty.toString();
  const reorderLvl = parseInt(part.reorder_level, 10);
  part.stock_status = qty <= reorderLvl ? 'Reorder' : 'In Stock';

  auditLogs.unshift({
    id: `AUD-${Date.now()}`,
    action: 'STOCK_LEVEL_UPDATE',
    details: `Part ${id} quantity updated to ${qty} (${part.stock_status})`,
    timestamp: new Date().toISOString(),
    user: 'Logistics Officer'
  });

  res.json({ success: true, part });
});

// 7. Proxy ML Predictive Model & Predictions
app.get('/api/ml/metrics', async (req, res) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/model/metrics`);
    if (!response.ok) throw new Error('ML Service Error');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.warn('ML Service unreachable, using cached telemetry metadata:', error.message);
    res.json({
      model_version: 'v1.2.0-RF-Ensemble',
      algorithm: 'RandomForestClassifier',
      sample_count: 4000,
      test_size: 800,
      accuracy: 0.8462,
      precision: 0.6723,
      recall: 0.6467,
      f1_score: 0.6593,
      roc_auc: 0.9004,
      confusion_matrix: [[558, 58], [65, 119]],
      feature_importances: {
        component_age_days: 0.4265,
        engine_temperature_c: 0.1013,
        health_index: 0.0855,
        flight_hours: 0.0788,
        vibration_mm_s: 0.0515,
        oil_pressure_kpa: 0.0492,
        days_since_maintenance: 0.0458,
        hydraulic_pressure_psi: 0.0426,
        brake_temperature_c: 0.0423,
        fuel_flow_kg_h: 0.0379,
        maintenance_count: 0.0269,
        previous_failures: 0.0118
      },
      is_simulated_model: true
    });
  }
});

app.post('/api/ml/predict', async (req, res) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    if (!response.ok) throw new Error('Inference failure from ML service');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    // Intelligent fallback rule simulation when ML service is offline
    const body = req.body || {};
    const age = parseFloat(body.component_age_days || 1000);
    const temp = parseFloat(body.engine_temperature_c || 550);
    const health = parseFloat(body.health_index || 75);

    let prob = 0.12;
    if (age > 2500) prob += 0.35;
    if (temp > 620) prob += 0.25;
    if (health < 60) prob += 0.25;
    prob = Math.min(0.96, Math.max(0.04, prob));

    const isHigh = prob >= 0.65;
    res.json({
      failure_probability: parseFloat(prob.toFixed(4)),
      predicted_label: isHigh ? 1 : 0,
      risk_level: isHigh ? 'CRITICAL / HIGH RISK' : (prob >= 0.35 ? 'ELEVATED / MEDIUM RISK' : 'NOMINAL / LOW RISK'),
      risk_color: isHigh ? '#EF4444' : (prob >= 0.35 ? '#F59E0B' : '#10B981'),
      recommendation: isHigh 
        ? 'Immediate scheduled teardown & sensor diagnostic recommended within 48 flight hours.'
        : 'System within standard parameters. Continue routine inspection.',
      model_version: 'v1.2.0-RF-Ensemble (Fallback Simulator)',
      timestamp: new Date().toISOString(),
      is_simulated_prediction: true,
      top_contributing_factors: [
        { feature: 'component_age_days', value: age, global_importance: 0.4265 },
        { feature: 'engine_temperature_c', value: temp, global_importance: 0.1013 },
        { feature: 'health_index', value: health, global_importance: 0.0855 }
      ]
    });
  }
});

// 8. Health Dataset Sample for Predictive Inspector
app.get('/api/ml/sample-records', (req, res) => {
  const limit = parseInt(req.query.limit || 20, 10);
  res.json({
    total: healthTrainingData.length,
    records: healthTrainingData.slice(0, limit)
  });
});

// 9. Audit Logs
app.get('/api/audit-logs', (req, res) => {
  res.json(auditLogs);
});

app.listen(PORT, () => {
  console.log(`[AIR POWER Gateway] Server active on port ${PORT}`);
});
