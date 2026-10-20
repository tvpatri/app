import React from 'react';
import { useEmoti } from '../../context/EmotiContext';
import { CheckCircle2, Sparkles, Heart, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useEmoti();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'spark':
        return <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />;
      case 'pulse':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0 animate-bounce" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-600 shrink-0" />;
    }
  };

  const getBgStyle = () => {
    switch (toast.type) {
      case 'spark':
        return 'bg-white border-[#DCD5F5] text-[#292A30] shadow-lg shadow-purple-900/5';
      case 'pulse':
        return 'bg-white border-[#F5DFD3] text-[#292A30] shadow-lg shadow-rose-900/5';
      case 'success':
        return 'bg-white border-[#D9E8DE] text-[#292A30] shadow-lg shadow-emerald-900/5';
      default:
        return 'bg-white border-[#DCEAF4] text-[#292A30] shadow-lg shadow-blue-900/5';
    }
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] pointer-events-none transition-all duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-xs font-medium backdrop-blur-md ${getBgStyle()}`}
      >
        {getIcon()}
        <span className="leading-tight flex-1">{toast.message}</span>
      </div>
    </div>
  );
};
