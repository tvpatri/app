import React, { useState } from 'react';
import { DIALOG_GUIDES } from '../../data/mockData';
import { useEmoti } from '../../context/EmotiContext';
import { 
  MessageCircle, 
  HelpCircle, 
  HeartHandshake, 
  Sparkles, 
  Check, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  Lightbulb,
  ShieldCheck,
  MessageCircleHeart
} from 'lucide-react';

export const TalkTogether: React.FC = () => {
  const { showToast, triggerSparkBurst } = useEmoti();
  const [activeCategory, setActiveCategory] = useState<'all' | 'malentendidos' | 'asertiva' | 'rompehielos'>('all');
  const [expandedId, setExpandedId] = useState<string>('guide-1');
  const [copiedPhrase, setCopiedPhrase] = useState<string | null>(null);

  const handleCopyPhrase = (phrase: string) => {
    navigator.clipboard.writeText(phrase);
    setCopiedPhrase(phrase);
    triggerSparkBurst();
    showToast('Frase copiada al portapapeles para practicar ✨', 'success');
    setTimeout(() => setCopiedPhrase(null), 2500);
  };

  const filteredGuides = activeCategory === 'all' 
    ? DIALOG_GUIDES 
    : DIALOG_GUIDES.filter((g) => g.category === activeCategory);

  return (
    <div className="space-y-6 pb-24 animate-pop-in">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-wider font-black text-[#A03E15] bg-[#FF936F]/25 border border-[#FF936F]/40 px-3 py-1 rounded-xl shadow-xs">
          Talk Together
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#28243A] tracking-tight mt-1.5 flex items-center gap-2">
          <span>Guía de Diálogo & Amistad</span>
          <span className="text-2xl animate-bounce">💬</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#28243A]/70 font-medium mt-1">
          Herramientas y disparadores empáticos para fortalecer relaciones sanas, resolver conflictos y conectar desde el corazón.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#FFF2DE] rounded-2xl border-2 border-[#FFD65A]/50 shadow-inner overflow-x-auto">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3.5 py-1.5 text-xs font-black rounded-xl whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-[#FFD65A] to-[#FF936F] text-[#28243A] shadow-xs scale-102'
              : 'text-[#28243A]/70 hover:text-[#28243A] hover:bg-white/60'
          }`}
        >
          Todas las guías
        </button>
        <button
          onClick={() => setActiveCategory('malentendidos')}
          className={`px-3.5 py-1.5 text-xs font-black rounded-xl whitespace-nowrap transition-all ${
            activeCategory === 'malentendidos'
              ? 'bg-gradient-to-r from-[#FF80B5] to-[#FF936F] text-white shadow-xs scale-102'
              : 'text-[#28243A]/70 hover:text-[#28243A] hover:bg-white/60'
          }`}
        >
          Resolver malentendidos
        </button>
        <button
          onClick={() => setActiveCategory('asertiva')}
          className={`px-3.5 py-1.5 text-xs font-black rounded-xl whitespace-nowrap transition-all ${
            activeCategory === 'asertiva'
              ? 'bg-gradient-to-r from-[#72D6B1] to-[#79B9F2] text-[#28243A] shadow-xs scale-102'
              : 'text-[#28243A]/70 hover:text-[#28243A] hover:bg-white/60'
          }`}
        >
          Comunicación asertiva
        </button>
        <button
          onClick={() => setActiveCategory('rompehielos')}
          className={`px-3.5 py-1.5 text-xs font-black rounded-xl whitespace-nowrap transition-all ${
            activeCategory === 'rompehielos'
              ? 'bg-gradient-to-r from-[#B69AF5] to-[#FF80B5] text-white shadow-xs scale-102'
              : 'text-[#28243A]/70 hover:text-[#28243A] hover:bg-white/60'
          }`}
        >
          Rompehielos
        </button>
      </div>

      {/* Guide Cards */}
      <div className="space-y-4">
        {filteredGuides.map((guide) => {
          const isExpanded = expandedId === guide.id;

          return (
            <div
              key={guide.id}
              className={`bg-white rounded-3xl border-2 transition-all duration-200 overflow-hidden shadow-xs ${
                isExpanded ? 'border-[#FF936F] ring-2 ring-[#FF936F]/20' : 'border-[#FFD65A]/40 hover:border-[#FF936F]'
              }`}
            >
              {/* Card Header Accordion Trigger */}
              <div
                onClick={() => setExpandedId(isExpanded ? '' : guide.id)}
                className="p-5 cursor-pointer flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black tracking-wider uppercase text-[#A03E15] bg-[#FF936F]/20 px-2.5 py-0.5 rounded-full border border-[#FF936F]/30">
                      {guide.categoryLabel}
                    </span>
                    <span className="text-xs text-[#28243A]/40">·</span>
                    <span className="text-xs font-bold text-[#28243A]/70">{guide.tag}</span>
                  </div>
                  <h3 className="font-black text-base sm:text-lg text-[#28243A]">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-[#28243A]/70 font-medium leading-relaxed">
                    {guide.summary}
                  </p>
                </div>

                <div className="p-2 rounded-2xl bg-[#FFF9F0] border border-[#FFD65A]/40 text-[#28243A] shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded Card Body */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t-2 border-[#FFD65A]/30 space-y-4 bg-[#FFF9F0]/60">
                  {/* Core Principle */}
                  <div className="p-4 rounded-2xl bg-white border-2 border-[#FFD65A]/50 flex items-start gap-3 shadow-2xs">
                    <Lightbulb className="w-5 h-5 text-[#FF936F] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-black text-xs text-[#28243A]">Principio clave:</h4>
                      <p className="text-xs text-[#28243A]/80 font-medium mt-0.5">{guide.keyPrinciple}</p>
                    </div>
                  </div>

                  {/* Practical Steps */}
                  <div className="space-y-2">
                    <h4 className="font-black text-xs text-[#28243A]">Pasos prácticos sugeridos:</h4>
                    <div className="space-y-2">
                      {guide.practicalSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-[#28243A]/80 font-medium">
                          <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#FFD65A] to-[#FF936F] text-[#28243A] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sample Copyable Phrases */}
                  <div className="space-y-2 pt-2">
                    <h4 className="font-black text-xs text-[#28243A]">Frases de ejemplo para poner en práctica:</h4>
                    <div className="space-y-2">
                      {guide.samplePhrases.map((phrase, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white rounded-2xl border border-[#FFD65A]/50 flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <span className="text-xs font-bold text-[#28243A] italic">"{phrase}"</span>
                          <button
                            onClick={() => handleCopyPhrase(phrase)}
                            className="p-1.5 rounded-xl bg-[#FFF9F0] hover:bg-[#FFF2DE] text-[#28243A] text-xs font-bold flex items-center gap-1 border border-[#FFD65A]/40 transition-colors shrink-0"
                            title="Copiar frase"
                          >
                            {copiedPhrase === phrase ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-[#FF936F]" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
