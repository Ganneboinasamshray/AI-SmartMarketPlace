'use client';

import React, { useState } from 'react';
import { Product } from '../lib/types';
import { 
  Search, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Phone, 
  MessageSquare, 
  Plus, 
  Sparkles,
  Leaf,
  CheckCircle2,
  TrendingDown,
  ShoppingBag
} from 'lucide-react';

interface MarketplaceViewProps {
  products: Product[];
  onAddToCart: (product: Product, quantityKg: number) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ products, onAddToCart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [contactModalProduct, setContactModalProduct] = useState<Product | null>(null);

  const categories = ['All', 'Vegetables', 'Fruits'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.farmLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.categoryName === selectedCategory;
    const matchesOrganic = !onlyOrganic || p.isOrganic;
    return matchesSearch && matchesCat && matchesOrganic;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-primary-900 via-primary-800 to-primary-950 text-white p-8 sm:p-12 overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-primary-200 mb-4 border border-white/10">
            <ShieldCheck className="w-4 h-4 text-primary-300" />
            100% Agent-Verified Telangana & Karnataka Growers • Zero Middlemen
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Fresh Fruits & Vegetables Direct From Farm
          </h1>
          <p className="mt-4 text-base sm:text-lg text-primary-100/90 leading-relaxed">
            Directly from villages across Telangana (Medchal, Ranga Reddy, Siddipet, Yadadri, Mahabubnagar) and Karnataka. Zero middlemen commission, fair ML pricing, and Cash on Delivery.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 bg-black/20 px-3.5 py-1.5 rounded-lg border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-primary-400" /> Physical Land Verified
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-3.5 py-1.5 rounded-lg border border-white/5">
              <TrendingDown className="w-4 h-4 text-primary-400" /> 15-25% Lower than Trader Markups
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-3.5 py-1.5 rounded-lg border border-white/5">
              <Phone className="w-4 h-4 text-primary-400" /> Direct Farmer Contact
            </span>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-primary-700/20 blur-3xl pointer-events-none" />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search crops (e.g. Tomato, Potato, Onion)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Organic Toggle */}
          <button
            onClick={() => setOnlyOrganic(!onlyOrganic)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              onlyOrganic
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            Organic
          </button>
        </div>

      </div>

      {/* Produce Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
          >
            {/* Image & Badges */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              <img
                src={p.imageUrl}
                alt={p.cropName}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/products/tomato.jpg';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Verified Badge */}
              {p.farmerVerified && (
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-emerald-100 text-[11px] font-bold text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Genuine Farmer
                </div>
              )}

              {/* Organic Badge */}
              {p.isOrganic && (
                <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-xs">
                  <Leaf className="w-3 h-3" /> Organic
                </div>
              )}

              {/* Quality Grade Tag */}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-medium">
                {p.qualityGrade}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                      {p.cropName}
                    </h3>
                    <p className="text-xs text-gray-500">{p.variety} • {p.categoryName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-primary-700">
                      ₹{p.pricePerKg.toFixed(2)}
                      <span className="text-xs font-normal text-gray-400">/kg</span>
                    </div>
                  </div>
                </div>

                {/* Farmer Info */}
                <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-gray-800">Farmer:</span> {p.farmerName}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{p.farmLocation}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" /> Harvest: {p.harvestDate}
                    </span>
                    <span>Stock: <strong className="text-gray-800">{p.quantityKg} kg</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-2">
                <button
                  onClick={() => setContactModalProduct(p)}
                  className="flex-1 py-2 px-3 rounded-xl border border-gray-200 hover:border-primary-400 hover:bg-primary-50 text-gray-700 hover:text-primary-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-primary-600" />
                  Contact Farmer
                </button>

                <button
                  onClick={() => onAddToCart(p, p.minOrderKg || 2)}
                  className="py-2 px-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buy ({p.minOrderKg || 2}kg+)</span>
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-800">No Produce Found</h3>
          <p className="text-xs text-gray-500 mt-1">Try adjusting your crop search or category filter.</p>
        </div>
      )}

      {/* Direct Farmer Contact Modal */}
      {contactModalProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Direct Farmer Communication
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Connect directly with genuine farmer to arrange bulk logistics, inspect produce, or negotiate terms with zero middlemen.
            </p>

            {/* Produce Card Preview in Modal */}
            <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center gap-3">
              <img
                src={contactModalProduct.imageUrl}
                alt={contactModalProduct.cropName}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/products/tomato.jpg';
                }}
                className="w-16 h-16 rounded-xl object-cover border border-emerald-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-sm text-gray-900 truncate">{contactModalProduct.cropName}</div>
                <div className="text-xs text-gray-600">{contactModalProduct.variety} • <span className="font-bold text-emerald-700">₹{contactModalProduct.pricePerKg.toFixed(2)}/kg</span></div>
                <div className="text-[11px] text-gray-500 truncate mt-0.5">{contactModalProduct.farmLocation}</div>
              </div>
            </div>

            <div className="mt-3 bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1.5 text-xs">
              <div><strong className="text-gray-700">Farmer:</strong> {contactModalProduct.farmerName}</div>
              <div><strong className="text-gray-700">Direct Contact:</strong> {contactModalProduct.farmerPhone}</div>
              <div><strong className="text-gray-700">Stock Available:</strong> {contactModalProduct.quantityKg} kg</div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <a
                href={`tel:${contactModalProduct.farmerPhone}`}
                className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <Phone className="w-4 h-4" />
                Call Farmer Now ({contactModalProduct.farmerPhone})
              </a>
              <a
                href={`https://wa.me/${contactModalProduct.farmerPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(contactModalProduct.farmerName)},%20I%20am%20interested%20in%20your%20${encodeURIComponent(contactModalProduct.cropName)}%20listed%20on%20Smart%20Farmer%20Marketplace.`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <MessageSquare className="w-4 h-4" />
                Chat on WhatsApp
              </a>
              <button
                onClick={() => setContactModalProduct(null)}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition mt-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
