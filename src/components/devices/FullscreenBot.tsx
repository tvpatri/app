import React, { useState, useEffect, useRef } from 'react';
import { useEmoti } from '../../context/EmotiContext';
import { useAuth } from '../../context/AuthContext';
import { BotExpression, EmotionType, VoiceBotState, VoiceChatMessage } from '../../types';
import { EMOTIONS_CONFIG } from '../../data/emotionsData';
import { VoiceService } from '../../services/voiceService';
import { VoiceWaveVisualizer } from './VoiceWaveVisualizer';
import { MicrophonePermissionModal } from './MicrophonePermissionModal';
import { VoiceConversationDrawer } from './VoiceConversationDrawer';
import { 
  X, 
  Sparkles, 
  RotateCw, 
  Heart, 
  Mic, 
  MicOff, 
  Square, 
  MessageSquare, 
  Send, 
  Volume2, 
  VolumeX, 
  Keyboard, 
  AlertCircle, 
  RefreshCw,
  HelpCircle,
  Wind
} from 'lucide-react';

export const FullscreenBot: React.FC = () => {
  const {
    botName,
    currentEmotion,
    setEmotion,
    botExpression,
    setBotExpression,
    cycleBotExpression,
    botMessage,
    setBotMessage,
    touchBot,
    isBotPetted,
    exitFullscreenDevice,
    showToast,
  } = useEmoti();

  const { userProfile, user } = useAuth();
  const effectiveUserName =
    userProfile?.displayName?.trim() ||
    user?.displayName?.trim() ||
    (userProfile?.username ? `@${userProfile.username}` : '') ||
    'amigo';
  const effectiveBotName = userProfile?.botName?.trim() || botName || 'Milo';

  // Voice Conversation States
  const [voiceState, setVoiceState] = useState<VoiceBotState>('IDLE');
  const [isBlinking, setIsBlinking] = useState(false);
  const [showEmotionSheet, setShowEmotionSheet] = useState(false);
  const [showTranscriptDrawer, setShowTranscriptDrawer] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showKeyboardInput, setShowKeyboardInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<VoiceChatMessage[]>([]);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingSeconds, setBreathingSeconds] = useState(4);
  const [speakingLipSync, setSpeakingLipSync] = useState(0);

  // Initialize friendly welcoming message with user's actual name
  useEffect(() => {
    if (botMessage === 'Disfruta este momento.' || !botMessage) {
      setBotMessage(`¡Hola, ${effectiveUserName}! Soy tu ${effectiveBotName}. Cuéntame cómo te sientes hoy o de qué te gustaría hablar.`);
    }
  }, [effectiveUserName, effectiveBotName]);

  // Background color mapping per emotion
  // Background color mapping per emotion with vibrant brand palette
  const getBackgroundColor = () => {
    switch (currentEmotion) {
      case 'feliz':
        return 'bg-[#FFD65A] text-[#28243A]'; // Amarillo vibrante
      case 'tranquilo':
        return 'bg-[#72D6B1] text-[#28243A]'; // Verde menta
      case 'emocionado':
        return 'bg-[#FF936F] text-[#28243A]'; // Naranja coral
      case 'triste':
        return 'bg-[#79B9F2] text-[#28243A]'; // Azul
      case 'estresado':
        return 'bg-[#FF80B5] text-[#28243A]'; // Rosa
      case 'cansado':
      default:
        return 'bg-[#B69AF5] text-[#28243A]'; // Lila
    }
  };

  // Automatic eye blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (voiceState !== 'THINKING') {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 180);
      }
    }, 4500);

    return () => clearInterval(blinkInterval);
  }, [voiceState]);

  // Clean up voice and synthesis on unmount
  useEffect(() => {
    return () => {
      VoiceService.abortListening();
      VoiceService.cancelSpeech();
    };
  }, []);

  // Breathing exercise countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (breathingActive) {
      if (breathingSeconds > 0) {
        timer = setTimeout(() => setBreathingSeconds((prev) => prev - 1), 1000);
      } else {
        setBreathingActive(false);
        setBreathingSeconds(4);
        showToast('¡Gran respiro! Excelente pausa para tu bienestar.', 'success');
      }
    }
    return () => clearTimeout(timer);
  }, [breathingActive, breathingSeconds, showToast]);

  // Lip sync timer while speaking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (voiceState === 'SPEAKING') {
      interval = setInterval(() => {
        setSpeakingLipSync((prev) => (prev + 1) % 4);
      }, 140);
    } else {
      setSpeakingLipSync(0);
    }
    return () => clearInterval(interval);
  }, [voiceState]);

  const handleFaceTap = () => {
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 220);
    touchBot();

    // If bot is speaking, tapping interrupts gently
    if (voiceState === 'SPEAKING') {
      interruptAiSpeech();
    }
  };

  /**
   * Start Voice Interaction: checks mic permission first
   */
  const handleMicrophoneClick = async () => {
    // If speaking, interrupt!
    if (voiceState === 'SPEAKING') {
      interruptAiSpeech();
      return;
    }

    // If already listening, stop listening and finalize
    if (voiceState === 'LISTENING') {
      VoiceService.stopListening();
      setVoiceState('IDLE');
      return;
    }

    // If thinking, let it finish or allow cancelling
    if (voiceState === 'THINKING') {
      setVoiceState('IDLE');
      return;
    }

    // Check if permission already asked or need prompt
    const hasAskedPermission = localStorage.getItem('emoti_mic_permission_granted');
    if (!hasAskedPermission) {
      setShowPermissionModal(true);
      return;
    }

    startListeningProcess();
  };

  const handlePermissionConfirm = async () => {
    setShowPermissionModal(false);
    const granted = await VoiceService.requestMicrophonePermission();
    if (granted) {
      localStorage.setItem('emoti_mic_permission_granted', 'true');
      startListeningProcess();
    } else {
      setErrorMessage('No pudimos acceder a tu micrófono. Puedes escribir con teclado en cualquier momento.');
      setVoiceState('ERROR');
    }
  };

  const startListeningProcess = () => {
    setVoiceState('LISTENING');
    setInterimTranscript('');
    setErrorMessage('');

    const started = VoiceService.startListening({
      onInterim: (text) => {
        setInterimTranscript(text);
      },
      onFinal: (finalText) => {
        setInterimTranscript('');
        handleProcessUserMessage(finalText);
      },
      onError: (err) => {
        console.warn('Voice recognition error:', err);
        setErrorMessage(err);
        setVoiceState('ERROR');
      },
      onEnd: () => {
        // Will transition to THINKING once final text processed
      },
    });

    if (!started) {
      setErrorMessage('Tu navegador no permite reconocimiento de voz continuo. Usa el teclado.');
      setVoiceState('ERROR');
    }
  };

  /**
   * Process user speech message with Gemini AI
   */
  const handleProcessUserMessage = async (userText: string) => {
    if (!userText.trim()) {
      setVoiceState('IDLE');
      return;
    }

    // Record user message in transcript
    const userMsg: VoiceChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setVoiceState('THINKING');
    setBotExpression('THINKING');

    try {
      // Query Gemini AI companion via backend proxy
      const aiResponse = await VoiceService.queryGeminiCompanion({
        message: userText,
        history: chatHistory,
        currentEmotion,
        botName: effectiveBotName,
        userName: effectiveUserName,
      });

      // Update bot message
      setBotMessage(aiResponse.reply);

      // Dynamically adapt bot expression & ecosystem emotion
      if (aiResponse.expression) {
        setBotExpression(aiResponse.expression);
      }
      if (aiResponse.detectedEmotion && aiResponse.detectedEmotion !== currentEmotion) {
        setEmotion(aiResponse.detectedEmotion);
      }

      // Record bot message in transcript
      const botMsg: VoiceChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: aiResponse.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        expression: aiResponse.expression,
        detectedEmotion: aiResponse.detectedEmotion,
        wellnessTip: aiResponse.wellnessTip,
      };
      setChatHistory((prev) => [...prev, botMsg]);

      // Speak response out loud in Spanish
      setVoiceState('SPEAKING');

      VoiceService.speak(aiResponse.reply, {
        onStart: () => {
          setVoiceState('SPEAKING');
        },
        onEnd: () => {
          setVoiceState('IDLE');
        },
        onError: () => {
          setVoiceState('IDLE');
        },
      });
    } catch (err: any) {
      console.error('Error contacting Gemini Companion:', err);
      setErrorMessage('Hubo un inconveniente al conectar con mi inteligencia. Intenta de nuevo.');
      setVoiceState('ERROR');
      setBotExpression('SUPPORTIVE');
    }
  };

  /**
   * Interrupt AI Speech immediately
   */
  const interruptAiSpeech = () => {
    VoiceService.cancelSpeech();
    setVoiceState('IDLE');
    showToast('Voz pausada. ¿De qué más te gustaría hablar?', 'info');
  };

  /**
   * Handle text input fallback submission
   */
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const msg = textInput.trim();
    setTextInput('');
    setShowKeyboardInput(false);
    handleProcessUserMessage(msg);
  };

  /**
   * Quick Prompt selector
   */
  const handleQuickPrompt = (promptText: string) => {
    handleProcessUserMessage(promptText);
  };

  /**
   * Trigger guided 4-second breathing exercise
   */
  const handleTriggerBreathing = () => {
    setBreathingActive(true);
    setBreathingSeconds(4);
    setBotExpression('CALM');
  };

  // Render Giant OLED Eyes & Expression
  const renderFace = () => {
    const eyeGlow = '#8BE9FD'; // Futuristic cyan OLED
    const mouthColor = '#A3E8FF';

    // Blinking state
    if (isBlinking) {
      return (
        <div className="flex flex-col items-center justify-center gap-12 w-full h-full">
          <div className="flex items-center justify-center gap-16 sm:gap-24">
            <div className="w-20 sm:w-28 h-2.5 bg-[#8BE9FD] rounded-full shadow-[0_0_20px_#8BE9FD]" />
            <div className="w-20 sm:w-28 h-2.5 bg-[#8BE9FD] rounded-full shadow-[0_0_20px_#8BE9FD]" />
          </div>
          <div className="w-12 h-2 bg-[#8BE9FD]/60 rounded-full" />
        </div>
      );
    }

    // Dynamic Speaking Lip-Sync Mouth Helper
    const renderMouth = () => {
      if (voiceState === 'SPEAKING') {
        const lipHeights = [
          'w-14 h-4 rounded-full bg-[#8BE9FD]/90 shadow-[0_0_12px_#8BE9FD]',
          'w-18 h-7 rounded-full bg-[#8BE9FD] shadow-[0_0_18px_#8BE9FD]',
          'w-12 h-3 rounded-full bg-[#8BE9FD]/80 shadow-[0_0_10px_#8BE9FD]',
          'w-16 h-8 rounded-full bg-[#8BE9FD] shadow-[0_0_16px_#8BE9FD]',
        ];
        return (
          <div className="flex items-center justify-center transition-all duration-100">
            <div className={lipHeights[speakingLipSync]} />
          </div>
        );
      }

      if (voiceState === 'LISTENING') {
        return (
          <div className="w-8 h-8 rounded-full border-2 border-[#8BE9FD] animate-ping opacity-80" />
        );
      }

      // Default expression mouths
      switch (botExpression) {
        case 'HAPPY':
          return (
            <svg className="w-20 h-10 sm:w-24 sm:h-12" viewBox="0 0 60 30">
              <path
                d="M 12 8 Q 30 26 48 8"
                fill="none"
                stroke={mouthColor}
                strokeWidth="6"
                strokeLinecap="round"
                className="filter drop-shadow-[0_0_10px_#8BE9FD]"
              />
            </svg>
          );
        case 'EXCITED':
          return (
            <svg className="w-20 h-12 sm:w-26 sm:h-14" viewBox="0 0 60 36">
              <path
                d="M 12 10 Q 30 34 48 10 Z"
                fill="#8BE9FD"
                opacity="0.85"
                className="filter drop-shadow-[0_0_12px_#8BE9FD]"
              />
            </svg>
          );
        case 'STRESSED':
          return (
            <svg className="w-20 h-8" viewBox="0 0 60 20">
              <path
                d="M 10 10 Q 20 4 30 10 T 50 10"
                fill="none"
                stroke={mouthColor}
                strokeWidth="5"
                strokeLinecap="round"
                className="filter drop-shadow-[0_0_8px_#8BE9FD]"
              />
            </svg>
          );
        case 'SAD':
        case 'SUPPORTIVE':
        case 'CALM':
        case 'THINKING':
        default:
          return (
            <div className="w-14 h-2 bg-[#8BE9FD]/80 rounded-full shadow-[0_0_8px_#8BE9FD]" />
          );
      }
    };

    switch (botExpression) {
      case 'HAPPY':
        return (
          <div className="flex flex-col items-center justify-center gap-8 sm:gap-12 w-full h-full">
            <div className="flex items-center justify-center gap-14 sm:gap-20">
              <svg className="w-24 h-20 sm:w-32 sm:h-24" viewBox="0 0 80 60">
                <path
                  d="M 10 45 Q 40 10 70 45"
                  fill="none"
                  stroke={eyeGlow}
                  strokeWidth="11"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_14px_#8BE9FD]"
                />
                <circle cx="55" cy="22" r="4" fill="#FFFFFF" />
              </svg>

              <svg className="w-24 h-20 sm:w-32 sm:h-24" viewBox="0 0 80 60">
                <path
                  d="M 10 45 Q 40 10 70 45"
                  fill="none"
                  stroke={eyeGlow}
                  strokeWidth="11"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_14px_#8BE9FD]"
                />
                <circle cx="55" cy="22" r="4" fill="#FFFFFF" />
              </svg>
            </div>
            {renderMouth()}
          </div>
        );

      case 'EXCITED':
        return (
          <div className="flex flex-col items-center justify-center gap-8 sm:gap-12 w-full h-full">
            <div className="flex items-center justify-center gap-12 sm:gap-18">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-8 border-[#8BE9FD] flex items-center justify-center shadow-[0_0_24px_#8BE9FD] relative animate-pulse">
                <div className="w-9 h-9 sm:w-12 sm:h-12 bg-white rounded-full shadow-[0_0_12px_#FFF]" />
                <span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-white" />
                <span className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-white" />
              </div>

              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-8 border-[#8BE9FD] flex items-center justify-center shadow-[0_0_24px_#8BE9FD] relative animate-pulse">
                <div className="w-9 h-9 sm:w-12 sm:h-12 bg-white rounded-full shadow-[0_0_12px_#FFF]" />
                <span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-white" />
                <span className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
            {renderMouth()}
          </div>
        );

      case 'SAD':
        return (
          <div className="flex flex-col items-center justify-center gap-8 sm:gap-12 w-full h-full">
            <div className="flex items-center justify-center gap-14 sm:gap-20">
              <svg className="w-24 h-20 sm:w-32 sm:h-24" viewBox="0 0 80 60">
                <path
                  d="M 12 20 Q 40 50 68 30"
                  fill="none"
                  stroke={eyeGlow}
                  strokeWidth="10"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_12px_#8BE9FD]"
                />
                <circle cx="36" cy="40" r="4" fill="#FFFFFF" />
              </svg>

              <svg className="w-24 h-20 sm:w-32 sm:h-24" viewBox="0 0 80 60">
                <path
                  d="M 12 30 Q 40 50 68 20"
                  fill="none"
                  stroke={eyeGlow}
                  strokeWidth="10"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_12px_#8BE9FD]"
                />
                <circle cx="44" cy="40" r="4" fill="#FFFFFF" />
              </svg>
            </div>
            {renderMouth()}
          </div>
        );

      case 'STRESSED':
        return (
          <div className="flex flex-col items-center justify-center gap-8 sm:gap-12 w-full h-full">
            <div className="flex items-center justify-center gap-12 sm:gap-18">
              <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-full border-7 border-[#8BE9FD] flex items-center justify-center shadow-[0_0_16px_#8BE9FD] transform -rotate-12">
                <div className="w-7 h-7 sm:w-10 sm:h-10 bg-[#8BE9FD] rounded-full translate-x-1" />
              </div>

              <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-full border-7 border-[#8BE9FD] flex items-center justify-center shadow-[0_0_16px_#8BE9FD] transform rotate-12">
                <div className="w-7 h-7 sm:w-10 sm:h-10 bg-[#8BE9FD] rounded-full -translate-x-1" />
              </div>
            </div>
            {renderMouth()}
          </div>
        );

      case 'SUPPORTIVE':
      case 'CALM':
        return (
          <div className="flex flex-col items-center justify-center gap-8 sm:gap-12 w-full h-full">
            <div className="flex items-center justify-center gap-12 sm:gap-18">
              <div className="w-20 h-20 sm:w-26 sm:h-26 rounded-full border-8 border-[#8BE9FD] flex items-center justify-center shadow-[0_0_20px_#8BE9FD] relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-[0_0_10px_#FFF]" />
                <span className="absolute top-2 right-2 w-3 h-3 rounded-full bg-white" />
              </div>

              <div className="w-20 h-20 sm:w-26 sm:h-26 rounded-full border-8 border-[#8BE9FD] flex items-center justify-center shadow-[0_0_20px_#8BE9FD] relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-[0_0_10px_#FFF]" />
                <span className="absolute top-2 right-2 w-3 h-3 rounded-full bg-white" />
              </div>
            </div>
            {renderMouth()}
          </div>
        );

      case 'THINKING':
      default:
        return (
          <div className="flex flex-col items-center justify-center gap-8 sm:gap-12 w-full h-full">
            <div className="flex items-center justify-center gap-12 sm:gap-18">
              <div className="relative">
                <div className="w-10 h-2 bg-[#8BE9FD] rounded-full mb-2 -rotate-12 transform shadow-[0_0_8px_#8BE9FD]" />
                <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-full border-7 border-[#8BE9FD] flex items-center justify-center shadow-[0_0_18px_#8BE9FD]">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#8BE9FD] rounded-full translate-x-1 -translate-y-1" />
                </div>
              </div>

              <div className="relative pt-3">
                <div className="w-16 h-16 sm:w-22 sm:h-22 rounded-full border-6 border-[#8BE9FD] flex items-center justify-center shadow-[0_0_16px_#8BE9FD]">
                  <div className="w-5 h-5 sm:w-7 sm:h-7 bg-[#8BE9FD] rounded-full translate-x-1" />
                </div>
              </div>
            </div>
            {renderMouth()}
          </div>
        );
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between p-4 sm:p-6 transition-colors duration-700 select-none overflow-hidden ${getBackgroundColor()}`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between z-20">
        {/* Identity & Companion Status Pill */}
        <div className="flex items-center gap-2 bg-black/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-black/5">
          <span
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              voiceState === 'LISTENING'
                ? 'bg-rose-500 animate-ping'
                : voiceState === 'THINKING'
                ? 'bg-amber-400 animate-spin'
                : voiceState === 'SPEAKING'
                ? 'bg-cyan-400 animate-pulse'
                : 'bg-emerald-500 animate-pulse'
            }`}
          />
          <span className="text-xs font-bold tracking-tight text-current">
            {effectiveBotName}
          </span>
          <span className="text-[10px] opacity-80 font-medium bg-black/5 px-1.5 py-0.5 rounded-md">
            {effectiveUserName}
          </span>
          <span className="text-[10px] opacity-70">
            {voiceState === 'LISTENING'
              ? '· Escuchando...'
              : voiceState === 'THINKING'
              ? '· Pensando...'
              : voiceState === 'SPEAKING'
              ? '· Hablando...'
              : '· IA Activa'}
          </span>
        </div>

        {/* Right Action Icons: Transcript Drawer + Exit */}
        <div className="flex items-center gap-2">
          {/* Transcript Drawer Button */}
          <button
            onClick={() => setShowTranscriptDrawer(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-md text-current text-xs font-semibold transition-all active:scale-95 border border-black/5"
            title="Ver transcripción completa"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Transcripción</span>
            {chatHistory.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-black/20 text-[10px] flex items-center justify-center">
                {chatHistory.length}
              </span>
            )}
          </button>

          {/* Exit Button */}
          <button
            onClick={exitFullscreenDevice}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-md text-current text-xs font-semibold transition-all active:scale-95 border border-black/5"
            title="Volver a la aplicación principal"
          >
            <span>Salir</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Center OLED Face Screen */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto relative z-10">
        {/* Soft Ambient Glow Halo */}
        <div
          className={`absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            voiceState === 'LISTENING'
              ? 'bg-rose-400/30 scale-110'
              : voiceState === 'SPEAKING'
              ? 'bg-cyan-400/35 scale-105'
              : voiceState === 'THINKING'
              ? 'bg-amber-400/25 scale-100'
              : 'bg-cyan-400/20 animate-pulse'
          }`}
        />

        {/* OLED Circular Display Chassis */}
        <div
          onClick={handleFaceTap}
          className={`relative cursor-pointer w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96 rounded-full bg-[#101216] p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5),0_0_0_12px_rgba(255,255,255,0.15)] flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${
            voiceState === 'LISTENING'
              ? 'ring-8 ring-rose-400/60 shadow-[0_0_40px_rgba(244,63,94,0.4)]'
              : voiceState === 'SPEAKING'
              ? 'ring-8 ring-cyan-400/50 shadow-[0_0_35px_rgba(139,233,253,0.3)]'
              : isBotPetted
              ? 'ring-8 ring-pink-400/50'
              : ''
          }`}
          title="Toca mi cara para interactuar"
        >
          {/* Glass specularity arc */}
          <div className="absolute top-2 left-6 right-6 h-28 bg-gradient-to-b from-white/10 to-transparent rounded-t-full pointer-events-none" />

          {/* Petting heart animation */}
          {isBotPetted && (
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
              <Heart className="w-24 h-24 text-pink-400 fill-pink-400 animate-ping opacity-90" />
            </div>
          )}

          {/* Actual Face SVG */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
            {renderFace()}
          </div>
        </div>

        {/* Conversational Speech Bubble & Realtime Transcriptions */}
        <div className="mt-5 max-w-sm sm:max-w-md w-full mx-auto bg-white/90 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/70 shadow-sm text-center transition-all">
          {voiceState === 'LISTENING' ? (
            <div className="space-y-1.5 py-1">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-rose-600">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Te escucho con atención... Di lo que sientes</span>
              </div>
              <p className="text-sm italic text-[#292A30] min-h-[22px]">
                {interimTranscript || 'Comienza a hablar en español...'}
              </p>
              <VoiceWaveVisualizer state="LISTENING" colorHex="#F43F5E" />
            </div>
          ) : voiceState === 'THINKING' ? (
            <div className="space-y-1.5 py-1">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-700">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-500" />
                <span>{botName} está procesando tu sentir...</span>
              </div>
              <VoiceWaveVisualizer state="THINKING" colorHex="#F59E0B" />
            </div>
          ) : voiceState === 'SPEAKING' ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-[#50545E] pb-1 border-b border-black/5">
                <span className="flex items-center gap-1 font-semibold text-[#4F4275]">
                  <Volume2 className="w-3.5 h-3.5 text-[#4F4275]" />
                  <span>Respuesta de {botName}</span>
                </span>
                <button
                  onClick={interruptAiSpeech}
                  className="px-2 py-0.5 rounded-md bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-[10px] transition-colors"
                  title="Interrumpir respuesta hablada"
                >
                  Interrumpir
                </button>
              </div>
              <p className="text-sm font-semibold text-[#292A30] leading-snug">
                "{botMessage}"
              </p>
              <VoiceWaveVisualizer state="SPEAKING" colorHex="#0284C7" />
            </div>
          ) : voiceState === 'ERROR' ? (
            <div className="space-y-2 py-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMessage || 'Hubo un error de voz.'}</span>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={handleMicrophoneClick}
                  className="px-3 py-1 rounded-xl bg-[#292A30] text-white text-xs font-medium hover:bg-black transition-colors"
                >
                  Reintentar hablar
                </button>
                <button
                  onClick={() => setShowKeyboardInput(true)}
                  className="px-3 py-1 rounded-xl bg-[#ECEDEF] text-[#292A30] text-xs font-medium hover:bg-gray-200 transition-colors"
                >
                  Usar teclado
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold text-[#292A30] leading-snug">
                "{botMessage}"
              </p>
              <div className="mt-1 flex items-center justify-center gap-2 text-[11px] text-[#50545E]">
                <span>Toca el micrófono para hablarme</span>
                <span>·</span>
                <button
                  onClick={handleTriggerBreathing}
                  className="text-[#2D5A3C] font-semibold underline decoration-dotted hover:text-emerald-800"
                >
                  Respirar juntos
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Breathing Guided Exercise Overlay if active */}
        {breathingActive && (
          <div className="mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-900 border border-emerald-500/30 backdrop-blur-md animate-pulse">
            <Wind className="w-4 h-4 text-emerald-700 animate-bounce" />
            <span className="text-xs font-semibold">
              Inhala suavemente... {breathingSeconds}s
            </span>
          </div>
        )}
      </div>

      {/* Suggested Starter Chips (Quick Spanish prompts) */}
      <div className="relative z-20 max-w-md w-full mx-auto px-2 mb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <span className="text-xs font-bold shrink-0 opacity-70">Ideas:</span>
          <button
            onClick={() => handleQuickPrompt('Me siento un poco abrumado con las tareas y necesito calmarme.')}
            className="shrink-0 px-2.5 py-1 rounded-full bg-white/75 hover:bg-white text-[#292A30] font-medium border border-white/60 transition-all active:scale-95 shadow-2xs"
          >
            "Me siento abrumado"
          </button>
          <button
            onClick={() => handleQuickPrompt('¡Aprobé mi examen y me siento muy feliz!')}
            className="shrink-0 px-2.5 py-1 rounded-full bg-white/75 hover:bg-white text-[#292A30] font-medium border border-white/60 transition-all active:scale-95 shadow-2xs"
          >
            "¡Aprobé mi examen!"
          </button>
          <button
            onClick={() => handleQuickPrompt('Tuve un desacuerdo con un amigo y me siento mal.')}
            className="shrink-0 px-2.5 py-1 rounded-full bg-white/75 hover:bg-white text-[#292A30] font-medium border border-white/60 transition-all active:scale-95 shadow-2xs"
          >
            "Problema con un amigo"
          </button>
          <button
            onClick={() => handleQuickPrompt(`¿Cómo estás hoy, ${effectiveBotName}? ¿De qué podemos hablar?`)}
            className="shrink-0 px-2.5 py-1 rounded-full bg-white/75 hover:bg-white text-[#292A30] font-medium border border-white/60 transition-all active:scale-95 shadow-2xs"
          >
            "¿Cómo estás, {effectiveBotName}?"
          </button>
        </div>
      </div>

      {/* Primary Interaction Zone: Prominent Circular Mic & Controls */}
      <div className="relative z-20 max-w-md w-full mx-auto pb-2 space-y-2">
        {/* Main Microphone Button Centerpiece */}
        <div className="flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Pulsing Ripple Rings when listening */}
            {voiceState === 'LISTENING' && (
              <>
                <span className="absolute w-24 h-24 rounded-full bg-rose-400/30 animate-ping pointer-events-none" />
                <span className="absolute w-20 h-20 rounded-full bg-rose-400/40 animate-pulse pointer-events-none" />
              </>
            )}

            {/* Glowing ring when speaking */}
            {voiceState === 'SPEAKING' && (
              <span className="absolute w-22 h-22 rounded-full bg-cyan-400/30 animate-pulse pointer-events-none" />
            )}

            {/* Circular Microphone Button */}
            <button
              onClick={handleMicrophoneClick}
              className={`relative z-10 w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-xl active:scale-90 cursor-pointer ${
                voiceState === 'LISTENING'
                  ? 'bg-rose-500 text-white shadow-rose-500/50 ring-4 ring-rose-200'
                  : voiceState === 'SPEAKING'
                  ? 'bg-[#292A30] text-[#8BE9FD] shadow-cyan-500/30 ring-4 ring-cyan-200 hover:bg-black'
                  : voiceState === 'THINKING'
                  ? 'bg-amber-500 text-white shadow-amber-500/30 ring-4 ring-amber-200 animate-pulse'
                  : 'bg-[#292A30] text-white hover:bg-black ring-4 ring-white/60 hover:ring-cyan-300/80'
              }`}
              title={
                voiceState === 'SPEAKING'
                  ? 'Toca para interrumpir'
                  : voiceState === 'LISTENING'
                  ? 'Toca para enviar'
                  : 'Toca para hablar en español'
              }
              aria-label="Micrófono conversacional"
            >
              {voiceState === 'SPEAKING' ? (
                <div className="flex flex-col items-center">
                  <Square className="w-6 h-6 fill-rose-300 text-rose-300 animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white mt-0.5">Parar</span>
                </div>
              ) : voiceState === 'LISTENING' ? (
                <div className="flex flex-col items-center">
                  <Mic className="w-7 h-7 text-white animate-bounce" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white mt-0.5">Listo</span>
                </div>
              ) : voiceState === 'THINKING' ? (
                <div className="flex flex-col items-center">
                  <RotateCw className="w-6 h-6 animate-spin text-white" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white mt-0.5">IA...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Mic className="w-7 h-7 text-[#8BE9FD]" />
                  <span className="text-[9px] font-semibold text-white/90 mt-0.5">Hablar</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Convenient Input Bar: Speak or Type immediately */}
        <form
          onSubmit={handleTextSubmit}
          className="bg-white/90 backdrop-blur-md rounded-2xl p-1.5 border border-white/80 shadow-md flex items-center gap-2"
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={`Escribe a ${effectiveBotName} o usa el micrófono...`}
            className="flex-1 bg-[#F8F7F4] px-3.5 py-2 rounded-xl text-xs text-[#292A30] placeholder:text-[#50545E]/60 focus:outline-none focus:ring-2 focus:ring-[#8BE9FD]"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || voiceState === 'THINKING'}
            className="p-2 rounded-xl bg-[#292A30] hover:bg-black text-white disabled:opacity-40 transition-colors cursor-pointer"
            title="Enviar mensaje"
          >
            <Send className="w-3.5 h-3.5 text-[#8BE9FD]" />
          </button>
        </form>

        {/* Secondary Utility Controls */}
        <div className="bg-white/75 backdrop-blur-md rounded-2xl p-1 border border-white/60 shadow-xs flex items-center justify-between gap-1.5">
          {/* Action 1: Cambiar emoción manual */}
          <button
            onClick={() => setShowEmotionSheet(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-white/60 hover:bg-[#DCD5F5]/60 text-[#292A30] text-xs font-semibold transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4F4275]" />
            <span className="truncate">Emoción</span>
          </button>

          {/* Action 2: Cambiar rostro */}
          <button
            onClick={cycleBotExpression}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-white/60 hover:bg-[#D9E8DE]/60 text-[#292A30] text-xs font-semibold transition-all active:scale-95 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#2D5A3C]" />
            <span className="truncate">Rostro</span>
          </button>

          {/* Action 3: Transcripción rápida */}
          <button
            onClick={() => setShowTranscriptDrawer(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-white/60 hover:bg-[#F5DFD3]/60 text-[#292A30] text-xs font-semibold transition-all active:scale-95 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#8C5835]" />
            <span className="truncate">Historial</span>
          </button>
        </div>
      </div>

      {/* Bottom Sheet for Emotion Selection */}
      {showEmotionSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-[#ECEDEF] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#ECEDEF]">
              <div>
                <h3 className="font-bold text-base text-[#292A30]">
                  Sintonizar emoción de {botName}
                </h3>
                <p className="text-xs text-[#50545E]">
                  El fondo y el rostro se adaptarán en todo el ecosistema.
                </p>
              </div>
              <button
                onClick={() => setShowEmotionSheet(false)}
                className="p-1.5 rounded-lg text-[#50545E] hover:bg-[#ECEDEF]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(Object.keys(EMOTIONS_CONFIG) as EmotionType[]).map((emoKey) => {
                const config = EMOTIONS_CONFIG[emoKey];
                const isSelected = currentEmotion === emoKey;

                return (
                  <button
                    key={emoKey}
                    onClick={() => {
                      setEmotion(emoKey);
                      setShowEmotionSheet(false);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#292A30] text-white border-[#292A30] shadow-sm'
                        : `${config.colorBg} border-transparent hover:border-black/10 text-[#292A30]`
                    }`}
                  >
                    <div className="text-2xl mb-1">{config.emoji}</div>
                    <div className="font-bold text-xs capitalize">{config.label}</div>
                    <div
                      className={`text-[10px] mt-0.5 line-clamp-1 ${
                        isSelected ? 'text-white/80' : 'text-[#50545E]'
                      }`}
                    >
                      {config.botVoiceQuote}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Microphone Permission Modal */}
      <MicrophonePermissionModal
        isOpen={showPermissionModal}
        botName={botName}
        onConfirm={handlePermissionConfirm}
        onCancel={() => setShowPermissionModal(false)}
        onUseKeyboard={() => {
          setShowPermissionModal(false);
          setShowKeyboardInput(true);
        }}
      />

      {/* Full Conversation History Drawer */}
      <VoiceConversationDrawer
        isOpen={showTranscriptDrawer}
        onClose={() => setShowTranscriptDrawer(false)}
        messages={chatHistory}
        botName={botName}
        onClearHistory={() => setChatHistory([])}
        onReplaySpeech={(text) => {
          VoiceService.speak(text);
        }}
      />
    </div>
  );
};
