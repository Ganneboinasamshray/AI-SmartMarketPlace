'use client';

import React, { useState } from 'react';
import { CartItem, Order } from '../lib/types';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  Phone,
  Banknote,
  Smartphone,
  Building2
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQty: (productId: number, qty: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckoutComplete: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cart,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onCheckoutComplete
}) => {
  const [address, setAddress] = useState('Plot 42, Wholesale APMC Market Complex, Bangalore, Karnataka');
  const [city, setCity] = useState('Bangalore');
  const [phone, setPhone] = useState('+91 98666 77788');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'NetBanking' | 'Card'>('COD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const totalAmount = cart.reduce((acc, item) => acc + (item.product.pricePerKg * item.quantityKg), 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      const isCod = paymentMethod === 'COD';
      const newOrder: Order = {
        id: Math.floor(1000 + Math.random() * 9000),
        buyerName: 'Priya Sundaram (Wholesale Buyer)',
        farmerName: cart[0].product.farmerName,
        farmerPhone: cart[0].product.farmerPhone,
        totalAmount,
        deliveryAddress: `${address}, ${city}`,
        orderStatus: 'PLACED',
        paymentStatus: isCod ? 'PENDING' : 'PAID',
        createdAt: new Date().toISOString().split('T')[0],
        items: cart.map(i => ({
          productId: i.product.id,
          cropName: i.product.cropName,
          quantityKg: i.quantityKg,
          unitPrice: i.product.pricePerKg,
          subtotal: i.quantityKg * i.product.pricePerKg
        }))
      };

      setPlacedOrder(newOrder);
      setIsProcessing(false);
      onCheckoutComplete(newOrder);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary-600" />
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
                    <strong>Payment Method:</strong> {paymentMethod === 'COD' ? '💵 Cash on Delivery (Pay upon arrival)' : paymentMethod}
                  </div>
                  <div>
                    <strong>Payment Status:</strong> {placedOrder.paymentStatus === 'PAID' ? '✅ Paid' : '⏳ Pending (Pay Cash on Delivery)'}
                  </div>
                  <div><strong>Delivery To:</strong> {placedOrder.deliveryAddress}</div>
                  <div><strong>Farmer Contact:</strong> {placedOrder.farmerPhone}</div>
                </div>

                <button
                  onClick={() => {
                    setPlacedOrder(null);
                    onClose();
                  }}
                  className="w-full py-2.5 bg-primary-600 text-white text-xs font-bold rounded-xl hover:bg-primary-700 transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 text-gray-400 space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto stroke-1" />
                <p className="text-xs">Your basket is empty. Add fresh crops from verified farmers.</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.cropName}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/products/tomato.jpg';
                        }}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0 shadow-2xs"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">{item.product.cropName}</h4>
                        <p className="text-[11px] text-gray-500">₹{item.product.pricePerKg}/kg • {item.product.farmerName}</p>
                        
                        {/* Qty Selector */}
                        <div className="flex items-center gap-2 mt-2">
                          <label className="text-[10px] text-gray-400 font-semibold">Qty (kg):</label>
                          <input
                            type="number"
                            min="2"
                            max={item.product.quantityKg}
                            step="1"
                            value={item.quantityKg}
                            onChange={(e) => onUpdateQty(item.product.id, Math.min(item.product.quantityKg, Math.max(2, Number(e.target.value))))}
                            className="w-20 px-2 py-1 text-xs border border-gray-200 rounded-lg bg-white"
                          />
                          <span className="text-[10px] text-gray-400">
                            (Max: {item.product.quantityKg}kg)
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end justify-between h-full">
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-primary-700">
                          ₹{(item.quantityKg * item.product.pricePerKg).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Checkout Form */}
                <form onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-900 block">Delivery & Payment Details</span>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">Delivery Address</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1">Contact Phone</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`p-2.5 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition ${
                          paymentMethod === 'COD' ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-xs' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        <span>Cash on Delivery (COD)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('UPI')}
                        className={`p-2.5 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition ${
                          paymentMethod === 'UPI' ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-xs' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Smartphone className="w-4 h-4 text-primary-600" />
                        <span>Instant UPI</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('NetBanking')}
                        className={`p-2.5 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition ${
                          paymentMethod === 'NetBanking' ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-xs' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-primary-600" />
                        <span>Net Banking</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Card')}
                        className={`p-2.5 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition ${
                          paymentMethod === 'Card' ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-xs' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-primary-600" />
                        <span>Debit / Credit Card</span>
                      </button>
                    </div>

                    {paymentMethod === 'COD' && (
                      <p className="mt-2 text-[11px] text-emerald-700 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100 flex items-center gap-1">
                        <span>💵</span> Inspect fresh farm produce at your doorstep, then pay cash directly to the driver/farmer.
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
                      <span className="text-emerald-600 font-bold">FREE (Direct Farm Pickup/Delivery)</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                      <span>Total Payable:</span>
                      <span className="text-primary-700 text-base">₹{totalAmount.toFixed(2)}</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full mt-4 py-3 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                    >
                      {isProcessing ? 'Confirming with Farmer...' : (
                        paymentMethod === 'COD'
                          ? `Place Order with Cash on Delivery (₹${totalAmount.toFixed(2)})`
                          : `Pay & Place Order (₹${totalAmount.toFixed(2)})`
                      )}
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
