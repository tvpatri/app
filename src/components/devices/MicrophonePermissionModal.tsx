import React from 'react';
import { Mic, ShieldCheck, Heart, Sparkles, X, MessageSquare } from 'lucide-react';

interface MicrophonePermissionModalProps {
  isOpen: boolean;
  botName: string;
  onConfirm: () => void;
  onCancel: () => void;
  onUseKeyboard: () => void;
}

export const MicrophonePermissionModal: React.FC<MicrophonePermissionModalProps> = ({
  isOpen,
  botName,
  onConfirm,
  onCancel,
  onUseKeyboard,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#ECEDEF] relative space-y-5 text-[#292A30]">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-full text-[#50545E] hover:bg-[#ECEDEF] transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#DCD5F5]/60 flex items-center justify-center text-[#4F4275] shadow-xs">
          <Mic className="w-8 h-8 animate-pulse text-[#4F4275]" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9E8DE]/60 text-[#1E3A27] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Voz Conversacional IA</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-[#292A30]">
            Habla con {botName} de forma natural
          </h3>
          <p className="text-sm text-[#50545E] mt-1.5 leading-relaxed">
            Para que tu smartphone funcione como un verdadero robot emocional y puedas mantener una conversación fluida por voz, necesitamos permiso para acceder al micrófono.
          </p>
        </div>

        {/* Key Guarantees */}
        <div className="space-y-3 bg-[#F8F7F4] p-4 rounded-2xl border border-[#ECEDEF] text-xs text-[#50545E]">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <strong className="text-[#292A30] font-semibold">100% Privado y Seguro:</strong>{' '}
              El audio se procesa en tiempo real para entender el tono y tus palabras. No se almacena ninguna grabación de voz permanente.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Heart className="w-4 h-4 text-[#8C5835] mt-0.5 shrink-0" />
            <div>
              <strong className="text-[#292A30] font-semibold">Compañero Amigable:</strong>{' '}
              {botName} te responderá con voz hablada en español, adaptando sus expresiones y consejos a lo que sientes.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={onConfirm}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#292A30] hover:bg-black text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Mic className="w-4 h-4 text-[#8BE9FD]" />
            <span>Permitir micrófono y comenzar</span>
          </button>

          <button
            onClick={onUseKeyboard}
            className="w-full py-2.5 px-4 rounded-2xl bg-transparent hover:bg-[#ECEDEF] text-[#50545E] hover:text-[#292A30] font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Prefiero escribir con teclado</span>
          </button>
        </div>
      </div>
    </div>
  );
};
