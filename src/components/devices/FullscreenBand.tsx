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
  CheckCircle2, 
  AlertTriangle,
  RotateCw,
  Send,
  Watch
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
    triggerSparkBurst,
    showToast
  } = useEmoti();

  const [showEmotionPicker, setShowEmotionPicker] = useState(false);
  const [targetFriendName, setTargetFriendName] = useState('Sofía');

  const currentMeta = EMOTIONS_CONFIG[currentEmotion];

  const handlePulse = () => {
    sendSupportPulse(targetFriendName);
    triggerSparkBurst();
  };

  const handleMeasure = () => {
    measureBiometrics();
    triggerSparkBurst();
    showToast('Escaneando biometría psicofisiológica...', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121316] text-white flex flex-col justify-between p-4 sm:p-6 overflow-y-auto select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#72D6B1] animate-ping" />
          <div className="flex items-center gap-1.5">
            <Watch className="w-4 h-4 text-[#72D6B1]" />
            <span className="text-xs font-black tracking-tight text-white">
              Emoti-Band
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#72D6B1] bg-[#72D6B1]/20 px-2 py-0.5 rounded-full">
            BLE 5.3 Activo
          </span>
          <span className="text-xs font-mono text-gray-300 ml-1">
            {devices.band.battery}%
          </span>
        </div>

        <button
          onClick={exitFullscreenDevice}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-black transition-all hover:scale-105 active:scale-95 border border-white/20 shadow-xs"
          title="Volver a la interfaz principal"
        >
          <span>Volver a la app</span>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Center Console: Real-time Biometrics & Sensor Display */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-4 sm:my-auto max-w-lg w-full mx-auto space-y-6">
        {/* Optical Sensor Glow when measuring */}
        {isMeasuringBiometrics && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="w-72 h-72 rounded-full bg-[#72D6B1]/25 blur-3xl animate-ping" />
          </div>
        )}

        {/* Haptic Support Pulse Shockwave Rings */}
        {isPulseVibrating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full border-4 border-[#FF80B5] animate-ping" />
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-[#FF80B5]/40 to-[#FF936F]/40 blur-2xl animate-pulse" />
          </div>
        )}

        {/* Giant Biometric Display Card */}
        <div 
          className="w-full bg-[#1A1C22] rounded-3xl p-6 sm:p-8 border-2 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6 relative overflow-hidden"
          style={{ borderColor: currentMeta.accentHex }}
        >
          {/* Subtle neon glow arc */}
          <div 
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full blur-2xl opacity-40 pointer-events-none"
            style={{ backgroundColor: currentMeta.accentHex }}
          />

          {/* Central Heartbeat & BPM Monitor */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center">
                <Heart
                  className="w-14 h-14 text-[#FF80B5] fill-[#FF80B5] animate-pulse drop-shadow-[0_0_15px_#FF80B5]"
                  style={{ animationDuration: `${Math.max(500, 60000 / bandBiometrics.bpm)}ms` }}
                />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white">
                    {isMeasuringBiometrics ? '---' : bandBiometrics.bpm}
                  </span>
                  <span className="text-sm font-bold text-gray-400">BPM</span>
                </div>
                <span className="text-xs text-gray-400 font-medium block">
                  Ritmo cardíaco continuo
                </span>
              </div>
            </div>

            {/* Stress Level & Emotional Sync Indicator */}
            <div className="text-center sm:text-right space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">
                Nivel de Estrés
              </span>
              <div
                className="text-sm font-black font-mono px-3 py-1 rounded-full inline-block border"
                style={{
                  backgroundColor: `${currentMeta.accentHex}25`,
                  borderColor: currentMeta.accentHex,
                  color: currentMeta.accentHex,
                }}
              >
                {isMeasuringBiometrics ? 'Escaneando...' : bandBiometrics.stressLevel}
              </div>
              <div className="text-xs text-gray-300 font-bold capitalize flex items-center justify-center sm:justify-end gap-1 pt-1">
                <span>{currentMeta.emoji}</span>
                <span>{currentMeta.label}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Real-time Animated ECG Waveform */}
          <div className="w-full h-12 bg-black/40 rounded-2xl p-2 border border-white/10 overflow-hidden relative flex items-center">
            <svg className="w-full h-full" viewBox="0 0 160 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="fullscreenEcgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#72D6B1" />
                  <stop offset="50%" stopColor="#79B9F2" />
                  <stop offset="100%" stopColor="#FF80B5" />
                </linearGradient>
              </defs>
              <path
                d="M 0 15 L 30 15 L 35 3 L 40 27 L 45 15 L 75 15 L 80 4 L 85 26 L 90 15 L 120 15 L 125 3 L 130 27 L 135 15 L 160 15"
                fill="none"
                stroke="url(#fullscreenEcgGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
              />
            </svg>
          </div>

          {/* Active Support Message */}
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-xs text-gray-300 italic font-medium leading-relaxed">
            "{currentMeta.supportMessage}"
          </div>
        </div>

        {/* Demo Disclaimer */}
        <div className="flex items-center gap-2 text-xs text-[#FFD65A] bg-[#FFD65A]/15 px-4 py-2 rounded-2xl border border-[#FFD65A]/30">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Datos biométricos y hápticos demostrativos simulados para prototipado UX.</span>
        </div>
      </div>

      {/* Bottom Interactive Controls Panel */}
      <div className="relative z-20 max-w-lg w-full mx-auto space-y-3 shrink-0">
        <div className="bg-[#1A1C22] rounded-3xl p-4 border border-white/15 shadow-xl space-y-3">
          {/* Main Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* 1. Pulso de apoyo */}
            <button
              onClick={handlePulse}
              disabled={isPulseVibrating}
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FF936F] via-[#FF80B5] to-[#B69AF5] hover:scale-102 active:scale-95 text-white text-xs font-black shadow-[0_4px_16px_rgba(255,128,181,0.4)] transition-all disabled:opacity-50"
            >
              <Heart className={`w-4 h-4 fill-white ${isPulseVibrating ? 'animate-bounce' : ''}`} />
              <span>ENVIAR PULSO DE APOYO</span>
            </button>

            {/* 2. Medir estado emocional */}
            <button
              onClick={handleMeasure}
              disabled={isMeasuringBiometrics}
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-black transition-all border border-white/20 disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isMeasuringBiometrics ? 'animate-spin text-[#72D6B1]' : ''}`} />
              <span>{isMeasuringBiometrics ? 'Midiendo biometría...' : 'Medir estado psicofisiológico'}</span>
            </button>
          </div>

          {/* Quick Friend Selector for Support Pulse */}
          <div className="flex items-center justify-between text-xs px-1 pt-1 border-t border-white/10 text-gray-400 flex-wrap gap-2">
            <span className="font-bold">Enviar pulso a:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {friends.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTargetFriendName(f.name)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    targetFriendName === f.name
                      ? 'bg-gradient-to-r from-[#FFD65A] to-[#FF936F] text-[#28243A] shadow-xs scale-105'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Return Button */}
        <div className="flex justify-center pb-2">
          <button
            onClick={() => {
              exitFullscreenDevice();
              setActiveTab('emotiapp');
            }}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white font-bold py-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la vista principal de EMOTI</span>
          </button>
        </div>
      </div>

      {/* Emotion Selector Modal */}
      {showEmotionPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#1A1C22] text-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border-2 border-white/20 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <h3 className="font-black text-base text-white">
                  Sintonizar emoción para Emoti-Band
                </h3>
                <p className="text-xs text-gray-400 font-medium">
                  Ajusta los parámetros psicofisiológicos simulados.
                </p>
              </div>
              <button
                onClick={() => setShowEmotionPicker(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:bg-white/10"
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
                      triggerSparkBurst();
                    }}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? 'bg-white/20 border-white text-white shadow-sm scale-102'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{config.emoji}</div>
                    <div className="font-black text-xs capitalize">{config.label}</div>
                    <div className="text-[10px] mt-0.5 text-gray-400 font-mono">
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
