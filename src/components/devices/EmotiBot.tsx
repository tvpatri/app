import React, { useState, useEffect } from 'react';
import { useEmoti } from '../../context/EmotiContext';
import { BotExpression } from '../../types';
import { 
  Sparkles, 
  Hand, 
  RefreshCw, 
  Heart, 
  Smile, 
  Frown, 
  HelpCircle, 
  ShieldCheck, 
  Volume2,
  Maximize2
} from 'lucide-react';

export const EmotiBot: React.FC = () => {
  const {
    botName,
    botExpression,
    setBotExpression,
    cycleBotExpression,
    botMessage,
    touchBot,
    isBotPetted,
    syncBotWithEmotion,
    enterFullscreenDevice,
    devices,
  } = useEmoti();

  const [isBlinking, setIsBlinking] = useState(false);

  // Blinking loop every 4-6 seconds
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4500);

    return () => clearInterval(blinkInterval);
  }, []);

  // Render SVG Robot Eyes based on expression and blinking
  const renderEyes = () => {
    const eyeColor = '#A3E8FF';
    const secondaryColor = '#80D0F5';

    if (isBlinking) {
      return (
        <div className="flex items-center justify-center gap-12 w-full h-full">
          <div className="w-14 h-1.5 bg-[#A3E8FF] rounded-full shadow-[0_0_12px_#A3E8FF]" />
          <div className="w-14 h-1.5 bg-[#A3E8FF] rounded-full shadow-[0_0_12px_#A3E8FF]" />
        </div>
      );
    }

    switch (botExpression) {
      case 'HAPPY':
        return (
          <div className="flex flex-col items-center justify-center w-full h-full gap-3">
            <div className="flex items-center justify-center gap-10">
              <svg className="w-16 h-14" viewBox="0 0 60 50">
                <path
                  d="M 10 35 Q 30 10 50 35"
                  fill="none"
                  stroke={eyeColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_8px_#A3E8FF]"
                />
                <circle cx="42" cy="18" r="3" fill="#FFF" />
              </svg>
              <svg className="w-16 h-14" viewBox="0 0 60 50">
                <path
                  d="M 10 35 Q 30 10 50 35"
                  fill="none"
                  stroke={eyeColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_8px_#A3E8FF]"
                />
                <circle cx="42" cy="18" r="3" fill="#FFF" />
              </svg>
            </div>
            <svg className="w-12 h-6" viewBox="0 0 40 20">
              <path
                d="M 10 8 Q 20 18 30 8"
                fill="none"
                stroke={secondaryColor}
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        );

      case 'CALM':
        return (
          <div className="flex flex-col items-center justify-center w-full h-full gap-3">
            <div className="flex items-center justify-center gap-10">
              <svg className="w-16 h-12" viewBox="0 0 60 40">
                <path
                  d="M 10 20 Q 30 32 50 20"
                  fill="none"
                  stroke={eyeColor}
                  strokeWidth="7"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_8px_#A3E8FF]"
                />
              </svg>
              <svg className="w-16 h-12" viewBox="0 0 60 40">
                <path
                  d="M 10 20 Q 30 32 50 20"
                  fill="none"
                  stroke={eyeColor}
                  strokeWidth="7"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_8px_#A3E8FF]"
                />
              </svg>
            </div>
            <div className="w-8 h-1 bg-[#80D0F5] rounded-full opacity-80" />
          </div>
        );

      case 'EXCITED':
        return (
          <div className="flex flex-col items-center justify-center w-full h-full gap-3">
            <div className="flex items-center justify-center gap-10">
              <div className="w-14 h-14 rounded-full border-6 border-[#A3E8FF] flex items-center justify-center shadow-[0_0_12px_#A3E8FF] relative animate-pulse">
                <div className="w-6 h-6 bg-white rounded-full shadow-[0_0_8px_#FFF]" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white" />
              </div>
              <div className="w-14 h-14 rounded-full border-6 border-[#A3E8FF] flex items-center justify-center shadow-[0_0_12px_#A3E8FF] relative animate-pulse">
                <div className="w-6 h-6 bg-white rounded-full shadow-[0_0_8px_#FFF]" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
            <svg className="w-14 h-7" viewBox="0 0 40 20">
              <path d="M 8 6 Q 20 22 32 6 Z" fill="#A3E8FF" opacity="0.9" />
            </svg>
          </div>
        );

      case 'SAD':
        return (
          <div className="flex flex-col items-center justify-center w-full h-full gap-3">
            <div className="flex items-center justify-center gap-10">
              <svg className="w-16 h-14" viewBox="0 0 60 50">
                <path
                  d="M 12 18 Q 30 38 48 24"
                  fill="none"
                  stroke={eyeColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_8px_#A3E8FF]"
                />
                <circle cx="28" cy="30" r="3" fill="#FFF" />
              </svg>
              <svg className="w-16 h-14" viewBox="0 0 60 50">
                <path
                  d="M 12 24 Q 30 38 48 18"
                  fill="none"
                  stroke={eyeColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_8px_#A3E8FF]"
                />
                <circle cx="32" cy="30" r="3" fill="#FFF" />
              </svg>
            </div>
            <div className="w-6 h-1 bg-[#80D0F5] rounded-full opacity-70" />
          </div>
        );

      case 'STRESSED':
        return (
          <div className="flex flex-col items-center justify-center w-full h-full gap-3">
            <div className="flex items-center justify-center gap-10">
              <div className="w-12 h-12 rounded-full border-5 border-[#A3E8FF] flex items-center justify-center shadow-[0_0_10px_#A3E8FF] transform -rotate-12">
                <div className="w-5 h-5 bg-[#A3E8FF] rounded-full translate-x-1" />
              </div>
              <div className="w-12 h-12 rounded-full border-5 border-[#A3E8FF] flex items-center justify-center shadow-[0_0_10px_#A3E8FF] transform rotate-12">
                <div className="w-5 h-5 bg-[#A3E8FF] rounded-full -translate-x-1" />
              </div>
            </div>
            <svg className="w-12 h-5" viewBox="0 0 40 16">
              <path
                d="M 6 8 Q 14 3 20 8 T 34 8"
                fill="none"
                stroke={secondaryColor}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        );

      case 'THINKING':
        return (
          <div className="flex flex-col items-center justify-center w-full h-full gap-3">
            <div className="flex items-center justify-center gap-10">
              <div className="w-14 h-14 rounded-full border-6 border-[#A3E8FF] flex items-center justify-center shadow-[0_0_10px_#A3E8FF] transform -rotate-12">
                <div className="w-5 h-5 bg-[#A3E8FF] rounded-full translate-x-1 -translate-y-1" />
              </div>
              <div className="w-12 h-12 rounded-full border-5 border-[#A3E8FF] flex items-center justify-center shadow-[0_0_10px_#A3E8FF] translate-y-1">
                <div className="w-4 h-4 bg-[#A3E8FF] rounded-full translate-x-1 -translate-y-1" />
              </div>
            </div>
            <div className="w-4 h-4 rounded-full border-2 border-[#80D0F5] opacity-80" />
          </div>
        );

      case 'SUPPORTIVE':
      default:
        return (
          <div className="flex flex-col items-center justify-center w-full h-full gap-3">
            <div className="flex items-center justify-center gap-10">
              <div className="w-14 h-14 rounded-full border-6 border-[#A3E8FF] flex items-center justify-center shadow-[0_0_12px_#A3E8FF] relative">
                <div className="w-5 h-5 bg-white rounded-full shadow-[0_0_8px_#FFF]" />
                <span className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-white opacity-80" />
              </div>
              <div className="w-14 h-14 rounded-full border-6 border-[#A3E8FF] flex items-center justify-center shadow-[0_0_12px_#A3E8FF] relative">
                <div className="w-5 h-5 bg-white rounded-full shadow-[0_0_8px_#FFF]" />
                <span className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-white opacity-80" />
              </div>
            </div>
            <svg className="w-10 h-5" viewBox="0 0 40 18">
              <path
                d="M 8 6 Q 20 16 32 6"
                fill="none"
                stroke="#A3E8FF"
                strokeWidth="4"
                strokeLinecap="round"
                className="filter drop-shadow-[0_0_6px_#A3E8FF]"
              />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#ECEDEF] shadow-sm relative overflow-hidden">
      {/* Device Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-[#292A30]">
              {botName}
            </h3>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#DCD5F5]/60 text-[#4F4275]">
              Robot Compañero
            </span>
          </div>
          <p className="text-xs text-[#50545E]">
            Pantalla circular OLED · 7 expresiones expresivas sincronizadas
          </p>
        </div>

        <button
          onClick={() => enterFullscreenDevice('bot')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#292A30] text-white hover:bg-black text-xs font-semibold shadow-xs transition-transform active:scale-95"
          title="Convertir pantalla del celular en Emoti-Bot"
        >
          <Maximize2 className="w-3.5 h-3.5 text-[#8BE9FD]" />
          <span>Pantalla completa</span>
        </button>
      </div>

      {/* Main Physical Robot Body Simulation */}
      <div className="flex flex-col items-center justify-center py-2">
        <div
          onClick={touchBot}
          className={`relative group cursor-pointer w-64 h-64 sm:w-72 sm:h-72 rounded-[3.5rem] bg-gradient-to-b from-[#F9F9F8] to-[#E9ECEF] p-4 shadow-[0_15px_35px_-10px_rgba(41,42,48,0.15),0_0_0_1px_rgba(255,255,255,0.8)_inset] transition-all duration-300 hover:scale-[1.01] ${
            isBotPetted ? 'ring-4 ring-[#DCD5F5] ring-offset-2' : ''
          }`}
          title={`Toca a ${botName} para interactuar`}
        >
          {/* Subtle speaker perforations top */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex gap-1 opacity-25">
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span className="w-1 h-1 rounded-full bg-gray-600" />
          </div>

          {/* Deep dark circular OLED screen bezel */}
          <div className="w-full h-full rounded-[2.8rem] bg-[#141518] p-3 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_1px_2px_rgba(255,255,255,0.2)] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-[2.8rem]" />

            {/* Petting heart animation */}
            {isBotPetted && (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none bg-black/30 backdrop-blur-[1px]">
                <Heart className="w-16 h-16 text-rose-400 fill-rose-400 animate-ping opacity-75" />
              </div>
            )}

            {/* Expressive animated face */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
              {renderEyes()}
            </div>

            {/* Bottom OLED status bar */}
            <div className="absolute bottom-3 text-[10px] font-mono text-[#50545E] flex items-center gap-2 tracking-widest uppercase">
              <span>{botName}·OS</span>
              <span>·</span>
              <span className="text-[#A3E8FF]">{botExpression}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Contextual Robot Speech Bubble */}
        <div className="mt-5 w-full max-w-md bg-[#F8F7F4] rounded-2xl p-4 border border-[#ECEDEF] relative">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#F8F7F4] border-t border-l border-[#ECEDEF] transform rotate-45" />
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#DCD5F5] text-[#4F4275] flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
              🤖
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-medium text-[#292A30] leading-snug">
                "{botMessage}"
              </p>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-[#7A7E89]">
                <span>Tacto capacitivo activo</span>
                <span>·</span>
                <span>Carita: <strong className="text-[#292A30]">{botExpression}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="mt-4 pt-4 border-t border-[#ECEDEF] space-y-3">
        <div className="text-xs font-semibold text-[#50545E]">
          Controles interactivos de simulación:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={cycleBotExpression}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#ECEDEF] hover:bg-[#DCD5F5]/60 text-[#292A30] text-xs font-semibold transition-all hover:shadow-xs active:scale-98"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#4F4275]" />
            <span>Cambiar carita</span>
          </button>

          <button
            onClick={touchBot}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#F5DFD3]/60 hover:bg-[#F5DFD3] text-[#8C5835] text-xs font-semibold transition-all hover:shadow-xs active:scale-98"
          >
            <Hand className="w-3.5 h-3.5" />
            <span>Tocar a {botName}</span>
          </button>

          <button
            onClick={syncBotWithEmotion}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#D9E8DE]/60 hover:bg-[#D9E8DE] text-[#2D5A3C] text-xs font-semibold transition-all hover:shadow-xs active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sincronizar emoción</span>
          </button>
        </div>

        {/* 7 Facial Expression Quick Selectors */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          {(['HAPPY', 'CALM', 'EXCITED', 'SAD', 'STRESSED', 'SUPPORTIVE', 'THINKING'] as BotExpression[]).map((exp) => (
            <button
              key={exp}
              onClick={() => setBotExpression(exp)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                botExpression === exp
                  ? 'bg-[#292A30] text-white shadow-xs'
                  : 'bg-[#F8F7F4] text-[#50545E] hover:bg-[#ECEDEF]'
              }`}
            >
              {exp}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
