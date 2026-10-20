import React, { useState } from 'react';
import { useEmoti } from '../../context/EmotiContext';
import { Friend } from '../../types';
import { EMOTIONS_CONFIG } from '../../data/emotionsData';
import { QUICK_SPARK_MESSAGES } from '../../data/mockData';
import { 
  Users, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  Lock, 
  X, 
  Clock, 
  Heart,
  MessageCircle,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const FriendsNetwork: React.FC = () => {
  const {
    friends,
    sendEnergySpark,
    sparksHistory,
    totalSparksSent,
    triggerSparkBurst,
    showToast
  } = useEmoti();

  const [activeFriendForSpark, setActiveFriendForSpark] = useState<Friend | null>(null);
  const [selectedMessage, setSelectedMessage] = useState(QUICK_SPARK_MESSAGES[0]);
  const [customMessage, setCustomMessage] = useState('');

  const handleSend = () => {
    if (!activeFriendForSpark) return;
    const finalMsg = customMessage.trim() || selectedMessage;
    sendEnergySpark(activeFriendForSpark.id, finalMsg);
    triggerSparkBurst();
    showToast(`¡Chispa de energía enviada a ${activeFriendForSpark.name}! ✨`, 'spark');
    setActiveFriendForSpark(null);
    setCustomMessage('');
  };

  return (
    <div className="space-y-6 pb-24 animate-pop-in">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-wider font-black text-[#1D6E50] bg-[#72D6B1]/25 border border-[#72D6B1]/40 px-3 py-1 rounded-xl shadow-xs">
          Red Social Consciente
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#28243A] tracking-tight mt-1.5 flex items-center gap-2">
          <span>Amigos & Energy Sparks</span>
          <span className="text-2xl animate-bounce">⚡</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#28243A]/70 font-medium mt-1">
          Comparte energía positiva, acompáñate de tu círculo de confianza y envía chispas sin invadir su espacio.
        </p>
      </div>

      {/* Spark Stats Banner */}
      <div className="bg-gradient-to-r from-[#FFD65A]/30 via-[#FF936F]/25 to-[#FF80B5]/30 rounded-3xl p-4 sm:p-5 border-2 border-[#FFD65A]/50 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FFD65A] to-[#FF936F] text-[#28243A] flex items-center justify-center font-black shadow-xs">
            <Zap className="w-6 h-6 fill-[#28243A]" />
          </div>
          <div>
            <h3 className="font-black text-sm text-[#28243A]">Total de Chispas Enviadas</h3>
            <p className="text-xs text-[#28243A]/70 font-medium">Cada chispa ilumina el día de un amigo</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl sm:text-3xl font-black text-[#28243A] font-mono">
            {totalSparksSent}
          </span>
          <span className="block text-[10px] font-bold text-[#A03E15]">SPARKS ✨</span>
        </div>
      </div>

      {/* Friends Cards List with large colorful avatars and rich cards */}
      <div className="space-y-3.5">
        {friends.map((friend) => {
          const moodMeta = friend.sharedMood ? EMOTIONS_CONFIG[friend.sharedMood] : null;

          return (
            <div
              key={friend.id}
              className="bg-white rounded-3xl p-5 border-2 border-[#FFD65A]/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#FF936F] transition-all hover:shadow-md group"
            >
              {/* Left: Avatar & Info */}
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black text-base sm:text-lg shadow-sm border-2 border-white transition-transform group-hover:scale-105"
                    style={{ backgroundColor: friend.avatarBg, color: friend.avatarColor }}
                  >
                    {friend.avatarInitials}
                  </div>
                  {friend.isOnline && (
                    <span
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#72D6B1] border-2 border-white shadow-xs animate-pulse"
                      title="En línea"
                    />
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base text-[#28243A]">
                      {friend.name}
                    </h3>
                    <span 
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        friend.isOnline 
                          ? 'bg-[#72D6B1]/20 text-[#1D6E50] border-[#72D6B1]/40' 
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}
                    >
                      {friend.isOnline ? 'En línea' : 'Desconectado'}
                    </span>
                  </div>

                  {/* Shared Mood Badge */}
                  {moodMeta ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-[#28243A]/80">
                      <span>Estado:</span>
                      <span 
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl border font-black capitalize"
                        style={{ backgroundColor: `${moodMeta.accentHex}30`, borderColor: moodMeta.accentHex, color: moodMeta.colorText }}
                      >
                        <span>{moodMeta.emoji}</span>
                        <span>{moodMeta.label}</span>
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-[#28243A]/50 italic">Estado reservado</span>
                  )}

                  {/* Status Quote */}
                  <p className="text-xs text-[#28243A]/70 italic font-medium">
                    "{friend.statusQuote}"
                  </p>
                </div>
              </div>

              {/* Right: Sparks Received & Send Spark Action */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-[#FFD65A]/20">
                <div className="text-[11px] text-left sm:text-right">
                  <span className="font-black text-[#28243A] block">
                    {friend.sparksReceivedCount} chispas recibidas
                  </span>
                  <span className="text-[#28243A]/60 font-medium">
                    {friend.lastSparkTimestamp || 'Sin interacción hoy'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setActiveFriendForSpark(friend);
                    setSelectedMessage(QUICK_SPARK_MESSAGES[0]);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FFD65A] via-[#FF936F] to-[#FF80B5] hover:scale-105 text-[#28243A] text-xs font-black shadow-[0_4px_14px_rgba(255,147,111,0.35)] transition-all active:scale-95 border border-white"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-[#28243A]" />
                  <span>Enviar chispa ✨</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Send Spark Modal */}
      {activeFriendForSpark && (
        <div className="fixed inset-0 z-50 bg-[#28243A]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFF9F0] border-2 border-[#FFD65A] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-pop-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FFD65A] to-[#FF936F] text-[#28243A] flex items-center justify-center font-black shadow-xs">
                  ✨
                </div>
                <div>
                  <h3 className="font-black text-base text-[#28243A]">
                    Enviar Chispa a {activeFriendForSpark.name}
                  </h3>
                  <p className="text-xs text-[#28243A]/70 font-medium">Un abrazo de energía positivo</p>
                </div>
              </div>
              <button
                onClick={() => setActiveFriendForSpark(null)}
                className="p-1 rounded-xl hover:bg-[#FFD65A]/30 text-[#28243A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Messages */}
            <div className="space-y-2">
              <label className="text-xs font-black text-[#28243A]">
                Elige un mensaje empático rápido:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {QUICK_SPARK_MESSAGES.map((msg, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedMessage(msg)}
                    className={`p-2.5 rounded-xl border-2 text-left text-xs font-bold transition-all ${
                      selectedMessage === msg
                        ? 'bg-[#FFD65A]/30 border-[#FF936F] text-[#28243A] shadow-xs'
                        : 'bg-white border-[#FFD65A]/40 text-[#28243A]/80 hover:border-[#FFD65A]'
                    }`}
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom message */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#28243A]">O escribe algo especial:</label>
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Escribe tu mensaje personal..."
                className="w-full bg-white border-2 border-[#FFD65A]/50 rounded-2xl px-3.5 py-2 text-xs text-[#28243A] font-medium focus:outline-none focus:border-[#FF936F]"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setActiveFriendForSpark(null)}
                className="flex-1 py-2.5 rounded-2xl bg-white border border-[#28243A]/10 text-xs font-bold text-[#28243A] hover:bg-[#FFF2DE] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSend}
                className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-[#FFD65A] via-[#FF936F] to-[#FF80B5] text-[#28243A] text-xs font-black hover:scale-103 active:scale-95 transition-all shadow-[0_4px_12px_rgba(255,147,111,0.35)] flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Chispa ✨</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
