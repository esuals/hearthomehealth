import React from 'react';
import { ActiveTab } from '../types';
import { 
  Home, 
  CalendarCheck, 
  Ambulance, 
  Stethoscope, 
  Pill, 
  Headphones,
  Compass 
} from 'lucide-react';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  hasActiveEmergency: boolean;
  unreadSupportCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  hasActiveEmergency,
  unreadSupportCount = 1,
}) => {
  return (
    <nav 
      aria-label="Mobile Navigation" 
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg md:hidden"
    >
      <div className="grid grid-cols-6 items-center h-16 max-w-md mx-auto px-1">
        {/* Tab 1: Home/Overview */}
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors cursor-pointer ${
            activeTab === 'overview' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'overview' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Home</span>
        </button>

        {/* Tab 2: Scheduled Checks */}
        <button
          onClick={() => setActiveTab('checks')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors cursor-pointer ${
            activeTab === 'checks' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarCheck className={`w-5 h-5 ${activeTab === 'checks' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Checks</span>
        </button>

        {/* Tab 3: Emergency SOS */}
        <button
          onClick={() => setActiveTab('emergency')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors cursor-pointer ${
            hasActiveEmergency || activeTab === 'emergency' ? 'text-red-600' : 'text-slate-500 hover:text-red-500'
          }`}
        >
          <div className={`relative ${hasActiveEmergency ? 'animate-bounce' : ''}`}>
            <Ambulance className={`w-5 h-5 ${hasActiveEmergency || activeTab === 'emergency' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            {hasActiveEmergency && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full" />
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-1">SOS</span>
        </button>

        {/* Tab 4: Tele-Diagnostics & Consultations */}
        <button
          onClick={() => setActiveTab('telediag')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors cursor-pointer ${
            activeTab === 'telediag' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Stethoscope className={`w-5 h-5 ${activeTab === 'telediag' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Consult</span>
        </button>

        {/* Tab 5: Google Maps Facility Locator */}
        <button
          onClick={() => setActiveTab('facilities')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors cursor-pointer ${
            activeTab === 'facilities' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className={`w-5 h-5 ${activeTab === 'facilities' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Clinics</span>
        </button>

        {/* Tab 6: Care Concierge Support */}
        <button
          onClick={() => setActiveTab('support')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors cursor-pointer ${
            activeTab === 'support' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Headphones className={`w-5 h-5 ${activeTab === 'support' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            {unreadSupportCount > 0 && activeTab !== 'support' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-600 rounded-full" />
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-1">Care</span>
        </button>
      </div>
    </nav>
  );
};
