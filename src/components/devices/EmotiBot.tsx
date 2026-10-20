import React, { useState, useEffect } from 'react';
import { useEmoti } from '../../context/EmotiContext';
import { BotExpression } from '../../types';
import { EMOTIONS_CONFIG } from '../../data/emotionsData';
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
  Maximize2,
  Radio,
  Zap,
  Bot
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
    currentEmotion,
    triggerSparkBurst
  } = useEmoti();

  const { userProfile, user } = useAuth();
  const effectiveUserName =
    userProfile?.displayName?.trim() ||
    user?.displayName?.trim() ||
    (userProfile?.username ? `@${userProfile.username}` : '') ||
    'amigo';
  const effectiveBotName = userProfile?.botName?.trim() || botName || 'Milo';

  const [isBlinking, setIsBlinking] = useState(false);
  const currentEmotionMeta = EMOTIONS_CONFIG[currentEmotion];

  // Blinking loop every 4-5 seconds
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4500);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleTouchAction = () => {
    touchBot();
    triggerSparkBurst();
  };

  // Render SVG Robot Eyes with vibrant cyberpunk / friendly aesthetic
  const renderEyes = () => {
    const eyeColor = currentEmotionMeta ? currentEmotionMeta.accentHex : '#79B9F2';
    const secondaryColor = '#FFF';

    if (isBlinking) {
      return (
        <div className="flex items-center justify-center gap-12 w-full h-full">
          <div 
            className="w-16 h-2 rounded-full transition-all duration-150" 
            style={{ backgroundColor: eyeColor, boxShadow: `0 0 16px ${eyeColor}` }}
          />
          <div 
            className="w-16 h-2 rounded-full transition-all duration-150" 
            style={{ backgroundColor: eyeColor, boxShadow: `0 0 16px ${eyeColor}` }}
          />
        </div>
      );
    }

    switch (botExpression) {
      case 'HAPPY':
        return (
          <div className="flex flex-col items-center justify-center w-full h-full gap-3 animate-soft-float">
            <div className="flex items-center justify-center gap-10">
              <svg className="w-16 h-14" viewBox="0 0 60 50">
                <path
                  d="M 10 35 Q 30 10 50 35"
                  fill="none"
                  stroke={eyeColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 10px ${eyeColor})` }}
                />
                <circle cx="42" cy="18" r="3.5" fill="#FFF" />
              </svg>
              <svg className="w-16 h-14" viewBox="0 0 60 50">
                <path
                  d="M 10 35 Q 30 10 50 35"
                  fill="none"
                  stroke={eyeColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 10px ${eyeColor})` }}
                />
                <circle cx="42" cy="18" r="3.5" fill="#FFF" />
              </svg>
            </div>
            {/* Cute robot smile */}
            <svg className="w-14 h-7" viewBox="0 0 40 20">
              <path
                d="M 10 8 Q 20 18 30 8"
                fill="none"
                stroke={eyeColor}
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
                  style={{ filter: `drop-shadow(0 0 10px ${eyeColor})` }}
                />
              </svg>
              <svg className="w-16 h-12" viewBox="0 0 60 40">
                <path
                  d="M 10 20 Q 30 32 50 20"
                  fill="none"
                  stroke={eyeColor}
                  strokeWidth="7"
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 10px ${eyeColor})` }}
                />
              </svg>
            </div>
            <div className="w-10 h-1.5 rounded-full opacity-80" style={{ backgroundColor: eyeColor }} />
          </div>
        );

      case 'EXCITED':
        return (
          <div className="flex flex-col items-center justify-center w-full h-full gap-3 animate-pulse">
            <div className="flex items-center justify-center gap-10">
              <div 
                className="w-16 h-16 rounded-full border-6 flex items-center justify-center relative"
                style={{ borderColor: eyeColor, boxShadow: `0 0 20px ${eyeColor}` }}
              >
                <div className="w-7 h-7 bg-white rounded-full shadow-[0_0_10px_#FFF]" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-white" />
              </div>
              <div 
                className="w-16 h-16 rounded-full border-6 flex items-center justify-center relative"
                style={{ borderColor: eyeColor, boxShadow: `0 0 20px ${eyeColor}` }}
              >
                <div className="w-7 h-7 bg-white rounded-full shadow-[0_0_10px_#FFF]" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-white" />
              </div>
            </div>
            <svg className="w-16 h-8" viewBox="0 0 40 20">
              <path d="M 8 6 Q 20 22 32 6 Z" fill={eyeColor} opacity="0.95" />
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
                  style={{ filter: `drop-shadow(0 0 10px ${eyeColor})` }}
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
                  style={{ filter: `drop-shadow(0 0 10px ${eyeColor})` }}
                />
                <circle cx="32" cy="30" r="3" fill="#FFF" />
              </svg>
            </div>
            <div className="w-8 h-1 rounded-full opacity-70" style={{ backgroundColor: eyeColor }} />
          </div>
        );

      case 'STRESSED':
        return (
          <div className="flex flex-col items-center justify-center w-full h-full gap-3">
            <div className="flex items-center justify-center gap-10">
              <div 
                className="w-14 h-14 rounded-full border-5 flex items-center justify-center transform -rotate-12"
                style={{ borderColor: eyeColor, boxShadow: `0 0 14px ${eyeColor}` }}
              >
                <div className="w-6 h-6 rounded-full translate-x-1" style={{ backgroundColor: eyeColor }} />
              </div>
              <div 
                className="w-14 h-14 rounded-full border-5 flex items-center justify-center transform rotate-12"
                style={{ borderColor: eyeColor, boxShadow: `0 0 14px ${eyeColor}` }}
              >
                <div className="w-6 h-6 rounded-full -translate-x-1" style={{ backgroundColor: eyeColor }} />
              </div>
            </div>
            <svg className="w-14 h-6" viewBox="0 0 40 16">
              <path
                d="M 6 8 Q 14 3 20 8 T 34 8"
                fill="none"
                stroke={eyeColor}
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        );

      case 'THINKING':
        return (
          <div className="flex flex-col items-center justify-center w-full h-full gap-3">
            <div className="flex items-center justify-center gap-10">
              <div 
                className="w-16 h-16 rounded-full border-6 flex items-center justify-center transform -rotate-12"
                style={{ borderColor: eyeColor, boxShadow: `0 0 14px ${eyeColor}` }}
              >
                <div className="w-6 h-6 rounded-full translate-x-1 -translate-y-1" style={{ backgroundColor: eyeColor }} />
              </div>
              <div 
                className="w-13 h-13 rounded-full border-5 flex items-center justify-center translate-y-1"
                style={{ borderColor: eyeColor, boxShadow: `0 0 12px ${eyeColor}` }}
              >
                <div className="w-4 h-4 rounded-full translate-x-1 -translate-y-1" style={{ backgroundColor: eyeColor }} />
              </div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 opacity-80 animate-spin" style={{ borderColor: eyeColor }} />
          </div>
        );

      case 'SUPPORTIVE':
      default:
        return (
          <div className="flex flex-col items-center justify-center w-full h-full gap-3">
            <div className="flex items-center justify-center gap-10">
              <div 
                className="w-16 h-16 rounded-full border-6 flex items-center justify-center relative"
                style={{ borderColor: eyeColor, boxShadow: `0 0 16px ${eyeColor}` }}
              >
                <div className="w-6 h-6 bg-white rounded-full shadow-[0_0_8px_#FFF]" />
                <span className="absolute -top-1 right-1 w-2.5 h-2.5 rounded-full bg-white opacity-90" />
              </div>
              <div 
                className="w-16 h-16 rounded-full border-6 flex items-center justify-center relative"
                style={{ borderColor: eyeColor, boxShadow: `0 0 16px ${eyeColor}` }}
              >
                <div className="w-6 h-6 bg-white rounded-full shadow-[0_0_8px_#FFF]" />
                <span className="absolute -top-1 right-1 w-2.5 h-2.5 rounded-full bg-white opacity-90" />
              </div>
            </div>
            <svg className="w-12 h-6" viewBox="0 0 40 18">
              <path
                d="M 8 6 Q 20 16 32 6"
                fill="none"
                stroke={eyeColor}
                strokeWidth="4"
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 8px ${eyeColor})` }}
              />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border-2 border-[#FFD65A]/50 shadow-sm relative overflow-hidden space-y-5 animate-pop-in">
      {/* Device Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#79B9F2] to-[#B69AF5] text-white flex items-center justify-center font-black shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-black text-base text-[#28243A]">
              {effectiveBotName}
            </h3>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#B69AF5]/25 text-[#58399E] border border-[#B69AF5]/40">
              Compañero IA
            </span>
          </div>
          <p className="text-xs text-[#28243A]/70 font-medium mt-0.5">
            Robot empático con IA generativa · Atento a {effectiveUserName}
          </p>
        </div>

        <button
          onClick={() => enterFullscreenDevice('bot')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#28243A] text-white hover:bg-black text-xs font-black shadow-xs transition-all hover:scale-105 active:scale-95"
          title="Convertir pantalla del celular en Emoti-Bot"
        >
          <Maximize2 className="w-3.5 h-3.5 text-[#FFD65A]" />
          <span>Pantalla completa</span>
        </button>
      </div>

      {/* Main Physical Robot Body Simulation with Dynamic Halo Glow */}
      <div className="flex flex-col items-center justify-center py-2">
        <div
          onClick={handleTouchAction}
          className={`relative group cursor-pointer w-64 h-64 sm:w-72 sm:h-72 rounded-[3.8rem] p-4.5 transition-all duration-300 hover:scale-102 ${
            isBotPetted ? 'scale-105 ring-4 ring-[#FF80B5] ring-offset-4' : ''
          }`}
          style={{
            background: `radial-gradient(circle at 50% 30%, ${currentEmotionMeta.accentHex}40, #28243A)`,
            boxShadow: `0 20px 45px -10px ${currentEmotionMeta.accentHex}60, 0 0 0 3px ${currentEmotionMeta.accentHex}70 inset`
          }}
          title={`Toca a ${botName} para interactuar`}
        >
          {/* Subtle speaker perforations top */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-40">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>

          {/* Deep dark circular OLED screen bezel */}
          <div className="w-full h-full rounded-[3rem] bg-[#141518] p-3 shadow-[inset_0_4px_16px_rgba(0,0,0,0.9),0_2px_4px_rgba(255,255,255,0.2)] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Screen Glass Reflection */}
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-[3rem]" />

            {/* Petting heart animation */}
            {isBotPetted && (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none bg-black/40 backdrop-blur-xs animate-pop-in">
                <Heart className="w-20 h-20 text-[#FF80B5] fill-[#FF80B5] animate-ping opacity-90" />
              </div>
            )}

            {/* Expressive animated face */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
              {renderEyes()}
            </div>

            {/* Bottom OLED status bar */}
            <div className="absolute bottom-3 text-[10px] font-mono text-gray-400 flex items-center gap-2 tracking-widest uppercase">
              <span>{effectiveBotName}·OS</span>
              <span>·</span>
              <span style={{ color: currentEmotionMeta.accentHex }}>{botExpression}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Contextual Robot Speech Bubble with colorful frame */}
        <div 
          className="mt-5 w-full max-w-md bg-[#FFF9F0] rounded-3xl p-4 border-2 shadow-xs relative"
          style={{ borderColor: currentEmotionMeta.accentHex }}
        >
          <div 
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FFF9F0] border-t-2 border-l-2 transform rotate-45"
            style={{ borderColor: currentEmotionMeta.accentHex }}
          />
          <div className="flex items-start gap-3">
            <div 
              className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-sm font-black mt-0.5 shadow-xs"
              style={{ backgroundColor: `${currentEmotionMeta.accentHex}40`, color: '#28243A' }}
            >
              🤖
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-bold text-[#28243A] leading-snug">
                "{botMessage}"
              </p>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-[#28243A]/70 font-semibold">
                <span>Tacto capacitivo activo</span>
                <span>·</span>
                <span>Carita: <strong className="text-[#28243A]">{botExpression}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Controls */}
      <div className="pt-2 border-t border-[#FFD65A]/30 space-y-3">
        <div className="text-xs font-black text-[#28243A] flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#FF936F]" />
          <span>Controles de Personalidad & Estados:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={cycleBotExpression}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-[#FFF9F0] hover:bg-[#FFF2DE] border-2 border-[#FFD65A]/50 text-[#28243A] text-xs font-black transition-all hover:scale-102 active:scale-95 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#FF936F]" />
            <span>Alternar carita</span>
          </button>

          <button
            onClick={handleTouchAction}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-[#FF80B5]/20 hover:bg-[#FF80B5]/30 border-2 border-[#FF80B5]/50 text-[#A31652] text-xs font-black transition-all hover:scale-102 active:scale-95 shadow-2xs"
          >
            <Heart className="w-3.5 h-3.5 fill-[#A31652]" />
            <span>Acariciar robot</span>
          </button>

          <button
            onClick={syncBotWithEmotion}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-[#72D6B1]/20 hover:bg-[#72D6B1]/30 border-2 border-[#72D6B1]/50 text-[#1D6E50] text-xs font-black transition-all hover:scale-102 active:scale-95 shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5 fill-[#1D6E50]" />
            <span>Sincronizar hoy</span>
          </button>
        </div>

        {/* 7 Facial Expression Quick Selectors */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {(['HAPPY', 'CALM', 'EXCITED', 'SAD', 'STRESSED', 'SUPPORTIVE', 'THINKING'] as BotExpression[]).map((exp) => (
            <button
              key={exp}
              onClick={() => setBotExpression(exp)}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                botExpression === exp
                  ? 'bg-gradient-to-r from-[#FFD65A] to-[#FF936F] text-[#28243A] shadow-xs scale-105'
                  : 'bg-[#FFF9F0] text-[#28243A]/70 border border-[#FFD65A]/40 hover:bg-[#FFF2DE]'
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
