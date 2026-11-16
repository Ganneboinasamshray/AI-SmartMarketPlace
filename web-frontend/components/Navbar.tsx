'use client';

import React from 'react';
import { User, UserRole } from '../lib/types';
import { 
  Sprout, 
  ShoppingBag, 
  ShieldCheck, 
  BarChart3, 
  ShoppingCart,
  LogIn,
  LogOut,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  currentRole: UserRole;
  activeTab: string;
  cartCount: number;
  onSelectTab: (tab: string) => void;
  onSwitchRole: (role: UserRole) => void;
  onOpenCart: () => void;
  onOpenAuth: (roleHint?: UserRole) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  activeTab,
  cartCount,
  onSelectTab,
  onSwitchRole,
  onOpenCart,
  onOpenAuth,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('marketplace')}>
            <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-md">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-1.5">
                Smart Farmer <span className="text-emerald-600">Marketplace</span>
              </span>
              <p className="text-[11px] text-gray-500 font-medium hidden sm:block">
                Direct Farm-to-Buyer • Telangana & Karnataka • Zero Middlemen
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Strictly Role-Based) */}
          <nav className="hidden md:flex space-x-1">
            {/* Marketplace is visible to Everyone */}
            <button
              onClick={() => onSelectTab('marketplace')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'marketplace'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Produce Marketplace
            </button>

            {/* Market Analytics & ML */}
            <button
              onClick={() => onSelectTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              ML Price Analytics
            </button>

            {/* FARMER DASHBOARD — Only accessible to Farmers (Hidden from Agents) */}
            {currentRole === 'ROLE_FARMER' && (
              <button
                onClick={() => onSelectTab('farmer')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'farmer'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                }`}
              >
                <Sprout className="w-4 h-4" />
                Farmer Dashboard
              </button>
            )}

            {/* AGENT DASHBOARD — Only accessible to Agents (Hidden from Farmers) */}
            {currentRole === 'ROLE_AGENT' && (
              <button
                onClick={() => onSelectTab('agent')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'agent'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Agent Verification
              </button>
            )}
          </nav>

          {/* Right Controls: Role Badge, Cart, Logins */}
          <div className="flex items-center space-x-3">
            
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-gray-700 hover:text-emerald-600 hover:bg-gray-100 rounded-full transition"
              title="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Authenticated User Status & Logout */}
            {currentUser ? (
              <div className="flex items-center space-x-2.5 pl-2 border-l border-gray-200">
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-xs font-bold text-gray-900 truncate max-w-[140px]">
                    {currentUser.fullName}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    currentUser.role === 'ROLE_FARMER' ? 'text-emerald-600' :
                    currentUser.role === 'ROLE_AGENT' ? 'text-blue-600' : 'text-amber-600'
                  }`}>
                    {currentUser.role === 'ROLE_FARMER' ? '🌾 Verified Farmer' :
                     currentUser.role === 'ROLE_AGENT' ? '🛡️ Field Agent' : '🛍️ Buyer'}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition flex items-center gap-1 text-xs font-bold"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            ) : (
              /* Dedicated Logins when not logged in */
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuth('ROLE_FARMER')}
                  className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl transition"
                >
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Farmer Login</span>
                </button>

                <button
                  onClick={() => onOpenAuth('ROLE_AGENT')}
                  className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-xl transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Agent Login</span>
                </button>

                <button
                  onClick={() => onOpenAuth('ROLE_BUYER')}
                  className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Buyer</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
