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
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Flame,
  Zap,
  Smile
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
    triggerSparkBurst,
    showToast
  } = useEmoti();

  const [inputNote, setInputNote] = useState(todayNote);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<'calendar' | 'stats'>('calendar');

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
    triggerSparkBurst();
    showToast(`¡Emoción ${EMOTIONS_CONFIG[emotion].label} guardada!`, 'success');
    setTimeout(() => setShowSyncSuccess(false), 3000);
  };

  const currentMeta = EMOTIONS_CONFIG[currentEmotion];

  // Emotion distribution statistics for the 7-day history
  const emotionCounts: Record<EmotionType, number> = {
    feliz: 0,
    tranquilo: 0,
    emocionado: 0,
    cansado: 0,
    estresado: 0,
    triste: 0,
  };
  moodHistory.forEach((entry) => {
    if (emotionCounts[entry.emotion] !== undefined) {
      emotionCounts[entry.emotion]++;
    }
  });

  return (
    <div className="space-y-6 pb-24 animate-pop-in">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-wider font-black text-[#58399E] bg-[#B69AF5]/25 border border-[#B69AF5]/40 px-3 py-1 rounded-xl shadow-xs">
          Mood Tracker Visual
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#28243A] tracking-tight mt-1.5 flex items-center gap-2">
          <span>¿Cómo te sientes hoy?</span>
          <span className="text-2xl animate-bounce">🎈</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#28243A]/70 font-medium mt-1">
          Cada emoción tiene su propio color y personaje. Al seleccionarla, tu Emoti-Bot y tu pulsera se adaptarán para acompañarte.
        </p>
      </div>

      {/* 6 Selectable Emotion Cards Grid with colorful dynamic growth */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {emotionsList.map((emoKey) => {
          const item = EMOTIONS_CONFIG[emoKey];
          const isSelected = currentEmotion === emoKey;

          return (
            <button
              key={emoKey}
              onClick={() => handleSelectEmotion(emoKey)}
              className={`p-4 rounded-3xl border-2 text-left transition-all duration-300 relative overflow-hidden group active:scale-95 ${
                isSelected
                  ? `bg-white border-[#28243A] shadow-[0_12px_28px_-6px_rgba(40,36,58,0.2)] scale-105 ring-4 ring-[#FFD65A]/40`
                  : `${item.colorBg} border-transparent hover:border-[#FFD65A] hover:scale-102 hover:shadow-md`
              }`}
            >
              {/* Selected badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#28243A] text-white flex items-center justify-center shadow-xs animate-pop-in">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Character Face with playful hover bounce */}
              <div className="text-4xl sm:text-5xl mb-2 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6 drop-shadow-sm inline-block">
                {item.emoji}
              </div>

              <h3 className={`font-black text-base sm:text-lg capitalize ${item.colorText}`}>
                {item.label}
              </h3>

              <p className="text-[11px] text-[#28243A]/80 font-medium mt-1 leading-snug line-clamp-2">
                {item.description}
              </p>

              {/* Micro-bar with emotion color accent */}
              <div 
                className="w-full h-1.5 rounded-full mt-3 opacity-60 group-hover:opacity-100 transition-opacity" 
                style={{ backgroundColor: item.accentHex }}
              />
            </button>
          );
        })}
      </div>

      {/* Synchronized Ecosystem Card with Bot Face & Band Biometrics Preview */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#FFD65A]/50 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs border-2"
              style={{ backgroundColor: `${currentMeta.accentHex}35`, borderColor: currentMeta.accentHex }}
            >
              {currentMeta.emoji}
            </div>
            <div>
              <h3 className="font-black text-base text-[#28243A]">
                Tu emoción activa: <span className="capitalize" style={{ color: currentMeta.accentHex }}>{currentMeta.label}</span>
              </h3>
              <p className="text-xs text-[#28243A]/70 font-semibold">
                Sincronizada con {botName} y tu pulsera háptica
              </p>
            </div>
          </div>
          {showSyncSuccess && (
            <span className="flex items-center gap-1 text-xs font-black text-[#1D6E50] bg-[#72D6B1]/25 px-3 py-1 rounded-full border border-[#72D6B1] animate-bounce">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ¡Sincronizado!
            </span>
          )}
        </div>

        {/* Dynamic Supportive Message Box */}
        <div 
          className="p-4 sm:p-5 rounded-2xl border-2 space-y-1.5 shadow-2xs"
          style={{ backgroundColor: `${currentMeta.accentHex}20`, borderColor: currentMeta.accentHex }}
        >
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-[#28243A]" />
            <h4 className="text-xs font-black uppercase text-[#28243A]">Mensaje de Acompañamiento:</h4>
          </div>
          <p className="text-xs sm:text-sm text-[#28243A] font-bold leading-relaxed">
            "{currentMeta.supportMessage}"
          </p>
        </div>

        {/* Interactive Ecosystem Sync Metrics */}
        <div className="p-4 bg-[#FFF9F0] rounded-2xl border border-[#FFD65A]/40 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#FFD65A]/40 shadow-2xs">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#B69AF5]" />
              <span className="font-bold text-[#28243A]">{botName} Expresión:</span>
            </div>
            <strong className="font-black px-2 py-0.5 rounded-lg bg-[#B69AF5]/20 text-[#58399E]">
              {botExpression}
            </strong>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#FFD65A]/40 shadow-2xs">
            <div className="flex items-center gap-2">
              <Watch className="w-4 h-4 text-[#72D6B1]" />
              <span className="font-bold text-[#28243A]">Emoti-Band:</span>
            </div>
            <strong className="font-black font-mono text-[#1D6E50]">
              {bandBiometrics.bpm} BPM · Estrés {bandBiometrics.stressLevel}
            </strong>
          </div>
        </div>

        {/* Reflection Note Input */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-[#28243A] flex items-center gap-1.5">
            <span>¿Qué influyó en tu emoción hoy? (Opcional)</span>
            <span className="text-[10px] text-[#FF936F]">· Tu diario personal</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputNote}
              onChange={(e) => setInputNote(e.target.value)}
              placeholder="Ej. Buena charla con amigos, exámenes, paseo relajante..."
              className="flex-1 bg-[#FFF9F0] border-2 border-[#FFD65A]/40 rounded-2xl px-4 py-2.5 text-xs text-[#28243A] font-medium focus:outline-none focus:border-[#FF936F] focus:ring-2 focus:ring-[#FF936F]/20"
            />
            <button
              onClick={() => {
                setEmotion(currentEmotion, inputNote);
                showToast('Nota de reflexión guardada', 'success');
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-[#FFD65A] to-[#FF936F] text-[#28243A] text-xs font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xs"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>

      {/* Visual Calendar & Colorful Weekly Charts */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#FFD65A]/50 shadow-sm space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#FF936F]" />
            <h3 className="font-black text-base text-[#28243A]">
              Historial Emocional Visual
            </h3>
          </div>

          {/* Toggle between Calendar and Stats */}
          <div className="flex items-center bg-[#FFF9F0] p-1 rounded-2xl border border-[#FFD65A]/40">
            <button
              onClick={() => setActiveViewMode('calendar')}
              className={`px-3 py-1 text-xs font-black rounded-xl transition-all ${
                activeViewMode === 'calendar'
                  ? 'bg-gradient-to-r from-[#FFD65A] to-[#FF936F] text-[#28243A] shadow-xs'
                  : 'text-[#28243A]/60 hover:text-[#28243A]'
              }`}
            >
              7 Días
            </button>
            <button
              onClick={() => setActiveViewMode('stats')}
              className={`px-3 py-1 text-xs font-black rounded-xl transition-all ${
                activeViewMode === 'stats'
                  ? 'bg-gradient-to-r from-[#72D6B1] to-[#79B9F2] text-[#28243A] shadow-xs'
                  : 'text-[#28243A]/60 hover:text-[#28243A]'
              }`}
            >
              Balance
            </button>
          </div>
        </div>

        {activeViewMode === 'calendar' ? (
          /* Visual Weekly Day Bars */
          <div className="grid grid-cols-7 gap-2 pt-1">
            {moodHistory.map((entry) => {
              const emoMeta = EMOTIONS_CONFIG[entry.emotion];
              const isToday = entry.dayLabel === 'Hoy';

              return (
                <div
                  key={entry.id}
                  className={`flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl border-2 text-center transition-all hover:scale-105 cursor-pointer ${
                    isToday
                      ? 'bg-gradient-to-b from-[#FFF2DE] to-white border-[#FF936F] shadow-sm ring-2 ring-[#FF936F]/30'
                      : 'bg-[#FFF9F0] border-[#FFD65A]/30 hover:border-[#FFD65A]'
                  }`}
                  title={`${entry.dayLabel}: ${emoMeta.label} - ${entry.note || 'Sin nota'}`}
                >
                  <span className={`text-[10px] font-black ${isToday ? 'text-[#A03E15]' : 'text-[#28243A]/70'}`}>
                    {entry.dayLabel}
                  </span>

                  <div className="my-2 text-2xl sm:text-3xl transform hover:scale-125 transition-transform drop-shadow-xs">
                    {emoMeta.emoji}
                  </div>

                  <span
                    className="text-[9px] font-black capitalize truncate w-full px-1 py-0.5 rounded-md"
                    style={{ backgroundColor: `${emoMeta.accentHex}30`, color: emoMeta.colorText }}
                  >
                    {entry.emotion}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          /* Colorful Emotional Distribution Bar Chart */
          <div className="space-y-3 pt-1">
            <p className="text-xs text-[#28243A]/80 font-medium">
              Frecuencia de emociones registradas durante esta semana:
            </p>
            <div className="space-y-2">
              {emotionsList.map((emoKey) => {
                const meta = EMOTIONS_CONFIG[emoKey];
                const count = emotionCounts[emoKey] || 0;
                const percentage = Math.round((count / moodHistory.length) * 100);

                return (
                  <div key={emoKey} className="flex items-center gap-3">
                    <span className="text-xl w-6 text-center">{meta.emoji}</span>
                    <span className="text-xs font-bold text-[#28243A] w-20 capitalize">{meta.label}</span>
                    <div className="flex-1 h-3.5 bg-[#FFF9F0] rounded-full overflow-hidden border border-[#FFD65A]/30">
                      <div 
                        className="h-full rounded-full transition-all duration-500 shadow-inner"
                        style={{ 
                          width: `${Math.max(percentage, count > 0 ? 12 : 0)}%`, 
                          backgroundColor: meta.accentHex 
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono font-black text-[#28243A] w-10 text-right">
                      {count} d
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="p-3 bg-[#FFF2DE] rounded-2xl border border-[#FFD65A]/40 flex items-center gap-2 text-xs text-[#28243A]/80 font-medium">
          <Sparkles className="w-4 h-4 text-[#FF936F] shrink-0" />
          <span>Todas las emociones son válidas. Reconocer lo que sientes es el primer paso para cultivar bienestar.</span>
        </div>
      </div>
    </div>
  );
};
