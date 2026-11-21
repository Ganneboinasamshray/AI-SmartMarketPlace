'use client';

import React from 'react';
import { User, UserRole } from '../lib/types';
import {
  Sprout,
  ShoppingBag,
  ShieldCheck,
  ShoppingCart,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  currentRole: UserRole | null;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: (roleHint?: UserRole) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  cartCount,
  onOpenCart,
  onOpenAuth,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Portal Identity */}
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-2xl shadow-xs text-white ${
              currentRole === 'ROLE_FARMER' ? 'bg-emerald-600' :
              currentRole === 'ROLE_AGENT' ? 'bg-blue-600' :
              currentRole === 'ROLE_BUYER' ? 'bg-amber-600' : 'bg-emerald-700'
            }`}>
              {currentRole === 'ROLE_FARMER' ? <Sprout className="w-6 h-6" /> :
               currentRole === 'ROLE_AGENT' ? <ShieldCheck className="w-6 h-6" /> :
               currentRole === 'ROLE_BUYER' ? <ShoppingBag className="w-6 h-6" /> :
               <Sprout className="w-6 h-6" />}
            </div>

            <div>
              <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                AI Smart{' '}
                <span className={
                  currentRole === 'ROLE_FARMER' ? 'text-emerald-600' :
                  currentRole === 'ROLE_AGENT' ? 'text-blue-600' :
                  currentRole === 'ROLE_BUYER' ? 'text-amber-600' : 'text-emerald-700'
                }>
                  Marketplace
                </span>

                {currentRole === 'ROLE_FARMER' && (
                  <span className="ml-1 text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 hidden sm:inline-block">
                    Farmer Portal
                  </span>
                )}
                {currentRole === 'ROLE_AGENT' && (
                  <span className="ml-1 text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200 hidden sm:inline-block">
                    Agent Portal
                  </span>
                )}
                {currentRole === 'ROLE_BUYER' && (
                  <span className="ml-1 text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 hidden sm:inline-block">
                    Buyer Portal
                  </span>
                )}
              </span>

              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                Direct Agriculture Trading • Strictly Telangana 33 Districts • Zero Intermediaries
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-3">
            {!currentUser && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('ROLE_FARMER')}
                  className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-2 rounded-xl transition"
                >
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Farmer Login</span>
                  <span className="sm:hidden">Farmer</span>
                </button>

                <button
                  onClick={() => onOpenAuth('ROLE_AGENT')}
                  className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-2 rounded-xl transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Agent Login</span>
                  <span className="sm:hidden">Agent</span>
                </button>

                <button
                  onClick={() => onOpenAuth('ROLE_BUYER')}
                  className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs transition"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Buyer Login</span>
                  <span className="sm:hidden">Buyer</span>
                </button>
              </div>
            )}

            {currentUser && currentRole === 'ROLE_BUYER' && (
              <button
                onClick={onOpenCart}
                className="relative p-2.5 text-slate-700 hover:text-amber-600 hover:bg-amber-50 rounded-2xl transition border border-slate-200"
                title="View Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {currentUser && (
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                    {currentUser.fullName}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center justify-end gap-1 ${
                    currentRole === 'ROLE_FARMER' ? 'text-emerald-600' :
                    currentRole === 'ROLE_AGENT' ? 'text-blue-600' : 'text-amber-600'
                  }`}>
                    {currentRole === 'ROLE_FARMER' && (
                      <>
                        <Sprout className="w-3 h-3" />
                        <span>Telangana Farmer</span>
                      </>
                    )}
                    {currentRole === 'ROLE_AGENT' && (
                      <>
                        <ShieldCheck className="w-3 h-3" />
                        <span>Officer ({currentUser.badgeId})</span>
                      </>
                    )}
                    {currentRole === 'ROLE_BUYER' && (
                      <>
                        <ShoppingBag className="w-3 h-3" />
                        <span>Verified Buyer</span>
                      </>
                    )}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition flex items-center gap-1.5 text-xs font-bold border border-rose-200 cursor-pointer"
                  title="Logout and exit to landing page"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
