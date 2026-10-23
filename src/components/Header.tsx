import React from 'react';
import { ActiveTab, UserMembership } from '../types';
import { 
  Shield, 
  Smartphone, 
  Monitor, 
  Ambulance, 
  CalendarCheck, 
  Stethoscope, 
  Pill, 
  Headphones,
  Sparkles,
  Palette,
  Heart,
  Compass,
  User,
  CreditCard,
  FileText
} from 'lucide-react';
import { auth } from '../firebase';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserMembership;
  isMobileDeviceFrame: boolean;
  setIsMobileDeviceFrame: (val: boolean) => void;
  hasActiveEmergency: boolean;
  onOpenPlans: () => void;
  onOpenThemes: () => void;
  onOpenAuth: () => void;
  onOpenPayment: () => void;
  onOpenTerms?: () => void;
  currentThemeName: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  isMobileDeviceFrame,
  setIsMobileDeviceFrame,
  hasActiveEmergency,
  onOpenPlans,
  onOpenThemes,
  onOpenAuth,
  onOpenPayment,
  onOpenTerms,
  currentThemeName,
}) => {
  const isFirebaseLoggedIn = !!auth.currentUser || !!user.uid;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setActiveTab('overview')} 
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:bg-rose-700 transition-colors">
                <Heart className="w-5 h-5 fill-white text-white" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors flex items-center gap-1.5 whitespace-nowrap">
                  <span>❤️</span>
                  <span>Home Health</span>
                </span>
                <span className="hidden sm:inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap">
                  🇳🇬 Imo State Pilot
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('overview')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'overview' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('checks')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'checks' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-slate-400" />
              Health Checks
            </button>
            <button
              onClick={() => setActiveTab('emergency')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'emergency' ? 'text-red-600 font-bold' : ''
              }`}
            >
              <Ambulance className={`w-4 h-4 ${hasActiveEmergency ? 'text-red-500' : 'text-slate-400'}`} />
              Emergency SOS
              {hasActiveEmergency && (
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded">
                  ACTIVE
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('telediag')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'telediag' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              <Stethoscope className="w-4 h-4 text-slate-400" />
              Consultations & Maps
            </button>
            <button
              onClick={() => setActiveTab('facilities')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'facilities' ? 'text-emerald-700 font-bold' : ''
              }`}
              title="Google Maps Grounded Rural Healthcare Centres"
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>PHCs & Maps</span>
            </button>
            <button
              onClick={() => setActiveTab('pharmacy')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pharmacy' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              <Pill className="w-4 h-4 text-slate-400" />
              Rx Delivery
            </button>
            <button
              onClick={onOpenTerms || (() => setActiveTab('terms'))}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'terms' ? 'text-rose-700 font-bold' : ''
              }`}
              title="Rights of Use, Medical Disclaimer & Terms"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Rights & Terms</span>
            </button>
          </nav>

          {/* Zone 3: Actions & Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Viewport switch: Mobile Device Frame vs Desktop */}
            <div className="hidden xl:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs text-slate-600">
              <button
                onClick={() => setIsMobileDeviceFrame(false)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  !isMobileDeviceFrame ? 'bg-white text-slate-900 shadow-xs font-medium' : 'hover:text-slate-900'
                }`}
                title="Expanded Multi-Column Desktop Dashboard"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setIsMobileDeviceFrame(true)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  isMobileDeviceFrame ? 'bg-white text-slate-900 shadow-xs font-medium' : 'hover:text-slate-900'
                }`}
                title="Interactive Mobile Smartphone Preview"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>

            {/* Theme & Contrast Studio */}
            <button
              onClick={onOpenThemes}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 border border-slate-200 cursor-pointer"
              title="Eye-Comfort & Contrast Theme Studio"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden 2xl:inline">{currentThemeName}</span>
            </button>

            {/* Nigerian Payment / Membership Upgrade Button */}
            <button
              onClick={onOpenPayment}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-300 shadow-xs cursor-pointer"
              title="Pay Annual Healthcare Subscription via USSD, Bank Transfer or POS Voucher"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
              <span>Pay ₦{user.annualFeeNaira?.toLocaleString() || '75,000'}</span>
            </button>

            {/* User Auth Profile Trigger */}
            <button
              onClick={onOpenAuth}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border cursor-pointer ${
                isFirebaseLoggedIn
                  ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                  : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
              }`}
              title="Sign In with Google or Edit Rural Nigerian Demographic Profile"
            >
              <User className="w-3.5 h-3.5" />
              <span className="max-w-[100px] truncate">
                {isFirebaseLoggedIn ? user.memberName.split(' ')[0] : 'Sign In'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
