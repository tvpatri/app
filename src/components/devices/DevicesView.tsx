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
  Smartphone
} from 'lucide-react';

export const DevicesView: React.FC = () => {
  const {
    botName,
    setBotName,
    enterFullscreenDevice,
    setActiveTab,
    setEmotiAppSubTab,
    currentEmotion,
  } = useEmoti();

  const [inputName, setInputName] = useState(botName);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    setBotName(inputName.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Intro section banner */}
      <div className="bg-gradient-to-br from-[#F8F7F4] to-[#ECEDEF] p-5 rounded-3xl border border-[#ECEDEF]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-[#4F4275] bg-[#DCD5F5]/60 px-2 py-0.5 rounded-md">
                Experiencia Inmersiva
              </span>
              <span className="text-xs text-[#7A7E89]">Transformación de Pantalla</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#292A30] mt-1 tracking-tight">
              Ecosistema Físico EMOTI
            </h1>
            <p className="text-xs sm:text-sm text-[#50545E] mt-1 max-w-xl">
              Activa los simuladores a pantalla completa para convertir tu smartphone en tu robot compañero <strong>{botName}</strong> o en la pulsera sensorial <strong>Emoti-Band</strong>.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('emotiapp');
              setEmotiAppSubTab('mood');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#292A30] text-white hover:bg-black text-xs font-semibold shadow-xs shrink-0 self-start sm:self-center transition-transform active:scale-95"
          >
            <span>Ir a Mood Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* TWO LARGE PREMIUM DEVICE CARDS (Required by prompt) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CARD 1: EMOTI-BOT */}
        <div className="bg-gradient-to-br from-white via-white to-[#DCD5F5]/30 rounded-3xl p-6 border border-[#ECEDEF] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#DCD5F5] transition-all">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#292A30] text-[#8BE9FD] flex items-center justify-center shadow-md">
                <Bot className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#DCD5F5]/70 text-[#4F4275]">
                OLED Fullscreen
              </span>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-[#292A30] tracking-tight">
                Tu Emoti-Bot {botName !== 'Emoti' && <span className="text-[#4F4275]">({botName})</span>}
              </h3>
              <p className="text-xs sm:text-sm text-[#50545E] mt-1 leading-relaxed">
                Convierte tu celular en tu compañero emocional.
              </p>
            </div>
          </div>

          {/* Device Action Button */}
          <div className="pt-6 relative z-10">
            <button
              onClick={() => enterFullscreenDevice('bot')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#292A30] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md shadow-black/10 transition-transform active:scale-98"
            >
              <Maximize2 className="w-4 h-4 text-[#8BE9FD]" />
              <span>Activar Emoti-Bot</span>
            </button>
          </div>

          {/* Ambient background decoration */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[#DCD5F5]/40 blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
        </div>

        {/* CARD 2: EMOTI-BAND */}
        <div className="bg-gradient-to-br from-white via-white to-[#D9E8DE]/40 rounded-3xl p-6 border border-[#ECEDEF] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#D9E8DE] transition-all">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#292A30] text-emerald-400 flex items-center justify-center shadow-md">
                <Watch className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#D9E8DE] text-[#2D5A3C]">
                Wearable OS
              </span>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-[#292A30] tracking-tight">
                Tu Emoti-Band
              </h3>
              <p className="text-xs sm:text-sm text-[#50545E] mt-1 leading-relaxed">
                Transforma tu pantalla en una pulsera inteligente.
              </p>
            </div>
          </div>

          {/* Device Action Button */}
          <div className="pt-6 relative z-10">
            <button
              onClick={() => enterFullscreenDevice('band')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#292A30] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md shadow-black/10 transition-transform active:scale-98"
            >
              <Maximize2 className="w-4 h-4 text-emerald-400" />
              <span>Activar Emoti-Band</span>
            </button>
          </div>

          {/* Ambient background decoration */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[#D9E8DE]/50 blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
        </div>
      </div>

      {/* PERSONALIZA TU EMOTI-BOT SECTION */}
      <div className="bg-white rounded-3xl p-5 border border-[#ECEDEF] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#DCD5F5] text-[#4F4275] flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#292A30]">Personaliza tu Emoti-Bot</h3>
              <p className="text-xs text-[#50545E]">
                Asigna un nombre especial a tu robot compañero.
              </p>
            </div>
          </div>

          {/* Live speech preview badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F8F7F4] border border-[#ECEDEF] text-xs font-semibold text-[#292A30]">
            <span>"Hola, soy {botName}."</span>
          </div>
        </div>

        <form onSubmit={handleSaveName} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="Ej. Milo, Lumi, Neko, Emoti..."
              className="w-full bg-[#F8F7F4] border border-[#D6D8DC] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#292A30] font-medium focus:outline-none focus:ring-2 focus:ring-[#DCD5F5]"
              maxLength={24}
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#292A30] hover:bg-black text-white text-xs font-semibold rounded-xl transition-all shadow-xs shrink-0 active:scale-95"
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>¡Guardado!</span>
              </>
            ) : (
              <span>Guardar nombre</span>
            )}
          </button>
        </form>

        <p className="text-[11px] text-[#7A7E89] italic">
          El nombre personalizado aparecerá en la pantalla OLED de transformación, en el dashboard y en las notificaciones del sistema.
        </p>
      </div>

      {/* Bluetooth Connection Simulator */}
      <BluetoothPairing />

      {/* Interactive Emoti-Bot Simulator (Desktop/Preview mode) */}
      <EmotiBot />

      {/* Interactive Emoti-Band Simulator (Desktop/Preview mode) */}
      <EmotiBand />

      {/* Architecture Footnote */}
      <div className="p-4 rounded-2xl bg-white border border-[#ECEDEF] text-xs text-[#50545E] space-y-2">
        <h4 className="font-bold text-[#292A30] flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-600" />
          <span>Sincronización multi-dispositivo en tiempo real</span>
        </h4>
        <p className="leading-relaxed">
          Tanto en modo pantalla completa como en la vista general, cualquier cambio de emoción o pulso de apoyo actualiza automáticamente todo el ecosistema <strong>EMOTI</strong>.
        </p>
      </div>
    </div>
  );
};
