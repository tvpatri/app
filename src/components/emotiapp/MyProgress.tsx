import React, { useState } from 'react';
import { useEmoti } from '../../context/EmotiContext';
import { EMOTIONS_CONFIG } from '../../data/emotionsData';
import { EmotionType } from '../../types';
import { 
  TrendingUp, 
  Sparkles, 
  Heart, 
  Calendar, 
  BookOpen, 
  Plus, 
  CheckCircle2, 
  Smile,
  ShieldCheck,
  Send,
  Zap
} from 'lucide-react';

export const MyProgress: React.FC = () => {
  const {
    moodHistory,
    totalSparksSent,
    totalPulsesSent,
    reflections,
    addReflection,
    currentEmotion,
    triggerSparkBurst,
    showToast
  } = useEmoti();

  const [newReflectionText, setNewReflectionText] = useState('');

  const handleAddReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReflectionText.trim()) return;
    addReflection(newReflectionText);
    setNewReflectionText('');
    triggerSparkBurst();
    showToast('¡Reflexión guardada en tu diario de bienestar!', 'success');
  };

  // Calculate emotion frequency breakdown
  const emotionCounts: Record<string, number> = {};
  moodHistory.forEach((item) => {
    emotionCounts[item.emotion] = (emotionCounts[item.emotion] || 0) + 1;
  });

  return (
    <div className="space-y-6 pb-24 animate-pop-in">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-wider font-black text-[#1D6E50] bg-[#72D6B1]/25 border border-[#72D6B1]/40 px-3 py-1 rounded-xl shadow-xs">
          Mi Progreso & Hábitos
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#28243A] tracking-tight mt-1.5 flex items-center gap-2">
          <span>Evolución & Autocuidado</span>
          <span className="text-2xl animate-bounce">🌱</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#28243A]/70 font-medium mt-1">
          Un espacio libre de juicios para observar tu camino emocional y celebrar cada acto de apoyo compartido.
        </p>
      </div>

      {/* Metric Counters Grid with vibrant cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Check-ins count */}
        <div className="bg-white p-5 rounded-3xl border-2 border-[#FFD65A]/50 shadow-sm flex flex-col justify-between hover:scale-102 transition-transform">
          <div className="flex items-center justify-between text-xs font-bold text-[#28243A]/70">
            <span>Registros de emoción</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFD65A]/30 text-[#946200] flex items-center justify-center font-black">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-[#28243A]">
              {moodHistory.length}
            </span>
            <span className="text-xs text-[#28243A]/70 font-bold block mt-0.5">días consecutivos</span>
          </div>
          <span className="text-[11px] font-black text-[#946200] bg-[#FFD65A]/20 px-2.5 py-1 rounded-xl w-fit">
            Constancia consciente ✨
          </span>
        </div>

        {/* Sparks sent */}
        <div className="bg-white p-5 rounded-3xl border-2 border-[#FF936F]/50 shadow-sm flex flex-col justify-between hover:scale-102 transition-transform">
          <div className="flex items-center justify-between text-xs font-bold text-[#28243A]/70">
            <span>Chispas enviadas</span>
            <div className="w-8 h-8 rounded-xl bg-[#FF936F]/30 text-[#A03E15] flex items-center justify-center font-black">
              <Zap className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-[#28243A]">
              {totalSparksSent}
            </span>
            <span className="text-xs text-[#28243A]/70 font-bold block mt-0.5">gestos de energía</span>
          </div>
          <span className="text-[11px] font-black text-[#A03E15] bg-[#FF936F]/20 px-2.5 py-1 rounded-xl w-fit">
            Impacto en amigos ⚡
          </span>
        </div>

        {/* Pulses sent */}
        <div className="bg-white p-5 rounded-3xl border-2 border-[#FF80B5]/50 shadow-sm flex flex-col justify-between hover:scale-102 transition-transform">
          <div className="flex items-center justify-between text-xs font-bold text-[#28243A]/70">
            <span>Pulsos de apoyo</span>
            <div className="w-8 h-8 rounded-xl bg-[#FF80B5]/30 text-[#A31652] flex items-center justify-center font-black">
              <Heart className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-[#28243A]">
              {totalPulsesSent}
            </span>
            <span className="text-xs text-[#28243A]/70 font-bold block mt-0.5">señales hápticas</span>
          </div>
          <span className="text-[11px] font-black text-[#A31652] bg-[#FF80B5]/20 px-2.5 py-1 rounded-xl w-fit">
            Presencia real 💖
          </span>
        </div>
      </div>

      {/* Non-judgmental Emotional Spectrum Breakdown */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#FFD65A]/50 shadow-sm space-y-4">
        <div>
          <h3 className="font-black text-base text-[#28243A]">
            Espectro Emocional de la Semana
          </h3>
          <p className="text-xs text-[#28243A]/70 font-medium mt-0.5">
            Observa tu espectro sin calificarlo. Sentir variedad es señal de salud emocional y sensibilidad humana.
          </p>
        </div>

        <div className="space-y-3 pt-1">
          {Object.entries(EMOTIONS_CONFIG).map(([key, meta]) => {
            const count = emotionCounts[key] || 0;
            const percentage = Math.round((count / moodHistory.length) * 100);

            return (
              <div key={key} className="flex items-center gap-3">
                <span className="text-2xl w-7 text-center">{meta.emoji}</span>
                <span className="text-xs font-black text-[#28243A] w-24 capitalize">{meta.label}</span>
                <div className="flex-1 h-3.5 bg-[#FFF9F0] rounded-full overflow-hidden border border-[#FFD65A]/30">
                  <div
                    className="h-full rounded-full transition-all duration-500 shadow-inner"
                    style={{
                      width: `${Math.max(percentage, count > 0 ? 12 : 0)}%`,
                      backgroundColor: meta.accentHex,
                    }}
                  />
                </div>
                <span className="text-xs font-mono font-black text-[#28243A] w-12 text-right">
                  {count} días
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Reflections Journal */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#FFD65A]/50 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#FF936F]" />
          <h3 className="font-black text-base text-[#28243A]">
            Diario de Reflexiones Personales
          </h3>
        </div>

        {/* New reflection input */}
        <form onSubmit={handleAddReflection} className="space-y-2">
          <input
            type="text"
            value={newReflectionText}
            onChange={(e) => setNewReflectionText(e.target.value)}
            placeholder="Escribe una pequeña reflexión sobre cómo te sentiste hoy..."
            className="w-full bg-[#FFF9F0] border-2 border-[#FFD65A]/50 rounded-2xl px-4 py-2.5 text-xs text-[#28243A] font-medium focus:border-[#FF936F] outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-[#FFD65A] via-[#FF936F] to-[#FF80B5] text-[#28243A] text-xs font-black rounded-2xl hover:scale-103 active:scale-95 transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar al diario</span>
          </button>
        </form>

        {/* Existing reflections list */}
        <div className="space-y-2.5 pt-2">
          {reflections.map((ref) => (
            <div
              key={ref.id}
              className="p-3.5 rounded-2xl bg-[#FFF9F0] border-2 border-[#FFD65A]/30 flex items-start gap-3"
            >
              <span className="text-lg mt-0.5">📝</span>
              <div className="flex-1">
                <p className="text-xs text-[#28243A] font-bold leading-relaxed">
                  "{ref.text}"
                </p>
                <span className="text-[10px] text-[#28243A]/60 font-semibold mt-1 block">
                  {ref.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
