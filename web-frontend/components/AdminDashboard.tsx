'use client';

import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  Package, 
  UserPlus, 
  UserCheck, 
  AlertTriangle,
  Layers,
  FileSpreadsheet,
  CheckCircle,
  Clock
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [agents, setAgents] = useState([
    { id: 1, name: 'Vikram Rathore', badge: 'AGT-TS-042', region: 'Hyderabad & Telangana Zone', activeAssigned: 3, rating: 4.9 },
    { id: 2, name: 'K. Sridhar', badge: 'AGT-TS-089', region: 'Ranga Reddy Zone (Telangana)', activeAssigned: 1, rating: 4.8 },
    { id: 3, name: 'Karthik Rao', badge: 'AGT-KA-305', region: 'Kolar and Malur Zone (Karnataka)', activeAssigned: 2, rating: 4.9 }
  ]);

  const [pendingFarmers, setPendingFarmers] = useState([
    { id: 101, name: 'Suresh Yadav', farm: 'Yadav Family Farms', location: 'Shamirpet, Medchal, Telangana', crop: 'Cauliflower', assignedAgent: 'Vikram Rathore' },
    { id: 102, name: 'Jagdish Meena', farm: 'Meena Organic Orchard', location: 'Chevella, Ranga Reddy, Telangana', crop: 'Mango, Guava', assignedAgent: 'Unassigned' },
    { id: 103, name: 'Manoj Kumar (Flagged)', farm: 'Manoj Brokerage', location: 'Bowenpally Yard, Hyderabad', crop: 'Trader Reseller', assignedAgent: 'Vikram Rathore (Rejected)' }
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: 'Vegetables', count: 18, active: true },
    { id: 2, name: 'Fruits', count: 12, active: true },
    
    { id: 3, name: 'Leafy Greens', count: 6, active: true }
  ]);

  const [selectedAgentId, setSelectedAgentId] = useState<number>(1);
  const [selectedFarmerId, setSelectedFarmerId] = useState<number>(102);

  const handleAssignAgent = () => {
    const agent = agents.find(a => a.id === selectedAgentId);
    if (!agent) return;

    setPendingFarmers(farmers => farmers.map(f => 
      f.id === selectedFarmerId ? { ...f, assignedAgent: agent.name } : f
    ));

    alert(`Successfully assigned Agent ${agent.name} to farmer!`);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Admin Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administrator Governance Hub</h1>
          <p className="text-xs text-gray-500 mt-1">
            Global platform analytics, agent dispatching, middleman detection oversight & category controls.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200">
            System Status: Healthy & Synced
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Verified Farmers</span>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 mt-2">1,248</div>
          <div className="mt-1 text-xs text-emerald-600 font-semibold flex items-center">
            88.4% physical pass rate
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Middlemen Blocked</span>
            <div className="p-2 bg-red-100 text-red-700 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 mt-2">164</div>
          <div className="mt-1 text-xs text-red-600 font-semibold">
            100% prevented from listing
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Field Agents Active</span>
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 mt-2">42</div>
          <div className="mt-1 text-xs text-blue-600 font-semibold">
            Covering 6 wholesale zones
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Gross Direct GMV</span>
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 mt-2">₹48.6 Lakh</div>
          <div className="mt-1 text-xs text-amber-600 font-semibold">
            Zero commission taken
          </div>
        </div>

      </div>

      {/* Agent Assignment Engine */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-purple-600" />
          Field Verification Agent Assignment Engine
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Assign unverified farmer applications to certified field agents for physical farm visit.
        </p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-purple-50/50 p-4 rounded-xl border border-purple-100">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Select Pending Farmer:</label>
            <select
              value={selectedFarmerId}
              onChange={(e) => setSelectedFarmerId(Number(e.target.value))}
              className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none"
            >
              {pendingFarmers.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.crop} • {f.location})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Assign Certified Agent:</label>
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(Number(e.target.value))}
              className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none"
            >
              {agents.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.badge} • {a.region})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAssignAgent}
              className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
            >
              Dispatch Agent for Inspection
            </button>
          </div>
        </div>

        {/* Verification Tracking Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Farm Details</th>
                <th className="py-3 px-4">Primary Produce</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingFarmers.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50/80 transition">
                  <td className="py-3 px-4 font-bold text-gray-900">{f.name}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {f.farm} <span className="block text-[11px] text-gray-400">{f.location}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{f.crop}</td>
                  <td className="py-3 px-4 font-semibold text-purple-700">{f.assignedAgent}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      f.assignedAgent.includes('Rejected') ? 'bg-red-100 text-red-800' :
                      f.assignedAgent === 'Unassigned' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {f.assignedAgent.includes('Rejected') ? 'REJECTED' : f.assignedAgent === 'Unassigned' ? 'ACTION REQUIRED' : 'IN FIELD VISIT'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Produce Category Management */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-gray-700" />
              Agricultural Categories & Commodities
            </h3>
            <p className="text-xs text-gray-500">Configure marketplace catalog categories</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray-900">{c.name}</h4>
                <p className="text-xs text-gray-500">{c.count} Active Crops</p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
