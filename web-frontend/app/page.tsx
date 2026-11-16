'use client';

import React, { useState } from 'react';
import { User, UserRole, Product, CartItem, Order } from '../lib/types';
import { INITIAL_PRODUCTS } from '../lib/api';
import { Navbar } from '../components/Navbar';
import { MarketplaceView } from '../components/MarketplaceView';
import { FarmerDashboard } from '../components/FarmerDashboard';
import { AgentDashboard } from '../components/AgentDashboard';
import { AnalyticsView } from '../components/AnalyticsView';
import { CartDrawer } from '../components/CartDrawer';
import { AuthModal } from '../components/AuthModal';

export default function Home() {
  // Current user & role state (Defaults to Buyer so visitor lands on Marketplace)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('ROLE_BUYER');
  const [activeTab, setActiveTab] = useState<string>('marketplace');

  // Products and Cart State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authRoleHint, setAuthRoleHint] = useState<UserRole | undefined>(undefined);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 501,
      buyerName: 'Priya Sundaram (Consumer)',
      farmerName: 'K. Mallesh Goud',
      farmerPhone: '+91 98480 32110',
      totalAmount: 560.00,
      deliveryAddress: 'Plot 14, Madhapur, Hyderabad, Telangana',
      orderStatus: 'DELIVERED',
      paymentStatus: 'PAID',
      createdAt: '2026-04-01',
      items: [
        {
          productId: 1,
          cropName: 'Tomato',
          quantityKg: 20,
          unitPrice: 28.00,
          subtotal: 560.00
        }
      ]
    },
    {
      id: 502,
      buyerName: 'Srikanth Varma (Store)',
      farmerName: 'Anand Reddy',
      farmerPhone: '+91 98490 11223',
      totalAmount: 1150.00,
      deliveryAddress: 'Shop 8, Gachibowli Organic Store, Hyderabad, Telangana',
      orderStatus: 'DISPATCHED',
      paymentStatus: 'PENDING',
      createdAt: '2026-04-02',
      items: [
        {
          productId: 2,
          cropName: 'Capsicum (Bell Pepper)',
          quantityKg: 25,
          unitPrice: 46.00,
          subtotal: 1150.00
        }
      ]
    }
  ]);

  // Open Auth with specific Role Hint
  const handleOpenAuth = (roleHint?: UserRole) => {
    setAuthRoleHint(roleHint);
    setIsAuthOpen(true);
  };

  // Add to Cart
  const handleAddToCart = (product: Product, quantityKg: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantityKg: i.quantityKg + quantityKg } : i);
      }
      return [...prev, { product, quantityKg }];
    });
    setIsCartOpen(true);
  };

  // Update Qty (Min 2kg up to product maximum stock)
  const handleUpdateQty = (productId: number, qty: number) => {
    setCart(prev => prev.map(i => {
      if (i.product.id === productId) {
        const validatedQty = Math.min(i.product.quantityKg, Math.max(2, qty));
        return { ...i, quantityKg: validatedQty };
      }
      return i;
    }));
  };

  // Remove Item
  const handleRemoveItem = (productId: number) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  // Farmer Add New Produce
  const handleAddProduct = (newProd: Partial<Product>) => {
    const created: Product = {
      id: products.length + 1,
      farmerId: currentUser ? currentUser.id : 1,
      farmerName: currentUser ? currentUser.fullName : 'K. Mallesh Goud',
      farmerPhone: currentUser ? currentUser.phoneNumber : '+91 98480 32110',
      farmerVerified: true,
      categoryName: newProd.categoryName || 'Vegetables',
      cropName: newProd.cropName || 'Fresh Crop',
      variety: newProd.variety || 'Standard',
      quantityKg: newProd.quantityKg || 500,
      minOrderKg: newProd.minOrderKg || 2,
      pricePerKg: newProd.pricePerKg || 30,
      qualityGrade: newProd.qualityGrade || 'Grade A',
      harvestDate: newProd.harvestDate || '2026-04-03',
      shelfLifeDays: 7,
      isOrganic: newProd.isOrganic !== undefined ? newProd.isOrganic : true,
      imageUrl: newProd.imageUrl || '/images/products/tomato.jpg',
      farmLocation: newProd.farmLocation || 'Shamirpet Village, Medchal-Malkajgiri, Telangana',
      status: 'AVAILABLE'
    };
    setProducts([created, ...products]);
  };

  // Update Order Status
  const handleUpdateOrderStatus = (orderId: number, status: Order['orderStatus']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: status } : o));
  };

  // Checkout Complete
  const handleCheckoutComplete = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
    setCart([]);
  };

  // Login Success Callback with strictly isolated role redirection
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentRole(user.role);

    // Strict Role-Based Redirection:
    if (user.role === 'ROLE_FARMER') {
      setActiveTab('farmer'); // Redirect Farmer to Farmer Dashboard
    } else if (user.role === 'ROLE_AGENT') {
      setActiveTab('agent');  // Redirect Agent to Agent Verification Dashboard
    } else {
      setActiveTab('marketplace'); // Redirect Buyer to Marketplace
    }
  };

  // Logout Callback
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRole('ROLE_BUYER');
    setActiveTab('marketplace');
  };

  const cartTotalCount = cart.reduce((acc, item) => acc + 1, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        currentRole={currentRole}
        activeTab={activeTab}
        cartCount={cartTotalCount}
        onSelectTab={(tab) => {
          // Prevent Role violation:
          if (tab === 'farmer' && currentRole !== 'ROLE_FARMER') {
            handleOpenAuth('ROLE_FARMER');
            return;
          }
          if (tab === 'agent' && currentRole !== 'ROLE_AGENT') {
            handleOpenAuth('ROLE_AGENT');
            return;
          }
          setActiveTab(tab);
        }}
        onSwitchRole={(role) => setCurrentRole(role)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Produce Marketplace */}
        {activeTab === 'marketplace' && (
          <MarketplaceView
            products={products}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* ML & Price Analytics */}
        {activeTab === 'analytics' && (
          <AnalyticsView />
        )}

        {/* FARMER DASHBOARD — Strictly Protected (Only ROLE_FARMER) */}
        {activeTab === 'farmer' && (
          currentRole === 'ROLE_FARMER' ? (
            <FarmerDashboard
              farmerProducts={products.filter(p => p.farmerName.includes(currentUser?.fullName.split(' ')[0] || 'Mallesh') || p.farmerId === 1)}
              orders={orders}
              onAddProduct={handleAddProduct}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8 shadow-xs">
              <h3 className="text-xl font-black text-gray-900">Farmer Access Required</h3>
              <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto">
                Please log in with your verified farmer credentials to access the Farmer Command Center.
              </p>
              <button
                onClick={() => handleOpenAuth('ROLE_FARMER')}
                className="mt-5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
              >
                Farmer Login
              </button>
            </div>
          )
        )}

        {/* AGENT DASHBOARD — Strictly Protected (Only ROLE_AGENT) */}
        {activeTab === 'agent' && (
          currentRole === 'ROLE_AGENT' ? (
            <AgentDashboard />
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8 shadow-xs">
              <h3 className="text-xl font-black text-gray-900">Verification Agent Access Required</h3>
              <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto">
                Authorized field verification agents only. Please log in with your agent badge ID and access key.
              </p>
              <button
                onClick={() => handleOpenAuth('ROLE_AGENT')}
                className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
              >
                Agent Login
              </button>
            </div>
          )
        )}
      </main>

      {/* Slide-over Shopping Cart */}
      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onCheckoutComplete={handleCheckoutComplete}
      />

      {/* Authentication Modal with Dedicated Farmer & Agent Logins */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRole={authRoleHint}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500">
          <p className="font-semibold text-gray-700">
            Smart Farmer Marketplace — Eliminating Middlemen, Empowering Genuine Growers.
          </p>
          <p className="mt-1">
            Agent-driven physical verification • Machine learning price forecasting • Direct Telangana & Karnataka farm trade.
          </p>
        </div>
      </footer>

    </div>
  );
}
