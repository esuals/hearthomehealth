import React, { useState, useEffect } from 'react';
import { MedicationOrder, UserMembership } from '../types';
import { 
  Pill, 
  Truck, 
  MapPin, 
  Clock, 
  Thermometer, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight,
  Package,
  Calendar,
  X
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface MedicationDeliveryProps {
  orders: MedicationOrder[];
  user: UserMembership;
  onRequestRefill: (order: MedicationOrder) => void;
}

export const MedicationDelivery: React.FC<MedicationDeliveryProps> = ({
  orders,
  user,
  onRequestRefill,
}) => {
  const [activeOrders, setActiveOrders] = useState<MedicationOrder[]>(orders);
  const [selectedOrder, setSelectedOrder] = useState<MedicationOrder | null>(
    orders.find((o) => o.status === 'out_for_delivery') || orders[0] || null
  );
  const [isRefillModalOpen, setIsRefillModalOpen] = useState(false);
  const [refillSpeed, setRefillSpeed] = useState<'express' | 'standard'>('express');
  const [selectedMedToRefill, setSelectedMedToRefill] = useState('Atorvastatin Calcium (20mg)');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync active orders when parent orders change
  useEffect(() => {
    setActiveOrders(orders);
    if (!selectedOrder && orders.length > 0) {
      setSelectedOrder(orders[0]);
    }
  }, [orders]);

  // Simulate courier delivery progress for active orders
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveOrders((prev) =>
        prev.map((ord) => {
          if (ord.status === 'out_for_delivery' && ord.etaMinutes > 1) {
            return { ...ord, etaMinutes: ord.etaMinutes - 1 };
          }
          if (ord.status === 'out_for_delivery' && ord.etaMinutes === 1) {
            return { ...ord, status: 'delivered', etaMinutes: 0 };
          }
          if (ord.status === 'packed') {
            return { ...ord, status: 'out_for_delivery', etaMinutes: 25 };
          }
          return ord;
        })
      );
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateRefillOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: MedicationOrder = {
      id: `rx_${Math.floor(1000 + Math.random() * 9000)}`,
      medicationName: selectedMedToRefill.split(' (')[0],
      dosage: selectedMedToRefill.includes('(') ? selectedMedToRefill.split('(')[1].replace(')', '') : 'Standard dosage',
      instructions: 'Take as directed on packaging label.',
      category: refillSpeed === 'express' ? 'Emergency Fast-Track' : 'Chronic Maintenance',
      status: 'out_for_delivery',
      prescribedBy: 'CarePlus Clinical Pharmacy',
      orderDate: 'Today, Just Now',
      etaMinutes: refillSpeed === 'express' ? 35 : 120,
      courierName: 'Eco-Express Mobile Courier Unit 28',
      temperatureCelsius: 18.2,
      daysSupply: 30,
      refillsRemaining: 2,
    };

    soundFx.playChime('success');
    onRequestRefill(newOrder);
    setSelectedOrder(newOrder);
    setIsRefillModalOpen(false);
    triggerToast(
      refillSpeed === 'express'
        ? 'Express 45-Min Courier Dispatched! Doorstep delivery active.'
        : 'Refill scheduled for next-morning delivery window.'
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">
              Yearly Membership Pharmacy Benefit
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">
              {(user.rxDeliveriesRemaining ?? 5)} of {(user.rxDeliveriesTotal ?? 6)} Deliveries Available
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Prescription & Medication Doorstep Delivery
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Cold-chain verified pharmaceutical courier service. Order scheduled chronic 90-day maintenance refills or 45-minute emergency fast-track prescription deliveries.
          </p>
        </div>

        <button
          onClick={() => setIsRefillModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-cyan-600/20 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Request Prescription Refill</span>
        </button>
      </div>

      {/* Live Active Delivery Tracker (if an order is out for delivery or packed) */}
      {selectedOrder && (
        <div className="bg-white rounded-2xl border border-cyan-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                    {selectedOrder.status === 'out_for_delivery' ? 'Out For Delivery' : selectedOrder.status === 'packed' ? 'Packed Cold-Chain' : 'Delivered'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Order #{selectedOrder.id}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedOrder.medicationName} ({selectedOrder.dosage})
                </h3>
              </div>
            </div>

            {selectedOrder.status !== 'delivered' && (
              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium">Estimated Doorstep Arrival</div>
                <div className="text-2xl font-extrabold text-cyan-600 font-mono tabular-nums">
                  ~{selectedOrder.etaMinutes} mins
                </div>
              </div>
            )}
          </div>

          {/* Delivery Map & Progression Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-5">
            {/* Delivery Timeline */}
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Fulfillment Timeline
              </div>

              <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                <div className="flex items-start gap-3 relative">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Prescription Verified</div>
                    <div className="text-[11px] text-slate-500">{selectedOrder.prescribedBy}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 relative">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Sealed in Insulated Tote</div>
                    <div className="text-[11px] text-slate-500">Tamper-proof medical seal verified</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 relative">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    selectedOrder.status === 'out_for_delivery' || selectedOrder.status === 'delivered'
                      ? 'bg-cyan-600 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Courier Dispatched</div>
                    <div className="text-[11px] text-slate-500">{selectedOrder.courierName}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 relative">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    selectedOrder.status === 'delivered'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Doorstep Delivery</div>
                    <div className="text-[11px] text-slate-500">{user.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Live Route Vector */}
            <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-5 text-white flex flex-col justify-between border border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <Truck className="w-4 h-4" />
                  Live Courier GPS Telemetry
                </span>
                <span className="flex items-center gap-1 font-mono text-emerald-400">
                  <Thermometer className="w-3.5 h-3.5" />
                  Cold-Chain: {selectedOrder.temperatureCelsius}°C Optimal
                </span>
              </div>

              {/* Progress Bar & Map Graphics */}
              <div className="py-6">
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" 
                    style={{ width: selectedOrder.status === 'delivered' ? '100%' : '75%' }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    Central Pharmacy Hub
                  </span>
                  <span className="font-mono text-cyan-300">
                    {selectedOrder.status === 'delivered' ? 'Arrived at Destination' : 'In Transit · 1.4 miles away'}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-white">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    Your Doorstep
                  </span>
                </div>
              </div>

              {/* Instructions on label */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 font-semibold">Prescription Instructions:</span>{' '}
                <span className="text-slate-200">{selectedOrder.instructions}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Prescription Cabinet */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Your Active Prescription Records & Refills
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeOrders.map((ord) => (
            <div
              key={ord.id}
              onClick={() => setSelectedOrder(ord)}
              className={`p-5 rounded-2xl bg-white border cursor-pointer transition-all ${
                selectedOrder?.id === ord.id
                  ? 'border-cyan-500 shadow-md ring-1 ring-cyan-500'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Pill className="w-4 h-4" />
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  ord.status === 'delivered'
                    ? 'bg-slate-100 text-slate-700'
                    : 'bg-cyan-50 text-cyan-700'
                }`}>
                  {ord.status === 'delivered' ? 'Delivered' : 'En Route'}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{ord.medicationName}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{ord.dosage}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Days Supply:</span>
                  <span className="font-semibold text-slate-900">{ord.daysSupply} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Refills Left:</span>
                  <span className="font-semibold text-cyan-600">{ord.refillsRemaining} refills</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMedToRefill(`${ord.medicationName} (${ord.dosage})`);
                  setIsRefillModalOpen(true);
                }}
                className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refill Medication</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Refill Request Modal */}
      {isRefillModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Request Prescription Refill Delivery
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Covered by your yearly subscription prescription delivery allowance
                </p>
              </div>
              <button
                onClick={() => setIsRefillModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRefillOrder} className="p-5 space-y-4">
              {/* Select Medication */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Select Medication
                </label>
                <select
                  value={selectedMedToRefill}
                  onChange={(e) => setSelectedMedToRefill(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                >
                  <option value="Atorvastatin Calcium (20mg)">Atorvastatin Calcium (20 mg · Oral Tablet)</option>
                  <option value="Albuterol Sulfate Inhaler (90mcg)">Albuterol Sulfate Inhaler (90 mcg / 200 Inhalations)</option>
                  <option value="Coenzyme Q10 + Omega-3 CardioPack (Softgel)">Coenzyme Q10 + Omega-3 CardioPack</option>
                  <option value="Azithromycin (250mg Z-Pak)">Azithromycin (250 mg · 5-Day Oral Z-Pack)</option>
                </select>
              </div>

              {/* Delivery Speed */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Courier Speed
                </label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setRefillSpeed('express')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      refillSpeed === 'express'
                        ? 'border-cyan-600 bg-cyan-50/50 text-cyan-950 font-semibold ring-1 ring-cyan-600'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-cyan-700 font-bold">
                      <Truck className="w-4 h-4" />
                      <span>45-Min Express Courier</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Urgent doorstep courier with cold-chain lock. $0 copay on your plan.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRefillSpeed('standard')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      refillSpeed === 'standard'
                        ? 'border-cyan-600 bg-cyan-50/50 text-cyan-950 font-semibold ring-1 ring-cyan-600'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                      <Calendar className="w-4 h-4" />
                      <span>Scheduled Next-Morning</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Standard batch delivery (08:00 AM - 11:00 AM window).
                    </div>
                  </button>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-semibold text-slate-900">Destination:</span> {user.address}
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRefillModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm shadow-cyan-600/20"
                >
                  Confirm Refill Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
