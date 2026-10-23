import React, { useState } from 'react';
import { 
  ActiveTab, 
  UserMembership, 
  ScheduledCheck, 
  AmbulanceDispatchState, 
  MedicationOrder,
  BookedConsultation 
} from '../types';
import { 
  Shield, 
  CalendarCheck, 
  Ambulance, 
  Stethoscope, 
  Pill, 
  QrCode, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  ChevronRight,
  HeartPulse,
  Activity,
  MapPin,
  Car,
  Compass,
  CreditCard,
  X,
  FileText,
  Scale,
  Headphones,
  LayoutGrid
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface DashboardOverviewProps {
  user: UserMembership;
  upcomingCheck?: ScheduledCheck;
  upcomingConsultation?: BookedConsultation;
  ambulanceState: AmbulanceDispatchState;
  activeOrder?: MedicationOrder;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenPlans: () => void;
  onOpenBookModal: () => void;
  onOpenPayment?: () => void;
  onOpenAuth?: () => void;
  onOpenTerms?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  user,
  upcomingCheck,
  upcomingConsultation,
  ambulanceState,
  activeOrder,
  setActiveTab,
  onOpenPlans,
  onOpenBookModal,
  onOpenPayment,
  onOpenAuth,
  onOpenTerms,
}) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const [buttonLayout, setButtonLayout] = useState<'6-grid' | '8-grid'>('6-grid');

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Emergency Active Banner (if dispatched) */}
      {ambulanceState.isActive && (
        <div 
          onClick={() => {
            soundFx.playChime('alert');
            setActiveTab('emergency');
          }}
          className="bg-red-600 text-white p-3.5 sm:p-4 rounded-2xl shadow-lg shadow-red-500/20 cursor-pointer hover:bg-red-700 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center animate-pulse">
              <Ambulance className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-red-600 px-2 py-0.5 rounded">
                  Ambulance Dispatched
                </span>
                <span className="text-xs text-red-100 font-mono">
                  ETA: ~{ambulanceState.etaMinutes} mins
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold mt-0.5">
                {ambulanceState.unitName} is responding to your address
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold bg-white/20 px-2.5 py-1.5 rounded-lg">
            <span>Live Console</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}

      {/* Hero Membership Card - Compact Viewport-Optimized */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-4 sm:p-6 shadow-xl border border-slate-800">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-3.5 sm:pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-emerald-400" />
                Annual Healthcare · 🇳🇬 Imo State Pilot
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-[11px] font-mono text-slate-400">ID: {user.memberId}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{user.memberName}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
              <span className="text-emerald-300 font-semibold">{user.planName} (₦{user.annualFeeNaira?.toLocaleString() || '120,000'}/yr)</span>
              <span>·</span>
              <span>{user.community || 'Enyiogugu'}, {user.lga || 'Aboh Mbaise LGA'}</span>
              <span>·</span>
              <span className="text-emerald-400 font-medium">Protected 24/7</span>
            </p>
          </div>

          {/* Quick Actions & Membership QR */}
          <div className="flex flex-wrap items-center gap-2">
            {onOpenPayment && (
              <button
                onClick={() => {
                  soundFx.playChime('pop');
                  onOpenPayment();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 cursor-pointer active:scale-95"
                title="Pay via USSD, Bank Transfer or POS Voucher"
              >
                <span>₦ Pay / Renew</span>
              </button>
            )}
            <button
              onClick={() => {
                soundFx.playChime('pop');
                setShowQrModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer active:scale-95"
              title="Show Medical ID & Verification QR"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-300" />
              <span>Digital Pass</span>
            </button>
            <button
              onClick={() => {
                soundFx.playChime('pop');
                onOpenPlans();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors border border-slate-700 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Tiers</span>
            </button>
          </div>
        </div>

        {/* Annual Benefits Progress & Allowances - Space-Optimized Grid */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3.5">
          <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Annual Checks</span>
              <span className="font-semibold text-white">{user.checkupsRemaining} of {user.checkupsTotal} Left</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full" 
                style={{ width: `${(user.checkupsRemaining / user.checkupsTotal) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <CalendarCheck className="w-3 h-3 text-emerald-400" />
              Nurse In-Home Visit
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Ambulance Dispatches</span>
              <span className="font-semibold text-emerald-400">
                {(user.emergencyRidesRemaining ?? 3)} of {(user.emergencyRidesTotal ?? 3)} Left
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full" 
                style={{ width: `${Math.min(100, Math.max(0, ((user.emergencyRidesRemaining ?? 3) / (user.emergencyRidesTotal ?? 3)) * 100))}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Ambulance className="w-3 h-3 text-emerald-400" />
              4x4 Rural Unit · ₦0 Copay
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Doctor Consults</span>
              <span className={`font-semibold ${user.consultationsRemaining > 0 ? 'text-white' : 'text-amber-400 font-bold'}`}>
                {user.consultationsRemaining} of {user.consultationsTotal} Left
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1.5 overflow-hidden">
              <div 
                className={`h-1.5 rounded-full ${user.consultationsRemaining > 0 ? 'bg-indigo-400' : 'bg-red-500'}`} 
                style={{ width: `${(user.consultationsRemaining / user.consultationsTotal) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Stethoscope className="w-3 h-3 text-indigo-400" />
              MD & Shuttle Transport
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Drug Deliveries</span>
              <span className="font-semibold text-white">
                {(user.rxDeliveriesRemaining ?? 5)} of {(user.rxDeliveriesTotal ?? 6)} Left
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1.5 overflow-hidden">
              <div 
                className="bg-cyan-400 h-1.5 rounded-full" 
                style={{ width: `${Math.min(100, Math.max(0, ((user.rxDeliveriesRemaining ?? 5) / (user.rxDeliveriesTotal ?? 6)) * 100))}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Pill className="w-3 h-3 text-cyan-400" />
              Express Bike Courier
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons Section - Symmetrically Divided to Equally Occupy Two Rows */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
              Primary Healthcare Actions
            </h2>
            <span className="hidden md:inline-block text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              Balanced 2-Row Layout
            </span>
          </div>

          {/* Toggle between 6-action (3 per row) and 8-action (4 per row) */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] sm:text-xs font-semibold text-slate-600 border border-slate-200">
            <button
              onClick={() => {
                soundFx.playChime('pop');
                setButtonLayout('6-grid');
              }}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                buttonLayout === '6-grid'
                  ? 'bg-white text-slate-950 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
              title="Equally divide into 2 rows of 3 buttons (6 Core Services)"
            >
              3 × 2 Grid
            </button>
            <button
              onClick={() => {
                soundFx.playChime('pop');
                setButtonLayout('8-grid');
              }}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                buttonLayout === '8-grid'
                  ? 'bg-white text-slate-950 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
              title="Equally divide into 2 rows of 4 buttons (8 Full Actions)"
            >
              4 × 2 Grid
            </button>
          </div>
        </div>

        {/* 6-BUTTON LAYOUT: Exactly 3 buttons in Row 1, 3 buttons in Row 2 */}
        {buttonLayout === '6-grid' && (
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {/* ROW 1: BUTTON 1 */}
            <button
              onClick={() => {
                soundFx.playChime('pop');
                setActiveTab('checks');
              }}
              className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 hover:shadow-xs transition-all group cursor-pointer active:scale-[0.98] min-h-[70px] sm:min-h-[72px]"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight truncate">
                  Annual Checkup
                </span>
                <span className="hidden sm:inline-block text-[11px] text-slate-500 font-medium truncate">
                  {user.checkupsRemaining} of {user.checkupsTotal} Left
                </span>
                <span className="sm:hidden text-[10px] text-emerald-700 font-semibold block">
                  {user.checkupsRemaining} Left
                </span>
              </div>
            </button>

            {/* ROW 1: BUTTON 2 (Emergency SOS - Priority Highlight) */}
            <button
              onClick={() => {
                soundFx.playChime('alert');
                setActiveTab('emergency');
              }}
              className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border border-red-200 bg-red-50/40 hover:border-red-400 hover:bg-red-50/70 hover:shadow-xs transition-all group cursor-pointer active:scale-[0.98] min-h-[70px] sm:min-h-[72px]"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                <Ambulance className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs sm:text-sm font-bold text-red-700 group-hover:text-red-800 transition-colors leading-tight truncate">
                  Emergency SOS
                </span>
                <span className="hidden sm:inline-block text-[11px] text-red-600 font-semibold truncate">
                  Priority 4x4 & Keke
                </span>
                <span className="sm:hidden text-[10px] text-red-600 font-bold block">
                  Instant SOS
                </span>
              </div>
            </button>

            {/* ROW 1: BUTTON 3 */}
            <button
              onClick={() => {
                soundFx.playChime('pop');
                onOpenBookModal();
              }}
              className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 hover:shadow-xs transition-all group cursor-pointer active:scale-[0.98] min-h-[70px] sm:min-h-[72px]"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight truncate">
                  Doctor Consult
                </span>
                <span className="hidden sm:inline-block text-[11px] text-slate-500 font-medium truncate">
                  {user.consultationsRemaining} of {user.consultationsTotal} Left
                </span>
                <span className="sm:hidden text-[10px] text-indigo-600 font-semibold block">
                  {user.consultationsRemaining} Left
                </span>
              </div>
            </button>

            {/* ROW 2: BUTTON 4 */}
            <button
              onClick={() => {
                soundFx.playChime('pop');
                setActiveTab('facilities');
              }}
              className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 hover:shadow-xs transition-all group cursor-pointer active:scale-[0.98] min-h-[70px] sm:min-h-[72px]"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Compass className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-tight truncate">
                  PHCs & Clinics
                </span>
                <span className="hidden sm:inline-block text-[11px] text-slate-500 font-medium truncate">
                  Google Maps Grounded
                </span>
                <span className="sm:hidden text-[10px] text-teal-700 font-semibold block">
                  Find Clinics
                </span>
              </div>
            </button>

            {/* ROW 2: BUTTON 5 */}
            <button
              onClick={() => {
                soundFx.playChime('pop');
                setActiveTab('pharmacy');
              }}
              className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/30 hover:shadow-xs transition-all group cursor-pointer active:scale-[0.98] min-h-[70px] sm:min-h-[72px]"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <Pill className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs sm:text-sm font-bold text-slate-900 group-hover:text-cyan-600 transition-colors leading-tight truncate">
                  Drug Delivery
                </span>
                <span className="hidden sm:inline-block text-[11px] text-slate-500 font-medium truncate">
                  Rural Bike Courier
                </span>
                <span className="sm:hidden text-[10px] text-cyan-700 font-semibold block">
                  Rx Delivery
                </span>
              </div>
            </button>

            {/* ROW 2: BUTTON 6 */}
            <button
              onClick={() => {
                soundFx.playChime('pop');
                setActiveTab('support');
              }}
              className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 hover:shadow-xs transition-all group cursor-pointer active:scale-[0.98] min-h-[70px] sm:min-h-[72px]"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors leading-tight truncate">
                  Care Concierge
                </span>
                <span className="hidden sm:inline-block text-[11px] text-slate-500 font-medium truncate">
                  24/7 Community Support
                </span>
                <span className="sm:hidden text-[10px] text-amber-700 font-semibold block">
                  24/7 Support
                </span>
              </div>
            </button>
          </div>
        )}

        {/* 8-BUTTON LAYOUT: Exactly 4 buttons in Row 1, 4 buttons in Row 2 */}
        {buttonLayout === '8-grid' && (
          <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
            {/* ROW 1: BUTTON 1 */}
            <button
              onClick={() => {
                soundFx.playChime('pop');
                setActiveTab('checks');
              }}
              className="flex flex-col items-center text-center gap-1.5 p-2 sm:p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 hover:shadow-xs transition-all group cursor-pointer active:scale-[0.98] min-h-[68px] sm:min-h-[72px]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0 w-full">
                <span className="block text-[11px] sm:text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight truncate">
                  Checkups
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  {user.checkupsRemaining} Left
                </span>
              </div>
            </button>

            {/* ROW 1: BUTTON 2 */}
            <button
              onClick={() => {
                soundFx.playChime('alert');
                setActiveTab('emergency');
              }}
              className="flex flex-col items-center text-center gap-1.5 p-2 sm:p-2.5 rounded-xl border border-red-200 bg-red-50/40 hover:border-red-400 hover:bg-red-50/70 hover:shadow-xs transition-all group cursor-pointer active:scale-[0.98] min-h-[68px] sm:min-h-[72px]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                <Ambulance className="w-4 h-4" />
              </div>
              <div className="min-w-0 w-full">
                <span className="block text-[11px] sm:text-xs font-bold text-red-700 group-hover:text-red-800 transition-colors leading-tight truncate">
                  Ambulance
                </span>
                <span className="text-[10px] text-red-600 font-bold block truncate">
                  Emergency
                </span>
              </div>
            </button>

            {/* ROW 1: BUTTON 3 */}
            <button
              onClick={() => {
                soundFx.playChime('pop');
                onOpenBookModal();
              }}
              className="flex flex-col items-center text-center gap-1.5 p-2 sm:p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 hover:shadow-xs transition-all group cursor-pointer active:scale-[0.98] min-h-[68px] sm:min-h-[72px]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div className="min-w-0 w-full">
                <span className="block text-[11px] sm:text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight truncate">
                  Doctor
                </span>
                <span className="text-[10px] text-indigo-600 block truncate">
                  Consultation
                </span>
              </div>
            </button>

            {/* ROW 1: BUTTON 4 */}
            <button
              onClick={() => {
                soundFx.playChime('pop');
                setActiveTab('pharmacy');
              }}
              className="flex flex-col items-center text-center gap-1.5 p-2 sm:p-2.5 rounded-xl border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/30 hover:shadow-xs transition-all group cursor-pointer active:scale-[0.98] min-h-[68px] sm:min-h-[72px]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <Pill className="w-4 h-4" />
              </div>
              <div className="min-w-0 w-full">
                <span className="block text-[11px] sm:text-xs font-bold text-slate-900 group-hover:text-cyan-600 transition-colors leading-tight truncate">
                  Pharmacy
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  Rx Delivery
                </span>
              </div>
            </button>

            {/* ROW 2: BUTTON 5 */}
            <button
              onClick={() => {
                soundFx.playChime('pop');
                setActiveTab('facilities');
              }}
              className="flex flex-col items-center text-center gap-1.5 p-2 sm:p-2.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 hover:shadow-xs transition-all group cursor-pointer active:scale-[0.98] min-h-[68px] sm:min-h-[72px]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Compass className="w-4 h-4" />
              </div>
              <div className="min-w-0 w-full">
                <span className="block text-[11px] sm:text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-tight truncate">
                  Clinics
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  Google Maps
                </span>
              </div>
            </button>

            {/* ROW 2: BUTTON 6 */}
            <button
              onClick={() => {
                soundFx.playChime('pop');
                setActiveTab('support');
              }}
              className="flex flex-col items-center text-center gap-1.5 p-2 sm:p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 hover:shadow-xs transition-all group cursor-pointer active:scale-[0.98] min-h-[68px] sm:min-h-[72px]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="min-w-0 w-full">
                <span className="block text-[11px] sm:text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors leading-tight truncate">
                  Care
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  24/7 Hotline
                </span>
              </div>
            </button>

            {/* ROW 2: BUTTON 7 */}
            <button
              onClick={() => {
                soundFx.playChime('pop');
                if (onOpenPayment) onOpenPayment();
              }}
              className="flex flex-col items-center text-center gap-1.5 p-2 sm:p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100 hover:shadow-xs transition-all group cursor-pointer active:scale-[0.98] min-h-[68px] sm:min-h-[72px]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:bg-emerald-700 transition-colors shadow-2xs">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="min-w-0 w-full">
                <span className="block text-[11px] sm:text-xs font-bold text-emerald-900 transition-colors leading-tight truncate">
                  Pay ₦
                </span>
                <span className="text-[10px] text-emerald-700 block truncate">
                  Renew / USSD
                </span>
              </div>
            </button>

            {/* ROW 2: BUTTON 8 */}
            <button
              onClick={() => {
                soundFx.playChime('pop');
                if (onOpenTerms) onOpenTerms();
                else setActiveTab('terms');
              }}
              className="flex flex-col items-center text-center gap-1.5 p-2 sm:p-2.5 rounded-xl border border-slate-200 hover:border-rose-400 hover:bg-rose-50/30 hover:shadow-xs transition-all group cursor-pointer active:scale-[0.98] min-h-[68px] sm:min-h-[72px]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0 w-full">
                <span className="block text-[11px] sm:text-xs font-bold text-slate-900 group-hover:text-rose-700 transition-colors leading-tight truncate">
                  Terms
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  Rights & NDPA
                </span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* 3-Column Section: Scheduled Checks, Doctor Consultations & Schedule Map, and Prescription Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Next Scheduled Healthcare Check */}
        {upcomingCheck ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Annual Screening
                </span>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {upcomingCheck.scheduledDate}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">
                {upcomingCheck.title}
              </h3>
              <p className="text-xs text-slate-600 mb-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{upcomingCheck.venue} · {upcomingCheck.scheduledTime}</span>
              </p>

              {upcomingCheck.nurseAssigned && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 mb-4">
                  <div className="font-semibold text-slate-900 mb-0.5">Assigned Clinician:</div>
                  <div className="truncate">{upcomingCheck.nurseAssigned}</div>
                </div>
              )}

              {upcomingCheck.fastingRequired && (
                <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60 mb-4">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-[11px]">
                    <span className="font-semibold">{upcomingCheck.fastingHours}hr Fasting:</span> Water permitted.
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500">100% Plan Covered</span>
              <button
                onClick={() => setActiveTab('checks')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Preparation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2 block">
                Annual Health Audit
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Schedule Checkup
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                You have {user.checkupsRemaining} checkups remaining in your annual plan.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('checks')}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Checkup</span>
            </button>
          </div>
        )}

        {/* Card 2: Upcoming Consultation & Schedule Map Route */}
        {upcomingConsultation ? (
          <div className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Doctor Appointment
                </span>
                <span className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-semibold">
                  {upcomingConsultation.scheduledDate}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">
                {upcomingConsultation.doctorName}
              </h3>
              <p className="text-xs text-slate-600 mb-3 truncate">
                {upcomingConsultation.doctorSpecialty}
              </p>

              {/* Transit & Pickup indicator */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5 mb-4">
                <div className="flex items-center justify-between font-semibold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    {upcomingConsultation.mode === 'clinic_with_shuttle_pickup' ? (
                      <Car className="w-3.5 h-3.5 text-indigo-600" />
                    ) : (
                      <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                    <span>
                      {upcomingConsultation.mode === 'clinic_with_shuttle_pickup'
                        ? 'Medical Shuttle Escort'
                        : upcomingConsultation.mode === 'in_home_physician'
                        ? 'In-Home Doctor Visit'
                        : 'Virtual Video Room'}
                    </span>
                  </span>
                  <span className="text-indigo-600 font-mono text-[11px]">
                    {upcomingConsultation.pickupDetails?.pickupTime ? `Pickup ${upcomingConsultation.pickupDetails.pickupTime}` : upcomingConsultation.scheduledTime}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  Route: {upcomingConsultation.scheduleMap.departurePoint.split('(')[0]} → {upcomingConsultation.scheduleMap.destinationPoint.split(',')[0]}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">
                {user.consultationsRemaining} quota left
              </span>
              <button
                onClick={() => setActiveTab('telediag')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View Schedule Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2 block">
                Doctor Consultations
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Book a Consultation
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                Schedule an in-home physician visit, medical shuttle transport, or HD tele-visit. {user.consultationsRemaining} of {user.consultationsTotal} remaining.
              </p>
            </div>
            <button
              onClick={onOpenBookModal}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Book Consultation</span>
            </button>
          </div>
        )}

        {/* Card 3: Live Active Prescription / Drug Delivery Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">
                Rx Delivery Tracking
              </span>
              {activeOrder && (
                <span className="text-xs font-mono text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded font-semibold">
                  ETA ~{activeOrder.etaMinutes} MINS
                </span>
              )}
            </div>

            {activeOrder ? (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {activeOrder.medicationName}
                </h3>
                <p className="text-xs text-slate-600 mb-3 font-mono truncate">
                  {activeOrder.dosage} · Rx #{activeOrder.id}
                </p>

                {/* Progress bar */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-medium text-slate-900 text-[11px] truncate">
                      {activeOrder.status === 'out_for_delivery' ? 'Courier En Route' : 'Pharmacist Packing'}
                    </span>
                    <span className="text-cyan-700 font-mono text-[11px]">
                      {activeOrder.temperatureCelsius}°C
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-cyan-500 h-2 rounded-full w-3/4 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    Assigned: {activeOrder.courierName}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  No Active Drug Deliveries
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Order chronic maintenance refills or emergency fast-track medications delivered in 45 minutes.
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <span className="text-xs text-slate-500">Free courier on plan</span>
            <button
              onClick={() => setActiveTab('pharmacy')}
              className="text-xs font-semibold text-cyan-600 hover:text-cyan-800 flex items-center gap-1"
            >
              <span>{activeOrder ? 'Track Courier' : 'Order Refill'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Domain Pillars Visual Showcase (anti-slop, authentic images) */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Your Annual Membership Inclusions
            </h2>
            <p className="text-xs text-slate-500">
              Four fully covered healthcare services included in your yearly subscription fee
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Scheduled Checks */}
          <div 
            onClick={() => setActiveTab('checks')}
            className="group cursor-pointer bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col"
          >
            <div className="h-36 overflow-hidden relative bg-slate-100">
              <img
                src="/src/assets/images/hero_health_membership_1792753772616.jpg"
                alt="Doctor reviewing scheduled health checkup diagnostics"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-slate-900 px-2 py-0.5 rounded-md">
                1. Scheduled Checks
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  Annual Preventive Wellness
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  Full blood biochemical screening, ECG, metabolic markers, and in-home nurse phlebotomy draws.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
                <span>View Lab Panels</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 2: Emergency & Ambulance */}
          <div 
            onClick={() => setActiveTab('emergency')}
            className="group cursor-pointer bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col"
          >
            <div className="h-36 overflow-hidden relative bg-slate-100">
              <img
                src="/src/assets/images/ambulance_emergency_dispatch_1792753772090.jpg"
                alt="Emergency advanced life support ambulance vehicle"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
                2. Emergency SOS
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">
                  ALS Ambulance Dispatch
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  Guaranteed emergency response with live GPS telemetry, paramedic briefing, and $0 copay.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-red-600 font-semibold">
                <span>Emergency Console</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 3: Tele-Diagnostics */}
          <div 
            onClick={() => setActiveTab('telediag')}
            className="group cursor-pointer bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col"
          >
            <div className="h-36 overflow-hidden relative bg-slate-100">
              <img
                src="/src/assets/images/tele_diagnostics_doctor_1792753773036.jpg"
                alt="Doctor performing tele-diagnostic video consultation"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-slate-900 px-2 py-0.5 rounded-md">
                3. Tele-Diagnostics
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                  Instant MD Video & Vitals
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  Optical heart rate capture, symptom assessment, digital stethoscope review, and immediate prescription generation.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold">
                <span>Start Tele-Visit</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 4: Drug & Medication Delivery */}
          <div 
            onClick={() => setActiveTab('pharmacy')}
            className="group cursor-pointer bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col"
          >
            <div className="h-36 overflow-hidden relative bg-slate-100">
              <img
                src="/src/assets/images/medication_delivery_courier_1792753773550.jpg"
                alt="Doorstep cold-chain medication prescription delivery"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-slate-900 px-2 py-0.5 rounded-md">
                4. Rx Courier
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-cyan-600 transition-colors">
                  Cold-Chain Drug Delivery
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  Scheduled monthly chronic prescription refills or rapid 45-minute emergency courier dispatch.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-cyan-600 font-semibold">
                <span>Pharmacy Tracker</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rights of Use, Medical Disclaimer & Clinical Governance Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-2xl p-5 text-white shadow-sm border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
            <Scale className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                Clinical Governance & Publishing Terms
              </span>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                NDPA 2023 Compliant
              </span>
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                Imo State Pilot
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-1">
              Rights of Use, Medical Disclaimer & Service Conditions
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
              Published in accordance with the National Health Act 2014, Nigeria Data Protection Act 2023, and Imo State Ministry of Health Clinical Pilot Guidelines.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenTerms || (() => setActiveTab('terms'))}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/30 shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Read Full Terms & Rights</span>
        </button>
      </div>

      {/* Digital Health Pass QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">❤️ Home Health Digital Healthpass</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Present this pass for instant admission at Heart Home Health partner emergency trauma centers and diagnostic facilities.
            </p>

            {/* Simulated QR Code SVG */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 inline-block mb-4">
              <svg className="w-44 h-44 mx-auto" viewBox="0 0 100 100" fill="currentColor">
                {/* QR matrix simulation */}
                <rect x="10" y="10" width="24" height="24" fill="#0f172a" rx="3" />
                <rect x="14" y="14" width="16" height="16" fill="#ffffff" rx="1" />
                <rect x="18" y="18" width="8" height="8" fill="#0f172a" />

                <rect x="66" y="10" width="24" height="24" fill="#0f172a" rx="3" />
                <rect x="70" y="14" width="16" height="16" fill="#ffffff" rx="1" />
                <rect x="74" y="18" width="8" height="8" fill="#0f172a" />

                <rect x="10" y="66" width="24" height="24" fill="#0f172a" rx="3" />
                <rect x="14" y="70" width="16" height="16" fill="#ffffff" rx="1" />
                <rect x="18" y="74" width="8" height="8" fill="#0f172a" />

                {/* Data dots */}
                <rect x="42" y="12" width="6" height="6" fill="#0f172a" />
                <rect x="52" y="12" width="6" height="6" fill="#0f172a" />
                <rect x="42" y="22" width="6" height="6" fill="#0f172a" />
                <rect x="52" y="28" width="6" height="6" fill="#0f172a" />

                <rect x="42" y="42" width="16" height="16" fill="#2563eb" rx="2" />
                <rect x="22" y="44" width="6" height="6" fill="#0f172a" />
                <rect x="30" y="52" width="6" height="6" fill="#0f172a" />
                <rect x="64" y="44" width="6" height="6" fill="#0f172a" />
                <rect x="72" y="52" width="6" height="6" fill="#0f172a" />
                <rect x="80" y="44" width="6" height="6" fill="#0f172a" />

                <rect x="42" y="66" width="6" height="6" fill="#0f172a" />
                <rect x="52" y="74" width="6" height="6" fill="#0f172a" />
                <rect x="62" y="66" width="6" height="6" fill="#0f172a" />
                <rect x="72" y="74" width="6" height="6" fill="#0f172a" />
                <rect x="80" y="82" width="6" height="6" fill="#0f172a" />
              </svg>
            </div>

            <div className="text-left text-xs space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Member:</span>
                <span className="font-semibold text-slate-900">{user.memberName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Blood Type:</span>
                <span className="font-semibold text-red-600">{user.bloodType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Emergency Contact:</span>
                <span className="font-semibold text-slate-900">{user.emergencyContact.name} ({user.emergencyContact.relation})</span>
              </div>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="mt-4 w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
