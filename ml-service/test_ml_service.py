"""
Unit and Integration Tests for Smart Farmer Marketplace ML Service.
Tests model loading, all five endpoints:
  /health, /commodities, /predict-price, /compare-price, /historical-analytics

Run from ml-service directory:
    python -m pytest test_ml_service.py -v
"""

import pytest
from fastapi.testclient import TestClient
from main import app, _load_artifacts


@pytest.fixture(scope="module", autouse=True)
def init_app():
    """Ensure ML models and dataset are loaded before tests run."""
    _load_artifacts()


# TestClient from fastapi (wraps httpx — no deprecation warning)
client = TestClient(app)


# ─────────────────────────── Health Check ───────────────────────────────────

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert data["historical_records_count"] > 0
    assert "Tomato" in data["supported_commodities"]
    assert "Azadpur (Delhi)" in data["supported_markets"]


# ─────────────────────────── Commodities ────────────────────────────────────

def test_commodities():
    res = client.get("/commodities")
    assert res.status_code == 200
    data = res.json()
    assert "Tomato" in data["commodities"]
    assert "Azadpur (Delhi)" in data["markets"]
    assert "Vegetables" in data["categories"]
    assert isinstance(data["commodity_stats"], dict)


# ──────────────────────── Predict Price ─────────────────────────────────────

def test_predict_price_7_days():
    payload = {"commodity": "Tomato", "market": "Azadpur (Delhi)", "forecast_days": 7}
    res = client.post("/predict-price", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["commodity"] == "Tomato"
    assert data["forecast_horizon_days"] == 7
    assert len(data["daily_forecasts"]) == 7
    assert data["trend"] in ["Increasing", "Decreasing", "Stable"]
    assert data["recommended_min_price"] < data["recommended_max_price"]
    assert data["confidence_score"] > 80
    # Validate every forecast day
    for day in data["daily_forecasts"]:
        assert day["predicted_price"] > 0
        assert day["lower_bound"] <= day["predicted_price"]
        assert day["upper_bound"] >= day["predicted_price"]


def test_predict_price_30_days():
    payload = {"commodity": "Onion", "market": "Lasalgaon (Maharashtra)", "forecast_days": 30}
    res = client.post("/predict-price", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["daily_forecasts"]) == 30
    assert data["avg_predicted_price"] > 0
    assert data["volatility_risk"] in ["Low", "Moderate", "High"]


def test_predict_price_invalid_commodity():
    payload = {"commodity": "NONEXISTENT_CROP", "market": "Azadpur (Delhi)", "forecast_days": 7}
    res = client.post("/predict-price", json=payload)
    assert res.status_code == 400
    assert "not found" in res.json()["detail"].lower()


def test_predict_price_invalid_market():
    payload = {"commodity": "Tomato", "market": "FAKE MARKET CITY", "forecast_days": 7}
    res = client.post("/predict-price", json=payload)
    assert res.status_code == 400


# ──────────────────────── Compare Price ─────────────────────────────────────

def test_compare_price_returns_status():
    payload = {"commodity": "Potato", "market": "Azadpur (Delhi)", "proposed_price": 22.0}
    res = client.post("/compare-price", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] in ["UNDERPRICED", "FAIR_MARKET", "OVERPRICED"]
    assert "recommendation_message" in data
    assert data["recommended_min_price"] < data["recommended_max_price"]


def test_compare_price_very_low():
    """Extremely low price should always be UNDERPRICED."""
    payload = {"commodity": "Tomato", "market": "Azadpur (Delhi)", "proposed_price": 0.5}
    res = client.post("/compare-price", json=payload)
    assert res.status_code == 200
    assert res.json()["status"] == "UNDERPRICED"


def test_compare_price_very_high():
    """Extremely high price should always be OVERPRICED."""
    payload = {"commodity": "Tomato", "market": "Azadpur (Delhi)", "proposed_price": 99999.0}
    res = client.post("/compare-price", json=payload)
    assert res.status_code == 200
    assert res.json()["status"] == "OVERPRICED"


# ──────────────────── Historical Analytics ──────────────────────────────────

def test_historical_analytics_daily():
    res = client.get(
        "/historical-analytics?commodity=Tomato&market=Azadpur%20(Delhi)&timeframe=daily&limit=30"
    )
    assert res.status_code == 200
    data = res.json()
    assert data["commodity"] == "Tomato"
    assert len(data["data_points"]) <= 30
    stats = data["statistics"]
    assert stats["highest_recorded_price"] >= stats["lowest_recorded_price"]
    assert stats["average_price"] > 0


def test_historical_analytics_weekly():
    res = client.get("/historical-analytics?commodity=Onion&timeframe=weekly&limit=12")
    assert res.status_code == 200
    data = res.json()
    assert data["timeframe"] == "weekly"
    assert len(data["data_points"]) <= 12


def test_historical_analytics_monthly():
    res = client.get("/historical-analytics?commodity=Potato&timeframe=monthly&limit=12")
    assert res.status_code == 200
    data = res.json()
    assert data["timeframe"] == "monthly"
    for pt in data["data_points"]:
        assert "period" in pt and "modal_price" in pt


def test_historical_analytics_invalid_timeframe():
    res = client.get("/historical-analytics?commodity=Tomato&timeframe=hourly")
    assert res.status_code == 422  # Validation error — pattern mismatch
