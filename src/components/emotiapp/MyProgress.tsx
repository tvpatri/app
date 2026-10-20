import React, { useState } from 'react';
import { useEmoti } from '../../context/EmotiContext';
import { EMOTIONS_CONFIG } from '../../data/emotionsData';
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
  Send
} from 'lucide-react';

export const MyProgress: React.FC = () => {
  const {
    moodHistory,
    totalSparksSent,
    totalPulsesSent,
    reflections,
    addReflection,
    currentEmotion,
  } = useEmoti();

  const [newReflectionText, setNewReflectionText] = useState('');

  const handleAddReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReflectionText.trim()) return;
    addReflection(newReflectionText);
    setNewReflectionText('');
  };

  // Calculate emotion frequency breakdown
  const emotionCounts: Record<string, number> = {};
  moodHistory.forEach((item) => {
    emotionCounts[item.emotion] = (emotionCounts[item.emotion] || 0) + 1;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-wider font-semibold text-[#2D5A3C] bg-[#D9E8DE]/60 px-2 py-0.5 rounded-md">
          Mi Progreso
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292A30] tracking-tight mt-1">
          Evolución & Autocuidado
        </h1>
        <p className="text-xs sm:text-sm text-[#50545E] mt-1">
          Un espacio libre de juicios para observar tu camino emocional y celebrar cada acto de apoyo compartido.
        </p>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Check-ins count */}
        <div className="bg-white p-5 rounded-3xl border border-[#ECEDEF] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#50545E]">
            <span>Registros de emoción</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold font-mono text-[#292A30]">
              {moodHistory.length}
            </span>
            <span className="text-xs text-[#7A7E89] block mt-0.5">días consecutivos</span>
          </div>
          <span className="text-[11px] text-[#4F4275] font-semibold">
            Constancia consciente
          </span>
        </div>

        {/* Sparks sent */}
        <div className="bg-white p-5 rounded-3xl border border-[#ECEDEF] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#50545E]">
            <span>Chispas enviadas</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold font-mono text-[#292A30]">
              {totalSparksSent}
            </span>
            <span className="text-xs text-[#7A7E89] block mt-0.5">gestos de energía</span>
          </div>
          <span className="text-[11px] text-[#8C5835] font-semibold">
            Impacto en amigos
          </span>
        </div>

        {/* Pulses sent */}
        <div className="bg-white p-5 rounded-3xl border border-[#ECEDEF] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#50545E]">
            <span>Pulsos de apoyo</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold font-mono text-[#292A30]">
              {totalPulsesSent}
            </span>
            <span className="text-xs text-[#7A7E89] block mt-0.5">señales hápticas</span>
          </div>
          <span className="text-[11px] text-rose-700 font-semibold">
            Presencia sin pantallas
          </span>
        </div>
      </div>

      {/* Non-judgmental Emotional Spectrum Breakdown */}
      <div className="bg-white rounded-3xl p-5 border border-[#ECEDEF] shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-sm text-[#292A30]">
            Diversidad emocional semanal
          </h3>
          <p className="text-xs text-[#50545E] mt-0.5">
            Observa tu espectro sin calificarlo. Sentir variedad es señal de salud mental y sensibilidad.
          </p>
        </div>

        <div className="space-y-2.5">
          {Object.entries(EMOTIONS_CONFIG).map(([key, config]) => {
            const count = emotionCounts[key] || 0;
            const percentage = Math.round((count / Math.max(1, moodHistory.length)) * 100);

            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span>{config.emoji}</span>
                    <span className="font-semibold text-[#292A30] capitalize">{config.label}</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#50545E]">
                    {count} {count === 1 ? 'vez' : 'veces'} ({percentage}%)
                  </div>
                </div>

                <div className="w-full bg-[#ECEDEF] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: config.accentHex,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Reflections Journal */}
      <div className="bg-white rounded-3xl p-5 border border-[#ECEDEF] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#4F4275]" />
            <h3 className="font-bold text-sm text-[#292A30]">
              Diario de Reflexiones
            </h3>
          </div>
          <span className="text-xs text-[#7A7E89]">{reflections.length} notas</span>
        </div>

        {/* New Reflection Form */}
        <form onSubmit={handleAddReflection} className="space-y-2">
          <textarea
            value={newReflectionText}
            onChange={(e) => setNewReflectionText(e.target.value)}
            rows={2}
            placeholder="¿Qué aprendiste sobre ti hoy? ¿Cómo te sentiste al apoyar o recibir apoyo?"
            className="w-full bg-[#F8F7F4] border border-[#D6D8DC] rounded-2xl p-3 text-xs text-[#292A30] focus:outline-none focus:ring-2 focus:ring-[#DCD5F5] resize-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newReflectionText.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#292A30] hover:bg-black text-white text-xs font-semibold shadow-xs disabled:opacity-40 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Guardar reflexión</span>
            </button>
          </div>
        </form>

        {/* Existing reflections list */}
        <div className="space-y-2.5 pt-2">
          {reflections.map((ref) => {
            const emoMeta = EMOTIONS_CONFIG[ref.emotion];
            return (
              <div
                key={ref.id}
                className="p-3.5 rounded-2xl bg-[#F8F7F4] border border-[#ECEDEF] space-y-1"
              >
                <div className="flex items-center justify-between text-[11px] text-[#7A7E89]">
                  <span className="flex items-center gap-1.5">
                    <span>{emoMeta?.emoji}</span>
                    <span className="font-semibold text-[#292A30]">{ref.dateFormatted}</span>
                  </span>
                </div>
                <p className="text-xs text-[#292A30] leading-relaxed italic">
                  "{ref.text}"
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
