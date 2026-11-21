'use client';

import React, { useState, useEffect } from 'react';
import { CartItem, Order, User } from '../lib/types';
import {
  X,
  Trash2,
  ShoppingBag,
  CreditCard,
  CheckCircle2,
  Banknote,
  Smartphone,
  Building2
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  currentUser: User | null;
  onClose: () => void;
  onUpdateQty: (productId: number, qty: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckoutComplete: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cart,
  currentUser,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onCheckoutComplete
}) => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'NetBanking' | 'Card'>('COD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setPlacedOrder(null);
      setAddress('');
      setCity('');
      setPhone('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalAmount = cart.reduce((acc, item) => acc + item.product.pricePerKg * item.quantityKg, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      const isCod = paymentMethod === 'COD';
      const newOrder: Order = {
        id: Math.floor(1000 + Math.random() * 9000),
        buyerName: currentUser?.fullName || 'Verified Buyer',
        farmerName: cart[0].product.farmerName,
        farmerPhone: cart[0].product.farmerPhone,
        totalAmount,
        deliveryAddress: `${address.trim()}, ${city.trim()}, Telangana`,
        orderStatus: 'PLACED',
        paymentStatus: isCod ? 'PENDING' : 'PAID',
        createdAt: new Date().toISOString().split('T')[0],
        items: cart.map(i => ({
          productId: i.product.id,
          cropName: i.product.cropName,
          quantityKg: i.quantityKg,
          unitPrice: i.product.pricePerKg,
          subtotal: +(i.quantityKg * i.product.pricePerKg).toFixed(2)
        }))
      };

      setPlacedOrder(newOrder);
      setIsProcessing(false);
      onCheckoutComplete(newOrder);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-900">Direct Produce Order</h2>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {placedOrder ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Order #{placedOrder.id} Placed!</h3>
                <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
                  Your purchase order was sent directly to <strong>{placedOrder.farmerName}</strong> with 0% middleman deduction.
                </p>

                <div className="bg-gray-50 p-4 rounded-xl text-left text-xs space-y-1.5 border border-gray-200">
                  <div><strong>Total Amount:</strong> ₹{placedOrder.totalAmount.toFixed(2)}</div>
                  <div>
                    <strong>Payment Method:</strong>{' '}
                    {paymentMethod === 'COD' ? 'Cash on Delivery (Pay upon arrival)' : paymentMethod}
                  </div>
                  <div><strong>Delivery Address:</strong> {placedOrder.deliveryAddress}</div>
                  {placedOrder.farmerPhone && (
                    <div><strong>Farmer Contact:</strong> {placedOrder.farmerPhone}</div>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 text-gray-400 space-y-2">
                <ShoppingBag className="w-12 h-12 mx-auto text-gray-300" />
                <p className="text-sm font-semibold text-gray-600">Your produce cart is empty</p>
                <p className="text-xs">Add verified Telangana vegetables from the marketplace to place a direct farm order.</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-slate-900 truncate">{item.product.cropName}</h4>
                        <p className="text-[11px] text-slate-500">
                          ₹{item.product.pricePerKg}/{item.product.unit || 'kg'} • {item.product.farmerName}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number"
                          min={item.product.minOrderKg || 2}
                          max={item.product.quantityKg}
                          value={item.quantityKg}
                          onChange={(e) => onUpdateQty(item.product.id, Number(e.target.value))}
                          className="w-16 p-1.5 text-xs font-bold text-center bg-white border border-slate-200 rounded-lg"
                        />
                        <span className="text-xs font-black text-slate-800 w-16 text-right">
                          ₹{(item.product.pricePerKg * item.quantityKg).toFixed(0)}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery & Payment Form */}
                <form onSubmit={handleCheckout} autoComplete="off" className="space-y-4">
                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Delivery Details (Telangana)</h3>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Delivery Address *</label>
                      <input
                        type="text"
                        required
                        autoComplete="off"
                        placeholder="House / Shop No., Street, Area"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">City / Town *</label>
                        <input
                          type="text"
                          required
                          autoComplete="off"
                          placeholder="e.g. Hyderabad, Warangal"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Contact Phone *</label>
                        <input
                          type="tel"
                          required
                          autoComplete="off"
                          placeholder="10-digit mobile"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-900 block">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`p-2.5 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition ${
                          paymentMethod === 'COD'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-xs'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        <span>Cash on Delivery</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('UPI')}
                        className={`p-2.5 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition ${
                          paymentMethod === 'UPI'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-xs'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        <span>Instant UPI</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('NetBanking')}
                        className={`p-2.5 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition ${
                          paymentMethod === 'NetBanking'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-xs'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-emerald-600" />
                        <span>Net Banking</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Card')}
                        className={`p-2.5 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition ${
                          paymentMethod === 'Card'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-xs'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <span>Debit / Credit Card</span>
                      </button>
                    </div>

                    {paymentMethod === 'COD' && (
                      <p className="mt-2 text-[11px] text-emerald-700 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                        <Banknote className="w-3.5 h-3.5 shrink-0" />
                        <span>Inspect fresh farm produce at your doorstep, then pay in INR (₹) directly to the farmer.</span>
                      </p>
                    )}
                  </div>

                  {/* Summary & Submit */}
                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Produce Subtotal:</span>
                      <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Middleman Commission:</span>
                      <span className="text-emerald-600 font-bold">₹0.00 (Direct Deal)</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Delivery Fee:</span>
                      <span className="text-emerald-600 font-bold">FREE (Direct Farm Trade)</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                      <span>Total Payable:</span>
                      <span className="text-emerald-700 text-base">₹{totalAmount.toFixed(2)}</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                    >
                      {isProcessing
                        ? 'Confirming with Farmer...'
                        : paymentMethod === 'COD'
                        ? `Place Order with Cash on Delivery (₹${totalAmount.toFixed(2)})`
                        : `Pay & Place Order (₹${totalAmount.toFixed(2)})`}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
