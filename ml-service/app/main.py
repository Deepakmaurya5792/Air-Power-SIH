import os
import json
from datetime import datetime
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib

app = FastAPI(
    title="AIR POWER - ML Predictive Maintenance Intelligence Service",
    description="Simulated ML inference service for fleet predictive maintenance",
    version="1.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
MODEL_FILE = os.path.join(MODEL_DIR, "predictive_maintenance_rf.joblib")
METADATA_FILE = os.path.join(MODEL_DIR, "model_metadata.json")

# In-memory model cache
loaded_model = None
model_metadata = {}

def get_model():
    global loaded_model, model_metadata
    if loaded_model is None and os.path.exists(MODEL_FILE):
        try:
            loaded_model = joblib.load(MODEL_FILE)
            if os.path.exists(METADATA_FILE):
                with open(METADATA_FILE, "r") as f:
                    model_metadata = json.load(f)
        except Exception as e:
            print(f"Error loading model: {e}")
    return loaded_model, model_metadata

class FeatureInput(BaseModel):
    flight_hours: float
    engine_temperature_c: float
    oil_pressure_kpa: float
    vibration_mm_s: float
    fuel_flow_kg_h: float
    hydraulic_pressure_psi: float
    brake_temperature_c: float
    component_age_days: float
    previous_failures: int
    maintenance_count: int
    days_since_maintenance: float
    health_index: float

class PredictionResponse(BaseModel):
    failure_probability: float
    predicted_label: int
    risk_level: str
    risk_color: str
    recommendation: str
    model_version: str
    timestamp: str
    is_simulated_prediction: bool
    top_contributing_factors: List[Dict[str, Any]]

@app.get("/health")
def health_check():
    model, metadata = get_model()
    return {
        "status": "healthy",
        "service": "AIR POWER Predictive Intelligence API",
        "model_loaded": model is not None,
        "model_version": metadata.get("model_version", "v1.2.0-RF-Ensemble"),
        "is_simulation_mode": True,
        "disclaimer": "PROTOTYPE ONLY - SYNTHETIC DATA & SIMULATED INFERENCE"
    }

@app.get("/model/metrics")
def get_metrics():
    _, metadata = get_model()
    if not metadata:
        raise HTTPException(status_code=404, detail="Model metadata not yet computed")
    return metadata

@app.post("/predict", response_model=PredictionResponse)
def predict_failure(features: FeatureInput, high_risk_threshold: float = 0.65, medium_risk_threshold: float = 0.35):
    model, metadata = get_model()
    if model is None:
        raise HTTPException(status_code=503, detail="Predictive ML Model is not yet trained or loaded.")

    feature_cols = metadata.get("feature_columns", [
        "flight_hours", "engine_temperature_c", "oil_pressure_kpa", "vibration_mm_s",
        "fuel_flow_kg_h", "hydraulic_pressure_psi", "brake_temperature_c",
        "component_age_days", "previous_failures", "maintenance_count",
        "days_since_maintenance", "health_index"
    ])

    data_dict = features.dict()
    input_vector = [data_dict.get(c, 0.0) for c in feature_cols]
    X = np.array([input_vector])

    # Model inference
    prob = float(model.predict_proba(X)[0][1])
    label = int(prob >= 0.5)

    if prob >= high_risk_threshold:
        risk_level = "CRITICAL / HIGH RISK"
        risk_color = "#EF4444"
        rec = "Immediate scheduled teardown & sensor diagnostic recommended within 48 flight hours."
    elif prob >= medium_risk_threshold:
        risk_level = "ELEVATED / MEDIUM RISK"
        risk_color = "#F59E0B"
        rec = "Schedule priority borescope inspection and cross-verify vibration telemetry."
    else:
        risk_level = "NOMINAL / LOW RISK"
        risk_color = "#10B981"
        rec = "System within normal operational parameters. Continue regular flight cycles."

    # Top contributing factors calculation based on feature importances and input deviations
    importances = metadata.get("feature_importances", {})
    contributions = []
    for col, imp in importances.items():
        val = data_dict.get(col, 0)
        contributions.append({
            "feature": col,
            "value": val,
            "global_importance": imp
        })
    contributions = sorted(contributions, key=lambda x: x["global_importance"], reverse=True)[:4]

    return {
        "failure_probability": round(prob, 4),
        "predicted_label": label,
        "risk_level": risk_level,
        "risk_color": risk_color,
        "recommendation": rec,
        "model_version": metadata.get("model_version", "v1.2.0-RF-Ensemble"),
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "is_simulated_prediction": True,
        "top_contributing_factors": contributions
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
