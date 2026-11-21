'use client';

import React, { useState, useEffect } from 'react';
import { Product, Order, MLPrediction, ListingStatus, User } from '../lib/types';
import { fetchMLPriceForecast, getCropImageUrl } from '../lib/api';
import {
  TELANGANA_DISTRICTS,
  TELANGANA_VEGETABLE_CROPS,
  getMandalsForDistrict
} from '../lib/telanganaData';
import {
  Sprout,
  ShieldCheck,
  Clock,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Plus,
  FileText,
  MapPin,
  PackageCheck,
  IndianRupee,
  ArrowRight,
  Info,
  Edit3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BrainCircuit
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface FarmerDashboardProps {
  currentUser: User | null;
  farmerProducts: Product[];
  orders: Order[];
  onAddProduct: (product: Partial<Product>) => void;
  onUpdateProduct: (productId: number, updatedFields: Partial<Product>) => void;
  onUpdateOrderStatus: (orderId: number, status: Order['orderStatus']) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  currentUser,
  farmerProducts,
  orders,
  onAddProduct,
  onUpdateProduct
}) => {
  const [activeSection, setActiveSection] = useState<'MY_LISTINGS' | 'ADD_LISTING' | 'ML_ANALYTICS' | 'ORDERS' | 'PROFILE'>('MY_LISTINGS');
  const [listingFilter, setListingFilter] = useState<'ALL' | ListingStatus>('ALL');

  // ML Analytics Calculator State
  const [mlCrop, setMlCrop] = useState('Tomato');
  const [mlMarket, setMlMarket] = useState('Bowenpally (Hyderabad)');
  const [mlHorizon] = useState<7 | 30>(7);
  const [loadingML, setLoadingML] = useState(false);
  const [prediction, setPrediction] = useState<MLPrediction | null>(null);

  // Add Vegetable Form State - ALL user inputs start EMPTY (zero dummy auto-fill)
  const [newCropName, setNewCropName] = useState('');
  const [newVariety, setNewVariety] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newUnit, setNewUnit] = useState('kg');
  const [newMinOrder, setNewMinOrder] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newQuality, setNewQuality] = useState<'' | 'Grade A' | 'Grade B' | 'Grade C' | 'Export Quality'>('');
  const [newHarvestDate, setNewHarvestDate] = useState('');
  const [newOrganic, setNewOrganic] = useState(false);
  const [newDistrict, setNewDistrict] = useState('');
  const [newMandal, setNewMandal] = useState('');
  const [newVillage, setNewVillage] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [formError, setFormError] = useState('');

  // Live ML prediction inside Add form (only fetched once crop + district are selected)
  const [formPrediction, setFormPrediction] = useState<MLPrediction | null>(null);
  const [formLoadingML, setFormLoadingML] = useState(false);

  // Edit & Resubmit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editQty, setEditQty] = useState('');
  const [editQuality, setEditQuality] = useState<'Grade A' | 'Grade B' | 'Grade C' | 'Export Quality'>('Grade A');
  const [editDescription, setEditDescription] = useState('');
  const [resubmitting, setResubmitting] = useState(false);

  const loadAnalyticsPrediction = async (crop: string, market: string, days: number) => {
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
    loadAnalyticsPrediction(mlCrop, mlMarket, mlHorizon);
  }, [mlCrop, mlMarket, mlHorizon]);

  const loadFormPrediction = async (crop: string, district: string) => {
    if (!crop || !district) {
      setFormPrediction(null);
      return;
    }
    setFormLoadingML(true);
    try {
      const pred = await fetchMLPriceForecast(crop, `${district} Mandi`, 7);
      setFormPrediction(pred);
    } catch (e) {
      console.error(e);
    } finally {
      setFormLoadingML(false);
    }
  };

  useEffect(() => {
    loadFormPrediction(newCropName, newDistrict);
  }, [newCropName, newDistrict]);

  // Only set Category when crop changes; never overwrite user's variety or price
  const handleCropSelect = (cropName: string) => {
    setNewCropName(cropName);
    const cropConfig = TELANGANA_VEGETABLE_CROPS.find(c => c.name === cropName);
    setNewCategory(cropConfig ? cropConfig.category : '');
  };

  const handleDistrictChange = (district: string) => {
    setNewDistrict(district);
    setNewMandal('');
  };

  const applyRecommendedPriceToAddForm = () => {
    if (formPrediction) {
      setNewPrice(String(formPrediction.avg_predicted_price));
    }
  };

  const resetAddForm = () => {
    setNewCropName('');
    setNewVariety('');
    setNewCategory('');
    setNewQty('');
    setNewUnit('kg');
    setNewMinOrder('');
    setNewPrice('');
    setNewQuality('');
    setNewHarvestDate('');
    setNewOrganic(false);
    setNewDistrict('');
    setNewMandal('');
    setNewVillage('');
    setNewDescription('');
    setFormPrediction(null);
    setFormError('');
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const parsedQty = Number(newQty);
    const parsedMinOrder = Number(newMinOrder);
    const parsedPrice = Number(newPrice);

    if (!newCropName || !newVariety.trim() || !newDistrict || !newMandal || !newVillage.trim() || !newQuality || !newHarvestDate) {
      setFormError('Please fill in all required fields before submitting.');
      return;
    }
    if (!parsedQty || parsedQty <= 0 || !parsedMinOrder || parsedMinOrder <= 0 || !parsedPrice || parsedPrice <= 0) {
      setFormError('Quantity, minimum order, and expected price must be positive numbers.');
      return;
    }
    if (parsedMinOrder > parsedQty) {
      setFormError('Minimum order quantity cannot exceed available stock quantity.');
      return;
    }

    const imagePath = getCropImageUrl(newCropName);
    const farmLocationStr = `${newVillage.trim()}, ${newMandal} Mandal, ${newDistrict}, Telangana`;

    onAddProduct({
      cropName: newCropName,
      variety: newVariety.trim(),
      categoryName: newCategory || 'Vegetables',
      quantityKg: parsedQty,
      unit: newUnit,
      minOrderKg: parsedMinOrder,
      pricePerKg: parsedPrice,
      qualityGrade: newQuality,
      harvestDate: newHarvestDate,
      shelfLifeDays: 7,
      isOrganic: newOrganic,
      imageUrl: imagePath,
      state: 'Telangana',
      district: newDistrict,
      mandal: newMandal,
      village: newVillage.trim(),
      farmLocation: farmLocationStr,
      description: newDescription.trim() || undefined,
      status: 'PENDING',
      agentApproved: false,
      predictedPrice: formPrediction?.avg_predicted_price,
      recommendedMinPrice: formPrediction?.recommended_min_price,
      recommendedMaxPrice: formPrediction?.recommended_max_price,
      mlConfidenceScore: formPrediction?.confidence_score
    });

    const submittedCrop = newCropName;
    const submittedDistrict = newDistrict;
    resetAddForm();

    alert(
      `Listing for ${submittedCrop} submitted successfully!

Status: PENDING AGENT APPROVAL.
It is hidden from the Buyer Marketplace until an authorized Field Agent for ${submittedDistrict} reviews and approves it.`
    );
    setActiveSection('MY_LISTINGS');
    setListingFilter('PENDING');
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setEditPrice(String(p.pricePerKg));
    setEditQty(String(p.quantityKg));
    setEditQuality(p.qualityGrade);
    setEditDescription(p.description || '');
  };

  const handleResubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const parsedPrice = Number(editPrice);
    const parsedQty = Number(editQty);
    if (!parsedPrice || parsedPrice <= 0 || !parsedQty || parsedQty <= 0) {
      alert('Please enter valid positive numbers for price and quantity.');
      return;
    }

    setResubmitting(true);

    setTimeout(() => {
      onUpdateProduct(editingProduct.id, {
        pricePerKg: parsedPrice,
        quantityKg: parsedQty,
        qualityGrade: editQuality,
        description: editDescription.trim(),
        status: 'PENDING',
        agentApproved: false,
        agentRemarks: undefined
      });

      alert(
        `Produce ${editingProduct.cropName} successfully updated and resubmitted to Field Agent!

Status changed back to PENDING VERIFICATION.`
      );
      setEditingProduct(null);
      setResubmitting(false);
      setListingFilter('PENDING');
    }, 300);
  };

  const filteredListings = farmerProducts.filter(p => {
    if (listingFilter === 'ALL') return true;
    return p.status === listingFilter;
  });

  const countPending = farmerProducts.filter(p => p.status === 'PENDING').length;
  const countApproved = farmerProducts.filter(p => p.status === 'APPROVED' && p.agentApproved).length;
  const countRequiresChanges = farmerProducts.filter(p => p.status === 'REQUIRES_CHANGES').length;

  const parsedNewPrice = Number(newPrice);
  const mandalOptions = newDistrict ? getMandalsForDistrict(newDistrict) : [];

  return (
    <div className="space-y-6 pb-20">
      {/* Farmer Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800">
            <Sprout className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">Farmer Command Center</h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Verified Cultivator
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Welcome, <strong>{currentUser?.fullName || 'Farmer'}</strong> • Farm:{' '}
              {[currentUser?.village, currentUser?.mandal, currentUser?.district, 'Telangana']
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveSection('ADD_LISTING')}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vegetable Listing</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-xs overflow-x-auto gap-1">
        <button
          onClick={() => setActiveSection('MY_LISTINGS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeSection === 'MY_LISTINGS'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>My Vegetable Listings ({farmerProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('ADD_LISTING')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeSection === 'ADD_LISTING'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add Vegetable (ML Assisted)</span>
        </button>

        <button
          onClick={() => setActiveSection('ML_ANALYTICS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeSection === 'ML_ANALYTICS'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>AI Price Forecaster</span>
        </button>

        <button
          onClick={() => setActiveSection('ORDERS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeSection === 'ORDERS'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Direct Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('PROFILE')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeSection === 'PROFILE'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Farm Profile & Land</span>
        </button>
      </div>

      {/* SECTION 1: MY LISTINGS */}
      {activeSection === 'MY_LISTINGS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setListingFilter('ALL')}
              className={`p-4 rounded-2xl border text-left transition ${
                listingFilter === 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-[11px] font-bold uppercase opacity-80">Total Crops</div>
              <div className="text-2xl font-black mt-1">{farmerProducts.length}</div>
            </button>

            <button
              onClick={() => setListingFilter('PENDING')}
              className={`p-4 rounded-2xl border text-left transition ${
                listingFilter === 'PENDING'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-amber-50/50'
              }`}
            >
              <div className={`text-[11px] font-bold uppercase ${listingFilter === 'PENDING' ? 'text-white' : 'text-amber-600'}`}>
                Pending Verification
              </div>
              <div className={`text-2xl font-black mt-1 ${listingFilter === 'PENDING' ? 'text-white' : 'text-amber-600'}`}>
                {countPending}
              </div>
            </button>

            <button
              onClick={() => setListingFilter('APPROVED')}
              className={`p-4 rounded-2xl border text-left transition ${
                listingFilter === 'APPROVED'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-emerald-50/50'
              }`}
            >
              <div className={`text-[11px] font-bold uppercase ${listingFilter === 'APPROVED' ? 'text-white' : 'text-emerald-600'}`}>
                Live in Marketplace
              </div>
              <div className={`text-2xl font-black mt-1 ${listingFilter === 'APPROVED' ? 'text-white' : 'text-emerald-600'}`}>
                {countApproved}
              </div>
            </button>

            <button
              onClick={() => setListingFilter('REQUIRES_CHANGES')}
              className={`p-4 rounded-2xl border text-left transition ${
                listingFilter === 'REQUIRES_CHANGES'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-blue-50/50'
              }`}
            >
              <div className={`text-[11px] font-bold uppercase ${listingFilter === 'REQUIRES_CHANGES' ? 'text-white' : 'text-blue-600'}`}>
                Requires Changes
              </div>
              <div className={`text-2xl font-black mt-1 ${listingFilter === 'REQUIRES_CHANGES' ? 'text-white' : 'text-blue-600'}`}>
                {countRequiresChanges}
              </div>
            </button>
          </div>

          {countRequiresChanges > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-blue-900">Action Required: Field Agent Requested Revisions</h4>
                  <p className="text-[11px] text-blue-700">
                    You have {countRequiresChanges} vegetable listing(s) requiring adjustments. Click &quot;Edit &amp; Resubmit&quot; to update price or details.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setListingFilter('REQUIRES_CHANGES')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl whitespace-nowrap"
              >
                View Items
              </button>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                Vegetables Listed ({filteredListings.length})
              </h3>
              <div className="text-xs text-slate-500">
                Showing: <strong>{listingFilter}</strong>
              </div>
            </div>

            {filteredListings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
                <PackageCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No Listings Found</h4>
                <p className="text-xs text-slate-400 mt-1">
                  {farmerProducts.length === 0
                    ? 'You have not listed any vegetables yet. Click "Add Vegetable Listing" to submit your first harvest.'
                    : `You do not have any vegetable listings with status "${listingFilter}".`}
                </p>
                {farmerProducts.length === 0 ? (
                  <button
                    onClick={() => setActiveSection('ADD_LISTING')}
                    className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                  >
                    + Add Vegetable Listing
                  </button>
                ) : (
                  <button
                    onClick={() => setListingFilter('ALL')}
                    className="mt-3 text-xs text-emerald-600 font-bold underline"
                  >
                    View All Listings
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredListings.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                        <img
                          src={p.imageUrl}
                          alt={p.cropName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/products/tomato.jpg';
                          }}
                        />

                        <div className="absolute top-3 left-3">
                          {p.status === 'APPROVED' && p.agentApproved && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-md">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approved (Live)</span>
                            </span>
                          )}
                          {p.status === 'PENDING' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-md">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Pending Verification</span>
                            </span>
                          )}
                          {p.status === 'REQUIRES_CHANGES' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-600 text-white shadow-md">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Requires Changes</span>
                            </span>
                          )}
                          {p.status === 'REJECTED' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-md">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Rejected</span>
                            </span>
                          )}
                        </div>

                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                            {p.qualityGrade}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                              {p.categoryName} • {p.variety}
                            </span>
                            <h4 className="text-base font-black text-slate-900 mt-0.5">
                              {p.cropName}
                            </h4>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-black text-slate-900">
                              ₹{p.pricePerKg}
                              <span className="text-xs font-semibold text-slate-500">/{p.unit || 'kg'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-slate-600 space-y-1.5 pt-1 border-t border-slate-100">
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{p.farmLocation}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-700">
                            <span>Stock Available: <strong>{p.quantityKg} {p.unit || 'kg'}</strong></span>
                            <span>Harvest: <strong>{p.harvestDate}</strong></span>
                          </div>
                        </div>

                        {p.predictedPrice && (
                          <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-100 flex items-center justify-between text-[11px]">
                            <span className="text-emerald-900 font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              ML Fair Price:
                            </span>
                            <span className="font-bold text-emerald-800">
                              ₹{p.predictedPrice}/kg
                            </span>
                          </div>
                        )}

                        {p.agentRemarks && (
                          <div className={`p-3 rounded-2xl border text-xs space-y-1 ${
                            p.status === 'REQUIRES_CHANGES'
                              ? 'bg-blue-50 border-blue-200 text-blue-900'
                              : p.status === 'APPROVED'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : 'bg-rose-50 border-rose-200 text-rose-900'
                          }`}>
                            <div className="font-bold flex items-center gap-1.5">
                              <Info className="w-3.5 h-3.5" />
                              <span>Field Agent Feedback ({p.verifiedByAgent || 'Assigned Officer'}):</span>
                            </div>
                            <p className="text-[11px] leading-relaxed italic">
                              &quot;{p.agentRemarks}&quot;
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                      {p.status === 'REQUIRES_CHANGES' ? (
                        <button
                          onClick={() => openEditModal(p)}
                          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit &amp; Resubmit Listing</span>
                        </button>
                      ) : p.status === 'PENDING' ? (
                        <div className="text-center text-[11px] text-amber-700 font-semibold flex items-center justify-center gap-1.5 py-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending Field Agent approval (hidden from buyers)</span>
                        </div>
                      ) : p.status === 'APPROVED' && p.agentApproved ? (
                        <div className="text-center text-[11px] text-emerald-700 font-semibold flex items-center justify-center gap-1.5 py-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Approved &amp; live on Buyer Marketplace</span>
                        </div>
                      ) : (
                        <div className="text-center text-[11px] text-rose-700 font-semibold flex items-center justify-center gap-1.5 py-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Listing rejected and hidden from buyers</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: ADD VEGETABLE (Zero Auto-Fill) */}
      {activeSection === 'ADD_LISTING' && (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Step-by-Step Produce Submission
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Add New Vegetable Harvest
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your harvested vegetable details below. All listings start in <strong>Pending Approval</strong> and require explicit Field Agent verification before becoming visible to buyers.
            </p>
          </div>

          {formError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleCreateListing} autoComplete="off" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">1</span>
                Crop &amp; Produce Identification
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Crop Name *</label>
                  <select
                    required
                    value={newCropName}
                    onChange={(e) => handleCropSelect(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
                  >
                    <option value="">-- Select Vegetable Crop --</option>
                    {TELANGANA_VEGETABLE_CROPS.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <input
                    type="text"
                    readOnly
                    value={newCategory}
                    placeholder="Auto-filled on crop selection"
                    className="w-full p-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Crop Variety *</label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    placeholder="e.g. Hybrid Roma Red"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">2</span>
                  Farm Location (Strictly Telangana 33 Districts)
                </h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  State: Telangana
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">District *</label>
                  <select
                    required
                    value={newDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
                  >
                    <option value="">-- Select District --</option>
                    {TELANGANA_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mandal *</label>
                  <select
                    required
                    disabled={!newDistrict}
                    value={newMandal}
                    onChange={(e) => setNewMandal(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-medium disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option value="">-- Select Mandal --</option>
                    {mandalOptions.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Village Name *</label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={newVillage}
                    onChange={(e) => setNewVillage(e.target.value)}
                    placeholder="Enter village name"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">3</span>
                Harvest Quantity &amp; Quality Grade
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Available Quantity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 500"
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Unit *</label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="quintals">Quintals (100 kg)</option>
                    <option value="crates">Crates (25 kg each)</option>
                    <option value="bags">Bags (50 kg each)</option>
                    <option value="bunches">Bunches (Leafy Greens)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Quality Grade *</label>
                  <select
                    required
                    value={newQuality}
                    onChange={(e) => setNewQuality(e.target.value as any)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  >
                    <option value="">-- Select Grade --</option>
                    <option value="Grade A">Grade A (Premium)</option>
                    <option value="Grade B">Grade B (Standard Market)</option>
                    <option value="Grade C">Grade C (Processing)</option>
                    <option value="Export Quality">Export Quality</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Harvest Date *</label>
                  <input
                    type="date"
                    required
                    value={newHarvestDate}
                    onChange={(e) => setNewHarvestDate(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">4</span>
                Pricing (INR ₹) &amp; Live AI Market Recommendation
              </h3>

              {/* Automatic ML Prediction Assistant Card */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 p-5 rounded-2xl border border-emerald-200/80 space-y-3">
                {!newCropName || !newDistrict ? (
                  <div className="flex items-center gap-2.5 text-xs text-emerald-900">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Select a <strong>Crop Name</strong> and <strong>Telangana District</strong> above to receive live AI market price intelligence (in ₹).
                    </span>
                  </div>
                ) : formLoadingML ? (
                  <div className="text-xs text-emerald-800 font-semibold">
                    Calculating live AI mandi benchmark for {newCropName} in {newDistrict}...
                  </div>
                ) : formPrediction ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                            Live AI Price Intelligence for {newCropName} in {newDistrict}
                          </h4>
                          <p className="text-[11px] text-emerald-800">
                            Model: {formPrediction.model_name}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={applyRecommendedPriceToAddForm}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 shrink-0"
                      >
                        <span>Apply AI Fair Price (₹{formPrediction.avg_predicted_price})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-emerald-200/60">
                      <div className="bg-white/80 p-3 rounded-xl border border-emerald-100">
                        <span className="text-[10px] font-bold text-emerald-700 block">AI Market Benchmark</span>
                        <span className="text-lg font-black text-slate-900">
                          ₹{formPrediction.avg_predicted_price}/kg
                        </span>
                      </div>

                      <div className="bg-white/80 p-3 rounded-xl border border-emerald-100">
                        <span className="text-[10px] font-bold text-emerald-700 block">Recommended Range</span>
                        <span className="text-xs font-bold text-slate-900 mt-1 block">
                          ₹{formPrediction.recommended_min_price} – ₹{formPrediction.recommended_max_price}
                        </span>
                      </div>

                      <div className="bg-white/80 p-3 rounded-xl border border-emerald-100">
                        <span className="text-[10px] font-bold text-emerald-700 block">AI Confidence Score</span>
                        <span className="text-lg font-black text-emerald-800">
                          {formPrediction.confidence_score}%
                        </span>
                      </div>

                      <div className="bg-white/80 p-3 rounded-xl border border-emerald-100">
                        <span className="text-[10px] font-bold text-emerald-700 block">Price Assessment</span>
                        <span className="text-xs font-bold text-slate-800 mt-1 block">
                          {!newPrice || parsedNewPrice <= 0
                            ? 'Enter price to compare'
                            : parsedNewPrice > formPrediction.recommended_max_price
                            ? 'Above Market Benchmark'
                            : parsedNewPrice < formPrediction.recommended_min_price
                            ? 'Below Market Rate'
                            : 'Fair Competitive Price'}
                        </span>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Your Expected Selling Price (₹ per {newUnit}) *
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="number"
                      step="0.5"
                      required
                      min="1"
                      placeholder="Enter selling price in ₹"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm font-black bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Zero intermediary deductions. You receive 100% of this INR price upon order delivery.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Minimum Order Quantity (in {newUnit}) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 5"
                    value={newMinOrder}
                    onChange={(e) => setNewMinOrder(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-semibold"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Minimum quantity wholesale buyers can purchase per order.
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Description / Farming Methods</label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                    placeholder="Describe freshness, organic manure, drip irrigation, or seed variety..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="organicCheck"
                    checked={newOrganic}
                    onChange={(e) => setNewOrganic(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <label htmlFor="organicCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Organically Cultivated (Chemical pesticide-free, natural manure)
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                <span className="font-bold text-slate-700">Approval Policy:</span> Listing will start in{' '}
                <strong>Pending Approval</strong> and remain invisible to buyers until approved by an authorized Field Agent.
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Submit Vegetable for Agent Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION 3: ML ANALYTICS */}
      {activeSection === 'ML_ANALYTICS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Telangana Mandi Price Predictor
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Machine Learning Vegetable Price Forecaster
                </h3>
                <p className="text-xs text-slate-500">
                  Historical market arrivals, weather signals, and mandi trend analytics across Telangana (INR ₹).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={mlCrop}
                  onChange={(e) => setMlCrop(e.target.value)}
                  className="text-xs font-bold p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {TELANGANA_VEGETABLE_CROPS.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>

                <select
                  value={mlMarket}
                  onChange={(e) => setMlMarket(e.target.value)}
                  className="text-xs font-bold p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Bowenpally (Hyderabad)">Bowenpally Mandi (Hyderabad)</option>
                  <option value="Gudimalkapur (Hyderabad)">Gudimalkapur Mandi (Hyderabad)</option>
                  <option value="L.B. Nagar Mandi">L.B. Nagar Mandi (Ranga Reddy)</option>
                  <option value="Siddipet Market Yard">Siddipet Market Yard</option>
                  <option value="Warangal Laxmipuram Mandi">Warangal Laxmipuram Mandi</option>
                  <option value="Karimnagar Vegetable Market">Karimnagar Vegetable Market</option>
                  <option value="Nizamabad APMC Market">Nizamabad APMC Market</option>
                  <option value="Suryapet APMC Market">Suryapet APMC Market</option>
                </select>
              </div>
            </div>

            {loadingML && (
              <div className="text-xs text-emerald-700 font-semibold">Loading ML price forecast...</div>
            )}

            {prediction && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                  <span className="text-[11px] font-bold text-emerald-800">Predicted Average</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    ₹{prediction.avg_predicted_price}/kg
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> +{prediction.trend_percentage}% next 7 days
                  </span>
                </div>

                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100">
                  <span className="text-[11px] font-bold text-blue-800">Fair Price Range</span>
                  <div className="text-base font-black text-slate-900 mt-1">
                    ₹{prediction.recommended_min_price} – ₹{prediction.recommended_max_price}
                  </div>
                  <span className="text-[10px] text-blue-600 mt-1 block">
                    Safe selling price bracket
                  </span>
                </div>

                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100">
                  <span className="text-[11px] font-bold text-purple-800">Model Confidence</span>
                  <div className="text-2xl font-black text-purple-900 mt-1">
                    {prediction.confidence_score}%
                  </div>
                  <span className="text-[10px] text-purple-600 mt-1 block">
                    High precision forecast
                  </span>
                </div>

                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100">
                  <span className="text-[11px] font-bold text-amber-800">Volatility Risk</span>
                  <div className="text-2xl font-black text-amber-900 mt-1">
                    {prediction.volatility_risk}
                  </div>
                  <span className="text-[10px] text-amber-700 mt-1 block">
                    Based on market arrivals
                  </span>
                </div>
              </div>
            )}

            {prediction && prediction.daily_forecasts && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700">7-Day Daily Price Trend Forecast (₹/kg)</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={prediction.daily_forecasts}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="day_name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} domain={['auto', 'auto']} />
                      <Tooltip formatter={(value: any) => [`₹${value}/kg`, 'Price']} />
                      <Line
                        type="monotone"
                        dataKey="predicted_price"
                        name="Predicted Price (₹/kg)"
                        stroke="#059669"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#059669' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="upper_bound"
                        name="Upper Limit (₹/kg)"
                        stroke="#10b981"
                        strokeDasharray="4 4"
                      />
                      <Line
                        type="monotone"
                        dataKey="lower_bound"
                        name="Lower Limit (₹/kg)"
                        stroke="#6ee7b7"
                        strokeDasharray="4 4"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: ORDERS */}
      {activeSection === 'ORDERS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black text-slate-900">Direct Buyer Orders</h3>
            <p className="text-xs text-slate-500">Orders placed by verified buyers directly for your produce.</p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">No direct orders received for your account yet.</div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div key={ord.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">Order #{ord.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {ord.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Buyer: <strong>{ord.buyerName}</strong> • Delivery: {ord.deliveryAddress}
                    </p>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Items: {ord.items.map(i => `${i.cropName} (${i.quantityKg} kg)`).join(', ')}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-slate-900">₹{ord.totalAmount.toFixed(2)}</div>
                    <span className="text-[10px] text-emerald-700 font-bold block">{ord.paymentStatus} via COD</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 5: PROFILE (Reflects Actual Logged-in Farmer Details) */}
      {activeSection === 'PROFILE' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black text-slate-900">Farmer Land &amp; Identity Profile</h3>
            <p className="text-xs text-slate-500">Registered Telangana Cultivator Details</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-semibold">Farmer Full Name</span>
              <div className="font-bold text-slate-800 text-sm">{currentUser?.fullName || 'Not Provided'}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-semibold">Mobile Phone</span>
              <div className="font-bold text-slate-800 text-sm">{currentUser?.phoneNumber || 'Not Provided'}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-semibold">State</span>
              <div className="font-bold text-emerald-800 text-sm">Telangana (Fixed Jurisdiction)</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-semibold">District &amp; Mandal</span>
              <div className="font-bold text-slate-800 text-sm">
                {currentUser?.district || 'Not Provided'}, {currentUser?.mandal || 'Not Provided'}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-semibold">Village</span>
              <div className="font-bold text-slate-800 text-sm">{currentUser?.village || 'Not Provided'}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-semibold">Dharani Passbook Number</span>
              <div className="font-bold text-slate-800 text-sm">{currentUser?.passbookNumber || 'Not Provided'}</div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <div className="text-xs text-emerald-900">
              <span className="font-bold">Mandatory Per-Listing Verification Active</span>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Every newly submitted harvest is audited by an authorized Telangana Field Agent before appearing on the Buyer Marketplace.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT & RESUBMIT */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-100">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-black text-slate-900">
                  Edit &amp; Resubmit: {editingProduct.cropName}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Make the required adjustments requested by the Field Agent. Upon resubmission, status will return to <strong>Pending Verification</strong>.
              </p>
            </div>

            {editingProduct.agentRemarks && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 mb-4 text-xs space-y-1">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  Field Agent Instruction:
                </span>
                <p className="text-[11px] text-blue-800 italic">
                  &quot;{editingProduct.agentRemarks}&quot;
                </p>
              </div>
            )}

            <form onSubmit={handleResubmit} autoComplete="off" className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Adjusted Expected Price (₹/{editingProduct.unit || 'kg'}) *
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="number"
                    step="0.5"
                    required
                    min="1"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm font-black bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
                {editingProduct.predictedPrice && (
                  <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                    AI Benchmark: ₹{editingProduct.predictedPrice}/kg (Recommended Range: ₹{editingProduct.recommendedMinPrice} – ₹{editingProduct.recommendedMaxPrice})
                  </span>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Available Quantity ({editingProduct.unit || 'kg'}) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={editQty}
                  onChange={(e) => setEditQty(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Quality Grade *
                </label>
                <select
                  value={editQuality}
                  onChange={(e) => setEditQuality(e.target.value as any)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
                >
                  <option value="Grade A">Grade A (Premium)</option>
                  <option value="Grade B">Grade B (Standard Market)</option>
                  <option value="Grade C">Grade C (Processing)</option>
                  <option value="Export Quality">Export Quality</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Updated Description / Remarks for Agent
                </label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  placeholder="Explain the changes made..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resubmitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  {resubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Resubmit for Field Verification</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
