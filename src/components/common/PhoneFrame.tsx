import React, { ReactNode } from 'react';
import { Wifi, BatteryMedium, Signal, Sparkles } from 'lucide-react';

interface PhoneFrameProps {
  children: ReactNode;
  title?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, title }) => {
  return (
    <div className="mx-auto max-w-[430px] w-full min-h-[820px] bg-[#FFF9F0] rounded-[48px] shadow-[0_25px_60px_-15px_rgba(40,36,58,0.25),0_0_0_12px_#28243A,0_0_0_16px_#FFD65A] overflow-hidden flex flex-col relative border-4 border-[#28243A]">
      {/* Smartphone Status Bar */}
      <div className="sticky top-0 z-30 bg-[#FFF9F0]/90 backdrop-blur-md px-7 pt-3.5 pb-2 flex items-center justify-between text-xs font-black text-[#28243A]">
        <div className="flex items-center gap-1.5">
          <span>11:04</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#72D6B1] inline-block animate-ping" />
        </div>

        {/* Dynamic Island Pill with glowing dot */}
        <div className="w-28 h-5 bg-[#28243A] rounded-full mx-auto flex items-center justify-between px-3 shadow-inner">
          <div className="w-2 h-2 rounded-full bg-[#FF80B5] animate-pulse" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#79B9F2]/40" />
        </div>

        <div className="flex items-center gap-2 text-[#28243A]">
          <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
          <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
          <BatteryMedium className="w-4 h-4 stroke-[2.5] text-[#1D6E50]" />
        </div>
      </div>

      {/* Screen Inner Content with warm cream background */}
      <div className="flex-1 px-4 pt-2 pb-8 overflow-y-auto">
        {children}
      </div>

      {/* Home Indicator Bar with cheerful colorful pill */}
      <div className="sticky bottom-1.5 left-0 right-0 py-2 flex justify-center pointer-events-none z-30">
        <div className="w-32 h-1.5 bg-[#28243A]/30 rounded-full" />
      </div>
    </div>
  );
};
