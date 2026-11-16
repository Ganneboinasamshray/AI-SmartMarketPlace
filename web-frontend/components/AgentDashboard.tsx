'use client';

import React, { useState } from 'react';
import { VerificationRequest } from '../lib/types';
import { INITIAL_VERIFICATIONS } from '../lib/api';
import { 
  ShieldCheck, 
  MapPin, 
  FileCheck, 
  AlertOctagon, 
  CheckCircle2, 
  XCircle, 
  Camera, 
  UserCheck, 
  Clock, 
  Eye, 
  FileText,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface AgentDashboardProps {
  onVerificationUpdate?: () => void;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>(INITIAL_VERIFICATIONS);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);

  // Verification Checklist State
  const [landRecordsCheck, setLandRecordsCheck] = useState(true);
  const [cropCultivationCheck, setCropCultivationCheck] = useState(true);
  const [identityProofCheck, setIdentityProofCheck] = useState(true);
  const [genuineFarmerCheck, setGenuineFarmerCheck] = useState(true);
  const [gpsCoordinates, setGpsCoordinates] = useState('17.3195, 78.5833');
  const [inspectorRemarks, setInspectorRemarks] = useState('');
  const [evidencePhoto, setEvidencePhoto] = useState('/evidence/farm_inspection.jpg');

  // Completed log state for audit
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      farmerName: 'V. Krishna Murthy',
      farmName: 'Murthy Natural Polyhouse Farms',
      decision: 'APPROVED',
      agent: 'Vikram Rathore (AGT-TS-042)',
      date: '2026-04-01',
      remarks: 'Physical inspection completed in Ibrahimpatnam. 7.5 acres active polyhouse capsicum/tomato verified. Dharani passbook authentic.'
    },
    {
      id: 2,
      farmerName: 'M. Suresh Goud',
      farmName: 'Goud Mandi Aggregators',
      decision: 'REJECTED',
      agent: 'Vikram Rathore (AGT-TS-042)',
      date: '2026-04-02',
      remarks: 'Middleman alert: No agricultural farmland exists. Location is a commercial storage godown near market yard.'
    }
  ]);

  const handleDecision = (decision: 'APPROVED' | 'REJECTED') => {
    if (!selectedRequest) return;
    if (!inspectorRemarks) {
      alert('Please enter formal inspection remarks before submitting.');
      return;
    }

    const updated = requests.map(r => 
      r.farmerId === selectedRequest.farmerId ? { ...r, status: decision } : r
    );
    setRequests(updated);

    // Append to audit log
    setAuditLogs([
      {
        id: auditLogs.length + 1,
        farmerName: selectedRequest.farmerName,
        farmName: selectedRequest.farmName,
        decision,
        agent: 'Vikram Rathore (AGT-TS-042)',
        date: new Date().toISOString().split('T')[0],
        remarks: inspectorRemarks
      },
      ...auditLogs
    ]);

    alert(
      decision === 'APPROVED'
        ? `Farmer ${selectedRequest.farmerName} APPROVED! Access to Marketplace unlocked.`
        : `Applicant ${selectedRequest.farmerName} REJECTED and flagged. Middleman access blocked.`
    );

    setSelectedRequest(null);
    setInspectorRemarks('');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Agent Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Field Agent Verification Portal</h1>
              <p className="text-xs text-gray-500">
                Logged in as <strong>Vikram Rathore (Badge: AGT-TS-042)</strong> • Assigned Region: Hyderabad & Telangana Zone
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 text-xs text-blue-800 font-semibold">
          <Clock className="w-4 h-4 text-blue-600" />
          Pending Verifications: {requests.filter(r => r.status === 'PENDING').length}
        </div>
      </div>

      {/* Main Grid: Pending Queue & Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Verification Queue (4 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
            <h3 className="text-base font-bold text-gray-900 mb-1">Assigned Inspection Queue</h3>
            <p className="text-xs text-gray-500 mb-4">
              Conduct on-site farm visits and cross-check revenue land records.
            </p>

            <div className="space-y-3">
              {requests.map((r) => (
                <div
                  key={r.farmerId}
                  onClick={() => {
                    setSelectedRequest(r);
                    if (r.farmerName.includes('Manoj')) {
                      // Pre-fill middleman scenario for demonstration
                      setLandRecordsCheck(false);
                      setCropCultivationCheck(false);
                      setGenuineFarmerCheck(false);
                      setInspectorRemarks('Applicant does not possess agricultural land. Location visited is a commercial trader storage godown. Suspected middleman broker.');
                    } else {
                      setLandRecordsCheck(true);
                      setCropCultivationCheck(true);
                      setGenuineFarmerCheck(true);
                      setInspectorRemarks('Physical inspection completed. Genuine cultivating farmer with active cauliflower crop.');
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedRequest?.farmerId === r.farmerId
                      ? 'border-blue-600 bg-blue-50/60 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{r.farmerName}</h4>
                      <p className="text-xs font-medium text-gray-600">{r.farmName}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      r.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      r.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {r.status}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {r.farmLocation}
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span>Land Size: <strong>{r.farmSizeAcres} Acres</strong></span>
                      <span>Crops: <strong>{r.primaryCrops}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Inspection Checklist (7 cols) */}
        <div className="lg:col-span-7">
          {selectedRequest ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
              
              <div className="border-b border-gray-100 pb-4 flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">On-Site Field Audit</span>
                  <h2 className="text-xl font-bold text-gray-900">{selectedRequest.farmerName} — {selectedRequest.farmName}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Phone: {selectedRequest.phoneNumber} • Location: {selectedRequest.farmLocation}</p>
                </div>
                <span className="text-xs text-gray-400">Reg: {selectedRequest.registeredAt}</span>
              </div>

              {/* Uploaded Documents Preview */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <span className="text-xs font-bold text-gray-700 block">Submitted Farmer Documents:</span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-2xs">
                    <FileText className="w-4 h-4 text-primary-600" />
                    <span>Land Ownership Deed (Patta / 7/12)</span>
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-2xs">
                    <FileCheck className="w-4 h-4 text-blue-600" />
                    <span>Kisan Credit Card (Verified)</span>
                  </div>
                </div>
              </div>

              {/* Physical Visit Verification Checklist */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                  Physical On-Site Verification Criteria:
                </span>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={landRecordsCheck}
                    onChange={(e) => setLandRecordsCheck(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-gray-900">Land Title & Revenue Record Cross-Check</span>
                    <p className="text-gray-500">Confirmed applicant is lawful cultivator or owner of declared acreage.</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={cropCultivationCheck}
                    onChange={(e) => setCropCultivationCheck(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-gray-900">Physical Crop Cultivation in Progress</span>
                    <p className="text-gray-500">Field visit confirms genuine agricultural standing crops, not a trader warehouse.</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={identityProofCheck}
                    onChange={(e) => setIdentityProofCheck(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-gray-900">Biometric / Aadhaar Verification</span>
                    <p className="text-gray-500">Identity matches land patta documentation and registered phone.</p>
                  </div>
                </label>

                {/* Middleman Detection Key Rule */}
                <label className="flex items-start gap-3 p-3 rounded-xl border border-emerald-300 bg-emerald-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={genuineFarmerCheck}
                    onChange={(e) => setGenuineFarmerCheck(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-emerald-900">Confirm Genuine Farmer (Middleman Exclusion Check)</span>
                    <p className="text-emerald-700">Applicant is not a commercial broker, commission agent (arhatia), or non-farming reseller.</p>
                  </div>
                </label>
              </div>

              {/* Inspector Remarks */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Official Verification Remarks & Evidence Log:
                </label>
                <textarea
                  rows={3}
                  value={inspectorRemarks}
                  onChange={(e) => setInspectorRemarks(e.target.value)}
                  placeholder="Record visit notes, surveyed parcel details, or specific reasons if rejected..."
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Decision Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleDecision('REJECTED')}
                  className="px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <AlertOctagon className="w-4 h-4 text-red-600" />
                  Reject / Flag Middleman
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision('APPROVED')}
                  disabled={!genuineFarmerCheck}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm ${
                    genuineFarmerCheck
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve Genuine Farmer
                </button>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-dashed border-gray-300 text-center">
              <ShieldCheck className="w-12 h-12 text-gray-300 mb-3" />
              <h4 className="text-sm font-bold text-gray-800">Select a Farmer from the Queue</h4>
              <p className="text-xs text-gray-500 max-w-sm mt-1">
                Click on any pending farmer registration on the left to review their land records, crop photos, and record inspection decisions.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Completed Verification Audit Trail */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Completed Verification History & Audit Trail</h3>
          <p className="text-xs text-gray-500">Immutable log of verified farmers and flagged middlemen</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Farmer / Farm</th>
                <th className="py-3 px-4">Decision</th>
                <th className="py-3 px-4">Inspection Date</th>
                <th className="py-3 px-4">Inspector</th>
                <th className="py-3 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/80 transition">
                  <td className="py-3 px-4 font-bold text-gray-900">
                    {log.farmerName}
                    <span className="block font-normal text-gray-500">{log.farmName}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.decision === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {log.decision}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{log.date}</td>
                  <td className="py-3 px-4 text-gray-600">{log.agent}</td>
                  <td className="py-3 px-4 text-gray-700 max-w-xs truncate" title={log.remarks}>
                    {log.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
