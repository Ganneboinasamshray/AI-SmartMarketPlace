'use client';

import React, { useState } from 'react';
import { User, UserRole } from '../lib/types';
import { 
  X, 
  Sprout, 
  ShieldCheck, 
  ShoppingBag,
  Phone, 
  User as UserIcon, 
  Lock,
  ArrowRight,
  BadgeCheck,
  Building,
  KeyRound
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess, initialRole }) => {
  const [activeTab, setActiveTab] = useState<'FARMER' | 'AGENT' | 'BUYER'>(
    initialRole === 'ROLE_AGENT' ? 'AGENT' : initialRole === 'ROLE_BUYER' ? 'BUYER' : 'FARMER'
  );

  // Farmer State
  const [farmerPhone, setFarmerPhone] = useState('+91 98480 32110');
  const [farmerPassbook, setFarmerPassbook] = useState('TS-DHA-948201');
  const [farmerName, setFarmerName] = useState('K. Mallesh Goud');
  const [farmerVillage, setFarmerVillage] = useState('Shamirpet Village, Medchal-Malkajgiri, Telangana');

  // Agent State
  const [agentBadgeId, setAgentBadgeId] = useState('AGT-TS-042');
  const [agentPassword, setAgentPassword] = useState('Agent@123');
  const [agentZone, setAgentZone] = useState('Hyderabad & North Telangana Zone');
  const [agentName, setAgentName] = useState('Vikram Rathore (Lead Field Agent)');

  // Buyer State
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');

  if (!isOpen) return null;

  // 1. Submit Farmer Login
  const handleFarmerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName || !farmerPhone) return;

    const farmerUser: User = {
      id: 1,
      email: `${farmerName.toLowerCase().replace(/[^a-z0-9]/g, '')}@telanganafarmers.in`,
      fullName: `${farmerName} (Verified Grower)`,
      phoneNumber: farmerPhone,
      role: 'ROLE_FARMER',
      verificationStatus: 'APPROVED'
    };
    onLoginSuccess(farmerUser);
    onClose();
  };

  // 2. Submit Agent Login
  const handleAgentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentBadgeId || !agentPassword) return;

    const agentUser: User = {
      id: 2,
      email: `${agentBadgeId.toLowerCase()}@smartfarmer.org`,
      fullName: agentName,
      phoneNumber: '+91 98111 22233',
      role: 'ROLE_AGENT'
    };
    onLoginSuccess(agentUser);
    onClose();
  };

  // 3. Submit Buyer Login
  const handleBuyerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone) return;

    const buyerUser: User = {
      id: Math.floor(1000 + Math.random() * 9000),
      email: `${buyerName.toLowerCase().replace(/[^a-z0-9]/g, '')}@consumer.in`,
      fullName: buyerName,
      phoneNumber: buyerPhone,
      role: 'ROLE_BUYER'
    };
    onLoginSuccess(buyerUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Toggle: Farmer vs Agent vs Buyer */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('FARMER')}
            className={`flex-1 py-2 px-1 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition ${
              activeTab === 'FARMER'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Farmer Login</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('AGENT')}
            className={`flex-1 py-2 px-1 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition ${
              activeTab === 'AGENT'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Agent Login</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('BUYER')}
            className={`flex-1 py-2 px-1 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition ${
              activeTab === 'BUYER'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Buyer</span>
          </button>
        </div>

        {/* ==================== 1. FARMER LOGIN ==================== */}
        {activeTab === 'FARMER' && (
          <form onSubmit={handleFarmerLogin} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Verified Farmer Login</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Access your Farmer Dashboard to list fresh produce, use ML price predictions, and manage orders.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Farmer Full Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. K. Mallesh Goud"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Registered Mobile Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98480 32110"
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Dharani / Pattadar Passbook Number *
              </label>
              <div className="relative">
                <BadgeCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. TS-DHA-948201"
                  value={farmerPassbook}
                  onChange={(e) => setFarmerPassbook(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Farm Village (Telangana / Karnataka)
              </label>
              <select
                value={farmerVillage}
                onChange={(e) => setFarmerVillage(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
              >
                <option value="Shamirpet Village, Medchal-Malkajgiri, Telangana">Shamirpet Village (Medchal-Malkajgiri, Telangana)</option>
                <option value="Chevella Village, Ranga Reddy, Telangana">Chevella Village (Ranga Reddy, Telangana)</option>
                <option value="Moinabad Village, Ranga Reddy, Telangana">Moinabad Village (Ranga Reddy, Telangana)</option>
                <option value="Gajwel Village, Siddipet, Telangana">Gajwel Village (Siddipet, Telangana)</option>
                <option value="Choutuppal Village, Yadadri Bhuvanagiri, Telangana">Choutuppal Village (Yadadri, Telangana)</option>
                <option value="Jadcherla Village, Mahabubnagar, Telangana">Jadcherla Village (Mahabubnagar, Telangana)</option>
                <option value="Malur Village, Kolar, Karnataka">Malur Village (Kolar, Karnataka)</option>
                <option value="Bangarapet Village, Kolar, Karnataka">Bangarapet Village (Kolar, Karnataka)</option>
              </select>
            </div>

            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Direct farm gate access. Middlemen and wholesale commission agents are prohibited from registering as farmers.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Login & Open Farmer Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ==================== 2. AGENT LOGIN ==================== */}
        {activeTab === 'AGENT' && (
          <form onSubmit={handleAgentLogin} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Verification Agent Login</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Authorized field agents log in to audit pending farmer applications, inspect land records, and detect middlemen.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Agent Employee / Badge ID *
              </label>
              <div className="relative">
                <BadgeCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. AGT-TS-042"
                  value={agentBadgeId}
                  onChange={(e) => setAgentBadgeId(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Agent Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Rathore"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Password / Access Key *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Enter your security access key"
                  value={agentPassword}
                  onChange={(e) => setAgentPassword(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Assigned Operational Jurisdiction
              </label>
              <select
                value={agentZone}
                onChange={(e) => setAgentZone(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              >
                <option value="Hyderabad & North Telangana Zone">Hyderabad & North Telangana (Medchal, Siddipet, Nizamabad)</option>
                <option value="South Telangana Zone">South Telangana (Ranga Reddy, Mahabubnagar, Nalgonda)</option>
                <option value="Karnataka Border Zone">Karnataka Border (Kolar, Bangalore Rural)</option>
              </select>
            </div>

            <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Agent privileges: Review Dharani land deeds, execute on-site farm GPS checks, and approve genuine growers or flag middlemen.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Login & Open Agent Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ==================== 3. BUYER LOGIN ==================== */}
        {activeTab === 'BUYER' && (
          <form onSubmit={handleBuyerLogin} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Customer / Buyer Access</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                No passwords required. Just enter your name and phone number to buy directly from verified farms.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Your Full Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma or Ramesh Kumar"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Mobile Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98666 77788"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Used for instant Cash on Delivery order confirmation & delivery updates.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Login as Buyer & Shop</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
