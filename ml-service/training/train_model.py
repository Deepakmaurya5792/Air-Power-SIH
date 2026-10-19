import os
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    classification_report,
    roc_auc_score,
    confusion_matrix,
    precision_score,
    recall_score,
    f1_score,
    accuracy_score
)
import joblib

DATASET_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "..",
    "DATASET",
    "air_power_synthetic_dataset",
    "synthetic_health_training.csv"
)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
os.makedirs(MODEL_DIR, exist_ok=True)

def train_predictive_model():
    print(f"Loading dataset from: {DATASET_PATH}")
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}")

    df = pd.read_csv(DATASET_PATH)
    target = "failure_next_30_days"
    drop_cols = ["record_id", "aircraft_id", "component_id", target]

    feature_cols = [c for c in df.columns if c not in drop_cols]
    X = df[feature_cols]
    y = df[target]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"Dataset Shape: {df.shape}, Train: {X_train.shape}, Test: {X_test.shape}")
    print(f"Target distribution: {y.value_counts().to_dict()}")

    # Baseline Random Forest Model
    rf_model = RandomForestClassifier(
        n_estimators=150,
        max_depth=12,
        random_state=42,
        class_weight="balanced"
    )
    rf_model.fit(X_train, y_train)

    y_pred = rf_model.predict(X_test)
    y_prob = rf_model.predict_proba(X_test)[:, 1]

    # Metrics computation
    cm = confusion_matrix(y_test, y_pred).tolist()
    auc = float(roc_auc_score(y_test, y_prob))
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))

    # Feature importances
    feature_importances = dict(
        sorted(
            zip(feature_cols, [float(x) for x in rf_model.feature_importances_]),
            key=lambda item: item[1],
            reverse=True
        )
    )

    metrics = {
        "model_version": "v1.2.0-RF-Ensemble",
        "algorithm": "RandomForestClassifier",
        "sample_count": len(df),
        "test_size": len(X_test),
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "roc_auc": round(auc, 4),
        "confusion_matrix": cm,
        "feature_columns": feature_cols,
        "feature_importances": feature_importances,
        "is_simulated_model": True,
        "trained_timestamp": pd.Timestamp.now().isoformat()
    }

    # Save model and metadata
    model_file = os.path.join(MODEL_DIR, "predictive_maintenance_rf.joblib")
    metrics_file = os.path.join(MODEL_DIR, "model_metadata.json")

    joblib.dump(rf_model, model_file)
    with open(metrics_file, "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"Model successfully saved to {model_file}")
    print(f"Metrics: F1={f1:.4f}, AUC={auc:.4f}, Precision={prec:.4f}, Recall={rec:.4f}")
    return metrics

if __name__ == "__main__":
    train_predictive_model()
