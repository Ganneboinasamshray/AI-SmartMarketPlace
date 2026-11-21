'use client';

import React, { useState } from 'react';
import { Product } from '../lib/types';
import { TELANGANA_DISTRICTS, TELANGANA_VEGETABLE_CATEGORIES } from '../lib/telanganaData';
import {
  Search,
  ShieldCheck,
  MapPin,
  Phone,
  MessageSquare,
  Plus,
  Sparkles,
  Leaf,
  CheckCircle2,
  TrendingDown,
  ShoppingBag,
  X
} from 'lucide-react';

interface MarketplaceViewProps {
  products: Product[];
  onAddToCart: (product: Product, quantityKg: number) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ products, onAddToCart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [sortBy, setSortBy] = useState<'DEFAULT' | 'PRICE_LOW' | 'PRICE_HIGH' | 'STOCK_HIGH'>('DEFAULT');
  const [contactModalProduct, setContactModalProduct] = useState<Product | null>(null);

  // STRICT WORKFLOW GATE: Only Agent-Approved listings are EVER visible to buyers
  const approvedOnlyProducts = products.filter(
    (p) => p.status === 'APPROVED' && p.agentApproved === true && Boolean(p.verifiedByAgent)
  );

  const filteredProducts = approvedOnlyProducts.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.cropName.toLowerCase().includes(q) ||
      p.variety.toLowerCase().includes(q) ||
      p.farmLocation.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      p.farmerName.toLowerCase().includes(q);

    const matchesCat = selectedCategory === 'All' || p.categoryName === selectedCategory;
    const matchesDistrict = selectedDistrict === 'All' || p.district === selectedDistrict;
    const matchesOrganic = !onlyOrganic || p.isOrganic;

    return matchesSearch && matchesCat && matchesDistrict && matchesOrganic;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'PRICE_LOW') return a.pricePerKg - b.pricePerKg;
    if (sortBy === 'PRICE_HIGH') return b.pricePerKg - a.pricePerKg;
    if (sortBy === 'STOCK_HIGH') return b.quantityKg - a.quantityKg;
    return 0;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white p-8 sm:p-12 overflow-hidden shadow-xl border border-emerald-800/40">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-emerald-300 border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Agent-Verified Telangana Growers • Zero Middlemen</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Farm-Fresh Vegetables <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-amber-300">
              Direct from Telangana Farms
            </span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
            Purchased directly from audited cultivators across <strong>all 33 districts of Telangana</strong>. Zero commission agent inflation, backed by AI price benchmarking (INR ₹) and physical field inspection.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Physical Farmland Verified
            </span>
            <span className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/10">
              <TrendingDown className="w-4 h-4 text-amber-300" /> 15–25% Below Mandi Markups
            </span>
            <span className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/10">
              <Phone className="w-4 h-4 text-blue-300" /> Direct Farmer Contact
            </span>
          </div>
        </div>

        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-emerald-700/20 blur-3xl pointer-events-none" />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="relative md:col-span-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoComplete="off"
              placeholder="Search vegetables, variety, village, or farmer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
            >
              <option value="All">All 33 Telangana Districts</option>
              {TELANGANA_DISTRICTS.map((d) => (
                <option key={d} value={d}>Telangana • {d}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
            >
              <option value="DEFAULT">Sort: Recommended</option>
              <option value="PRICE_LOW">Price: Low to High (₹)</option>
              <option value="PRICE_HIGH">Price: High to Low (₹)</option>
              <option value="STOCK_HIGH">Highest Stock Available</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {TELANGANA_VEGETABLE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 select-none">
            <input
              type="checkbox"
              checked={onlyOrganic}
              onChange={(e) => setOnlyOrganic(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>Organic Certified Only</span>
          </label>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-900">
          Verified Vegetable Produce ({sortedProducts.length} Available)
        </h3>
        <span className="text-xs text-slate-500">
          {selectedDistrict !== 'All' ? `Filtered by: ${selectedDistrict}` : 'Showing all Telangana locations'}
        </span>
      </div>

      {/* Product Cards Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h4 className="text-base font-bold text-slate-700">No Verified Produce Found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No agent-approved vegetable listings match your search or filter criteria. Try resetting the filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedDistrict('All');
              setOnlyOrganic(false);
            }}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={p.imageUrl}
                    alt={p.cropName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/products/tomato.jpg';
                    }}
                  />

                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-md">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Agent Verified</span>
                    </span>

                    {p.isOrganic && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-600 text-white shadow-md">
                        <Leaf className="w-3 h-3" />
                        <span>Organic</span>
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
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                        {p.categoryName} • {p.variety}
                      </span>
                      <h4 className="text-base font-black text-slate-900 mt-0.5">
                        {p.cropName}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-black text-slate-900">
                        ₹{p.pricePerKg}
                        <span className="text-xs font-semibold text-slate-500">/{p.unit || 'kg'}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-semibold block">Zero Middleman Fee</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1.5 pt-1 border-t border-slate-100">
                    <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="truncate font-medium">{p.village}, {p.mandal}, {p.district}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-700 font-medium">
                      <span>Farmer: <strong>{p.farmerName}</strong></span>
                      <span>Stock: <strong>{p.quantityKg} {p.unit || 'kg'}</strong></span>
                    </div>
                  </div>

                  {p.predictedPrice && (
                    <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-900 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        ML Benchmark:
                      </span>
                      <span className="font-bold text-emerald-800">₹{p.predictedPrice}/kg</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => onAddToCart(p, Math.max(p.minOrderKg || 2, 2))}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Order (Min: {p.minOrderKg || 2} {p.unit || 'kg'})</span>
                </button>

                <button
                  onClick={() => setContactModalProduct(p)}
                  className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Contact Farmer Directly</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Direct Farmer Contact Modal */}
      {contactModalProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 relative">
            <button
              onClick={() => setContactModalProduct(null)}
              className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Verified Farmer Direct Contact</h3>
              <p className="text-xs text-slate-500">
                Speak directly with the cultivator to arrange bulk pickup, negotiate wholesale terms, or verify fresh harvest.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Farmer Name:</span>
                <span className="font-bold text-slate-900">{contactModalProduct.farmerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Produce:</span>
                <span className="font-bold text-slate-900">{contactModalProduct.cropName} ({contactModalProduct.variety})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Price:</span>
                <span className="font-bold text-slate-900">₹{contactModalProduct.pricePerKg}/{contactModalProduct.unit || 'kg'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Farm Location:</span>
                <span className="font-bold text-slate-900 text-right">{contactModalProduct.farmLocation}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500">Mobile Number:</span>
                <span className="font-black text-emerald-800 text-sm">{contactModalProduct.farmerPhone}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <a
                href={`tel:${contactModalProduct.farmerPhone.replace(/\s+/g, '')}`}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl text-center shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>Call Farmer Now</span>
              </a>

              <a
                href={`https://wa.me/${contactModalProduct.farmerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(contactModalProduct.farmerName)},%20I%20am%20interested%20in%20your%20${encodeURIComponent(contactModalProduct.cropName)}%20listed%20on%20AI%20Smart%20Marketplace.`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl text-center shadow-md transition flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Farmer</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
