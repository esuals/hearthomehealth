import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  isMobileDeviceFrame: boolean;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  isMobileDeviceFrame,
  children,
}) => {
  if (!isMobileDeviceFrame) {
    // Multi-column responsive layout
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {children}
      </main>
    );
  }

  // Simulated Mobile Phone Viewport Frame
  return (
    <div className="py-8 px-4 flex justify-center items-center bg-slate-900/10 min-h-[calc(100vh-64px)]">
      <div className="w-full max-w-[410px] bg-white rounded-[44px] shadow-2xl border-[10px] border-slate-900 overflow-hidden relative flex flex-col min-h-[820px] max-h-[880px]">
        {/* Mobile Device Status Bar */}
        <div className="h-10 bg-slate-900 text-white px-7 flex items-center justify-between text-xs font-semibold shrink-0 select-none">
          <span>9:41</span>
          {/* Dynamic Island pill */}
          <div className="w-20 h-4 bg-black rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Mobile Screen Viewport (Scrollable body) */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 bg-slate-50">
          {children}
        </div>

        {/* Mobile Home Indicator bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900/40 rounded-full pointer-events-none z-50" />
      </div>
    </div>
  );
};
