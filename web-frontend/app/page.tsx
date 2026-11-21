'use client';

import React, { useState, useEffect } from 'react';
import { User, UserRole, Product, CartItem, Order, AgentAuditRecord } from '../lib/types';
import { INITIAL_PRODUCTS, INITIAL_AUDIT_LOGS } from '../lib/api';
import { Navbar } from '../components/Navbar';
import { RoleLandingView } from '../components/RoleLandingView';
import { MarketplaceView } from '../components/MarketplaceView';
import { FarmerDashboard } from '../components/FarmerDashboard';
import { AgentDashboard } from '../components/AgentDashboard';
import { CartDrawer } from '../components/CartDrawer';
import { AuthModal } from '../components/AuthModal';

const STORAGE_KEYS = {
  PRODUCTS: 'smartfarmer_v3_products',
  AUDITS: 'smartfarmer_v3_audits',
  ORDERS: 'smartfarmer_v3_orders'
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 501,
    buyerName: 'Priya Sundaram (Consumer)',
    farmerName: 'K. Mallesh Goud',
    farmerPhone: '+91 98480 32110',
    totalAmount: 560.0,
    deliveryAddress: 'Plot 14, Madhapur, Hyderabad, Telangana',
    orderStatus: 'DELIVERED',
    paymentStatus: 'PAID',
    createdAt: '2026-04-01',
    items: [
      {
        productId: 1,
        cropName: 'Tomato',
        quantityKg: 20,
        unitPrice: 28.0,
        subtotal: 560.0
      }
    ]
  },
  {
    id: 502,
    buyerName: 'Srikanth Varma (Store)',
    farmerName: 'Anand Reddy',
    farmerPhone: '+91 98490 11223',
    totalAmount: 1150.0,
    deliveryAddress: 'Shop 8, Gachibowli Organic Store, Hyderabad, Telangana',
    orderStatus: 'DISPATCHED',
    paymentStatus: 'PENDING',
    createdAt: '2026-04-02',
    items: [
      {
        productId: 2,
        cropName: 'Capsicum (Bell Pepper)',
        quantityKg: 25,
        unitPrice: 46.0,
        subtotal: 1150.0
      }
    ]
  }
];

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [auditLogs, setAuditLogs] = useState<AgentAuditRecord[]>(INITIAL_AUDIT_LOGS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authRoleHint, setAuthRoleHint] = useState<UserRole | undefined>(undefined);

  // Hydrate persisted state from localStorage safely
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
      }
      const savedAudits = localStorage.getItem(STORAGE_KEYS.AUDITS);
      if (savedAudits) {
        const parsed = JSON.parse(savedAudits);
        if (Array.isArray(parsed)) setAuditLogs(parsed);
      }
      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) setOrders(parsed);
      }
    } catch (err) {
      console.warn('Could not load saved marketplace state:', err);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      localStorage.setItem(STORAGE_KEYS.AUDITS, JSON.stringify(auditLogs));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (err) {
      console.warn('Could not persist marketplace state:', err);
    }
  }, [products, auditLogs, orders, hydrated]);

  const handleOpenAuth = (roleHint?: UserRole) => {
    setAuthRoleHint(roleHint);
    setIsAuthOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    setCart([]);
    setIsCartOpen(false);
  };

  // 1. Farmer Action: Add Vegetable Listing (STRICTLY forces PENDING & agentApproved: false)
  const handleAddProduct = (newProd: Partial<Product>) => {
    if (!currentUser || currentUser.role !== 'ROLE_FARMER') return;

    const newId = Math.max(...products.map(p => p.id), 200) + 1;
    const fullProduct: Product = {
      id: newId,
      farmerId: currentUser.id,
      farmerName: currentUser.fullName,
      farmerPhone: currentUser.phoneNumber,
      farmerVerified: false,
      categoryName: newProd.categoryName || 'Vegetables',
      cropName: newProd.cropName || 'Vegetable',
      variety: newProd.variety || 'Local Desi',
      quantityKg: Number(newProd.quantityKg) || 100,
      minOrderKg: Number(newProd.minOrderKg) || 2,
      pricePerKg: Number(newProd.pricePerKg) || 30,
      unit: newProd.unit || 'kg',
      qualityGrade: newProd.qualityGrade || 'Grade A',
      harvestDate: newProd.harvestDate || new Date().toISOString().split('T')[0],
      shelfLifeDays: newProd.shelfLifeDays || 7,
      isOrganic: !!newProd.isOrganic,
      imageUrl: newProd.imageUrl || '/images/products/tomato.jpg',
      state: 'Telangana',
      district: newProd.district || currentUser.district || 'Hyderabad',
      mandal: newProd.mandal || currentUser.mandal || 'Urban',
      village: newProd.village || currentUser.village || 'Village',
      farmLocation:
        newProd.farmLocation ||
        `${newProd.village || 'Village'}, ${newProd.mandal || 'Mandal'}, ${newProd.district || 'Telangana'}, Telangana`,
      description: newProd.description,

      // STRICT WORKFLOW ENFORCEMENT: NEVER bypass agent verification
      status: 'PENDING',
      agentApproved: false,
      verifiedByAgent: undefined,
      verifiedAt: undefined,
      agentRemarks: undefined,

      predictedPrice: newProd.predictedPrice,
      recommendedMinPrice: newProd.recommendedMinPrice,
      recommendedMaxPrice: newProd.recommendedMaxPrice,
      mlConfidenceScore: newProd.mlConfidenceScore
    };

    setProducts(prev => [fullProduct, ...prev]);
  };

  // 2. Farmer Action: Edit & Resubmit (STRICTLY resets to PENDING & agentApproved: false)
  const handleUpdateProduct = (productId: number, updatedFields: Partial<Product>) => {
    if (!currentUser || currentUser.role !== 'ROLE_FARMER') return;

    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId && p.farmerId === currentUser.id) {
          return {
            ...p,
            ...updatedFields,
            status: 'PENDING',
            agentApproved: false,
            farmerVerified: false,
            verifiedByAgent: undefined,
            verifiedAt: undefined,
            agentRemarks: undefined
          };
        }
        return p;
      })
    );
  };

  // 3. Agent Action: Approve Listing (STRICTLY requires authenticated ROLE_AGENT with badgeId)
  const handleApproveProduct = (productId: number, remarks: string) => {
    if (!currentUser || currentUser.role !== 'ROLE_AGENT' || !currentUser.badgeId) {
      alert('Unauthorized: Only an authenticated Field Agent can approve produce listings.');
      return;
    }

    const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const target = products.find(p => p.id === productId);
    if (!target) return;

    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            status: 'APPROVED',
            agentApproved: true,
            farmerVerified: true,
            verifiedByAgent: `${currentUser.fullName} (${currentUser.badgeId})`,
            verifiedAt: new Date().toISOString().split('T')[0],
            agentRemarks: remarks
          };
        }
        return p;
      })
    );

    const newLog: AgentAuditRecord = {
      id: Date.now(),
      productId,
      cropName: target.cropName,
      farmerName: target.farmerName,
      district: target.district,
      action: 'APPROVED',
      agentName: currentUser.fullName,
      agentBadge: currentUser.badgeId,
      timestamp,
      remarks
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // 4. Agent Action: Reject Listing
  const handleRejectProduct = (productId: number, reason: string) => {
    if (!currentUser || currentUser.role !== 'ROLE_AGENT' || !currentUser.badgeId) return;

    const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const target = products.find(p => p.id === productId);
    if (!target) return;

    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            status: 'REJECTED',
            agentApproved: false,
            farmerVerified: false,
            verifiedByAgent: `${currentUser.fullName} (${currentUser.badgeId})`,
            verifiedAt: new Date().toISOString().split('T')[0],
            agentRemarks: reason
          };
        }
        return p;
      })
    );

    const newLog: AgentAuditRecord = {
      id: Date.now(),
      productId,
      cropName: target.cropName,
      farmerName: target.farmerName,
      district: target.district,
      action: 'REJECTED',
      agentName: currentUser.fullName,
      agentBadge: currentUser.badgeId,
      timestamp,
      remarks: reason
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // 5. Agent Action: Request Changes
  const handleRequestChanges = (productId: number, instructions: string) => {
    if (!currentUser || currentUser.role !== 'ROLE_AGENT' || !currentUser.badgeId) return;

    const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const target = products.find(p => p.id === productId);
    if (!target) return;

    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            status: 'REQUIRES_CHANGES',
            agentApproved: false,
            farmerVerified: false,
            verifiedByAgent: `${currentUser.fullName} (${currentUser.badgeId})`,
            verifiedAt: new Date().toISOString().split('T')[0],
            agentRemarks: instructions
          };
        }
        return p;
      })
    );

    const newLog: AgentAuditRecord = {
      id: Date.now(),
      productId,
      cropName: target.cropName,
      farmerName: target.farmerName,
      district: target.district,
      action: 'REQUIRES_CHANGES',
      agentName: currentUser.fullName,
      agentBadge: currentUser.badgeId,
      timestamp,
      remarks: instructions
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Buyer: Add to Cart (double-checks product is Agent-Approved)
  const handleAddToCart = (product: Product, quantityKg: number) => {
    if (product.status !== 'APPROVED' || !product.agentApproved) {
      alert('This listing has not been approved by a Field Agent yet.');
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantityKg: Math.min(product.quantityKg, i.quantityKg + quantityKg) }
            : i
        );
      }
      return [...prev, { product, quantityKg }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQty = (productId: number, qty: number) => {
    setCart(prev =>
      prev.map(i => {
        if (i.product.id === productId) {
          const validatedQty = Math.min(i.product.quantityKg, Math.max(i.product.minOrderKg || 2, qty));
          return { ...i, quantityKg: validatedQty };
        }
        return i;
      })
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const handleCheckoutComplete = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
  };

  const handleUpdateOrderStatus = (orderId: number, status: Order['orderStatus']) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, orderStatus: status } : o)));
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantityKg, 0);

  // STRICT BUYER CATALOG: Only Agent-Approved listings are ever passed to Buyer Marketplace
  const verifiedBuyerProducts = products.filter(
    p => p.status === 'APPROVED' && p.agentApproved === true && Boolean(p.verifiedByAgent)
  );

  // STRICT FARMER ISOLATION: Only show this logged-in farmer's own products and orders
  const currentFarmerProducts = currentUser
    ? products.filter(p => p.farmerId === currentUser.id)
    : [];

  const currentFarmerOrders = currentUser
    ? orders.filter(o => o.farmerName.toLowerCase() === currentUser.fullName.toLowerCase())
    : [];

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col font-sans text-slate-800 antialiased">
      {/* Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        currentRole={currentRole}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {!currentUser && (
          <RoleLandingView onSelectRole={(role) => handleOpenAuth(role)} />
        )}

        {currentUser && currentRole === 'ROLE_FARMER' && (
          <FarmerDashboard
            currentUser={currentUser}
            farmerProducts={currentFarmerProducts}
            orders={currentFarmerOrders}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {currentUser && currentRole === 'ROLE_AGENT' && (
          <AgentDashboard
            currentUser={currentUser}
            products={products}
            auditLogs={auditLogs}
            onApproveProduct={handleApproveProduct}
            onRejectProduct={handleRejectProduct}
            onRequestChanges={handleRequestChanges}
          />
        )}

        {currentUser && currentRole === 'ROLE_BUYER' && (
          <MarketplaceView
            products={verifiedBuyerProducts}
            onAddToCart={handleAddToCart}
          />
        )}
      </main>

      {/* Slide-over Shopping Cart (Buyers Only) */}
      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        currentUser={currentUser}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onCheckoutComplete={handleCheckoutComplete}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRole={authRoleHint}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-1.5">
          <p className="font-bold text-slate-800">
            AI-Enabled Smart Marketplace for Farmers with Intelligent Price Prediction and Direct Trading
          </p>
          <p>
            Field Agent Physical Land Audit • RandomForest Regressor Price Forecasting • Strictly Telangana 33 Districts • Zero Intermediaries
          </p>
          <p className="text-[11px] text-slate-400">
            Final-Year B.Tech Capstone Project • SR University
          </p>
        </div>
      </footer>
    </div>
  );
}
