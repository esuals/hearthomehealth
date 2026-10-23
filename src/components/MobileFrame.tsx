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
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-5 pb-20 md:pb-10">
        {children}
      </main>
    );
  }

  // Simulated Mobile Phone Viewport Frame
  return (
    <div className="py-2 sm:py-4 px-2 sm:px-4 flex justify-center items-center bg-slate-900/10 min-h-[calc(100vh-64px)]">
      <div className="w-full max-w-[414px] bg-white rounded-[36px] sm:rounded-[42px] shadow-2xl border-[7px] sm:border-[9px] border-slate-900 overflow-hidden relative flex flex-col h-[min(840px,calc(100vh-80px))] min-h-[580px]">
        {/* Mobile Device Status Bar */}
        <div className="h-9 sm:h-10 bg-slate-900 text-white px-6 sm:px-7 flex items-center justify-between text-xs font-semibold shrink-0 select-none">
          <span>9:41</span>
          {/* Dynamic Island pill */}
          <div className="w-18 sm:w-20 h-3.5 sm:h-4 bg-black rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Mobile Screen Viewport (Scrollable body) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 pb-20 bg-slate-50">
          {children}
        </div>

        {/* Mobile Home Indicator bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-1 bg-slate-900/40 rounded-full pointer-events-none z-50" />
      </div>
    </div>
  );
};
