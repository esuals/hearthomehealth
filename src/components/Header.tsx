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
  Heart
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserMembership;
  isMobileDeviceFrame: boolean;
  setIsMobileDeviceFrame: (val: boolean) => void;
  hasActiveEmergency: boolean;
  onOpenPlans: () => void;
  onOpenThemes: () => void;
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
  currentThemeName,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setActiveTab('overview')} 
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:bg-rose-700 transition-colors">
                <Heart className="w-5 h-5 fill-white text-white" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors flex items-center gap-1.5 whitespace-nowrap">
                  <span>❤️</span>
                  <span>Home Health</span>
                </span>
                <span className="hidden sm:inline-block text-xs font-semibold text-rose-600 whitespace-nowrap">
                  Heart Home Health
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('overview')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'overview' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('checks')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'checks' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-slate-400" />
              Annual Checks
            </button>
            <button
              onClick={() => setActiveTab('emergency')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'emergency' ? 'text-red-600 font-semibold' : ''
              }`}
            >
              <Ambulance className={`w-4 h-4 ${hasActiveEmergency ? 'text-red-500' : 'text-slate-400'}`} />
              Emergency SOS
              {hasActiveEmergency && (
                <span className="text-[11px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded">
                  ACTIVE
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('telediag')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'telediag' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              <Stethoscope className="w-4 h-4 text-slate-400" />
              Consultations & Maps
            </button>
            <button
              onClick={() => setActiveTab('pharmacy')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'pharmacy' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              <Pill className="w-4 h-4 text-slate-400" />
              Rx Delivery
            </button>
          </nav>

          {/* Zone 3: 1 primary action & controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Viewport switch: Mobile Device Frame vs Full Responsive View */}
            <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs text-slate-600">
              <button
                onClick={() => setIsMobileDeviceFrame(false)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                  !isMobileDeviceFrame ? 'bg-white text-slate-900 shadow-xs font-medium' : 'hover:text-slate-900'
                }`}
                title="Expanded Multi-Column Desktop Dashboard"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setIsMobileDeviceFrame(true)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                  isMobileDeviceFrame ? 'bg-white text-slate-900 shadow-xs font-medium' : 'hover:text-slate-900'
                }`}
                title="Interactive Mobile Smartphone Preview"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>

            {/* Theme & Eye-Comfort Studio Button */}
            <button
              onClick={onOpenThemes}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 border border-slate-200"
              title="Eye-Comfort & Contrast Theme Studio"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden xl:inline">{currentThemeName}</span>
              <span className="xl:hidden">Theme</span>
            </button>

            <button
              onClick={onOpenPlans}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 border border-slate-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{user.planName}</span>
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-blue-600/20"
            >
              <Headphones className="w-4 h-4" />
              <span className="hidden sm:inline">24/7 Care Triage</span>
              <span className="sm:hidden">Care</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
