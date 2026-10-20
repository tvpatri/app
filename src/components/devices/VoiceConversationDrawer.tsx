import React from 'react';
import { VoiceChatMessage } from '../../types';
import { X, Volume2, User, Bot, Trash2, Sparkles, MessageSquare } from 'lucide-react';
import { EMOTIONS_CONFIG } from '../../data/emotionsData';

interface VoiceConversationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: VoiceChatMessage[];
  botName: string;
  onClearHistory: () => void;
  onReplaySpeech: (text: string) => void;
}

export const VoiceConversationDrawer: React.FC<VoiceConversationDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  botName,
  onClearHistory,
  onReplaySpeech,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl max-h-[85vh] sm:rounded-3xl rounded-t-3xl shadow-2xl border border-[#ECEDEF] flex flex-col overflow-hidden text-[#292A30]">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#ECEDEF] bg-[#F8F7F4]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#DCD5F5] flex items-center justify-center text-[#4F4275]">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#292A30]">
                Transcripción de conversación
              </h3>
              <p className="text-xs text-[#50545E]">
                Con {botName} · Registros en vivo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-2 rounded-xl text-[#50545E] hover:text-red-600 hover:bg-red-50 text-xs font-medium transition-colors"
                title="Limpiar transcripción"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#50545E] hover:bg-[#ECEDEF] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="py-12 text-center text-[#50545E] space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#ECEDEF] flex items-center justify-center text-[#50545E]/60">
                <Bot className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">Aún no hay mensajes en esta sesión.</p>
              <p className="text-xs max-w-xs mx-auto text-[#50545E]/80">
                Toca el micrófono en la pantalla de {botName} y habla con naturalidad en español.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const emoConfig = msg.detectedEmotion ? EMOTIONS_CONFIG[msg.detectedEmotion] : null;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-[#50545E] px-1">
                    {isUser ? (
                      <>
                        <span>Tú</span>
                        <User className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        <Bot className="w-3 h-3 text-[#4F4275]" />
                        <span className="font-semibold text-[#4F4275]">{botName}</span>
                        {emoConfig && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-[#ECEDEF] text-[9px]">
                            {emoConfig.emoji} {emoConfig.label}
                          </span>
                        )}
                      </>
                    )}
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-[#292A30] text-white rounded-br-xs'
                        : 'bg-[#F8F7F4] text-[#292A30] border border-[#ECEDEF] rounded-bl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {msg.wellnessTip && (
                      <div className="mt-2 pt-2 border-t border-black/5 flex items-center gap-1.5 text-xs text-[#2D5A3C] font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{msg.wellnessTip}</span>
                      </div>
                    )}
                  </div>

                  {!isUser && (
                    <button
                      onClick={() => onReplaySpeech(msg.text)}
                      className="inline-flex items-center gap-1 text-[11px] text-[#50545E] hover:text-[#292A30] px-2 py-0.5 transition-colors"
                      title="Volver a escuchar esta respuesta"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Escuchar</span>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#F8F7F4] border-t border-[#ECEDEF] text-center text-[11px] text-[#50545E]">
          <span>Las respuestas son generadas por Gemini AI y adaptadas a tu bienestar.</span>
        </div>
      </div>
    </div>
  );
};
