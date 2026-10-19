# Air Power Predictive Maintenance — Synthetic Prototype Dataset

IMPORTANT:
- All records in this package are synthetic, generated for a software prototype.
- Aircraft IDs, component IDs, aircraft types, sensor readings, costs, work orders, and labels are fictional.
- This dataset is NOT official Ministry of Defence, Indian Air Force, or real aircraft data.
- Do not use it for real maintenance, airworthiness, or operational decisions.

## Files
1. synthetic_health_training.csv
   - 4,000 labeled rows for a demonstration binary classifier.
   - Target: `failure_next_30_days` (0=no simulated failure label, 1=simulated failure label).
   - Features include operating hours, simulated sensor readings, component age, prior failures, maintenance history and health index.
   - Labels are generated from synthetic rules/noise. Metrics only demonstrate pipeline operation; they are not evidence of real-world performance.

2. synthetic_aircraft_fleet.csv
   - 150 fictional aircraft records for dashboard KPIs and fleet filtering.

3. synthetic_sensor_history.csv
   - 30 daily records for each of 60 fictional aircraft (1,800 rows) for sensor trend charts.

4. synthetic_maintenance_work_orders.csv
   - 320 fictional work orders for maintenance queues and status filters.

5. synthetic_spare_parts_inventory.csv
   - 40 fictional spare-part inventory records.

## Quick start (Python)
```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score

df = pd.read_csv("synthetic_health_training.csv")
target = "failure_next_30_days"
drop_cols = ["record_id", "aircraft_id", "component_id", target]
X = df.drop(columns=drop_cols)
y = df[target]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
model = RandomForestClassifier(n_estimators=200, random_state=42, class_weight="balanced")
model.fit(X_train, y_train)
pred = model.predict(X_test)
print(classification_report(y_test, pred))
print("AUC:", roc_auc_score(y_test, model.predict_proba(X_test)[:, 1]))
```

## Transition to official/real data later
- Build a separate data adapter/validation layer to map incoming columns to the model's expected features.
- Retrain and validate the model on authorized, labeled data; do not simply plug in different columns.
- NASA C-MAPSS predicts remaining useful life from engine-cycle sensor data. It has a different schema and target from `failure_next_30_days`, so it requires a separate preprocessing/training pipeline or an explicit target/feature redesign.
- Evaluate on a held-out dataset split by engine/component/time where appropriate. Avoid leakage from repeated observations of the same engine.
- Keep synthetic and real datasets clearly separated and label dashboard demo data accordingly.
