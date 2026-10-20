import React from 'react';
import { useEmoti } from '../../context/EmotiContext';
import { EMOTIONS_CONFIG } from '../../data/emotionsData';
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
  Send
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const {
    currentEmotion,
    devices,
    friends,
    totalSparksSent,
    totalPulsesSent,
    setEmotiAppSubTab,
    setActiveTab,
    todayNote,
    botName,
  } = useEmoti();

  const currentMeta = EMOTIONS_CONFIG[currentEmotion];
  const onlineFriends = friends.filter((f) => f.isOnline);

  return (
    <div className="space-y-5 pb-20">
      {/* Welcome Greeting */}
      <div>
        <span className="text-xs uppercase tracking-wider font-semibold text-[#50545E]">
          Miércoles, 14 de Octubre
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292A30] tracking-tight mt-0.5">
          Hola, ¿cómo te sientes hoy?
        </h1>
      </div>

      {/* Hero Inspirational Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#DCD5F5]/50 via-[#F5DFD3]/40 to-[#D9E8DE]/40 rounded-3xl p-5 sm:p-6 border border-[#ECEDEF] shadow-xs">
        <div className="relative z-10 max-w-lg space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-xs text-[11px] font-semibold text-[#4F4275] border border-white/60">
            <Sparkles className="w-3 h-3 text-[#4F4275]" />
            <span>Bienestar Diario</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#292A30] tracking-tight">
            Tu bienestar también importa.
          </h2>
          <p className="text-xs sm:text-sm text-[#50545E] leading-relaxed">
            Un pequeño momento para conectar contigo, escuchar lo que sientes y recordar que cuentas con una red que te apoya.
          </p>
          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => {
                setActiveTab('emotiapp');
                setEmotiAppSubTab('mood');
              }}
              className="px-4 py-2 bg-[#292A30] text-white hover:bg-black text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>Registrar emoción</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('circle')}
              className="px-4 py-2 bg-white/90 hover:bg-white text-[#292A30] text-xs font-semibold rounded-xl border border-[#D6D8DC] shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>Ver Mi Círculo ({friends.length})</span>
            </button>
          </div>
        </div>

        {/* Decorative soft pastel orbs */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-[#DCD5F5]/40 blur-2xl pointer-events-none" />
        <div className="absolute right-20 -top-10 w-36 h-36 rounded-full bg-[#F5DFD3]/40 blur-2xl pointer-events-none" />
      </div>

      {/* Today's Emotional Status Widget */}
      <div className="bg-white rounded-3xl p-5 border border-[#ECEDEF] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentMeta.emoji}</span>
            <h3 className="font-bold text-sm text-[#292A30]">
              Estado emocional de hoy: <span className="capitalize">{currentMeta.label}</span>
            </h3>
          </div>
          <button
            onClick={() => setEmotiAppSubTab('mood')}
            className="text-xs font-semibold text-[#4F4275] hover:underline flex items-center gap-1"
          >
            <span>Cambiar</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className={`p-4 rounded-2xl border ${currentMeta.colorBg} ${currentMeta.colorBorder} space-y-2`}>
          <p className="text-xs sm:text-sm font-medium text-[#292A30] leading-relaxed">
            "{currentMeta.supportMessage}"
          </p>
          {todayNote && (
            <div className="pt-2 border-t border-black/5 flex items-center gap-2 text-[11px] text-[#50545E]">
              <span className="font-semibold">Nota personal:</span>
              <span className="italic">{todayNote}</span>
            </div>
          )}
        </div>
      </div>

      {/* Connected Devices Live Sync Summary */}
      <div className="bg-white rounded-3xl p-5 border border-[#ECEDEF] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#292A30]">Dispositivos sincronizados</h3>
            <p className="text-xs text-[#50545E]">
              Estado del hardware Emoti vinculado a esta sesión
            </p>
          </div>
          <button
            onClick={() => setActiveTab('devices')}
            className="text-xs font-semibold text-[#292A30] bg-[#ECEDEF] px-3 py-1.5 rounded-xl hover:bg-[#DCD5F5]/60 transition-colors"
          >
            Administrar
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Bot mini status */}
          <div
            onClick={() => setActiveTab('devices')}
            className="p-3.5 rounded-2xl bg-[#F8F7F4] border border-[#ECEDEF] flex items-center justify-between cursor-pointer hover:border-[#DCD5F5] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#DCD5F5] text-[#4F4275] flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-[#292A30]">
                  {botName} <span className="text-[10px] text-[#7A7E89] font-normal">(Emoti-Bot)</span>
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-[#50545E]">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      devices.bot.connected ? 'bg-emerald-500' : 'bg-gray-400'
                    }`}
                  />
                  <span>
                    {devices.bot.connected ? 'Expresión sincronizada' : 'Desconectado'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right font-mono text-xs text-[#50545E]">
              {devices.bot.battery}%
            </div>
          </div>

          {/* Band mini status */}
          <div
            onClick={() => setActiveTab('devices')}
            className="p-3.5 rounded-2xl bg-[#F8F7F4] border border-[#ECEDEF] flex items-center justify-between cursor-pointer hover:border-[#D9E8DE] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D9E8DE] text-[#2D5A3C] flex items-center justify-center">
                <Watch className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-[#292A30]">Emoti-Band</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-[#50545E]">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      devices.band.connected ? 'bg-emerald-500' : 'bg-gray-400'
                    }`}
                  />
                  <span>
                    {devices.band.connected ? 'Sensor sensorial activo' : 'Desconectado'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right font-mono text-xs text-[#50545E]">
              {devices.band.battery}%
            </div>
          </div>
        </div>
      </div>

      {/* Friends Activity & Red de Apoyo Snapshot */}
      <div className="bg-white rounded-3xl p-5 border border-[#ECEDEF] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#292A30]">Actividad de amigos</h3>
            <p className="text-xs text-[#50545E]">
              {onlineFriends.length} amigos en línea ahora mismo
            </p>
          </div>
          <button
            onClick={() => setActiveTab('circle')}
            className="text-xs font-semibold text-[#4F4275] hover:underline"
          >
            Ver todos
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {friends.map((friend) => (
            <div
              key={friend.id}
              onClick={() => setActiveTab('circle')}
              className="p-3 rounded-2xl bg-[#F8F7F4] border border-[#ECEDEF] hover:border-[#DCD5F5] transition-all cursor-pointer text-center space-y-1.5 group"
            >
              <div className="relative inline-block mx-auto">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: friend.avatarBg, color: friend.avatarColor }}
                >
                  {friend.avatarInitials}
                </div>
                {friend.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#292A30] truncate">{friend.name}</h4>
                <p className="text-[10px] text-[#7A7E89] capitalize truncate">
                  {friend.sharedMood || 'En pausa'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Support Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => setEmotiAppSubTab('guide')}
          className="p-4 rounded-2xl bg-white border border-[#ECEDEF] hover:border-[#DCD5F5] transition-all text-left flex items-start gap-3 shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-[#DCD5F5]/60 text-[#4F4275] flex items-center justify-center shrink-0">
            <MessageCircleHeart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#292A30]">Guía de Diálogo</h4>
            <p className="text-[11px] text-[#50545E] mt-0.5">
              Consejos prácticos para resolver malentendidos y conversar asertivamente.
            </p>
          </div>
        </button>

        <button
          onClick={() => setEmotiAppSubTab('progress')}
          className="p-4 rounded-2xl bg-white border border-[#ECEDEF] hover:border-[#D9E8DE] transition-all text-left flex items-start gap-3 shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-[#D9E8DE]/60 text-[#2D5A3C] flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#292A30]">Mi Progreso</h4>
            <p className="text-[11px] text-[#50545E] mt-0.5">
              {totalSparksSent} chispas enviadas · Historial y reflexiones personales.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
