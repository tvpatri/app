import React, { useState } from 'react';
import { useEmoti } from '../../context/EmotiContext';
import { 
  Heart, 
  Activity, 
  Zap, 
  Radio, 
  Shuffle, 
  AlertTriangle, 
  Flame, 
  Footprints, 
  ShieldAlert,
  SendHorizontal,
  Maximize2
} from 'lucide-react';

export const EmotiBand: React.FC = () => {
  const {
    bandBiometrics,
    isPulseVibrating,
    sendSupportPulse,
    simulateBiometricChange,
    enterFullscreenDevice,
    devices,
    currentEmotion,
    friends,
  } = useEmoti();

  const [selectedFriendIndex, setSelectedFriendIndex] = useState(0);

  const targetFriend = friends[selectedFriendIndex] || friends[0];

  // Helper for stress color styling
  const getStressBadge = () => {
    switch (bandBiometrics.stressLevel) {
      case 'Alto':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          width: 'w-5/6',
        };
      case 'Medio':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          width: 'w-3/6',
        };
      case 'Bajo':
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          width: 'w-1/6',
        };
    }
  };

  const stressInfo = getStressBadge();

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#ECEDEF] shadow-sm relative overflow-hidden space-y-5">
      {/* Device Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-[#292A30]">Emoti-Band</h3>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#D9E8DE] text-[#2D5A3C]">
              Banda Inteligente
            </span>
          </div>
          <p className="text-xs text-[#50545E]">
            Pulsera sensorial háptica · Detección psicofisiológica simulada
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => enterFullscreenDevice('band')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#292A30] text-white hover:bg-black text-xs font-semibold shadow-xs transition-transform active:scale-95"
            title="Convertir pantalla en pulsera inteligente"
          >
            <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pantalla completa</span>
          </button>
        </div>
      </div>

      {/* Realistic Smart Bracelet Rendering */}
      <div className="relative py-4 flex flex-col items-center justify-center">
        {/* Pulse vibration wave overlay when activated */}
        {isPulseVibrating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-56 h-56 rounded-full border-4 border-rose-400/60 animate-ping" />
            <div className="w-40 h-40 rounded-full border-2 border-purple-400/80 animate-pulse" />
          </div>
        )}

        {/* Bracelet Strap Silhouette (minimal white / matte silicone) */}
        <div className="relative w-full max-w-sm flex items-center justify-center">
          {/* Top/Left Strap */}
          <div className="w-16 sm:w-20 h-16 bg-gradient-to-r from-[#EDEDEC] to-[#F5F5F3] rounded-l-2xl border-y border-l border-[#D6D8DC] shadow-inner" />

          {/* Central Curved Smart Core Capsule */}
          <div
            className={`relative z-10 w-48 sm:w-56 h-28 bg-[#18191C] rounded-[2rem] p-3 shadow-[0_12px_28px_-6px_rgba(41,42,48,0.25),0_0_0_2px_#E2E4E8] border border-white/20 flex flex-col justify-between transition-transform duration-300 ${
              isPulseVibrating ? 'scale-105 ring-4 ring-rose-300' : ''
            }`}
          >
            {/* Screen Glass Reflection */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/15 to-transparent rounded-t-[1.8rem] pointer-events-none" />

            {/* Top digital bar */}
            <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono tracking-wider">
              <span className="flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                <span>BLE 5.3</span>
              </span>
              <span>11:04 AM</span>
              <span className="text-gray-300">{devices.band.battery}%</span>
            </div>

            {/* Center Biometrics Display */}
            <div className="flex items-center justify-between px-1">
              {/* Heart rate & Animated ECG Wave */}
              <div className="flex items-center gap-2">
                <Heart
                  className={`w-6 h-6 text-rose-500 fill-rose-500 ${
                    devices.band.connected ? 'animate-pulse' : 'opacity-40'
                  }`}
                  style={{ animationDuration: `${Math.max(600, 60000 / bandBiometrics.bpm)}ms` }}
                />
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                      {bandBiometrics.bpm}
                    </span>
                    <span className="text-[10px] font-medium text-gray-400">BPM</span>
                  </div>
                  <span className="text-[9px] text-gray-400 block -mt-0.5">Ritmo cardíaco</span>
                </div>
              </div>

              {/* Stress Level Mini Gauge */}
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-gray-400 block">
                  Estrés
                </span>
                <span
                  className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                    bandBiometrics.stressLevel === 'Alto'
                      ? 'bg-rose-900/60 text-rose-300'
                      : bandBiometrics.stressLevel === 'Medio'
                      ? 'bg-amber-900/60 text-amber-300'
                      : 'bg-emerald-900/60 text-emerald-300'
                  }`}
                >
                  {bandBiometrics.stressLevel}
                </span>
              </div>
            </div>

            {/* Simulated Dynamic ECG Line */}
            <div className="w-full h-3 overflow-hidden">
              <svg className="w-full h-full text-emerald-400 opacity-80" viewBox="0 0 100 20">
                <path
                  d="M 0 10 L 20 10 L 25 3 L 30 17 L 35 10 L 50 10 L 55 2 L 60 18 L 65 10 L 100 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Bottom/Right Strap */}
          <div className="w-16 sm:w-20 h-16 bg-gradient-to-l from-[#EDEDEC] to-[#F5F5F3] rounded-r-2xl border-y border-r border-[#D6D8DC] shadow-inner flex items-center justify-end pr-2">
            <div className="w-2 h-7 bg-[#D6D8DC] rounded-full" />
          </div>
        </div>

        {/* Demo values mandatory disclaimer */}
        <div className="mt-3 text-[11px] text-amber-800/90 bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-200/60 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            <strong>Valores demostrativos:</strong> Simulación de laboratorio para validar la experiencia de usuario.
          </span>
        </div>
      </div>

      {/* Biometric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Heart Rate Card */}
        <div className="bg-[#F8F7F4] p-3.5 rounded-2xl border border-[#ECEDEF] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#50545E]">
            <span>Ritmo cardíaco</span>
            <Activity className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#292A30]">
              {bandBiometrics.bpm}
            </span>
            <span className="text-xs text-[#50545E]">BPM</span>
          </div>
          <div className="w-full bg-[#ECEDEF] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (bandBiometrics.bpm / 120) * 100)}%` }}
            />
          </div>
        </div>

        {/* Stress Meter Card */}
        <div className="bg-[#F8F7F4] p-3.5 rounded-2xl border border-[#ECEDEF] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#50545E]">
            <span>Nivel de estrés</span>
            <Zap className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="my-2 flex items-center gap-2">
            <span className="text-xl font-bold text-[#292A30]">
              {bandBiometrics.stressLevel}
            </span>
            <span className={`w-2 h-2 rounded-full ${stressInfo.dot}`} />
          </div>
          <div className="w-full bg-[#ECEDEF] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                bandBiometrics.stressLevel === 'Alto'
                  ? 'bg-rose-500 w-5/6'
                  : bandBiometrics.stressLevel === 'Medio'
                  ? 'bg-amber-500 w-3/6'
                  : 'bg-emerald-500 w-1/6'
              }`}
            />
          </div>
        </div>

        {/* Sync Emotional Status */}
        <div className="bg-[#F8F7F4] p-3.5 rounded-2xl border border-[#ECEDEF] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#50545E]">
            <span>Estado emocional</span>
            <span className="text-xs">✨</span>
          </div>
          <div className="my-2">
            <span className="text-sm font-semibold capitalize text-[#292A30]">
              {currentEmotion}
            </span>
            <p className="text-[11px] text-[#7A7E89] truncate">
              {bandBiometrics.emotionalStateText}
            </p>
          </div>
          <span className="text-[10px] text-emerald-700 font-medium">
            Sincronizado con EmotiApp
          </span>
        </div>
      </div>

      {/* Interactive Actions */}
      <div className="space-y-3 pt-2 border-t border-[#ECEDEF]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#50545E]">
            Acciones de la banda:
          </span>
          <div className="flex items-center gap-1.5 text-xs text-[#7A7E89]">
            <span>Destinatario del pulso:</span>
            <select
              value={selectedFriendIndex}
              onChange={(e) => setSelectedFriendIndex(Number(e.target.value))}
              className="bg-[#F8F7F4] border border-[#D6D8DC] rounded-lg px-2 py-0.5 text-xs text-[#292A30] font-medium"
            >
              {friends.map((f, i) => (
                <option key={f.id} value={i}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Main button: ENVIAR PULSO DE APOYO */}
          <button
            onClick={() => sendSupportPulse(targetFriend.name)}
            disabled={isPulseVibrating}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-900/10 active:scale-98 transition-all disabled:opacity-50"
          >
            <Heart className={`w-4 h-4 fill-white ${isPulseVibrating ? 'animate-bounce' : ''}`} />
            <span>ENVIAR PULSO DE APOYO</span>
          </button>

          {/* Button: Simular cambio emocional */}
          <button
            onClick={simulateBiometricChange}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#ECEDEF] hover:bg-[#DCD5F5]/60 text-[#292A30] font-semibold text-xs active:scale-98 transition-all"
          >
            <Shuffle className="w-4 h-4 text-[#4F4275]" />
            <span>Simular cambio emocional</span>
          </button>
        </div>

        {/* Pulse confirmation status */}
        {bandBiometrics.lastPulseSent && bandBiometrics.lastPulseSent !== 'Nunca' && (
          <div className="text-[11px] text-[#2D5A3C] bg-[#D9E8DE]/40 p-2.5 rounded-xl border border-[#C2D8C9] flex items-center justify-between">
            <span>Último pulso enviado: {bandBiometrics.lastPulseSent}</span>
            <span className="font-semibold">Recibido por {targetFriend.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};
