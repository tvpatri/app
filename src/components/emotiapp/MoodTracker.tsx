import React, { useState } from 'react';
import { useEmoti } from '../../context/EmotiContext';
import { EmotionType } from '../../types';
import { EMOTIONS_CONFIG } from '../../data/emotionsData';
import { 
  Sparkles, 
  Bot, 
  Watch, 
  Check, 
  Calendar, 
  ArrowRight, 
  HeartHandshake, 
  Info,
  CheckCircle2
} from 'lucide-react';

export const MoodTracker: React.FC = () => {
  const {
    currentEmotion,
    setEmotion,
    todayNote,
    setTodayNote,
    moodHistory,
    botExpression,
    bandBiometrics,
    setActiveTab,
    botName,
  } = useEmoti();

  const [inputNote, setInputNote] = useState(todayNote);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  const emotionsList: EmotionType[] = [
    'feliz',
    'tranquilo',
    'emocionado',
    'cansado',
    'estresado',
    'triste',
  ];

  const handleSelectEmotion = (emotion: EmotionType) => {
    setEmotion(emotion, inputNote);
    setShowSyncSuccess(true);
    setTimeout(() => setShowSyncSuccess(false), 3000);
  };

  const currentMeta = EMOTIONS_CONFIG[currentEmotion];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-wider font-semibold text-[#4F4275] bg-[#DCD5F5]/60 px-2 py-0.5 rounded-md">
          Mood Tracker
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292A30] tracking-tight mt-1">
          ¿Cómo te sientes hoy?
        </h1>
        <p className="text-xs sm:text-sm text-[#50545E] mt-1">
          Elige la emoción que mejor te represente. El ecosistema Emoti se sincronizará automáticamente para acompañarte.
        </p>
      </div>

      {/* 6 Selectable Emotion Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {emotionsList.map((emoKey) => {
          const item = EMOTIONS_CONFIG[emoKey];
          const isSelected = currentEmotion === emoKey;

          return (
            <button
              key={emoKey}
              onClick={() => handleSelectEmotion(emoKey)}
              className={`p-4 rounded-3xl border text-left transition-all duration-200 relative overflow-hidden group active:scale-98 ${
                isSelected
                  ? `bg-white border-[#292A30] shadow-md ring-2 ring-[#292A30]/10`
                  : `${item.colorBg} border-transparent hover:border-black/10`
              }`}
            >
              {/* Selected badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#292A30] text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div className="text-3xl sm:text-4xl mb-2 transition-transform group-hover:scale-110">
                {item.emoji}
              </div>

              <h3 className="font-bold text-sm sm:text-base text-[#292A30] capitalize">
                {item.label}
              </h3>

              <p className="text-[11px] text-[#50545E] mt-1 leading-snug line-clamp-2">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Synchronized Feedback Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#ECEDEF] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentMeta.emoji}</span>
            <div>
              <h3 className="font-bold text-sm text-[#292A30]">
                Tu emoción registrada: <span className="capitalize">{currentMeta.label}</span>
              </h3>
              <p className="text-[11px] text-[#7A7E89]">
                Sincronizada con Emoti-Bot y Emoti-Band
              </p>
            </div>
          </div>
          {showSyncSuccess && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 animate-pulse">
              <CheckCircle2 className="w-3 h-3" />
              Sincronizado
            </span>
          )}
        </div>

        {/* Supportive Message Box */}
        <div className={`p-4 rounded-2xl border ${currentMeta.colorBg} ${currentMeta.colorBorder}`}>
          <div className="flex items-start gap-2.5">
            <HeartHandshake className="w-4 h-4 text-[#292A30] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#292A30]">Mensaje de acompañamiento:</h4>
              <p className="text-xs sm:text-sm text-[#292A30] font-medium leading-relaxed mt-0.5">
                "{currentMeta.supportMessage}"
              </p>
            </div>
          </div>
        </div>

        {/* Live Ecosystem Response Status */}
        <div className="p-3.5 bg-[#F8F7F4] rounded-2xl border border-[#ECEDEF] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#ECEDEF]">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#4F4275]" />
              <span className="text-[#50545E]">{botName} Carita:</span>
            </div>
            <strong className="text-[#292A30]">{botExpression}</strong>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#ECEDEF]">
            <div className="flex items-center gap-2">
              <Watch className="w-4 h-4 text-[#2D5A3C]" />
              <span className="text-[#50545E]">Emoti-Band:</span>
            </div>
            <strong className="text-[#292A30]">
              {bandBiometrics.bpm} BPM · Estrés {bandBiometrics.stressLevel}
            </strong>
          </div>
        </div>

        {/* Reflection Note Input */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-semibold text-[#50545E]">
            ¿Hay algo específico que influyó en tu emoción? (Opcional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputNote}
              onChange={(e) => setInputNote(e.target.value)}
              placeholder="Ej. Buena charla con un amigo, cansancio por exámenes..."
              className="flex-1 bg-[#F8F7F4] border border-[#D6D8DC] rounded-xl px-3.5 py-2 text-xs text-[#292A30] focus:outline-none focus:ring-2 focus:ring-[#DCD5F5]"
            />
            <button
              onClick={() => {
                setEmotion(currentEmotion, inputNote);
              }}
              className="px-4 py-2 bg-[#292A30] text-white text-xs font-semibold rounded-xl hover:bg-black transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Mood History Chart */}
      <div className="bg-white rounded-3xl p-5 border border-[#ECEDEF] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#50545E]" />
            <h3 className="font-bold text-sm text-[#292A30]">
              Historial emocional de los últimos 7 días
            </h3>
          </div>
          <span className="text-[11px] text-[#7A7E89]">Octubre 2026</span>
        </div>

        {/* Visual Weekly Day Bars */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {moodHistory.map((entry) => {
            const emoMeta = EMOTIONS_CONFIG[entry.emotion];
            const isToday = entry.dayLabel === 'Hoy';

            return (
              <div
                key={entry.id}
                className={`flex flex-col items-center justify-between p-2 rounded-2xl border text-center transition-all ${
                  isToday
                    ? 'bg-[#F8F7F4] border-[#292A30] shadow-xs'
                    : 'bg-[#F8F7F4]/50 border-[#ECEDEF]'
                }`}
              >
                <span className="text-[10px] font-semibold text-[#50545E]">
                  {entry.dayLabel}
                </span>

                <div className="my-2 text-xl sm:text-2xl transform hover:scale-125 transition-transform cursor-pointer" title={`${emoMeta.label}: ${entry.note || ''}`}>
                  {emoMeta.emoji}
                </div>

                <span
                  className="text-[9px] font-medium capitalize truncate w-full"
                  style={{ color: emoMeta.colorText }}
                >
                  {entry.emotion}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-[#7A7E89] text-center italic">
          Cada emoción es una señal valiosa para conocerte mejor. No hay emociones buenas o malas.
        </p>
      </div>
    </div>
  );
};
