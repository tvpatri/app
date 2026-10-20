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
  ShieldCheck
} from 'lucide-react';

export const TalkTogether: React.FC = () => {
  const { showToast } = useEmoti();
  const [activeCategory, setActiveCategory] = useState<'all' | 'malentendidos' | 'asertiva' | 'rompehielos'>('all');
  const [expandedId, setExpandedId] = useState<string>('guide-1');
  const [copiedPhrase, setCopiedPhrase] = useState<string | null>(null);

  const handleCopyPhrase = (phrase: string) => {
    navigator.clipboard.writeText(phrase);
    setCopiedPhrase(phrase);
    showToast('Frase copiada al portapapeles para practicar', 'success');
    setTimeout(() => setCopiedPhrase(null), 2500);
  };

  const filteredGuides = activeCategory === 'all' 
    ? DIALOG_GUIDES 
    : DIALOG_GUIDES.filter((g) => g.category === activeCategory);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-wider font-semibold text-[#8C5835] bg-[#F5DFD3]/60 px-2 py-0.5 rounded-md">
          Talk Together
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292A30] tracking-tight mt-1">
          Guía de Diálogo & Amistad
        </h1>
        <p className="text-xs sm:text-sm text-[#50545E] mt-1">
          Herramientas y disparadores empáticos para fortalecer relaciones sanas, resolver conflictos y conectar desde el corazón.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#ECEDEF] rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-white text-[#292A30] shadow-xs'
              : 'text-[#50545E] hover:text-[#292A30]'
          }`}
        >
          Todas las guías
        </button>
        <button
          onClick={() => setActiveCategory('malentendidos')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeCategory === 'malentendidos'
              ? 'bg-white text-[#292A30] shadow-xs'
              : 'text-[#50545E] hover:text-[#292A30]'
          }`}
        >
          Resolver malentendidos
        </button>
        <button
          onClick={() => setActiveCategory('asertiva')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeCategory === 'asertiva'
              ? 'bg-white text-[#292A30] shadow-xs'
              : 'text-[#50545E] hover:text-[#292A30]'
          }`}
        >
          Comunicación asertiva
        </button>
        <button
          onClick={() => setActiveCategory('rompehielos')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeCategory === 'rompehielos'
              ? 'bg-white text-[#292A30] shadow-xs'
              : 'text-[#50545E] hover:text-[#292A30]'
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
              className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs ${
                isExpanded ? 'border-[#292A30] ring-1 ring-[#292A30]/5' : 'border-[#ECEDEF] hover:border-black/10'
              }`}
            >
              {/* Card Header Accordion Trigger */}
              <div
                onClick={() => setExpandedId(isExpanded ? '' : guide.id)}
                className="p-5 cursor-pointer flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-[#4F4275] bg-[#DCD5F5]/60 px-2 py-0.5 rounded-md">
                      {guide.categoryLabel}
                    </span>
                    <span className="text-xs text-[#7A7E89]">·</span>
                    <span className="text-xs text-[#7A7E89]">{guide.tag}</span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-[#292A30]">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-[#50545E] leading-relaxed">
                    {guide.summary}
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-[#F8F7F4] text-[#50545E] shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded Card Body */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-[#ECEDEF] space-y-4 bg-[#F8F7F4]/40">
                  {/* Core Principle */}
                  <div className="p-3.5 rounded-2xl bg-white border border-[#ECEDEF] flex items-start gap-3">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-xs text-[#292A30]">Principio clave:</h4>
                      <p className="text-xs text-[#50545E] mt-0.5">{guide.keyPrinciple}</p>
                    </div>
                  </div>

                  {/* Practical Steps */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-[#292A30]">Pasos prácticos sugeridos:</h4>
                    <div className="space-y-1.5">
                      {guide.practicalSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-[#50545E]">
                          <span className="w-5 h-5 rounded-full bg-[#ECEDEF] text-[#292A30] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sample Copyable Phrases */}
                  <div className="space-y-2 pt-2">
                    <h4 className="font-bold text-xs text-[#292A30]">Frases de ejemplo para poner en práctica:</h4>
                    <div className="space-y-2">
                      {guide.samplePhrases.map((phrase, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-white border border-[#ECEDEF] flex items-center justify-between gap-3 text-xs text-[#292A30]"
                        >
                          <span className="italic leading-snug">{phrase}</span>
                          <button
                            onClick={() => handleCopyPhrase(phrase)}
                            className="p-1.5 rounded-lg text-[#50545E] hover:bg-[#ECEDEF] hover:text-[#292A30] transition-colors shrink-0"
                            title="Copiar frase"
                          >
                            {copiedPhrase === phrase ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
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

      {/* Mutual Care Footnote */}
      <div className="p-4 rounded-2xl bg-[#D9E8DE]/40 border border-[#C2D8C9] text-xs text-[#2D5A3C] flex items-start gap-3">
        <HeartHandshake className="w-4 h-4 text-[#2D5A3C] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Aprender a conversar es un acto de amor propio y colectivo.</strong> No siempre saldrá perfecto a la primera; lo importante es la intención sincera de cuidar el vínculo.
        </p>
      </div>
    </div>
  );
};
