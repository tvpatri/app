import React, { useState } from 'react';
import { useEmoti } from '../../context/EmotiContext';
import { EMOTIONS_CONFIG } from '../../data/emotionsData';
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
  Maximize2,
  Watch,
  Sparkles,
  Gauge
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
    triggerSparkBurst,
    showToast
  } = useEmoti();

  const [selectedFriendIndex, setSelectedFriendIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const targetFriend = friends[selectedFriendIndex] || friends[0];
  const currentEmotionMeta = EMOTIONS_CONFIG[currentEmotion];

  const handleScanBiometrics = () => {
    setIsScanning(true);
    simulateBiometricChange();
    triggerSparkBurst();
    showToast('Escaneando biometría sensorial...', 'info');
    setTimeout(() => {
      setIsScanning(false);
      showToast('¡Medición psicofisiológica actualizada!', 'success');
    }, 1500);
  };

  const handleSendPulse = () => {
    sendSupportPulse(targetFriend.name, targetFriend.id);
    triggerSparkBurst();
  };

  // Helper for stress styling with user brand tokens
  const getStressBadge = () => {
    switch (bandBiometrics.stressLevel) {
      case 'Alto':
        return {
          bg: 'bg-[#FF80B5]/20 text-[#A31652] border-[#FF80B5]',
          dot: 'bg-[#FF80B5]',
          percent: 85,
        };
      case 'Medio':
        return {
          bg: 'bg-[#FFD65A]/25 text-[#946200] border-[#FFD65A]',
          dot: 'bg-[#FFD65A]',
          percent: 50,
        };
      case 'Bajo':
      default:
        return {
          bg: 'bg-[#72D6B1]/20 text-[#1D6E50] border-[#72D6B1]',
          dot: 'bg-[#72D6B1]',
          percent: 22,
        };
    }
  };

  const stressInfo = getStressBadge();

  // SVG Circular Gauge helper
  const renderCircleGauge = (percent: number, color: string, size = 64, stroke = 5) => {
    const radius = (size - stroke * 2) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 border-2 border-[#FFD65A]/50 shadow-sm relative overflow-hidden space-y-5 animate-pop-in">
      {/* Device Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#72D6B1] to-[#79B9F2] text-[#1D6E50] flex items-center justify-center font-black shadow-xs">
              <Watch className="w-5 h-5" />
            </div>
            <h3 className="font-black text-base text-[#28243A]">Emoti-Band</h3>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#72D6B1]/25 text-[#1D6E50] border border-[#72D6B1]/40">
              Sensor Háptico
            </span>
          </div>
          <p className="text-xs text-[#28243A]/70 font-medium mt-0.5">
            Pulsera sensorial háptica · Detección psicofisiológica simulada
          </p>
        </div>

        <button
          onClick={() => enterFullscreenDevice('band')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#28243A] text-white hover:bg-black text-xs font-black shadow-xs transition-all hover:scale-105 active:scale-95"
          title="Convertir pantalla en pulsera inteligente"
        >
          <Maximize2 className="w-3.5 h-3.5 text-[#72D6B1]" />
          <span>Pantalla completa</span>
        </button>
      </div>

      {/* Realistic Smart Bracelet Rendering with Dynamic Neon Halo & Light Bursts */}
      <div className="relative py-4 flex flex-col items-center justify-center">
        {/* Support pulse radiant light halo */}
        {isPulseVibrating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="w-72 h-72 rounded-full border-4 border-[#FF80B5] animate-ping" />
            <div className="w-56 h-56 rounded-full bg-gradient-to-tr from-[#FF80B5]/40 to-[#FF936F]/40 blur-xl animate-pulse" />
          </div>
        )}

        {/* Laser scanner effect */}
        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="w-64 h-64 rounded-full bg-[#72D6B1]/20 blur-xl animate-ping" />
          </div>
        )}

        {/* Bracelet Strap Silhouette */}
        <div className="relative w-full max-w-sm flex items-center justify-center">
          {/* Left Strap */}
          <div className="w-16 sm:w-20 h-20 bg-gradient-to-r from-[#EDEDEC] to-[#F5F5F3] rounded-l-2xl border-y-2 border-l-2 border-[#D6D8DC] shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-10 bg-[#D6D8DC] rounded-full" />
          </div>

          {/* Central Curved Smart Core Capsule with Dynamic Bezel Ring */}
          <div
            className={`relative z-10 w-56 sm:w-64 h-36 bg-[#141518] rounded-[2.5rem] p-3.5 shadow-[0_16px_36px_-6px_rgba(40,36,58,0.35),0_0_0_2px_#FFF] border-2 transition-all duration-300 flex flex-col justify-between ${
              isPulseVibrating 
                ? 'scale-105 ring-4 ring-[#FF80B5]' 
                : 'hover:scale-101'
            }`}
            style={{ borderColor: currentEmotionMeta.accentHex }}
          >
            {/* Screen Glass Reflection */}
            <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-white/15 to-transparent rounded-t-[2.3rem] pointer-events-none" />

            {/* Top digital bar */}
            <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono tracking-wider">
              <span className="flex items-center gap-1 text-[#72D6B1]">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>BLE 5.3</span>
              </span>
              <span className="text-white font-bold">11:04 AM</span>
              <span className="text-[#FFD65A] font-bold">{devices.band.battery}%</span>
            </div>

            {/* Center Biometrics Display with Circular Gauges */}
            <div className="flex items-center justify-between px-1 my-auto">
              {/* Heart Rate + Circular Mini Gauge */}
              <div className="flex items-center gap-2">
                <div className="relative flex items-center justify-center">
                  {renderCircleGauge(Math.min(100, (bandBiometrics.bpm / 120) * 100), '#FF80B5', 48, 4)}
                  <Heart
                    className={`w-5 h-5 text-[#FF80B5] fill-[#FF80B5] absolute ${
                      devices.band.connected ? 'animate-pulse' : 'opacity-40'
                    }`}
                    style={{ animationDuration: `${Math.max(500, 60000 / bandBiometrics.bpm)}ms` }}
                  />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                      {bandBiometrics.bpm}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">BPM</span>
                  </div>
                  <span className="text-[9px] text-gray-400 block -mt-0.5">Ritmo cardíaco</span>
                </div>
              </div>

              {/* Stress Circular Gauge */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block">
                    Estrés
                  </span>
                  <span
                    className="text-[11px] font-black font-mono px-2 py-0.5 rounded-full inline-block mt-0.5"
                    style={{ backgroundColor: `${currentEmotionMeta.accentHex}30`, color: currentEmotionMeta.accentHex }}
                  >
                    {bandBiometrics.stressLevel}
                  </span>
                </div>
                <div className="relative flex items-center justify-center">
                  {renderCircleGauge(stressInfo.percent, currentEmotionMeta.accentHex, 40, 3.5)}
                  <Zap className="w-3.5 h-3.5 absolute" style={{ color: currentEmotionMeta.accentHex }} />
                </div>
              </div>
            </div>

            {/* Dynamic Real-Time Animated ECG Wave */}
            <div className="w-full h-4 overflow-hidden relative">
              <svg className="w-full h-full" viewBox="0 0 100 20">
                <defs>
                  <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#72D6B1" />
                    <stop offset="50%" stopColor="#79B9F2" />
                    <stop offset="100%" stopColor="#FF80B5" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 10 L 18 10 L 23 2 L 28 18 L 33 10 L 48 10 L 53 2 L 58 18 L 63 10 L 100 10"
                  fill="none"
                  stroke="url(#ecgGrad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={devices.band.connected ? 'animate-pulse' : ''}
                />
              </svg>
            </div>
          </div>

          {/* Right Strap */}
          <div className="w-16 sm:w-20 h-20 bg-gradient-to-l from-[#EDEDEC] to-[#F5F5F3] rounded-r-2xl border-y-2 border-r-2 border-[#D6D8DC] shadow-inner flex items-center justify-end pr-3">
            <div className="w-2.5 h-8 bg-[#D6D8DC] rounded-full" />
          </div>
        </div>

        {/* Mandatory simulated biometrics disclaimer */}
        <div className="mt-4 text-xs text-[#946200] bg-[#FFD65A]/25 px-4 py-2 rounded-2xl border border-[#FFD65A]/60 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#946200] shrink-0" />
          <span>
            <strong>Datos biométricos simulados:</strong> Entorno educativo de laboratorio para prototipado emocional.
          </span>
        </div>
      </div>

      {/* 3 Circular Animated Wellbeing Gauges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1: BPM */}
        <div className="bg-[#FFF9F0] p-4 rounded-3xl border-2 border-[#FF80B5]/40 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-bold text-[#28243A]/70">Ritmo Cardíaco</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black font-mono text-[#28243A]">
                {bandBiometrics.bpm}
              </span>
              <span className="text-xs font-bold text-[#FF80B5]">BPM</span>
            </div>
            <span className="text-[10px] text-[#28243A]/60 font-medium">Zona estable</span>
          </div>
          <div className="relative flex items-center justify-center">
            {renderCircleGauge(Math.min(100, (bandBiometrics.bpm / 120) * 100), '#FF80B5', 54, 5)}
            <Heart className="w-5 h-5 text-[#FF80B5] fill-[#FF80B5] absolute animate-pulse" />
          </div>
        </div>

        {/* Metric 2: Stress Index */}
        <div className="bg-[#FFF9F0] p-4 rounded-3xl border-2 border-[#FFD65A]/50 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-bold text-[#28243A]/70">Nivel de Estrés</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-[#28243A]">
                {bandBiometrics.stressLevel}
              </span>
            </div>
            <span className="text-[10px] text-[#28243A]/60 font-medium">Modulación activa</span>
          </div>
          <div className="relative flex items-center justify-center">
            {renderCircleGauge(stressInfo.percent, '#FFD65A', 54, 5)}
            <Zap className="w-5 h-5 text-[#946200] fill-[#FFD65A] absolute" />
          </div>
        </div>

        {/* Metric 3: Harmony Balance */}
        <div className="bg-[#FFF9F0] p-4 rounded-3xl border-2 border-[#72D6B1]/50 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-bold text-[#28243A]/70">Armonía Emocional</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-black capitalize text-[#1D6E50] truncate max-w-[100px]">
                {currentEmotion}
              </span>
            </div>
            <span className="text-[10px] text-[#28243A]/60 font-medium truncate block">
              {bandBiometrics.emotionalStateText}
            </span>
          </div>
          <div className="relative flex items-center justify-center">
            {renderCircleGauge(78, '#72D6B1', 54, 5)}
            <span className="text-base absolute">{currentEmotionMeta.emoji}</span>
          </div>
        </div>
      </div>

      {/* Interactive Actions & Support Pulse Trigger */}
      <div className="space-y-3 pt-2 border-t border-[#FFD65A]/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-black text-[#28243A]">
            Acciones & Pulso Háptico:
          </span>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[#28243A]/70">Enviar apoyo a:</span>
            <select
              value={selectedFriendIndex}
              onChange={(e) => setSelectedFriendIndex(Number(e.target.value))}
              className="bg-[#FFF9F0] border-2 border-[#FFD65A]/60 rounded-xl px-2.5 py-1 text-xs text-[#28243A] font-bold focus:outline-none"
            >
              {friends.map((f, i) => (
                <option key={f.id} value={i}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Main button: ENVIAR PULSO DE APOYO */}
          <button
            onClick={handleSendPulse}
            disabled={isPulseVibrating}
            className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#FF936F] via-[#FF80B5] to-[#B69AF5] hover:scale-102 text-white font-black text-xs shadow-[0_4px_16px_rgba(255,128,181,0.4)] active:scale-95 transition-all disabled:opacity-50 border border-white"
          >
            <Heart className={`w-4 h-4 fill-white ${isPulseVibrating ? 'animate-bounce' : ''}`} />
            <span>ENVIAR PULSO DE APOYO HÁPTICO</span>
          </button>

          {/* Button: Escanear / Simular cambio biométrico */}
          <button
            onClick={handleScanBiometrics}
            disabled={isScanning}
            className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#FFF9F0] hover:bg-[#FFF2DE] border-2 border-[#72D6B1]/60 text-[#1D6E50] font-black text-xs hover:scale-102 active:scale-95 transition-all shadow-2xs"
          >
            <Activity className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Midiendo biometría...' : 'Medir estado psicofisiológico'}</span>
          </button>
        </div>

        {/* Pulse confirmation status */}
        {bandBiometrics.lastPulseSent && bandBiometrics.lastPulseSent !== 'Nunca' && (
          <div className="text-xs font-bold text-[#1D6E50] bg-[#72D6B1]/20 p-3 rounded-2xl border border-[#72D6B1]/50 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Último pulso enviado: {bandBiometrics.lastPulseSent}</span>
            </span>
            <span className="font-black">Recibido por {targetFriend.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};
