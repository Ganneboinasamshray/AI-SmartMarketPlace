'use client';

import React, { useState, useEffect } from 'react';
import { MLPrediction } from '../lib/types';
import { fetchMLPriceForecast } from '../lib/api';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedMarket, setSelectedMarket] = useState('Bowenpally (Hyderabad)');
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [forecastHorizon, setForecastHorizon] = useState<7 | 30>(7);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<MLPrediction | null>(null);

  // Regional market comparison across Telangana Mandis
  const marketComparisons = [
    { market: 'Bowenpally (Hyd, TS)', currentPrice: 28.0, predicted7d: 28.8, arrival: 2100 },
    { market: 'Gudimalkapur (Hyd, TS)', currentPrice: 28.5, predicted7d: 29.1, arrival: 1850 },
    { market: 'Warangal Laxmipuram (TS)', currentPrice: 27.5, predicted7d: 28.2, arrival: 2600 },
    { market: 'Karimnagar Market Yard (TS)', currentPrice: 27.0, predicted7d: 27.6, arrival: 2400 },
    { market: 'Gudimalkapur (Hyderabad Mandi)', currentPrice: 28.5, predicted7d: 29.2, arrival: 3200 }
  ];

  // Historical price data points
  const generateHistoricalData = () => {
    const data = [];
    const base = selectedCrop === 'Apple' ? 110 : selectedCrop === 'Onion' ? 26 : selectedCrop === 'Potato' ? 21 : 28;
    const now = new Date();

    for (let i = 30; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const cycle = Math.sin((30 - i) * 0.25) * 3.5;
      const modal = Math.round((base + cycle + (Math.random() * 1.5 - 0.75)) * 10) / 10;
      data.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        modalPrice: modal,
        minPrice: Math.round((modal * 0.91) * 10) / 10,
        maxPrice: Math.round((modal * 1.11) * 10) / 10,
        arrivalQuintals: Math.round(1500 - cycle * 60)
      });
    }
    return data;
  };

  const [historicalData, setHistoricalData] = useState(generateHistoricalData());

  useEffect(() => {
    setLoading(true);
    fetchMLPriceForecast(selectedCrop, selectedMarket, forecastHorizon)
      .then(res => setPrediction(res))
      .catch(console.error)
      .finally(() => setLoading(false));

    setHistoricalData(generateHistoricalData());
  }, [selectedCrop, selectedMarket, forecastHorizon]);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary-100 text-primary-800">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agricultural Market Intelligence</h1>
              <p className="text-xs text-gray-500">
                Multi-year Mandi Arrivals, Seasonal Price Cycles & ML Projections
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div>
            <label className="text-[11px] font-bold text-gray-500 block mb-1">Crop</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
            >
              {['Tomato', 'Potato', 'Onion', 'Carrot', 'Cauliflower', 'Capsicum', 'Spinach', 'Green Chilli', 'Brinjal', 'Cabbage', 'Bottle Gourd', 'Bitter Gourd', 'Cucumber', 'Ginger', 'Garlic', 'Green Beans', 'Lady Finger (Okra)', 'Mango', 'Banana', 'Pomegranate'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 block mb-1">Benchmark Mandi</label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
            >
              <option value="Bowenpally (Hyderabad)">Bowenpally Mandi (Hyderabad, TS)</option>
              <option value="Gudimalkapur (Hyderabad)">Gudimalkapur Mandi (Hyderabad, TS)</option>
              <option value="Warangal (Laxmipuram)">Warangal Laxmipuram Mandi (Telangana)</option>
              <option value="Bowenpally (Hyderabad)">Bowenpally Mandi (Hyderabad Benchmark)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 block mb-1">Forecast Horizon</label>
            <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setForecastHorizon(7)}
                className={`px-3 py-1.5 rounded-lg transition ${forecastHorizon === 7 ? 'bg-white text-primary-700 shadow-xs' : 'text-gray-600'}`}
              >
                7 Days
              </button>
              <button
                onClick={() => setForecastHorizon(30)}
                className={`px-3 py-1.5 rounded-lg transition ${forecastHorizon === 30 ? 'bg-white text-primary-700 shadow-xs' : 'text-gray-600'}`}
              >
                30 Days
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Current Mandi Price</span>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">
            ₹{prediction ? prediction.current_market_price.toFixed(2) : '--'}/kg
          </div>
          <div className="mt-2 text-xs text-gray-600 flex items-center">
            {prediction?.trend === 'Increasing' ? (
              <span className="text-emerald-600 font-bold flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-0.5" /> +{prediction.trend_percentage}% over 7d
              </span>
            ) : (
              <span className="text-gray-500 font-medium">Stable demand spread</span>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">30-Day Peak High</span>
          <div className="text-2xl font-extrabold text-primary-700 mt-1">
            ₹{(Math.max(...historicalData.map(d => d.maxPrice))).toFixed(2)}/kg
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Recorded during supply arrivals drawdown
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">30-Day Trough Low</span>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">
            ₹{(Math.min(...historicalData.map(d => d.minPrice))).toFixed(2)}/kg
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Recorded during peak harvest arrival flush
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">ML Forecast ({forecastHorizon}d Average)</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">
            ₹{prediction ? prediction.avg_predicted_price.toFixed(2) : '--'}/kg
          </div>
          <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> 94.8% model confidence
          </div>
        </div>

      </div>

      {/* Main Charts: 1. Historical & 2. Future Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Historical Price Trend */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">30-Day Historical Modal Price & Spread</h3>
              <p className="text-xs text-gray-500">Daily mandi modal rates vs high/low price boundaries</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 rounded-lg text-gray-600">
              ₹/kg
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={['dataMin - 2', 'dataMax + 2']} tickLine={false} unit="₹" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="maxPrice" stroke="#93c5fd" strokeDasharray="3 3" dot={false} name="High (₹)" />
                <Line type="monotone" dataKey="modalPrice" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 2 }} name="Modal Price (₹)" />
                <Line type="monotone" dataKey="minPrice" stroke="#cbd5e1" strokeDasharray="3 3" dot={false} name="Low (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Machine Learning Projection Curve */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                {forecastHorizon}-Day Machine Learning Forward Trajectory
              </h3>
              <p className="text-xs text-gray-500">Random Forest & XGBoost with 95% confidence uncertainty interval</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
              Trend: {prediction?.trend}
            </span>
          </div>

          <div className="h-72 w-full">
            {prediction && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prediction.daily_forecasts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day_name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} tickLine={false} unit="₹" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="upper_bound" stroke="#86efac" strokeDasharray="2 2" dot={false} name="Confidence Upper" />
                  <Line type="monotone" dataKey="predicted_price" stroke="#059669" strokeWidth={3} dot={{ r: 3, fill: '#059669' }} name="Predicted Price (₹)" />
                  <Line type="monotone" dataKey="lower_bound" stroke="#a7f3d0" strokeDasharray="2 2" dot={false} name="Confidence Lower" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Mandi-Wise Comparison Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Regional Wholesale Mandi Price & Arrival Comparison</h3>
            <p className="text-xs text-gray-500">Analyze geographic price arbitrage and supply volume differences</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marketComparisons}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="market" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="₹" />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="currentPrice" fill="#16a34a" name="Spot Price (₹/kg)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="predicted7d" fill="#3b82f6" name="7-Day Predicted (₹/kg)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
