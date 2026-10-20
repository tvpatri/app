import React, { useState } from 'react';
import { useEmoti } from '../../context/EmotiContext';
import { useAuth } from '../../context/AuthContext';
import { EMOTIONS_CONFIG } from '../../data/emotionsData';
import { EmotionType } from '../../types';
import { 
  Heart, 
  Sparkles, 
  Bot, 
  Watch, 
  ArrowRight, 
  Smile, 
  MessageCircleHeart, 
  Clock, 
  TrendingUp, 
  Send,
  Radio,
  Zap,
  Flame,
  CheckCircle2,
  Maximize2,
  Users
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const {
    currentEmotion,
    setEmotion,
    devices,
    friends,
    totalSparksSent,
    totalPulsesSent,
    setEmotiAppSubTab,
    setActiveTab,
    todayNote,
    botName,
    botExpression,
    botMessage,
    touchBot,
    isBotPetted,
    enterFullscreenDevice,
    triggerSparkBurst,
    showToast
  } = useEmoti();

  const { userProfile, user } = useAuth();

  const displayName = 
    userProfile?.displayName?.trim() || 
    user?.displayName?.trim() || 
    (userProfile?.username ? `@${userProfile.username}` : '') || 
    'Amigo';

  const currentMeta = EMOTIONS_CONFIG[currentEmotion];
  const onlineFriends = friends.filter((f) => f.isOnline);

  const [botPettedLocal, setBotPettedLocal] = useState(false);

  const emotionsList: EmotionType[] = [
    'feliz',
    'tranquilo',
    'emocionado',
    'cansado',
    'estresado',
    'triste',
  ];

  const handleSelectEmotion = (emo: EmotionType) => {
    setEmotion(emo);
    triggerSparkBurst();
    showToast(`¡Emoción actualizada a ${EMOTIONS_CONFIG[emo].label}!`, 'success');
  };

  const handlePetBot = () => {
    touchBot();
    setBotPettedLocal(true);
    triggerSparkBurst();
    setTimeout(() => setBotPettedLocal(false), 1200);
  };

  return (
    <div className="space-y-6 pb-24 animate-pop-in">
      {/* 1. Personalized Colorful Welcome Greeting with Avatar */}
      <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-[#FFF2DE] via-[#FFF9F0] to-[#FFD65A]/20 p-4 sm:p-5 rounded-3xl border-2 border-[#FFD65A]/50 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="relative">
            <div 
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl shadow-[0_6px_16px_rgba(255,147,111,0.35)] border-2 border-white transition-transform hover:scale-105"
              style={{ 
                backgroundColor: userProfile?.avatarBg || '#FFD65A', 
                color: '#28243A' 
              }}
            >
              {userProfile?.avatarInitials || displayName.charAt(0).toUpperCase()}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#72D6B1] border-2 border-white animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#A03E15] bg-[#FF936F]/25 px-2.5 py-0.5 rounded-full border border-[#FF936F]/40">
                ¡Bienvenido a EMOTI!
              </span>
              <span className="text-[11px] font-semibold text-[#28243A]/60 hidden sm:inline">
                Hoy es un buen día
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#28243A] tracking-tight mt-1 flex items-center gap-1.5">
              <span>Hola, {displayName}</span>
              <span className="text-[#FF936F] animate-bounce inline-block">✨</span>
            </h1>
            <p className="text-xs text-[#28243A]/80 font-medium">
              Tu red emocional está activa y sincronizada
            </p>
          </div>
        </div>

        {/* Quick Spark Button */}
        <button
          onClick={() => {
            triggerSparkBurst();
            showToast('¡Chispa de energía desatada!', 'spark');
          }}
          className="hidden sm:flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FFD65A] to-[#FF936F] text-[#28243A] hover:scale-105 active:scale-95 transition-all shadow-[0_4px_14px_rgba(255,147,111,0.4)] border border-white relative z-10"
          title="Lanza chispas de energía"
        >
          <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-[9px] font-black">SPARK</span>
        </button>

        {/* Decorative background orbs */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[#FFD65A]/30 blur-2xl pointer-events-none" />
        <div className="absolute right-24 -top-8 w-24 h-24 rounded-full bg-[#FF80B5]/20 blur-xl pointer-events-none" />
      </div>

      {/* 2. Interactive Emoti-Bot Live Companion Banner */}
      <div 
        onClick={handlePetBot}
        className={`cursor-pointer relative overflow-hidden rounded-3xl p-5 border-2 transition-all duration-300 shadow-md ${
          botPettedLocal 
            ? 'bg-gradient-to-r from-[#FFD65A]/40 via-[#FF936F]/40 to-[#FF80B5]/40 border-[#FF936F] scale-102 ring-4 ring-[#FFD65A]/40' 
            : 'bg-gradient-to-r from-[#28243A] via-[#352F4C] to-[#28243A] border-[#B69AF5]/50 hover:border-[#FFD65A]'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          {/* Animated Robot Face preview */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#18191C] border-2 border-[#79B9F2] shadow-[0_0_20px_rgba(121,185,242,0.4)] flex flex-col items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
                {/* Glowing robot eyes */}
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#79B9F2] shadow-[0_0_10px_#79B9F2] animate-pulse" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#79B9F2] shadow-[0_0_10px_#79B9F2] animate-pulse" />
                </div>
                {/* Robot smile curve */}
                <div className="w-6 h-1.5 bg-[#FFD65A] rounded-full mt-2 shadow-[0_0_6px_#FFD65A]" />
              </div>
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#72D6B1] text-[#1D6E50] text-[9px] font-black border border-white animate-bounce">
                ONLINE
              </span>
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-white flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-[#FFD65A]" />
                  <span>{botName}</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B69AF5]/30 text-[#B69AF5] border border-[#B69AF5]/40">
                  {botExpression}
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium italic">
                "{botMessage || '¡Hola! Toca mi carita para sentir mi acompañamiento.'}"
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#FFD65A] font-bold pt-0.5">
                <span>👆 Toca aquí para interactuar</span>
                <span>·</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    enterFullscreenDevice('bot');
                  }}
                  className="underline hover:text-white flex items-center gap-1"
                >
                  <Maximize2 className="w-3 h-3" />
                  Modo Bot Fullscreen
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('devices');
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FFD65A] to-[#FF936F] text-[#28243A] font-black text-xs shadow-[0_4px_12px_rgba(255,214,90,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Bot className="w-4 h-4" />
            <span>Hablar con {botName}</span>
          </button>
        </div>
      </div>

      {/* 3. Big Vibrant Card: "¿Cómo te sientes hoy?" with Character Caritas */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#FFD65A]/50 shadow-[0_10px_30px_rgba(255,214,90,0.15)] space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl">🎨</span>
              <h2 className="text-lg sm:text-xl font-black text-[#28243A] tracking-tight">
                ¿Cómo te sientes hoy?
              </h2>
            </div>
            <p className="text-xs text-[#28243A]/70 font-medium mt-0.5">
              Elige tu carita para sincronizar toda la app, tus dispositivos y tu círculo
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('emotiapp');
              setEmotiAppSubTab('mood');
            }}
            className="text-xs font-black text-[#FF936F] hover:text-[#A03E15] flex items-center gap-1 hover:underline"
          >
            <span>Ver historial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Vibrant Characters / Emotion Quick Selector */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3">
          {emotionsList.map((emoKey) => {
            const item = EMOTIONS_CONFIG[emoKey];
            const isSelected = currentEmotion === emoKey;

            return (
              <button
                key={emoKey}
                onClick={() => handleSelectEmotion(emoKey)}
                className={`flex flex-col items-center justify-between p-3 rounded-2xl border-2 transition-all duration-200 group active:scale-95 relative ${
                  isSelected
                    ? `${item.colorBg} ${item.colorBorder} shadow-[0_6px_20px_rgba(40,36,58,0.15)] scale-105 ring-2 ring-[#28243A]`
                    : 'bg-[#FFF9F0] border-[#FFD65A]/30 hover:border-[#FF936F] hover:scale-103'
                }`}
              >
                {/* Selected checkmark indicator */}
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#28243A] text-white flex items-center justify-center text-[10px] shadow-sm font-black animate-pop-in">
                    ✓
                  </span>
                )}

                <span className="text-3xl sm:text-4xl transition-transform group-hover:scale-120 drop-shadow-xs">
                  {item.emoji}
                </span>

                <span className={`text-xs font-extrabold capitalize mt-1.5 ${item.colorText}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Support Feedback Banner */}
        <div 
          className={`p-4 rounded-2xl border-2 ${currentMeta.colorBg} ${currentMeta.colorBorder} flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{currentMeta.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-[#28243A]">
                  Acompañamiento Emoti:
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#28243A] shadow-2xs">
                  {currentMeta.label}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#28243A] mt-0.5 leading-snug">
                "{currentMeta.supportMessage}"
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveTab('emotiapp');
              setEmotiAppSubTab('mood');
            }}
            className="px-3 py-1.5 rounded-xl bg-white text-[#28243A] font-black text-xs border border-[#28243A]/10 hover:bg-[#FFF9F0] transition-colors shrink-0"
          >
            Escribir nota
          </button>
        </div>
      </div>

      {/* 4. Visual 4-Grid Shortcuts to Key App Functions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-base text-[#28243A] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF936F]" />
            <span>Accesos Rápidos</span>
          </h3>
          <span className="text-xs font-bold text-[#FF936F]">Ecosistema interactivo</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Card 1: Mi Círculo de Amigos */}
          <div
            onClick={() => setActiveTab('circle')}
            className="p-4 rounded-3xl bg-gradient-to-br from-[#FF80B5]/20 to-[#FF936F]/20 border-2 border-[#FF80B5]/40 hover:border-[#FF80B5] shadow-xs cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md group flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#FF80B5] text-white flex items-center justify-center font-black shadow-xs group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white text-[#A31652]">
                {friends.length}
              </span>
            </div>
            <div>
              <h4 className="font-black text-sm text-[#28243A]">Mi Círculo</h4>
              <p className="text-[11px] text-[#28243A]/70 font-semibold mt-0.5">
                {onlineFriends.length} amigos en línea
              </p>
            </div>
          </div>

          {/* Card 2: Energy Sparks */}
          <div
            onClick={() => {
              setActiveTab('circle');
            }}
            className="p-4 rounded-3xl bg-gradient-to-br from-[#FFD65A]/25 to-[#FF936F]/20 border-2 border-[#FFD65A]/60 hover:border-[#FF936F] shadow-xs cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md group flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#FFD65A] text-[#946200] flex items-center justify-center font-black shadow-xs group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 fill-[#946200]" />
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white text-[#946200]">
                {totalSparksSent} sent
              </span>
            </div>
            <div>
              <h4 className="font-black text-sm text-[#28243A]">Energy Sparks</h4>
              <p className="text-[11px] text-[#28243A]/70 font-semibold mt-0.5">
                Envía apoyo con 1 toque
              </p>
            </div>
          </div>

          {/* Card 3: Mood Tracker & Trends */}
          <div
            onClick={() => {
              setActiveTab('emotiapp');
              setEmotiAppSubTab('mood');
            }}
            className="p-4 rounded-3xl bg-gradient-to-br from-[#72D6B1]/20 to-[#79B9F2]/20 border-2 border-[#72D6B1]/50 hover:border-[#72D6B1] shadow-xs cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md group flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#72D6B1] text-[#1D6E50] flex items-center justify-center font-black shadow-xs group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white text-[#1D6E50]">
                7 días
              </span>
            </div>
            <div>
              <h4 className="font-black text-sm text-[#28243A]">Mood Tracker</h4>
              <p className="text-[11px] text-[#28243A]/70 font-semibold mt-0.5">
                Calendario & gráficas
              </p>
            </div>
          </div>

          {/* Card 4: Talk Together */}
          <div
            onClick={() => {
              setActiveTab('emotiapp');
              setEmotiAppSubTab('guide');
            }}
            className="p-4 rounded-3xl bg-gradient-to-br from-[#B69AF5]/20 to-[#79B9F2]/20 border-2 border-[#B69AF5]/50 hover:border-[#B69AF5] shadow-xs cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md group flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#B69AF5] text-white flex items-center justify-center font-black shadow-xs group-hover:scale-110 transition-transform">
                <MessageCircleHeart className="w-5 h-5" />
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white text-[#58399E]">
                Guías
              </span>
            </div>
            <div>
              <h4 className="font-black text-sm text-[#28243A]">Talk Together</h4>
              <p className="text-[11px] text-[#28243A]/70 font-semibold mt-0.5">
                Diálogo empático
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Connected Devices Live Sync Technological Widget */}
      <div className="bg-white rounded-3xl p-5 border-2 border-[#FFD65A]/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#72D6B1] animate-pulse" />
            <h3 className="font-black text-sm text-[#28243A]">Dispositivos Hardware Conectados</h3>
          </div>
          <button
            onClick={() => setActiveTab('devices')}
            className="text-xs font-black text-[#FF936F] hover:underline"
          >
            Gestionar
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Bot Card */}
          <div 
            onClick={() => enterFullscreenDevice('bot')}
            className="p-3.5 rounded-2xl bg-[#FFF9F0] border-2 border-[#B69AF5]/40 hover:border-[#B69AF5] transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#79B9F2] to-[#B69AF5] text-white flex items-center justify-center font-black shadow-xs group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs text-[#28243A] flex items-center gap-1.5">
                  <span>{botName}</span>
                  <span className="text-[10px] text-[#58399E] font-bold">Emoti-Bot</span>
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1D6E50]">
                  <span className="w-2 h-2 rounded-full bg-[#72D6B1] animate-ping" />
                  <span>Sincronizado en tiempo real</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-[#28243A] font-mono">{devices.bot.battery}%</span>
              <span className="block text-[9px] text-[#B69AF5] font-bold">Pantalla completa ↗</span>
            </div>
          </div>

          {/* Band Card */}
          <div 
            onClick={() => enterFullscreenDevice('band')}
            className="p-3.5 rounded-2xl bg-[#FFF9F0] border-2 border-[#72D6B1]/40 hover:border-[#72D6B1] transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#72D6B1] to-[#79B9F2] text-[#1D6E50] flex items-center justify-center font-black shadow-xs group-hover:scale-105 transition-transform">
                <Watch className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs text-[#28243A] flex items-center gap-1.5">
                  <span>Emoti-Band</span>
                  <span className="text-[10px] text-[#1D6E50] font-bold">BLE 5.3</span>
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1D6E50]">
                  <span className="w-2 h-2 rounded-full bg-[#72D6B1] animate-ping" />
                  <span>Pulsera sensorial activa</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-[#28243A] font-mono">{devices.band.battery}%</span>
              <span className="block text-[9px] text-[#72D6B1] font-bold">Pantalla completa ↗</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
