import React, { ReactNode } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: ReactNode;
  title?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, title }) => {
  return (
    <div className="mx-auto max-w-[420px] w-full min-h-[780px] bg-[#F8F7F4] rounded-[44px] shadow-[0_25px_60px_-15px_rgba(41,42,48,0.2),0_0_0_10px_#292A30,0_0_0_12px_#D6D8DC] overflow-hidden flex flex-col relative border border-[#ECEDEF]">
      {/* Smartphone Status Bar */}
      <div className="sticky top-0 z-30 bg-[#F8F7F4]/90 backdrop-blur-md px-6 pt-3 pb-2 flex items-center justify-between text-xs font-semibold text-[#292A30]">
        <span>11:04</span>

        {/* Dynamic Island / Speaker Pill */}
        <div className="w-24 h-4 bg-[#292A30] rounded-full mx-auto" />

        <div className="flex items-center gap-1.5 text-[#292A30]">
          <Signal className="w-3 h-3" />
          <Wifi className="w-3 h-3" />
          <BatteryMedium className="w-4 h-4" />
        </div>
      </div>

      {/* Screen Inner Content */}
      <div className="flex-1 px-4 pt-2 pb-6 overflow-y-auto">
        {children}
      </div>

      {/* iOS-style Home Indicator Bar */}
      <div className="sticky bottom-1 left-0 right-0 py-1.5 flex justify-center pointer-events-none z-30">
        <div className="w-32 h-1 bg-[#292A30]/30 rounded-full" />
      </div>
    </div>
  );
};
