'use client';

import React, { useState, useEffect } from 'react';
import { Product, Order, MLPrediction } from '../lib/types';
import { fetchMLPriceForecast } from '../lib/api';
import { 
  Sprout, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Plus, 
  FileText, 
  MapPin, 
  Check, 
  PackageCheck, 
  DollarSign,
  ArrowRight,
  Info
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface FarmerDashboardProps {
  farmerProducts: Product[];
  orders: Order[];
  onAddProduct: (product: Partial<Product>) => void;
  onUpdateOrderStatus: (orderId: number, status: Order['orderStatus']) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  farmerProducts,
  orders,
  onAddProduct,
  onUpdateOrderStatus
}) => {
  // Verification status state for demo
  const [verificationStatus, setVerificationStatus] = useState<'APPROVED' | 'PENDING' | 'REJECTED'>('APPROVED');
  
  // Smart ML Pricing state
  const [mlCrop, setMlCrop] = useState('Tomato');
  const [mlMarket, setMlMarket] = useState('Bowenpally (Hyderabad)');
  const [mlHorizon, setMlHorizon] = useState<7 | 30>(7);
  const [proposedPrice, setProposedPrice] = useState<number>(28);
  const [loadingML, setLoadingML] = useState(false);
  const [prediction, setPrediction] = useState<MLPrediction | null>(null);

  // New Product Listing form state
  const [showListingModal, setShowListingModal] = useState(false);
  const [newCropName, setNewCropName] = useState('Tomato');
  const [newVariety, setNewVariety] = useState('Hybrid Roma Red');
  const [newCategory, setNewCategory] = useState('Vegetables');
  const [newQty, setNewQty] = useState(1000);
  const [newMinOrder, setNewMinOrder] = useState(2);
  const [newPrice, setNewPrice] = useState(28);
  const [newQuality, setNewQuality] = useState<'Grade A' | 'Grade B' | 'Export Quality'>('Grade A');
  const [newHarvestDate, setNewHarvestDate] = useState('2026-04-03');
  const [newOrganic, setNewOrganic] = useState(true);

  // Load ML Prediction
  const loadPrediction = async (crop: string, market: string, days: number) => {
    setLoadingML(true);
    try {
      const pred = await fetchMLPriceForecast(crop, market, days);
      setPrediction(pred);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingML(false);
    }
  };

  useEffect(() => {
    loadPrediction(mlCrop, mlMarket, mlHorizon);
  }, [mlCrop, mlMarket, mlHorizon]);

  // Handle auto-apply recommended fair price
  const applyRecommendedPrice = () => {
    if (prediction) {
      setNewPrice(prediction.avg_predicted_price);
      setProposedPrice(prediction.avg_predicted_price);
    }
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationStatus !== 'APPROVED') {
      alert('Only verified farmers can publish produce. Please complete verification first.');
      return;
    }

    onAddProduct({
      cropName: newCropName,
      variety: newVariety,
      categoryName: newCategory,
      quantityKg: Number(newQty),
      minOrderKg: Number(newMinOrder),
      pricePerKg: Number(newPrice),
      qualityGrade: newQuality,
      harvestDate: newHarvestDate,
      isOrganic: newOrganic,
      imageUrl: newCropName.toLowerCase().includes('tomato') ? '/images/products/tomato.jpg' :
                newCropName.toLowerCase().includes('capsicum') ? '/images/products/capsicum.jpg' :
                newCropName.toLowerCase().includes('spinach') || newCropName.toLowerCase().includes('palak') ? '/images/products/spinach.jpg' :
                newCropName.toLowerCase().includes('brinjal') || newCropName.toLowerCase().includes('eggplant') ? '/images/products/brinjal.jpg' :
                newCropName.toLowerCase().includes('cabbage') ? '/images/products/cabbage.jpg' :
                newCropName.toLowerCase().includes('bottle') || newCropName.toLowerCase().includes('lauki') ? '/images/products/bottle_gourd.jpg' :
                newCropName.toLowerCase().includes('bitter') || newCropName.toLowerCase().includes('karela') ? '/images/products/bitter_gourd.jpg' :
                newCropName.toLowerCase().includes('cucumber') || newCropName.toLowerCase().includes('kheera') ? '/images/products/cucumber.jpg' :
                newCropName.toLowerCase().includes('ginger') || newCropName.toLowerCase().includes('adrak') ? '/images/products/ginger.jpg' :
                newCropName.toLowerCase().includes('garlic') || newCropName.toLowerCase().includes('lehsun') ? '/images/products/garlic.jpg' :
                newCropName.toLowerCase().includes('bean') ? '/images/products/green_beans.jpg' :
                newCropName.toLowerCase().includes('mango') ? '/images/products/mango.jpg' :
                newCropName.toLowerCase().includes('pomegranate') ? '/images/products/pomegranate.jpg' :
                newCropName.toLowerCase().includes('onion') ? '/images/products/onion.jpg' :
                newCropName.toLowerCase().includes('potato') ? '/images/products/potato.jpg' :
                newCropName.toLowerCase().includes('carrot') ? '/images/products/carrot.jpg' :
                newCropName.toLowerCase().includes('banana') ? '/images/products/banana.jpg' :
                newCropName.toLowerCase().includes('lady') || newCropName.toLowerCase().includes('bhindi') || newCropName.toLowerCase().includes('okra') ? '/images/products/lady_finger.jpg' :
                '/images/products/cauliflower.jpg',
      farmLocation: 'Shamirpet Village, Medchal-Malkajgiri, Telangana',
      farmerVerified: true,
      status: 'AVAILABLE'
    });

    setShowListingModal(false);
    alert(`Successfully published ${newCropName} to the Marketplace at ₹${newPrice}/kg!`);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner / Verification Indicator */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Farmer Command Center</h1>
            {verificationStatus === 'APPROVED' ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Genuine Farmer
              </span>
            ) : verificationStatus === 'PENDING' ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Physical Visit Pending
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                Verification Rejected
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Registered: K. Mallesh Goud • Farm: Goud Agro Fields (7.5 Acres) • Passbook: TS-DHA-948201 (Telangana)
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setVerificationStatus(v => v === 'APPROVED' ? 'PENDING' : 'APPROVED')}
            className="text-xs text-gray-500 hover:text-gray-800 underline"
            title="Toggle for demonstration"
          >
            (Simulate status: {verificationStatus === 'APPROVED' ? 'Pending' : 'Approved'})
          </button>
          
          <button
            onClick={() => setShowListingModal(true)}
            disabled={verificationStatus !== 'APPROVED'}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition ${
              verificationStatus === 'APPROVED'
                ? 'bg-primary-600 hover:bg-primary-700 text-white active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            Publish Produce
          </button>
        </div>
      </div>

      {/* Verification Notice if not approved */}
      {verificationStatus !== 'APPROVED' && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <p className="font-bold">Physical Farm Verification in Progress</p>
            <p className="mt-0.5">
              Assigned Field Agent <strong>Vikram Rathore</strong> is scheduled to inspect your land records and crop cultivation. 
              Only verified genuine farmers can publish produce to protect against middlemen.
            </p>
          </div>
        </div>
      )}

      {/* ML Smart Pricing Section */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-primary-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-emerald-800/60">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/60 text-emerald-200 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Machine Learning Smart Price Advisor
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Predictive Mandi Price Guidance</h2>
            <p className="text-xs text-emerald-200/80 mt-1">
              Trained on multi-year agricultural arrivals, seasonality & weather. Know fair market value before setting your price.
            </p>
          </div>

          {/* Controls: Crop, Market, Horizon */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={mlCrop}
              onChange={(e) => setMlCrop(e.target.value)}
              className="bg-emerald-900/90 text-white text-xs rounded-xl px-3 py-2 border border-emerald-700/60 focus:outline-none"
            >
              {['Tomato', 'Potato', 'Onion', 'Carrot', 'Cauliflower', 'Capsicum', 'Spinach', 'Green Chilli', 'Brinjal', 'Cabbage', 'Bottle Gourd', 'Bitter Gourd', 'Cucumber', 'Ginger', 'Garlic', 'Green Beans', 'Lady Finger (Okra)', 'Mango', 'Banana', 'Pomegranate'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={mlMarket}
              onChange={(e) => setMlMarket(e.target.value)}
              className="bg-emerald-900/90 text-white text-xs rounded-xl px-3 py-2 border border-emerald-700/60 focus:outline-none"
            >
              <option value="Bowenpally (Hyderabad)">Bowenpally Mandi (Hyderabad, TS)</option>
              <option value="Gudimalkapur (Hyderabad)">Gudimalkapur Mandi (Hyderabad, TS)</option>
              <option value="Kolar (Karnataka)">Kolar APMC (Karnataka)</option>
              <option value="Bowenpally (Hyderabad)">Bowenpally Mandi (Hyderabad)</option>
              <option value="Vashi (Mumbai)">Vashi APMC (Mumbai)</option>
            </select>

            <div className="bg-emerald-900/90 rounded-xl p-1 border border-emerald-700/60 flex text-xs font-semibold">
              <button
                onClick={() => setMlHorizon(7)}
                className={`px-3 py-1 rounded-lg transition ${mlHorizon === 7 ? 'bg-primary-500 text-white' : 'text-emerald-300'}`}
              >
                7 Days
              </button>
              <button
                onClick={() => setMlHorizon(30)}
                className={`px-3 py-1 rounded-lg transition ${mlHorizon === 30 ? 'bg-primary-500 text-white' : 'text-emerald-300'}`}
              >
                30 Days
              </button>
            </div>
          </div>
        </div>

        {/* Prediction Display Grid */}
        {prediction && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Stat Cards & Fair Bracket */}
            <div className="space-y-4">
              <div className="bg-emerald-900/40 border border-emerald-800/60 p-4 rounded-2xl">
                <div className="text-xs text-emerald-300">Current Mandi Benchmark</div>
                <div className="text-3xl font-extrabold text-white mt-1">₹{prediction.current_market_price.toFixed(2)}/kg</div>
                <div className="mt-2 flex items-center gap-1.5 text-xs">
                  {prediction.trend === 'Increasing' ? (
                    <span className="text-emerald-400 flex items-center font-bold">
                      <TrendingUp className="w-4 h-4 mr-1" /> Rising Trend (+{prediction.trend_percentage}%)
                    </span>
                  ) : prediction.trend === 'Decreasing' ? (
                    <span className="text-rose-400 flex items-center font-bold">
                      <TrendingDown className="w-4 h-4 mr-1" /> Softening Trend ({prediction.trend_percentage}%)
                    </span>
                  ) : (
                    <span className="text-emerald-300 flex items-center font-bold">
                      Stable Price Trajectory
                    </span>
                  )}
                </div>
              </div>

              {/* Recommended Range Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                <div className="text-xs text-emerald-200">Recommended Fair Farmer Price Band</div>
                <div className="text-xl font-bold text-emerald-300 mt-1">
                  ₹{prediction.recommended_min_price.toFixed(2)} — ₹{prediction.recommended_max_price.toFixed(2)} <span className="text-xs text-white">/kg</span>
                </div>
                <p className="text-[11px] text-emerald-100/70 mt-1.5 leading-snug">
                  Optimal pricing bracket maximizes farmer margin while offering buyers better rates than middleman-controlled retail.
                </p>
                <button
                  onClick={applyRecommendedPrice}
                  className="mt-3 w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Apply ₹{prediction.avg_predicted_price}/kg to Listing
                </button>
              </div>

              {/* Proposed Price Checker */}
              <div className="bg-emerald-950/60 border border-emerald-800/80 p-4 rounded-2xl">
                <label className="text-xs text-emerald-200 block mb-1">Test Your Proposed Price (₹/kg):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(Number(e.target.value))}
                    className="w-24 bg-emerald-900 border border-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold focus:outline-none"
                  />
                  <div className="text-xs">
                    {proposedPrice < prediction.recommended_min_price ? (
                      <span className="text-amber-400 font-semibold">Underpriced: You may lose earnings.</span>
                    ) : proposedPrice > prediction.recommended_max_price ? (
                      <span className="text-blue-300 font-semibold">High: Fair only for export/Grade A.</span>
                    ) : (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Optimal Fair Price!
                      </span>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Interactive Chart */}
            <div className="lg:col-span-2 bg-emerald-900/30 border border-emerald-800/60 p-4 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-300">
                  {mlHorizon}-Day Machine Learning Price Projection Curve ({prediction.model_name})
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">
                  Confidence: {prediction.confidence_score}%
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prediction.daily_forecasts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#065f46" vertical={false} />
                    <XAxis dataKey="day_name" stroke="#a7f3d0" fontSize={11} tickLine={false} />
                    <YAxis stroke="#a7f3d0" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} tickLine={false} unit="₹" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#064e3b', borderColor: '#059669', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="upper_bound" stroke="#34d399" strokeDasharray="2 2" strokeWidth={1} dot={false} name="Upper Bound" />
                    <Line type="monotone" dataKey="predicted_price" stroke="#10b981" strokeWidth={3} dot={{ r: 3, fill: '#34d399' }} name="Predicted Price (₹)" />
                    <Line type="monotone" dataKey="lower_bound" stroke="#059669" strokeDasharray="2 2" strokeWidth={1} dot={false} name="Lower Bound" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-emerald-300/80 pt-2 border-t border-emerald-800/40">
                <span>Model: Scikit-Learn Random Forest Regressor & XGBoost</span>
                <span>Includes weather, seasonality & 30-day lag indicators</span>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Active Listings Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Your Active Produce Listings</h3>
            <p className="text-xs text-gray-500">Produce currently available for direct buyer purchase</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
            {farmerProducts.length} Crops Listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Crop</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Your Price</th>
                <th className="py-3 px-4">Available Stock</th>
                <th className="py-3 px-4">Min Order</th>
                <th className="py-3 px-4">Harvest Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {farmerProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={p.imageUrl}
                        alt={p.cropName}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/products/tomato.jpg';
                        }}
                        className="w-9 h-9 rounded-lg object-cover border border-gray-200 shrink-0 shadow-2xs"
                      />
                      <div>
                        <div className="font-extrabold text-xs text-gray-900">{p.cropName}</div>
                        <div className="font-normal text-[11px] text-gray-500">{p.variety}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">{p.categoryName}</td>
                  <td className="py-3.5 px-4 font-bold text-primary-700">₹{p.pricePerKg.toFixed(2)}/kg</td>
                  <td className="py-3.5 px-4 text-gray-800 font-semibold">{p.quantityKg} kg</td>
                  <td className="py-3.5 px-4 text-gray-500">{p.minOrderKg} kg</td>
                  <td className="py-3.5 px-4 text-gray-500">{p.harvestDate}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incoming Buyer Orders Fulfillment */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Incoming Buyer Orders & Fulfillment</h3>
          <p className="text-xs text-gray-500">Manage orders placed directly by buyers without middlemen</p>
        </div>

        <div className="p-6 space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">Order #{o.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    o.orderStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                    o.orderStatus === 'DISPATCHED' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {o.orderStatus}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Payment: {o.paymentStatus}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Buyer: <strong>{o.buyerName}</strong> • Destination: {o.deliveryAddress}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Items: {o.items.map(i => `${i.quantityKg}kg of ${i.cropName}`).join(', ')}
                </div>
              </div>

              <div className="text-right flex items-center gap-3">
                <div className="text-lg font-black text-gray-900">₹{o.totalAmount.toFixed(2)}</div>
                {o.orderStatus === 'PLACED' && (
                  <button
                    onClick={() => onUpdateOrderStatus(o.id, 'DISPATCHED')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Mark Dispatched
                  </button>
                )}
                {o.orderStatus === 'DISPATCHED' && (
                  <button
                    onClick={() => onUpdateOrderStatus(o.id, 'DELIVERED')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publish Produce Listing Modal */}
      {showListingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-primary-600" />
              Publish Fresh Crop Produce
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              List crops directly for wholesale buyers. Pricing is farmer-controlled.
            </p>

            <form onSubmit={handleCreateListing} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700">Crop Name</label>
                  <select
                    value={newCropName}
                    onChange={(e) => {
                      setNewCropName(e.target.value);
                      loadPrediction(e.target.value, mlMarket, 7);
                    }}
                    className="w-full mt-1 p-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                  >
                    {['Tomato', 'Potato', 'Onion', 'Carrot', 'Cauliflower', 'Capsicum', 'Spinach', 'Green Chilli', 'Brinjal', 'Cabbage', 'Bottle Gourd', 'Bitter Gourd', 'Cucumber', 'Ginger', 'Garlic', 'Green Beans', 'Lady Finger (Okra)', 'Mango', 'Banana', 'Pomegranate'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">Variety</label>
                  <input
                    type="text"
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    className="w-full mt-1 p-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700">Available Stock (kg)</label>
                  <input
                    type="number"
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="w-full mt-1 p-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">Min Order Size (kg)</label>
                  <input
                    type="number"
                    value={newMinOrder}
                    onChange={(e) => setNewMinOrder(Number(e.target.value))}
                    className="w-full mt-1 p-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Price per kg with ML assist indicator */}
              <div className="bg-primary-50 p-3.5 rounded-xl border border-primary-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-primary-900">Your Selling Price (₹/kg)</label>
                  {prediction && (
                    <span className="text-[11px] text-primary-700 font-semibold">
                      ML Fair Benchmark: ₹{prediction.avg_predicted_price}/kg
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    type="number"
                    step="0.5"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full p-2 text-sm font-bold bg-white border border-primary-300 rounded-lg focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={applyRecommendedPrice}
                    className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap"
                  >
                    Auto-Fill ML Price
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700">Quality Grade</label>
                  <select
                    value={newQuality}
                    onChange={(e) => setNewQuality(e.target.value as any)}
                    className="w-full mt-1 p-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                  >
                    <option value="Grade A">Grade A (Premium)</option>
                    <option value="Grade B">Grade B (Standard)</option>
                    <option value="Export Quality">Export Quality</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">Harvest Date</label>
                  <input
                    type="date"
                    value={newHarvestDate}
                    onChange={(e) => setNewHarvestDate(e.target.value)}
                    className="w-full mt-1 p-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="organicCheck"
                  checked={newOrganic}
                  onChange={(e) => setNewOrganic(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="organicCheck" className="text-xs text-gray-700 font-medium">
                  Organically Cultivated (Chemical pesticide-free)
                </label>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowListingModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-sm"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
