import React, { useState } from 'react';
import { BluetoothPairing } from './BluetoothPairing';
import { EmotiBot } from './EmotiBot';
import { EmotiBand } from './EmotiBand';
import { useEmoti } from '../../context/EmotiContext';
import { 
  Bot, 
  Watch, 
  Maximize2, 
  Sparkles, 
  Edit3, 
  Check, 
  ArrowRight,
  Cpu,
  Smartphone,
  Radio,
  Zap
} from 'lucide-react';

export const DevicesView: React.FC = () => {
  const {
    botName,
    setBotName,
    enterFullscreenDevice,
    setActiveTab,
    setEmotiAppSubTab,
    currentEmotion,
    triggerSparkBurst,
    showToast
  } = useEmoti();

  const [inputName, setInputName] = useState(botName);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    setBotName(inputName.trim());
    setIsSaved(true);
    triggerSparkBurst();
    showToast(`¡Nombre de tu robot actualizado a ${inputName.trim()}!`, 'success');
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-24 animate-pop-in">
      {/* Intro section banner with vibrant gradient */}
      <div className="bg-gradient-to-r from-[#FFF2DE] via-[#FFF9F0] to-[#FFD65A]/30 p-5 sm:p-6 rounded-3xl border-2 border-[#FFD65A]/50 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-black text-[#58399E] bg-[#B69AF5]/25 border border-[#B69AF5]/40 px-3 py-0.5 rounded-full shadow-2xs">
                Experiencia Inmersiva
              </span>
              <span className="text-xs font-bold text-[#FF936F]">Hardware Empático</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#28243A] mt-1.5 tracking-tight flex items-center gap-2">
              <span>Ecosistema Físico EMOTI</span>
              <span className="text-2xl animate-bounce">🤖⚡</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#28243A]/70 font-medium mt-1 max-w-xl">
              Activa los simuladores a pantalla completa para convertir tu smartphone en tu robot compañero <strong>{botName}</strong> o en la pulsera sensorial <strong>Emoti-Band</strong>.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('emotiapp');
              setEmotiAppSubTab('mood');
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FFD65A] to-[#FF936F] text-[#28243A] text-xs font-black shadow-xs shrink-0 self-start sm:self-center transition-all hover:scale-105 active:scale-95"
          >
            <span>Ir a Mood Tracker</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Decorative blur orbs */}
        <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-[#FFD65A]/40 blur-2xl pointer-events-none" />
        <div className="absolute right-28 -top-8 w-24 h-24 rounded-full bg-[#FF80B5]/20 blur-xl pointer-events-none" />
      </div>

      {/* TWO LARGE PREMIUM DEVICE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CARD 1: EMOTI-BOT */}
        <div className="bg-gradient-to-br from-white via-white to-[#B69AF5]/20 rounded-3xl p-6 border-2 border-[#B69AF5]/50 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#B69AF5] hover:shadow-md transition-all">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#79B9F2] to-[#B69AF5] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Bot className="w-7 h-7" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#B69AF5]/25 text-[#58399E] border border-[#B69AF5]/40">
                OLED Fullscreen
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-[#28243A] tracking-tight">
                Emoti-Bot {botName !== 'Emoti' && <span className="text-[#58399E]">({botName})</span>}
              </h3>
              <p className="text-xs sm:text-sm text-[#28243A]/70 font-medium mt-1 leading-relaxed">
                Convierte la pantalla completa de tu teléfono en la cara expresiva y parlante de tu robot compañero.
              </p>
            </div>
          </div>

          {/* Device Action Button */}
          <div className="pt-6 relative z-10">
            <button
              onClick={() => enterFullscreenDevice('bot')}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#79B9F2] to-[#B69AF5] text-white text-xs sm:text-sm font-black shadow-[0_4px_16px_rgba(182,154,245,0.4)] transition-all hover:scale-103 active:scale-95 border border-white"
            >
              <Maximize2 className="w-4 h-4 text-white" />
              <span>Activar Emoti-Bot Pantalla Completa</span>
            </button>
          </div>
        </div>

        {/* CARD 2: EMOTI-BAND */}
        <div className="bg-gradient-to-br from-white via-white to-[#72D6B1]/20 rounded-3xl p-6 border-2 border-[#72D6B1]/50 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#72D6B1] hover:shadow-md transition-all">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#72D6B1] to-[#79B9F2] text-[#1D6E50] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Watch className="w-7 h-7" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#72D6B1]/25 text-[#1D6E50] border border-[#72D6B1]/40">
                Wearable OS
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-[#28243A] tracking-tight">
                Emoti-Band Pulsera Háptica
              </h3>
              <p className="text-xs sm:text-sm text-[#28243A]/70 font-medium mt-1 leading-relaxed">
                Transforma tu pantalla en una pulsera inteligente con pulsómetro, biometría y pulso de apoyo hápitco.
              </p>
            </div>
          </div>

          {/* Device Action Button */}
          <div className="pt-6 relative z-10">
            <button
              onClick={() => enterFullscreenDevice('band')}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#72D6B1] to-[#79B9F2] text-[#28243A] text-xs sm:text-sm font-black shadow-[0_4px_16px_rgba(114,214,177,0.4)] transition-all hover:scale-103 active:scale-95 border border-white"
            >
              <Maximize2 className="w-4 h-4 text-[#1D6E50]" />
              <span>Activar Emoti-Band Pantalla Completa</span>
            </button>
          </div>
        </div>
      </div>

      {/* PERSONALIZA TU EMOTI-BOT SECTION */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#FFD65A]/50 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FFD65A] to-[#FF936F] text-[#28243A] flex items-center justify-center font-black shadow-xs">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-[#28243A]">Personaliza a tu Robot</h3>
              <p className="text-xs text-[#28243A]/70 font-medium">
                Asigna un nombre único y especial a tu compañero emocional.
              </p>
            </div>
          </div>

          {/* Live speech preview badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#FFF9F0] border-2 border-[#FFD65A]/40 text-xs font-black text-[#28243A]">
            <span>🤖 "Hola, soy {botName}."</span>
          </div>
        </div>

        <form onSubmit={handleSaveName} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="Ej. Milo, Lumi, Neko, Emoti..."
              className="w-full bg-[#FFF9F0] border-2 border-[#FFD65A]/50 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-[#28243A] font-bold focus:outline-none focus:border-[#FF936F]"
              maxLength={24}
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-[#FFD65A] via-[#FF936F] to-[#FF80B5] text-[#28243A] text-xs font-black rounded-2xl transition-all shadow-xs shrink-0 hover:scale-105 active:scale-95"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>¡Guardado!</span>
              </>
            ) : (
              <span>Guardar nombre</span>
            )}
          </button>
        </form>

        <p className="text-xs text-[#28243A]/60 italic font-medium">
          El nombre personalizado se sincronizará en la pantalla OLED de transformación, en el dashboard, en tus conversaciones con IA y en las notificaciones.
        </p>
      </div>

      {/* Bluetooth Connection Simulator */}
      <BluetoothPairing />

      {/* Interactive Emoti-Bot Simulator (Desktop/Preview mode) */}
      <EmotiBot />

      {/* Interactive Emoti-Band Simulator (Desktop/Preview mode) */}
      <EmotiBand />

      {/* Architecture Footnote */}
      <div className="p-4 rounded-3xl bg-[#FFF2DE] border-2 border-[#FFD65A]/50 text-xs text-[#28243A] space-y-1.5 shadow-2xs">
        <h4 className="font-black text-[#28243A] flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#FF936F]" />
          <span>Sincronización multi-dispositivo en tiempo real</span>
        </h4>
        <p className="font-medium text-[#28243A]/80 leading-relaxed">
          Tanto en modo pantalla completa como en la vista general, cualquier cambio de emoción o pulso de apoyo actualiza automáticamente todo el ecosistema <strong>EMOTI</strong>.
        </p>
      </div>
    </div>
  );
};
