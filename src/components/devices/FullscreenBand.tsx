import React, { useState } from 'react';
import { useEmoti } from '../../context/EmotiContext';
import { EMOTIONS_CONFIG } from '../../data/emotionsData';
import { EmotionType } from '../../types';
import { 
  X, 
  Heart, 
  Activity, 
  Zap, 
  Radio, 
  Sparkles, 
  ArrowLeft, 
  SendHorizontal, 
  CheckCircle2, 
  AlertTriangle,
  RotateCw,
  Fingerprint
} from 'lucide-react';

export const FullscreenBand: React.FC = () => {
  const {
    bandBiometrics,
    isPulseVibrating,
    isMeasuringBiometrics,
    measureBiometrics,
    sendSupportPulse,
    currentEmotion,
    setEmotion,
    devices,
    friends,
    exitFullscreenDevice,
    setActiveTab,
  } = useEmoti();

  const [showEmotionPicker, setShowEmotionPicker] = useState(false);
  const [targetFriendName, setTargetFriendName] = useState('Sofía');

  const currentMeta = EMOTIONS_CONFIG[currentEmotion];

  return (
    <div className="fixed inset-0 z-50 bg-[#EFECE6] flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between z-20">
        <div className="flex items-center gap-2 bg-black/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-black/5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold tracking-tight text-[#292A30]">
            Emoti-Band Wearable OS
          </span>
          <span className="text-[10px] text-[#50545E]">· Sensor Activo</span>
        </div>

        <button
          onClick={exitFullscreenDevice}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-md text-[#292A30] text-xs font-semibold transition-all active:scale-95 border border-black/5"
          title="Volver a la aplicación"
        >
          <span>Salir</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center: Wrist and Wearable Device Simulation */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-auto">
        {/* Optical Sensor Glow when measuring */}
        {isMeasuringBiometrics && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="w-64 h-64 rounded-full bg-emerald-400/20 blur-2xl animate-ping" />
          </div>
        )}

        {/* Haptic Pulse Waves */}
        {isPulseVibrating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border-4 border-rose-400/80 animate-ping" />
            <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full border-2 border-purple-400/70 animate-pulse" />
          </div>
        )}

        {/* Realistic Arm & Forearm Render Silhouette */}
        <div className="relative w-full max-w-lg flex items-center justify-center">
          {/* Forearm (Top portion) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-28 sm:w-36 h-48 sm:h-56 bg-gradient-to-r from-[#E2D2C3] via-[#E8D9CB] to-[#DFCBB9] rounded-l-[4rem] shadow-inner opacity-90 -z-10" />

          {/* Forearm (Bottom/Hand portion) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-28 sm:w-36 h-48 sm:h-56 bg-gradient-to-l from-[#E2D2C3] via-[#E8D9CB] to-[#DFCBB9] rounded-r-[4rem] shadow-inner opacity-90 -z-10" />

          {/* Wearable Silicone Strap (Matte Ceramic White) */}
          <div className="relative z-10 flex items-center justify-center w-full">
            {/* Left Strap */}
            <div className="w-16 sm:w-24 h-28 sm:h-32 bg-gradient-to-r from-[#F0EFEA] to-[#FAFAF8] rounded-l-3xl border-y-2 border-l-2 border-[#D6D4CE] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)]" />

            {/* Smart Capsule Watch Screen Body */}
            <div
              className={`relative z-20 w-64 sm:w-72 md:w-80 h-44 sm:h-48 rounded-[2.8rem] bg-[#121316] p-4 sm:p-5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4),0_0_0_3px_#E2E0D8,0_0_0_6px_#C8C6BD] border border-white/20 flex flex-col justify-between transition-all duration-300 ${
                isPulseVibrating ? 'scale-105 ring-8 ring-rose-400/60' : ''
              } ${isMeasuringBiometrics ? 'ring-4 ring-emerald-400' : ''}`}
            >
              {/* Glass Reflection Arc */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/15 to-transparent rounded-t-[2.8rem] pointer-events-none" />

              {/* Status Header on OLED */}
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>BLE 5.3</span>
                </span>
                <span className="text-gray-300 font-semibold tracking-wider">11:04 AM</span>
                <span className="text-gray-300">{devices.band.battery}%</span>
              </div>

              {/* Central Biometric Readout */}
              <div className="flex items-center justify-between my-auto px-1">
                {/* BPM & Pulse */}
                <div className="flex items-center gap-3">
                  <Heart
                    className={`w-8 h-8 text-rose-500 fill-rose-500 ${
                      isMeasuringBiometrics ? 'animate-bounce' : 'animate-pulse'
                    }`}
                    style={{ animationDuration: `${Math.max(500, 60000 / bandBiometrics.bpm)}ms` }}
                  />
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                        {isMeasuringBiometrics ? '---' : bandBiometrics.bpm}
                      </span>
                      <span className="text-xs font-semibold text-gray-400">BPM</span>
                    </div>
                    <span className="text-[10px] text-gray-400 block -mt-1">Ritmo cardíaco</span>
                  </div>
                </div>

                {/* Stress & Mood indicator */}
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                    Estrés
                  </span>
                  <div
                    className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${
                      bandBiometrics.stressLevel === 'Alto'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : bandBiometrics.stressLevel === 'Medio'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {isMeasuringBiometrics ? 'Escaneando...' : bandBiometrics.stressLevel}
                  </div>
                  <div className="text-[11px] text-[#A3E8FF] capitalize font-medium mt-1">
                    {currentEmotion}
                  </div>
                </div>
              </div>

              {/* Dynamic Animated Pulse Waveform */}
              <div className="w-full h-4 overflow-hidden relative">
                <svg className="w-full h-full text-emerald-400 opacity-90" viewBox="0 0 120 20">
                  <path
                    d="M 0 10 L 25 10 L 30 2 L 35 18 L 40 10 L 60 10 L 65 3 L 70 17 L 75 10 L 120 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Right Strap with Clasp Detail */}
            <div className="w-16 sm:w-24 h-28 sm:h-32 bg-gradient-to-l from-[#F0EFEA] to-[#FAFAF8] rounded-r-3xl border-y-2 border-r-2 border-[#D6D4CE] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)] flex items-center justify-end pr-3">
              <div className="w-2.5 h-10 bg-[#D6D4CE] rounded-full" />
            </div>
          </div>
        </div>

        {/* Demo Disclaimer */}
        <div className="mt-6 flex items-center gap-1.5 text-xs text-[#50545E] bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-black/5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Datos demostrativos de laboratorio · Sensor háptico simulado</span>
        </div>
      </div>

      {/* Bottom Floating Interaction Area */}
      <div className="relative z-20 max-w-lg w-full mx-auto space-y-2">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-3 border border-white/80 shadow-lg space-y-2.5">
          {/* Main Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* 1. Medir estado emocional */}
            <button
              onClick={measureBiometrics}
              disabled={isMeasuringBiometrics}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-[#292A30] hover:bg-black text-white text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isMeasuringBiometrics ? 'animate-spin' : ''}`} />
              <span>{isMeasuringBiometrics ? 'Midiendo...' : 'Medir estado'}</span>
            </button>

            {/* 2. Pulso de apoyo */}
            <button
              onClick={() => sendSupportPulse(targetFriendName)}
              disabled={isPulseVibrating}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-50"
            >
              <Heart className={`w-3.5 h-3.5 fill-white ${isPulseVibrating ? 'animate-bounce' : ''}`} />
              <span>Pulso de apoyo</span>
            </button>

            {/* 3. Cambiar emoción */}
            <button
              onClick={() => setShowEmotionPicker(true)}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-[#F8F7F4] hover:bg-[#DCD5F5]/60 text-[#292A30] text-xs font-semibold transition-all active:scale-95 border border-[#ECEDEF]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4F4275]" />
              <span>Cambiar emoción</span>
            </button>
          </div>

          {/* Quick Friend Selector for Support Pulse */}
          <div className="flex items-center justify-between text-xs px-2 pt-1 border-t border-black/5 text-[#50545E]">
            <span>Destinatario del pulso:</span>
            <div className="flex items-center gap-1">
              {friends.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTargetFriendName(f.name)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                    targetFriendName === f.name
                      ? 'bg-[#292A30] text-white'
                      : 'bg-[#F8F7F4] text-[#50545E] hover:bg-[#ECEDEF]'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Return Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              exitFullscreenDevice();
              setActiveTab('emotiapp');
            }}
            className="flex items-center gap-1 text-xs text-[#50545E] hover:text-[#292A30] font-medium py-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a EmotiApp</span>
          </button>
        </div>
      </div>

      {/* Emotion Selector Bottom Sheet */}
      {showEmotionPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-[#ECEDEF] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#ECEDEF]">
              <div>
                <h3 className="font-bold text-base text-[#292A30]">
                  Seleccionar emoción para Emoti-Band
                </h3>
                <p className="text-xs text-[#50545E]">
                  Ajusta los parámetros psicofisiológicos simulados.
                </p>
              </div>
              <button
                onClick={() => setShowEmotionPicker(false)}
                className="p-1.5 rounded-lg text-[#50545E] hover:bg-[#ECEDEF]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(Object.keys(EMOTIONS_CONFIG) as EmotionType[]).map((emoKey) => {
                const config = EMOTIONS_CONFIG[emoKey];
                const isSelected = currentEmotion === emoKey;

                return (
                  <button
                    key={emoKey}
                    onClick={() => {
                      setEmotion(emoKey);
                      setShowEmotionPicker(false);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#292A30] text-white border-[#292A30] shadow-sm'
                        : `${config.colorBg} border-transparent hover:border-black/10 text-[#292A30]`
                    }`}
                  >
                    <div className="text-2xl mb-1">{config.emoji}</div>
                    <div className="font-bold text-xs capitalize">{config.label}</div>
                    <div
                      className={`text-[10px] mt-0.5 ${
                        isSelected ? 'text-white/80' : 'text-[#50545E]'
                      }`}
                    >
                      Estrés {config.suggestedStress}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
