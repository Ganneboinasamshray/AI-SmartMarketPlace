'use client';

import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../lib/types';
import { verifyAgentCredentials } from '../lib/api';
import { TELANGANA_DISTRICTS, getMandalsForDistrict } from '../lib/telanganaData';
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
  MapPin,
  AlertCircle,
  Info
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialRole?: UserRole;
}

function generateDeterministicUserId(phone: string, seedOffset: number): number {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.endsWith('9848032110')) return 1; // Maps existing demo farmer account
  let hash = 0;
  for (let i = 0; i < digits.length; i++) {
    hash = (hash * 31 + digits.charCodeAt(i)) % 100000;
  }
  return seedOffset + hash + 100;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole
}) => {
  const [activeRole, setActiveRole] = useState<UserRole>(initialRole || 'ROLE_FARMER');
  const [authError, setAuthError] = useState<string>('');

  // All form fields start EMPTY - zero auto-fill of dummy data
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [farmerDistrict, setFarmerDistrict] = useState('');
  const [farmerMandal, setFarmerMandal] = useState('');
  const [farmerVillage, setFarmerVillage] = useState('');
  const [farmerPassbook, setFarmerPassbook] = useState('');

  const [agentBadgeId, setAgentBadgeId] = useState('');
  const [agentName, setAgentName] = useState('');
  const [agentDistrict, setAgentDistrict] = useState('');
  const [agentAccessKey, setAgentAccessKey] = useState('');

  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerDistrict, setBuyerDistrict] = useState('');

  const resetAllFields = () => {
    setAuthError('');
    setFarmerName('');
    setFarmerPhone('');
    setFarmerDistrict('');
    setFarmerMandal('');
    setFarmerVillage('');
    setFarmerPassbook('');
    setAgentBadgeId('');
    setAgentName('');
    setAgentDistrict('');
    setAgentAccessKey('');
    setBuyerName('');
    setBuyerPhone('');
    setBuyerDistrict('');
  };

  useEffect(() => {
    if (isOpen) {
      resetAllFields();
      if (initialRole) {
        setActiveRole(initialRole);
      }
    }
  }, [isOpen, initialRole]);

  const handleTabSwitch = (role: UserRole) => {
    setActiveRole(role);
    setAuthError('');
  };

  const handleFarmerDistrictChange = (district: string) => {
    setFarmerDistrict(district);
    setFarmerMandal('');
  };

  if (!isOpen) return null;

  // 1. Submit Farmer Login
  const handleFarmerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!farmerName.trim() || !farmerPhone.trim() || !farmerDistrict || !farmerMandal || !farmerVillage.trim()) {
      setAuthError('Please fill in all required farmer details including Telangana district, mandal, and village.');
      return;
    }

    const user: User = {
      id: generateDeterministicUserId(farmerPhone, 1000),
      email: `${farmerName.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}@telanganafarmers.in`,
      fullName: farmerName.trim(),
      phoneNumber: farmerPhone.trim(),
      role: 'ROLE_FARMER',
      state: 'Telangana',
      district: farmerDistrict,
      mandal: farmerMandal,
      village: farmerVillage.trim(),
      passbookNumber: farmerPassbook.trim() || undefined,
      verificationStatus: 'APPROVED'
    };

    resetAllFields();
    onLoginSuccess(user);
  };

  // 2. Submit Agent Login (Strictly Authenticated against Authorized Agent Registry)
  const handleAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!agentBadgeId.trim() || !agentName.trim() || !agentDistrict || !agentAccessKey.trim()) {
      setAuthError('Please enter your Agent Badge ID, Full Name, Assigned District, and Security Access Key.');
      return;
    }

    const verifiedAgent = verifyAgentCredentials(agentBadgeId, agentAccessKey);
    if (!verifiedAgent) {
      setAuthError('Authentication Failed: Invalid Agent Badge ID or Security Access Key. Only authorized Telangana Field Agents may enter.');
      return;
    }

    const user: User = {
      id: 99,
      email: `${verifiedAgent.badgeId.toLowerCase()}@telanganaagri.gov.in`,
      fullName: agentName.trim(),
      phoneNumber: '+91 98490 99887',
      role: 'ROLE_AGENT',
      state: 'Telangana',
      district: agentDistrict,
      badgeId: verifiedAgent.badgeId,
      verificationStatus: 'APPROVED'
    };

    resetAllFields();
    onLoginSuccess(user);
  };

  // 3. Submit Buyer Login
  const handleBuyerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!buyerName.trim() || !buyerPhone.trim() || !buyerDistrict) {
      setAuthError('Please enter your full name, phone number, and Telangana delivery district.');
      return;
    }

    const user: User = {
      id: generateDeterministicUserId(buyerPhone, 5000),
      email: `${buyerName.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}@buyer.in`,
      fullName: buyerName.trim(),
      phoneNumber: buyerPhone.trim(),
      role: 'ROLE_BUYER',
      state: 'Telangana',
      district: buyerDistrict,
      verificationStatus: 'APPROVED'
    };

    resetAllFields();
    onLoginSuccess(user);
  };

  const mandalOptions = farmerDistrict ? getMandalsForDistrict(farmerDistrict) : [];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto relative border border-slate-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Portal Role Tabs */}
        <div className="flex border-b border-slate-200 mb-6 pb-2 gap-2">
          <button
            type="button"
            onClick={() => handleTabSwitch('ROLE_FARMER')}
            className={`flex-1 pb-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition ${
              activeRole === 'ROLE_FARMER'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Farmer Login</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('ROLE_AGENT')}
            className={`flex-1 pb-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition ${
              activeRole === 'ROLE_AGENT'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Agent Login</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('ROLE_BUYER')}
            className={`flex-1 pb-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition ${
              activeRole === 'ROLE_BUYER'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Buyer Login</span>
          </button>
        </div>

        {/* Inline Error Banner */}
        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {/* ==================== 1. FARMER LOGIN ==================== */}
        {activeRole === 'ROLE_FARMER' && (
          <form onSubmit={handleFarmerSubmit} autoComplete="off" className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Farmer Portal Access</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Enter your details to list harvested vegetables, get ML price forecasts, and track agent verification.
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
                  autoComplete="off"
                  placeholder="Enter your full name"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  autoComplete="off"
                  placeholder="Enter 10-digit mobile number"
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Strict Telangana Location */}
            <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Farm Location (Telangana Only)
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                  State: Telangana
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">District *</label>
                  <select
                    required
                    value={farmerDistrict}
                    onChange={(e) => handleFarmerDistrictChange(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-slate-800 font-medium"
                  >
                    <option value="">-- Select District --</option>
                    {TELANGANA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Mandal *</label>
                  <select
                    required
                    disabled={!farmerDistrict}
                    value={farmerMandal}
                    onChange={(e) => setFarmerMandal(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-slate-800 font-medium disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option value="">-- Select Mandal --</option>
                    {mandalOptions.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Village *</label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="Enter your village name"
                  value={farmerVillage}
                  onChange={(e) => setFarmerVillage(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-slate-800 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Pattadar Passbook / Dharani Number (Optional)
              </label>
              <input
                type="text"
                autoComplete="off"
                placeholder="Enter Dharani passbook number (if available)"
                value={farmerPassbook}
                onChange={(e) => setFarmerPassbook(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Login & Open Farmer Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ==================== 2. AGENT LOGIN ==================== */}
        {activeRole === 'ROLE_AGENT' && (
          <form onSubmit={handleAgentSubmit} autoComplete="off" className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Field Agent Portal Access</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Authorized agricultural field agents only. Valid Badge ID and Security Key are strictly required.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Agent Official Badge ID *
              </label>
              <div className="relative">
                <BadgeCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="Enter official Badge ID (e.g. AGT-TS-042)"
                  value={agentBadgeId}
                  onChange={(e) => setAgentBadgeId(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Agent Full Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="Enter officer full name"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Assigned Telangana District *
              </label>
              <select
                required
                value={agentDistrict}
                onChange={(e) => setAgentDistrict(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              >
                <option value="">-- Select Assigned District --</option>
                {TELANGANA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Agent Security Access Key *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="Enter authorized security key"
                  value={agentAccessKey}
                  onChange={(e) => setAgentAccessKey(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-blue-800 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Authorized Test Credentials:</span> Badge IDs <code className="bg-white px-1 rounded">AGT-TS-042</code>, <code className="bg-white px-1 rounded">AGT-TS-089</code>, or <code className="bg-white px-1 rounded">AGT-TS-105</code> • Key: <code className="bg-white px-1 rounded">Agent@TS2026</code>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Authenticate & Open Agent Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ==================== 3. BUYER LOGIN ==================== */}
        {activeRole === 'ROLE_BUYER' && (
          <form onSubmit={handleBuyerSubmit} autoComplete="off" className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Buyer Portal Access</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Enter your details to browse agent-approved farm produce directly from Telangana farmers.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="Enter your full name"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  autoComplete="off"
                  placeholder="Enter 10-digit mobile number"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Delivery District (Telangana) *
              </label>
              <select
                required
                value={buyerDistrict}
                onChange={(e) => setBuyerDistrict(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
              >
                <option value="">-- Select Delivery District --</option>
                {TELANGANA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Login & Open Buyer Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
