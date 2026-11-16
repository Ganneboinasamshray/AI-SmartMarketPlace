"""
Agricultural Market Historical Price Generator based on Indian Agmarknet Mandi patterns.
Generates comprehensive multi-year historical prices with realistic seasonal patterns,
weather anomalies, supply arrivals, and market spreads across 12 staple crops and 6 major mandis.
"""

import os
import math
import datetime
import numpy as np
import pandas as pd

COMMODITY_PROFILES = {
    "Tomato": {
        "category": "Vegetables",
        "base_price": 28.0,
        "volatility": 0.28,
        "season_peak_month": 7,     # July (monsoon supply squeeze)
        "season_trough_month": 1,   # January (winter flush harvest)
        "annual_drift": 0.04,
        "shelf_life_days": 7
    },
    "Potato": {
        "category": "Vegetables",
        "base_price": 20.0,
        "volatility": 0.12,
        "season_peak_month": 10,    # October (pre-harvest cold storage drawdown)
        "season_trough_month": 3,   # March (fresh rabi harvest)
        "annual_drift": 0.03,
        "shelf_life_days": 60
    },
    "Onion": {
        "category": "Vegetables",
        "base_price": 26.0,
        "volatility": 0.35,
        "season_peak_month": 11,    # November (Diwali post-monsoon stock gap)
        "season_trough_month": 4,   # April (rabi harvest arrivals)
        "annual_drift": 0.05,
        "shelf_life_days": 45
    },
    "Green Chilli": {
        "category": "Vegetables",
        "base_price": 45.0,
        "volatility": 0.22,
        "season_peak_month": 6,
        "season_trough_month": 12,
        "annual_drift": 0.04,
        "shelf_life_days": 10
    },
    "Cauliflower": {
        "category": "Vegetables",
        "base_price": 24.0,
        "volatility": 0.20,
        "season_peak_month": 6,
        "season_trough_month": 12,
        "annual_drift": 0.03,
        "shelf_life_days": 7
    },
    "Cabbage": {
        "category": "Vegetables",
        "base_price": 18.0,
        "volatility": 0.18,
        "season_peak_month": 7,
        "season_trough_month": 1,
        "annual_drift": 0.03,
        "shelf_life_days": 12
    },
    "Carrot": {
        "category": "Vegetables",
        "base_price": 30.0,
        "volatility": 0.20,
        "season_peak_month": 8,
        "season_trough_month": 1,
        "annual_drift": 0.03,
        "shelf_life_days": 20
    },
    "Spinach": {
        "category": "Vegetables",
        "base_price": 22.0,
        "volatility": 0.25,
        "season_peak_month": 5,
        "season_trough_month": 12,
        "annual_drift": 0.04,
        "shelf_life_days": 3
    },
    "Apple": {
        "category": "Fruits",
        "base_price": 110.0,
        "volatility": 0.16,
        "season_peak_month": 5,     # May-June (pre-Shimla/Kashmir season)
        "season_trough_month": 9,   # Sept-Oct (peak harvest)
        "annual_drift": 0.05,
        "shelf_life_days": 45
    },
    "Banana": {
        "category": "Fruits",
        "base_price": 35.0,
        "volatility": 0.14,
        "season_peak_month": 8,     # Festival demand
        "season_trough_month": 2,
        "annual_drift": 0.03,
        "shelf_life_days": 8
    },
    "Mango": {
        "category": "Fruits",
        "base_price": 85.0,
        "volatility": 0.32,
        "season_peak_month": 3,     # Early season premium
        "season_trough_month": 6,   # Peak supply glut
        "annual_drift": 0.05,
        "shelf_life_days": 10
    },
    "Rice": {
        "category": "Grains",
        "base_price": 42.0,
        "volatility": 0.08,
        "season_peak_month": 9,
        "season_trough_month": 12,
        "annual_drift": 0.04,
        "shelf_life_days": 365
    },
    "Wheat": {
        "category": "Grains",
        "base_price": 27.0,
        "volatility": 0.09,
        "season_peak_month": 1,
        "season_trough_month": 4,
        "annual_drift": 0.04,
        "shelf_life_days": 365
    }
}

MARKETS = {
    "Azadpur (Delhi)": {"region": "North", "price_multiplier": 1.08, "volume_multiplier": 2.2},
    "Vashi (Mumbai)": {"region": "West", "price_multiplier": 1.10, "volume_multiplier": 1.8},
    "Kolar (Karnataka)": {"region": "South", "price_multiplier": 0.92, "volume_multiplier": 1.5},
    "Lasalgaon (Maharashtra)": {"region": "West", "price_multiplier": 0.88, "volume_multiplier": 2.5}, # Onion capital
    "Bowenpally (Hyderabad)": {"region": "South", "price_multiplier": 0.98, "volume_multiplier": 1.2},
    "Durgapura (Jaipur)": {"region": "North", "price_multiplier": 0.95, "volume_multiplier": 1.0}
}

def generate_market_data(start_date="2023-01-01", end_date="2026-03-31", seed=42):
    np.random.seed(seed)
    start = datetime.datetime.strptime(start_date, "%Y-%m-%d").date()
    end = datetime.datetime.strptime(end_date, "%Y-%m-%d").date()
    days = (end - start).days + 1
    
    records = []
    
    for commodity, profile in COMMODITY_PROFILES.items():
        base_p = profile["base_price"]
        cat = profile["category"]
        volat = profile["volatility"]
        peak_m = profile["season_peak_month"]
        drift = profile["annual_drift"]
        
        for market, mkt_info in MARKETS.items():
            mkt_mult = mkt_info["price_multiplier"]
            vol_mult = mkt_info["volume_multiplier"]
            region = mkt_info["region"]
            
            # Special regional advantages: Lasalgaon for onions, Kolar for tomatoes
            if commodity == "Onion" and "Lasalgaon" in market:
                mkt_mult = 0.82
            elif commodity == "Tomato" and "Kolar" in market:
                mkt_mult = 0.85
            elif commodity == "Apple" and "Azadpur" in market:
                mkt_mult = 1.02 # hub for north
                
            current_date = start
            running_price = base_p * mkt_mult
            
            for d in range(days):
                date_str = current_date.strftime("%Y-%m-%d")
                year = current_date.year
                month = current_date.month
                day_of_week = current_date.weekday()
                day_of_year = current_date.timetuple().tm_yday
                
                # Seasonality cycle (12-month harmonic)
                # Max at peak_m, min 6 months later
                month_angle = 2 * math.pi * (month - peak_m) / 12.0
                seasonal_factor = 1.0 + (volat * 0.7 * math.cos(month_angle))
                
                # Inflation / yearly drift
                year_factor = 1.0 + (year - 2023) * drift
                
                # Rainfall / Temperature proxy based on month & region
                is_monsoon = 1 if month in [6, 7, 8, 9] else 0
                rainfall_mm = np.random.exponential(15.0) if is_monsoon else np.random.exponential(2.0)
                rainfall_mm = round(float(rainfall_mm), 1)
                
                temp_c = 28 + 8 * math.sin(2 * math.pi * (month - 4) / 12.0) + np.random.normal(0, 1.5)
                temp_c = round(float(temp_c), 1)
                
                # Arrival volume (quintals) inversely correlated with price spikes
                base_arrival = 1500 * vol_mult / seasonal_factor
                arrival_quintals = max(100.0, base_arrival * np.random.normal(1.0, 0.15))
                arrival_quintals = round(float(arrival_quintals), 1)
                
                # Daily price calculation with mean-reverting random walk
                target_price = base_p * mkt_mult * seasonal_factor * year_factor
                # Supply shock effect: lower arrival -> higher price
                supply_shock = (base_arrival / max(arrival_quintals, 50.0) - 1.0) * 0.15
                target_price *= (1.0 + supply_shock)
                
                # Mean reversion
                running_price = 0.85 * running_price + 0.15 * target_price + np.random.normal(0, base_p * 0.03)
                running_price = max(base_p * 0.4, running_price)
                
                modal_price = round(float(running_price), 2)
                min_price = round(modal_price * np.random.uniform(0.88, 0.94), 2)
                max_price = round(modal_price * np.random.uniform(1.06, 1.15), 2)
                
                # Demand score 1 to 10
                demand_index = round(min(10.0, max(1.0, 5.5 + 2.5 * math.cos(month_angle) + (1 if day_of_week in [5, 6] else 0))), 1)
                
                records.append({
                    "date": date_str,
                    "commodity": commodity,
                    "category": cat,
                    "market": market,
                    "region": region,
                    "modal_price": modal_price,
                    "min_price": min_price,
                    "max_price": max_price,
                    "arrival_quintals": arrival_quintals,
                    "rainfall_mm": rainfall_mm,
                    "temperature_c": temp_c,
                    "demand_index": demand_index,
                    "year": year,
                    "month": month,
                    "day_of_week": day_of_week
                })
                
                current_date += datetime.timedelta(days=1)
                
    df = pd.DataFrame(records)
    return df

if __name__ == "__main__":
    out_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(out_dir, "data")
    os.makedirs(data_dir, exist_ok=True)
    out_csv = os.path.join(data_dir, "historical_mandi_prices.csv")
    
    print(f"Generating realistic agricultural market dataset...")
    df = generate_market_data()
    print(f"Generated {len(df)} records across {df['commodity'].nunique()} commodities and {df['market'].nunique()} markets.")
    df.to_csv(out_csv, index=False)
    print(f"Saved dataset to {out_csv}")
    print(df.head())
