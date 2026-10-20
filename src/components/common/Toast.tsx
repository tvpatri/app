import React from 'react';
import { useEmoti } from '../../context/EmotiContext';
import { CheckCircle2, Sparkles, Heart, Info, Zap } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useEmoti();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'spark':
        return <Zap className="w-5 h-5 text-[#946200] fill-[#FFD65A] shrink-0 animate-bounce" />;
      case 'pulse':
        return <Heart className="w-5 h-5 text-[#FF80B5] fill-[#FF80B5] shrink-0 animate-ping" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-[#1D6E50] shrink-0" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#FF936F] shrink-0" />;
    }
  };

  const getBgStyle = () => {
    switch (toast.type) {
      case 'spark':
        return 'bg-[#FFF9F0] border-2 border-[#FFD65A] text-[#28243A] shadow-[0_10px_25px_-5px_rgba(255,214,90,0.5)]';
      case 'pulse':
        return 'bg-[#FFF9F0] border-2 border-[#FF80B5] text-[#28243A] shadow-[0_10px_25px_-5px_rgba(255,128,181,0.5)]';
      case 'success':
        return 'bg-[#FFF9F0] border-2 border-[#72D6B1] text-[#28243A] shadow-[0_10px_25px_-5px_rgba(114,214,177,0.5)]';
      default:
        return 'bg-[#FFF9F0] border-2 border-[#79B9F2] text-[#28243A] shadow-[0_10px_25px_-5px_rgba(121,185,242,0.5)]';
    }
  };

  return (
    <div className="fixed bottom-22 sm:bottom-16 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] pointer-events-none transition-all duration-300 animate-pop-in">
      <div
        className={`flex items-center gap-3 px-4.5 py-3.5 rounded-2xl border-2 text-xs font-black backdrop-blur-md ${getBgStyle()}`}
      >
        {getIcon()}
        <span className="leading-tight flex-1">{toast.message}</span>
      </div>
    </div>
  );
};
