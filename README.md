# AIR POWER — Predictive Maintenance & Fleet Intelligence

> **Predict Failure. Preserve Readiness.**  
> TechCraft-inspired cinematic defence aviation analytics prototype powered by supervised machine learning and synthetic fleet telemetry.

---

## ⚠️ Synthetic Prototype Notice
**All aircraft records, sensor values, maintenance queues, predictions, costs, and availability metrics generated and consumed by this platform are entirely synthetic.** This system is engineered as an operational architectural prototype and demonstration for predictive maintenance analytics. Do not represent or utilize these records as official military data or operational flight specifications.

---

## Architecture Overview

```
                      ┌──────────────────────────────────────────┐
                      │             React + JSX Web UI           │
                      │    (Vite / Tailwind CSS / Recharts)      │
                      │         http://localhost:5173            │
                      └────────────────────┬─────────────────────┘
                                           │
                                    REST API Proxy
                                           │
                      ┌────────────────────▼─────────────────────┐
                      │         Node.js Express Gateway          │
                      │       Live Mutations, CSV Importer       │
                      │         http://localhost:8000            │
                      └────────────────────┬─────────────────────┘
                                           │
                                    HTTP Inferences
                                           │
                      ┌────────────────────▼─────────────────────┐
                      │           Python FastAPI Service         │
                      │   Scikit-Learn Random Forest Ensemble    │
                      │         http://127.0.0.1:8001            │
                      └──────────────────────────────────────────┘
```

---

## Features & Modules

1. **TechCraft Cinematic Theme & Canvas Background**
   - High-performance layered HTML5 canvas animation: moving perspective grid, particle signal stream, radar pulse HUD sweep, and responsive lighting effects.
   - Strictly optimized for 60 FPS without unnecessary React re-renders.

2. **Cinematic Landing Page**
   - Immersive hero section with tactical status cards (150 Active Craft, 62.7% Availability, 90.0% ROC-AUC, 1,800 telemetry rows).
   - Direct launch pathways to the Command Center and Predictive AI workspace.

3. **Command Center Overview**
   - Dynamic KPI cards calculated from active datasets (Mission Ready: 94, Under Maintenance: 25, Open Orders: 181, Anomalies: 114).
   - Time-series availability trend chart distinguishing 14-day historical telemetry from simulated projections with confidence boundaries.
   - Interactive donut chart of fleet status distribution.

4. **Tactical Fleet Registry**
   - Dual-view interface: full data table and interactive card grid.
   - Multi-parameter filtering by Status, Aircraft Type, Maintenance Unit, and text search.
   - One-click CSV export of filtered records.

5. **AI Predictive Maintenance Workspace**
   - Trained Random Forest model using `DATASET/air_power_synthetic_dataset/synthetic_health_training.csv` with `failure_next_30_days` binary target.
   - Model metrics: **84.6% Accuracy**, **90.04% ROC-AUC**, **65.9% F1-score**.
   - Interactive feature tuning console to simulate sensor anomalies and calculate live failure probabilities with primary contributing telemetry factors.

6. **Sensor Intelligence & Aircraft Health**
   - Multi-channel timeseries (Engine Temp, Vibration, Oil Pressure, Hydraulic Pressure).
   - Flagged anomaly markers and direct one-click work-order dispatching.

7. **Maintenance Work Orders & Triage Kanban**
   - Visual Kanban board with columns: `Open`, `In Progress`, `Waiting for Parts`, `Completed`.
   - Live status shifting persisted directly through the backend server.
   - Work order dispatch modal with priority tagging and engineering notes.

8. **Spare Parts & Aviation Logistics**
   - Tracks stock quantities, unit costs (demo INR), supplier lead times, and automated reorder alerts.
   - Interactive stock receipt (+) and issue (-) adjustments.

9. **Fleet Availability Forecasting & Scenario Simulator**
   - Dynamic sliders to simulate reduced spare-parts lead times and depot turnaround efficiency improvements.

10. **Interactive Digital Twin**
    - Component-oriented virtual airframe schematic with clickable hotspots (Turbofan core, Avionics radar, Wing actuators, Undercarriage).

11. **Data Management & Ingestion Gateway**
    - Documentation for all 5 synthetic CSV datasets with schema validation and upload simulation.

12. **Settings & Immutable Audit Trail**
    - Live audit trail logging all system events (work orders created, status changes, inventory adjustments).

---

## Quick Start / Running the Platform

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### 1. Start the Machine Learning Inference Service (Python FastAPI)
```bash
# Model is already trained and saved to ml-service/models/predictive_maintenance_rf.joblib
# To retrain the model at any time:
python ml-service/training/train_model.py

# Start the FastAPI service:
cd ml-service
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001
```

### 2. Start the Backend API Gateway (Node.js Express)
```bash
cd backend
npm install
node server.js
# Backend runs on port 8000
```

### 3. Start the Frontend Application (React JSX)
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

Open your browser at: **`http://localhost:5173`**

---

## 🔒 Environment Variables & GitHub Security

All secret keys, credentials, tokens, build outputs, and dependencies are isolated in `.env` files and excluded from git:

- `.env` files contain active local secrets (JWT secret, API keys, endpoints) and are automatically ignored by `.gitignore`.
- `.env.example` templates are provided in the root, `frontend/`, `backend/`, and `ml-service/` for safe version control and deployment configuration.

