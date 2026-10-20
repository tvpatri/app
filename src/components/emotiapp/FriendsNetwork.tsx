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
  MessageCircle
} from 'lucide-react';

export const FriendsNetwork: React.FC = () => {
  const {
    friends,
    sendEnergySpark,
    sparksHistory,
    totalSparksSent,
  } = useEmoti();

  const [activeFriendForSpark, setActiveFriendForSpark] = useState<Friend | null>(null);
  const [selectedMessage, setSelectedMessage] = useState(QUICK_SPARK_MESSAGES[0]);
  const [customMessage, setCustomMessage] = useState('');

  const handleSend = () => {
    if (!activeFriendForSpark) return;
    const finalMsg = customMessage.trim() || selectedMessage;
    sendEnergySpark(activeFriendForSpark.id, finalMsg);
    setActiveFriendForSpark(null);
    setCustomMessage('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-wider font-semibold text-[#2D5A3C] bg-[#D9E8DE]/60 px-2 py-0.5 rounded-md">
          Red de Apoyo
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292A30] tracking-tight mt-1">
          Amigos & Conexión
        </h1>
        <p className="text-xs sm:text-sm text-[#50545E] mt-1">
          Una red íntima y segura de amistades de confianza. Envía Chispas de Energía para acompañar sin invadir.
        </p>
      </div>

      {/* Privacy Notice Banner */}
      <div className="bg-[#F8F7F4] rounded-2xl p-4 border border-[#ECEDEF] flex items-start gap-3">
        <Lock className="w-4 h-4 text-[#50545E] shrink-0 mt-0.5" />
        <div className="text-xs text-[#50545E] leading-relaxed">
          <strong className="text-[#292A30]">Privacidad emocional consciente:</strong> Los estados de ánimo mostrados son perfiles demostrativos basados únicamente en la información que cada amigo decide voluntariamente compartir con su círculo cercano.
        </div>
      </div>

      {/* Friends Cards List */}
      <div className="space-y-3">
        {friends.map((friend) => {
          const moodMeta = friend.sharedMood ? EMOTIONS_CONFIG[friend.sharedMood] : null;

          return (
            <div
              key={friend.id}
              className="bg-white rounded-3xl p-5 border border-[#ECEDEF] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#DCD5F5] transition-all"
            >
              {/* Left: Avatar & Info */}
              <div className="flex items-start gap-3.5">
                <div className="relative shrink-0">
                  <div
                    className="w-13 h-13 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs"
                    style={{ backgroundColor: friend.avatarBg, color: friend.avatarColor }}
                  >
                    {friend.avatarInitials}
                  </div>
                  {friend.isOnline && (
                    <span
                      className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"
                      title="En línea"
                    />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-[#292A30]">
                      {friend.name}
                    </h3>
                    <span className="text-[11px] text-[#7A7E89]">
                      {friend.isOnline ? 'En línea' : 'Desconectado'}
                    </span>
                  </div>

                  {/* Shared Mood Badge */}
                  {moodMeta ? (
                    <div className="flex items-center gap-1.5 text-xs text-[#50545E]">
                      <span>Estado compartido:</span>
                      <span className="font-medium text-[#292A30] capitalize flex items-center gap-1">
                        <span>{moodMeta.emoji}</span>
                        <span>{moodMeta.label}</span>
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-[#7A7E89]">Estado privado</span>
                  )}

                  {/* Status Quote */}
                  <p className="text-xs text-[#50545E] italic">
                    "{friend.statusQuote}"
                  </p>
                </div>
              </div>

              {/* Right: Sparks Received & Send Spark Action */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-[#ECEDEF]">
                <div className="text-[11px] text-[#7A7E89] text-left sm:text-right">
                  <span className="font-semibold text-[#292A30] block">
                    {friend.sparksReceivedCount} chispas
                  </span>
                  <span>{friend.lastSparkTimestamp || 'Sin interacción hoy'}</span>
                </div>

                <button
                  onClick={() => {
                    setActiveFriendForSpark(friend);
                    setSelectedMessage(QUICK_SPARK_MESSAGES[0]);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#DCD5F5] to-[#E5DFFA] hover:from-[#d1c8f4] hover:to-[#dbd3f8] text-[#372A5E] text-xs font-semibold shadow-xs transition-transform active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#4F4275]" />
                  <span>Enviar chispa ✨</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Energy Sparks Activity History */}
      <div className="bg-white rounded-3xl p-5 border border-[#ECEDEF] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4F4275]" />
            <h3 className="font-bold text-sm text-[#292A30]">
              Historial de Chispas & Apoyo
            </h3>
          </div>
          <span className="text-xs font-semibold text-[#50545E]">
            {totalSparksSent} enviadas
          </span>
        </div>

        {sparksHistory.length === 0 ? (
          <p className="text-xs text-[#7A7E89] py-3 text-center">
            Aún no has enviado chispas hoy.
          </p>
        ) : (
          <div className="space-y-2.5">
            {sparksHistory.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-[#F8F7F4] border border-[#ECEDEF] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">✨</span>
                  <div>
                    <span className="font-semibold text-[#292A30]">
                      Para {item.friendName}:
                    </span>{' '}
                    <span className="text-[#50545E]">"{item.message}"</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-[#7A7E89] shrink-0 ml-2">
                  {item.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Energy Spark Modal */}
      {activeFriendForSpark && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#ECEDEF] relative space-y-4">
            <button
              onClick={() => setActiveFriendForSpark(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#50545E] hover:bg-[#ECEDEF] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs"
                style={{
                  backgroundColor: activeFriendForSpark.avatarBg,
                  color: activeFriendForSpark.avatarColor,
                }}
              >
                {activeFriendForSpark.avatarInitials}
              </div>
              <div>
                <h3 className="font-bold text-base text-[#292A30]">
                  Enviar chispa a {activeFriendForSpark.name} ✨
                </h3>
                <p className="text-xs text-[#50545E]">
                  Elige un mensaje de apoyo afectivo o escribe el tuyo propio.
                </p>
              </div>
            </div>

            {/* Quick Supportive Messages */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#50545E]">
                Mensajes rápidos de apoyo:
              </label>
              <div className="space-y-1.5">
                {QUICK_SPARK_MESSAGES.map((msg, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedMessage(msg);
                      setCustomMessage('');
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all ${
                      selectedMessage === msg && !customMessage
                        ? 'bg-[#DCD5F5]/60 text-[#292A30] font-semibold border border-[#DCD5F5]'
                        : 'bg-[#F8F7F4] text-[#50545E] hover:bg-[#ECEDEF]'
                    }`}
                  >
                    "{msg}"
                  </button>
                ))}
              </div>
            </div>

            {/* Custom message input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#50545E]">
                O escribe tu propio mensaje:
              </label>
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Ej. ¡Éxito en tu presentación de hoy! Te acompaño..."
                className="w-full bg-[#F8F7F4] border border-[#D6D8DC] rounded-xl px-3.5 py-2 text-xs text-[#292A30] focus:outline-none focus:ring-2 focus:ring-[#DCD5F5]"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setActiveFriendForSpark(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#50545E] hover:bg-[#ECEDEF]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSend}
                className="px-5 py-2 rounded-xl bg-[#292A30] hover:bg-black text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#DCD5F5]" />
                <span>Enviar Chispa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
