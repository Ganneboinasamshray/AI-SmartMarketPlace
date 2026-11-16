"""
Agricultural Price Prediction Model Training Pipeline.
Trains Random Forest and XGBoost models on multi-year mandi price dataset.
Includes feature engineering (lags, rolling stats, cyclical harmonics, weather, arrivals),
train/test split evaluation (RMSE, MAE, R2), and model persistence.
"""

import os
import json
import math
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import xgboost as xgb

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    print("Engineering temporal, lag, rolling and market features...")
    df = df.sort_values(by=["commodity", "market", "date"]).copy()
    df["date"] = pd.to_datetime(df["date"])
    
    # Cyclical day-of-year and month encoding
    day_of_year = df["date"].dt.dayofyear
    df["sin_doy"] = np.sin(2 * np.pi * day_of_year / 365.25)
    df["cos_doy"] = np.cos(2 * np.pi * day_of_year / 365.25)
    df["sin_month"] = np.sin(2 * np.pi * df["month"] / 12.0)
    df["cos_month"] = np.cos(2 * np.pi * df["month"] / 12.0)
    
    # Grouped lag features per commodity and market
    grouped = df.groupby(["commodity", "market"])["modal_price"]
    df["lag_1"] = grouped.shift(1)
    df["lag_7"] = grouped.shift(7)
    df["lag_14"] = grouped.shift(14)
    df["lag_30"] = grouped.shift(30)
    
    # Rolling statistics (excluding current day to prevent data leakage)
    df["rolling_mean_7"] = grouped.transform(lambda x: x.shift(1).rolling(7, min_periods=1).mean())
    df["rolling_std_7"] = grouped.transform(lambda x: x.shift(1).rolling(7, min_periods=1).std()).fillna(0)
    df["rolling_mean_30"] = grouped.transform(lambda x: x.shift(1).rolling(30, min_periods=1).mean())
    
    # Fill initial lag NAs with backward/forward fill
    df["lag_1"] = df["lag_1"].fillna(df["modal_price"])
    df["lag_7"] = df["lag_7"].fillna(df["lag_1"])
    df["lag_14"] = df["lag_14"].fillna(df["lag_7"])
    df["lag_30"] = df["lag_30"].fillna(df["lag_14"])
    df["rolling_mean_7"] = df["rolling_mean_7"].fillna(df["modal_price"])
    df["rolling_mean_30"] = df["rolling_mean_30"].fillna(df["modal_price"])
    
    return df

def train_and_evaluate():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, "data", "historical_mandi_prices.csv")
    models_dir = os.path.join(script_dir, "models")
    os.makedirs(models_dir, exist_ok=True)
    
    print(f"Loading data from {csv_path}...")
    df = pd.read_csv(csv_path)
    df = engineer_features(df)
    
    # Encode categorical features
    commodities = sorted(df["commodity"].unique().tolist())
    markets = sorted(df["market"].unique().tolist())
    categories = sorted(df["category"].unique().tolist())
    
    commodity_to_id = {c: i for i, c in enumerate(commodities)}
    market_to_id = {m: i for i, m in enumerate(markets)}
    category_to_id = {c: i for i, c in enumerate(categories)}
    
    df["commodity_id"] = df["commodity"].map(commodity_to_id)
    df["market_id"] = df["market"].map(market_to_id)
    df["category_id"] = df["category"].map(category_to_id)
    
    feature_cols = [
        "commodity_id", "market_id", "category_id",
        "month", "day_of_week", "sin_doy", "cos_doy", "sin_month", "cos_month",
        "arrival_quintals", "rainfall_mm", "temperature_c", "demand_index",
        "lag_1", "lag_7", "lag_14", "lag_30",
        "rolling_mean_7", "rolling_std_7", "rolling_mean_30"
    ]
    target_col = "modal_price"
    
    # Time-based train/test split: reserve the last 15% dates for out-of-sample evaluation
    unique_dates = sorted(df["date"].unique())
    split_idx = int(len(unique_dates) * 0.85)
    split_date = unique_dates[split_idx]
    
    train_mask = df["date"] < split_date
    test_mask = df["date"] >= split_date
    
    X_train = df.loc[train_mask, feature_cols]
    y_train = df.loc[train_mask, target_col]
    X_test = df.loc[test_mask, feature_cols]
    y_test = df.loc[test_mask, target_col]
    
    print(f"Training set: {X_train.shape[0]} samples (up to {split_date})")
    print(f"Testing set: {X_test.shape[0]} samples (from {split_date})")
    
    # 1. Train Random Forest Regressor
    print("\n--- Training Random Forest Regressor ---")
    rf_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=16,
        min_samples_split=5,
        min_samples_leaf=2,
        n_jobs=-1,
        random_state=42
    )
    rf_model.fit(X_train, y_train)
    rf_preds = rf_model.predict(X_test)
    
    rf_rmse = float(np.sqrt(mean_squared_error(y_test, rf_preds)))
    rf_mae = float(mean_absolute_error(y_test, rf_preds))
    rf_r2 = float(r2_score(y_test, rf_preds))
    rf_mape = float(np.mean(np.abs((y_test - rf_preds) / y_test)) * 100)
    
    print(f"Random Forest Performance:")
    print(f"  RMSE: {rf_rmse:.3f} ₹/kg")
    print(f"  MAE:  {rf_mae:.3f} ₹/kg")
    print(f"  R²:   {rf_r2:.4f}")
    print(f"  MAPE: {rf_mape:.2f}%")
    
    # 2. Train XGBoost Regressor
    print("\n--- Training XGBoost Regressor ---")
    xgb_model = xgb.XGBRegressor(
        n_estimators=150,
        learning_rate=0.08,
        max_depth=7,
        subsample=0.85,
        colsample_bytree=0.85,
        random_state=42,
        n_jobs=-1
    )
    xgb_model.fit(X_train, y_train)
    xgb_preds = xgb_model.predict(X_test)
    
    xgb_rmse = float(np.sqrt(mean_squared_error(y_test, xgb_preds)))
    xgb_mae = float(mean_absolute_error(y_test, xgb_preds))
    xgb_r2 = float(r2_score(y_test, xgb_preds))
    xgb_mape = float(np.mean(np.abs((y_test - xgb_preds) / y_test)) * 100)
    
    print(f"XGBoost Performance:")
    print(f"  RMSE: {xgb_rmse:.3f} ₹/kg")
    print(f"  MAE:  {xgb_mae:.3f} ₹/kg")
    print(f"  R²:   {xgb_r2:.4f}")
    print(f"  MAPE: {xgb_mape:.2f}%")
    
    # Select best model
    best_name = "XGBoost" if xgb_r2 >= rf_r2 else "RandomForest"
    best_model = xgb_model if best_name == "XGBoost" else rf_model
    best_rmse = xgb_rmse if best_name == "XGBoost" else rf_rmse
    best_r2 = xgb_r2 if best_name == "XGBoost" else rf_r2
    
    print(f"\nChampion Model: {best_name} (R² = {best_r2:.4f}, RMSE = {best_rmse:.3f})")
    
    # Save models
    xgb_path = os.path.join(models_dir, "price_predictor_xgb.joblib")
    rf_path = os.path.join(models_dir, "price_predictor_rf.joblib")
    joblib.dump(xgb_model, xgb_path)
    joblib.dump(rf_model, rf_path)
    print(f"Saved models to {models_dir}")
    
    # Commodity baselines and standard deviations for confidence intervals & pricing bands
    commodity_stats = {}
    for c in commodities:
        cdf = df[df["commodity"] == c]
        commodity_stats[c] = {
            "mean": round(float(cdf["modal_price"].mean()), 2),
            "std": round(float(cdf["modal_price"].std()), 2),
            "min": round(float(cdf["modal_price"].min()), 2),
            "max": round(float(cdf["modal_price"].max()), 2),
            "category": cdf["category"].iloc[0]
        }
        
    metadata = {
        "best_model": best_name,
        "feature_cols": feature_cols,
        "commodities": commodities,
        "markets": markets,
        "categories": categories,
        "commodity_to_id": commodity_to_id,
        "market_to_id": market_to_id,
        "category_to_id": category_to_id,
        "metrics": {
            "xgboost": {"rmse": xgb_rmse, "mae": xgb_mae, "r2": xgb_r2, "mape": xgb_mape},
            "random_forest": {"rmse": rf_rmse, "mae": rf_mae, "r2": rf_r2, "mape": rf_mape}
        },
        "commodity_stats": commodity_stats,
        "last_trained_date": pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    meta_path = os.path.join(models_dir, "metadata.json")
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved metadata & metrics to {meta_path}")

if __name__ == "__main__":
    train_and_evaluate()
