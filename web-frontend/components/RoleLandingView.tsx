'use client';

import React from 'react';
import { UserRole } from '../lib/types';
import {
  Sprout,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BrainCircuit,
  Scale
} from 'lucide-react';

interface RoleLandingViewProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleLandingView: React.FC<RoleLandingViewProps> = ({ onSelectRole }) => {
  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-8 sm:p-14 shadow-2xl border border-emerald-700/30">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>AI-Powered Direct Agricultural Marketplace • Telangana State</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Fair Prices for Farmers. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-amber-300">
              Verified Fresh Produce
            </span>{' '}
            for Buyers.
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
            Eliminating predatory middlemen and commission agents across all <strong>33 districts of Telangana</strong>. Powered by AI price forecasting, rigorous on-field agent verification, and direct farmer-to-buyer transactions.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-emerald-700/40 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>33 Telangana Districts</span>
            </div>
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-amber-300 shrink-0" />
              <span>AI Price Benchmark</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-300 shrink-0" />
              <span>Physical Field Audit</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Zero Intermediaries</span>
            </div>
          </div>
        </div>

        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />
        <div className="absolute right-10 top-10 w-72 h-72 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
      </section>

      {/* Role Selection Section: 3 Strict Portals */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Dedicated Role Portals
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Select Your Portal to Continue
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Each role has a completely isolated portal designed for their exact operational workflow. Please choose your account type:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* 1. FARMER PORTAL CARD */}
          <div className="group relative bg-white rounded-3xl p-7 border-2 border-emerald-200 hover:border-emerald-500 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition">
                <Sprout className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                  For Genuine Cultivators
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  Farmer Portal
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                List harvested vegetables, receive instant AI price recommendations based on live mandi arrivals, track agent verification status, and sell at fair prices.
              </p>

              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Add Vegetables with Telangana Location</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Real-time ML Price Prediction (₹/kg)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Edit & Resubmit if changes requested</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct contact with verified buyers</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelectRole('ROLE_FARMER')}
              className="mt-6 w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 group-hover:gap-3"
            >
              <span>Login as Farmer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 2. AGENT PORTAL CARD */}
          <div className="group relative bg-white rounded-3xl p-7 border-2 border-blue-200 hover:border-blue-500 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  Field Verification Officers
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  Agent Portal
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Authorized field inspection portal. Verify farmer land records, audit vegetable quality, review ML price benchmarks, and approve, reject, or request changes.
              </p>

              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Review Pending Farmer Submissions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Approve, Reject or Request Changes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Eliminate Mandi Middlemen & Resellers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Complete Audit Trail & Inspection Logs</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelectRole('ROLE_AGENT')}
              className="mt-6 w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 group-hover:gap-3"
            >
              <span>Login as Field Agent</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3. BUYER PORTAL CARD */}
          <div className="group relative bg-white rounded-3xl p-7 border-2 border-amber-200 hover:border-amber-500 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                  Consumers, Retailers & Traders
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  Buyer Portal
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse 100% verified, farm-fresh vegetables directly from Telangana farmers. Filter by all 33 districts, view farmer contacts, and purchase at wholesale rates.
              </p>

              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>ONLY Agent-Approved Produce Visible</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Filter by 33 Telangana Districts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>15–25% Lower than Market Mandi Markups</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Direct Farmer Phone & WhatsApp Contact</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelectRole('ROLE_BUYER')}
              className="mt-6 w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 group-hover:gap-3"
            >
              <span>Login as Buyer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Verification Workflow Section */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-10 space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            How It Works
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            End-to-End Three-Role Verification Lifecycle
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Strict quality assurance ensures only authentic growers and tested produce reach buyers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-black text-sm flex items-center justify-center">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-900">Farmer Submits Produce</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Farmer enters vegetable details, mandal/village in Telangana, and receives automatic ML fair price recommendations. Produce starts as <strong>Pending Verification</strong>.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-900">Field Agent Verifies & Audits</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Authenticated Field Agent reviews Dharani land credentials, verifies produce quality, and approves, rejects with cause, or requests improvements with instructions.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 font-black text-sm flex items-center justify-center">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-900">Buyer Buys Direct</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Approved listings appear instantly in Buyer Marketplace. Buyers purchase directly from the farmer with zero intermediary commission or inflated prices.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
