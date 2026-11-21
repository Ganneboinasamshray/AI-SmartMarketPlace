'use client';

import React, { useState } from 'react';
import { Product, User, AgentAuditRecord } from '../lib/types';
import {
  ShieldCheck,
  MapPin,
  CheckCircle2,
  XCircle,
  UserCheck,
  Clock,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  History
} from 'lucide-react';

interface AgentDashboardProps {
  currentUser: User | null;
  products: Product[];
  auditLogs: AgentAuditRecord[];
  onApproveProduct: (productId: number, remarks: string) => void;
  onRejectProduct: (productId: number, reason: string) => void;
  onRequestChanges: (productId: number, instructions: string) => void;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({
  currentUser,
  products,
  auditLogs,
  onApproveProduct,
  onRejectProduct,
  onRequestChanges
}) => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'AUDIT_LOG' | 'PROFILE'>('PENDING');

  // All modal textareas start EMPTY (zero dummy pre-fill)
  const [approvingProduct, setApprovingProduct] = useState<Product | null>(null);
  const [approvalRemarks, setApprovalRemarks] = useState('');

  const [rejectingProduct, setRejectingProduct] = useState<Product | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const [changeReqProduct, setChangeReqProduct] = useState<Product | null>(null);
  const [changeInstructions, setChangeInstructions] = useState('');

  const pendingProducts = products.filter(p => p.status === 'PENDING');
  const approvedProducts = products.filter(p => p.status === 'APPROVED' && p.agentApproved);
  const rejectedProducts = products.filter(p => p.status === 'REJECTED');
  const changesProducts = products.filter(p => p.status === 'REQUIRES_CHANGES');

  const handleConfirmApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingProduct) return;
    if (!approvalRemarks.trim()) {
      alert('Please enter your physical verification / inspection remarks before approving.');
      return;
    }
    onApproveProduct(approvingProduct.id, approvalRemarks.trim());
    alert(
      `Listing for ${approvingProduct.cropName} by ${approvingProduct.farmerName} APPROVED!

It is now published on the Buyer Marketplace.`
    );
    setApprovingProduct(null);
    setApprovalRemarks('');
  };

  const handleConfirmRejection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingProduct) return;
    if (!rejectionReason.trim()) {
      alert('Please enter a specific reason for rejection.');
      return;
    }
    onRejectProduct(rejectingProduct.id, rejectionReason.trim());
    alert(
      `Listing for ${rejectingProduct.cropName} has been REJECTED.

It will remain hidden from buyers and the farmer has been notified.`
    );
    setRejectingProduct(null);
    setRejectionReason('');
  };

  const handleConfirmChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeReqProduct) return;
    if (!changeInstructions.trim()) {
      alert('Please specify the instructions or improvements required.');
      return;
    }
    onRequestChanges(changeReqProduct.id, changeInstructions.trim());
    alert(
      `Revision requested for ${changeReqProduct.cropName}.

Status changed to REQUIRES CHANGES. The farmer can now edit and resubmit.`
    );
    setChangeReqProduct(null);
    setChangeInstructions('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Agent Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-100 text-blue-800">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">Field Agent Verification Portal</h1>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                Authenticated Inspector
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Logged in as: <strong>{currentUser?.fullName} (Badge: {currentUser?.badgeId})</strong> • Jurisdiction:{' '}
              <strong>{currentUser?.district || 'Telangana State'} (Telangana)</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-2 rounded-2xl border border-amber-200 text-xs font-bold text-amber-800">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>{pendingProducts.length} Pending Review</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`p-4 rounded-2xl border text-left transition ${
            activeTab === 'PENDING'
              ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
              : 'bg-white text-slate-800 border-slate-200 hover:bg-amber-50/50'
          }`}
        >
          <div className="text-[11px] font-bold uppercase opacity-85">Pending Verifications</div>
          <div className="text-2xl font-black mt-1">{pendingProducts.length}</div>
          <span className="text-[10px] opacity-80 mt-1 block">Awaiting field inspection</span>
        </button>

        <button
          onClick={() => setActiveTab('APPROVED')}
          className={`p-4 rounded-2xl border text-left transition ${
            activeTab === 'APPROVED'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-slate-800 border-slate-200 hover:bg-emerald-50/50'
          }`}
        >
          <div className={`text-[11px] font-bold uppercase ${activeTab === 'APPROVED' ? 'text-white' : 'text-emerald-600'}`}>
            Approved Produce
          </div>
          <div className={`text-2xl font-black mt-1 ${activeTab === 'APPROVED' ? 'text-white' : 'text-emerald-600'}`}>
            {approvedProducts.length}
          </div>
          <span className={`text-[10px] mt-1 block ${activeTab === 'APPROVED' ? 'text-emerald-100' : 'text-emerald-700'}`}>
            Live in Buyer Marketplace
          </span>
        </button>

        <button
          onClick={() => setActiveTab('REJECTED')}
          className={`p-4 rounded-2xl border text-left transition ${
            activeTab === 'REJECTED'
              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
              : 'bg-white text-slate-800 border-slate-200 hover:bg-rose-50/50'
          }`}
        >
          <div className={`text-[11px] font-bold uppercase ${activeTab === 'REJECTED' ? 'text-white' : 'text-rose-600'}`}>
            Rejected / Flagged
          </div>
          <div className={`text-2xl font-black mt-1 ${activeTab === 'REJECTED' ? 'text-white' : 'text-rose-600'}`}>
            {rejectedProducts.length}
          </div>
          <span className={`text-[10px] mt-1 block ${activeTab === 'REJECTED' ? 'text-rose-100' : 'text-rose-700'}`}>
            Middlemen &amp; unverified
          </span>
        </button>

        <div className="p-4 rounded-2xl border bg-white text-slate-800 border-slate-200">
          <div className="text-[11px] font-bold uppercase text-blue-600">Changes Requested</div>
          <div className="text-2xl font-black mt-1 text-blue-600">{changesProducts.length}</div>
          <span className="text-[10px] text-blue-700 mt-1 block">Awaiting farmer resubmission</span>
        </div>
      </div>

      {/* Portal Sub-tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-xs overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'PENDING'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Submissions ({pendingProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('APPROVED')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'APPROVED'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Approved Produce ({approvedProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('REJECTED')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'REJECTED'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <XCircle className="w-4 h-4" />
          <span>Rejected / Flagged ({rejectedProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT_LOG')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'AUDIT_LOG'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Log &amp; History ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'PROFILE'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Agent Profile</span>
        </button>
      </div>

      {/* 1. PENDING SUBMISSIONS QUEUE */}
      {activeTab === 'PENDING' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Farmer Produce Awaiting Verification ({pendingProducts.length})
            </h3>
            <p className="text-xs text-slate-500">
              Review farmer details, Dharani land compliance, vegetable grade, and AI price comparison (INR ₹) before taking action.
            </p>
          </div>

          {pendingProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-base font-black text-slate-800">Verification Queue Cleared!</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                All vegetable submissions have been reviewed. New submissions from farmers will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingProducts.map((p) => {
                const priceDiff = p.predictedPrice
                  ? (((p.pricePerKg - p.predictedPrice) / p.predictedPrice) * 100).toFixed(1)
                  : '0';
                const isOverpriced = Number(priceDiff) > 20;

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/50">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            Submission ID #{p.id} • {p.categoryName}
                          </span>
                          <h4 className="text-lg font-black text-slate-900 mt-1">
                            {p.cropName} ({p.variety})
                          </h4>
                          <span className="text-xs text-slate-500">
                            Harvested: <strong>{p.harvestDate}</strong> • Quality: <strong>{p.qualityGrade}</strong>
                          </span>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white">
                          Pending Audit
                        </span>
                      </div>

                      <div className="p-5 space-y-4">
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 flex items-center gap-1.5">
                              <UserCheck className="w-4 h-4 text-emerald-600" />
                              {p.farmerName}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {p.farmerPhone}
                            </span>
                          </div>

                          <div className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                            <MapPin className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                            <span>{p.farmLocation}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 block">Farmer Asking Price</span>
                            <div className="text-lg font-black text-slate-900 mt-0.5">
                              ₹{p.pricePerKg}
                              <span className="text-xs font-semibold text-slate-500">/{p.unit || 'kg'}</span>
                            </div>
                            <span className="text-[10px] text-slate-500">Stock: {p.quantityKg} {p.unit || 'kg'}</span>
                          </div>

                          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
                            <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              AI Fair Benchmark
                            </span>
                            <div className="text-lg font-black text-emerald-900 mt-0.5">
                              ₹{p.predictedPrice || p.pricePerKg}/kg
                            </div>
                            <span className="text-[10px] text-emerald-700 font-semibold">
                              Range: ₹{p.recommendedMinPrice || p.pricePerKg} – ₹{p.recommendedMaxPrice || p.pricePerKg}
                            </span>
                          </div>
                        </div>

                        {isOverpriced && (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>
                              Farmer asking price is <strong>+{priceDiff}%</strong> higher than AI benchmark. You can request a price revision.
                            </span>
                          </div>
                        )}

                        {p.description && (
                          <div className="text-xs text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-100">
                            &quot;{p.description}&quot;
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-2">
                      <button
                        onClick={() => {
                          setApprovingProduct(p);
                          setApprovalRemarks('');
                        }}
                        className="w-full sm:flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => {
                          setChangeReqProduct(p);
                          setChangeInstructions('');
                        }}
                        className="w-full sm:flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Request Changes</span>
                      </button>

                      <button
                        onClick={() => {
                          setRejectingProduct(p);
                          setRejectionReason('');
                        }}
                        className="w-full sm:w-auto py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. APPROVED LISTINGS */}
      {activeTab === 'APPROVED' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Field Agent Approved Vegetables ({approvedProducts.length})
            </h3>
            <p className="text-xs text-slate-500">
              These produce items have passed field inspection and are currently live on the Buyer Marketplace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approvedProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{p.cropName} ({p.variety})</h4>
                    <span className="text-[11px] text-slate-500">Farmer: <strong>{p.farmerName}</strong></span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Live on Market
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span className="truncate">{p.farmLocation}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-1 border-t border-slate-100">
                    <span>Stock: {p.quantityKg} {p.unit || 'kg'}</span>
                    <span className="text-slate-900 font-bold">₹{p.pricePerKg}/{p.unit || 'kg'}</span>
                  </div>
                </div>

                <div className="text-[10px] text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-100 font-medium">
                  Verified by: {p.verifiedByAgent}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. REJECTED / FLAGGED LISTINGS */}
      {activeTab === 'REJECTED' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Rejected / Flagged Submissions ({rejectedProducts.length})
            </h3>
            <p className="text-xs text-slate-500">
              Submissions flagged as middlemen, suspicious land records, or failed quality audits. Hidden from buyers.
            </p>
          </div>

          <div className="space-y-3">
            {rejectedProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-rose-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">{p.cropName} • {p.variety}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                      REJECTED &amp; BLOCKED
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Farmer / Applicant: <strong>{p.farmerName}</strong> • Location: {p.farmLocation}
                  </p>
                  {p.agentRemarks && (
                    <div className="text-xs text-rose-800 bg-rose-50 p-2.5 rounded-xl border border-rose-100 mt-2 font-medium">
                      <strong>Rejection Cause:</strong> &quot;{p.agentRemarks}&quot;
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-400 font-semibold">Audited: {p.verifiedAt || 'Recent'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. VERIFICATION AUDIT LOG */}
      {activeTab === 'AUDIT_LOG' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black text-slate-900">Field Inspection Audit Trail</h3>
            <p className="text-xs text-slate-500">
              Immutable log of every field verification decision, physical farm check, and rejection.
            </p>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">{log.cropName}</span>
                    <span className="text-xs text-slate-500">by <strong>{log.farmerName}</strong> ({log.district}, Telangana)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      log.action === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      log.action === 'REJECTED' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                      'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {log.action}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">{log.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                  <strong>Officer Remarks ({log.agentName} - {log.agentBadge}):</strong> {log.remarks}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. AGENT PROFILE */}
      {activeTab === 'PROFILE' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black text-slate-900">Authorized Field Agent Credentials</h3>
            <p className="text-xs text-slate-500">Government Agriculture Field Agent Identification</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-semibold">Officer Name</span>
              <div className="font-bold text-slate-800 text-sm">{currentUser?.fullName}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-semibold">Badge Identification ID</span>
              <div className="font-bold text-blue-700 text-sm">{currentUser?.badgeId}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-semibold">Assigned District</span>
              <div className="font-bold text-slate-800 text-sm">{currentUser?.district || 'Telangana'}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-semibold">Verification Authority</span>
              <div className="font-bold text-emerald-800 text-sm">Level-1 Field Inspector</div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2 text-xs text-blue-900">
            <span className="font-bold block">Field Inspection Responsibilities:</span>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-blue-800">
              <li>Physical audit of Dharani passbooks and land boundaries.</li>
              <li>Quality grading check on standing crop harvest.</li>
              <li>Verification of farmer vs intermediary identity to block commercial traders.</li>
              <li>Cross-verification of asking price against AI mandi benchmark prices (INR ₹).</li>
            </ul>
          </div>
        </div>
      )}

      {/* MODAL: APPROVE CONFIRMATION */}
      {approvingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <h3 className="text-lg font-black text-slate-900">Approve Vegetable Listing</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Approve <strong>{approvingProduct.cropName}</strong> by <strong>{approvingProduct.farmerName}</strong>? Once approved, it will become visible on the Buyer Marketplace.
            </p>

            <form onSubmit={handleConfirmApproval} autoComplete="off" className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Inspection Remarks (Recorded in Audit Log) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={approvalRemarks}
                  onChange={(e) => setApprovalRemarks(e.target.value)}
                  placeholder="Enter your physical inspection findings and quality confirmation..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setApprovingProduct(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  Confirm &amp; Approve Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REQUEST CHANGES */}
      {changeReqProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-black text-slate-900">Request Revisions from Farmer</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Provide instructions to <strong>{changeReqProduct.farmerName}</strong> regarding what needs to be changed in their listing for <strong>{changeReqProduct.cropName}</strong>.
            </p>

            <form onSubmit={handleConfirmChanges} autoComplete="off" className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Specific Improvement Instructions *
                </label>
                <textarea
                  rows={4}
                  required
                  value={changeInstructions}
                  onChange={(e) => setChangeInstructions(e.target.value)}
                  placeholder="e.g. Please revise selling price closer to the AI market benchmark in ₹/kg..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setChangeReqProduct(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  Send Instructions to Farmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REJECT LISTING */}
      {rejectingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-6 h-6 text-rose-600" />
              <h3 className="text-lg font-black text-slate-900">Reject &amp; Flag Listing</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Rejecting <strong>{rejectingProduct.cropName}</strong> by <strong>{rejectingProduct.farmerName}</strong> will keep it hidden from buyers and notify the submitter.
            </p>

            <form onSubmit={handleConfirmRejection} autoComplete="off" className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Official Reason for Rejection *
                </label>
                <textarea
                  rows={4}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter the exact cause for rejection (e.g. unverified farmland, quality issue, suspected reseller)..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectingProduct(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
