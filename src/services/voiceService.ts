/**
 * Voice Service for EMOTI Ecosystem
 * Handles Web Speech Recognition (STT), Speech Synthesis (TTS), and Gemini AI voice API integration.
 */

import { VoiceChatMessage, BotExpression, EmotionType } from '../types';

// Declare types for WebkitSpeechRecognition
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export interface VoiceApiResponse {
  reply: string;
  expression: BotExpression;
  detectedEmotion: EmotionType;
  wellnessTip?: string;
}

export class VoiceService {
  private static recognitionInstance: any = null;
  private static isSpeakingNow = false;

  /**
   * Check if Speech Recognition is supported in the current browser
   */
  public static isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as unknown as IWindow;
    return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  /**
   * Check if Speech Synthesis is supported
   */
  public static isSpeechSynthesisSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  /**
   * Request microphone permission explicitly
   */
  public static async requestMicrophonePermission(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return true; // Fallback to browser recognition prompt
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the tracks immediately after permission check
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (err) {
      console.warn('Microphone permission not granted or dismissed:', err);
      return false;
    }
  }

  /**
   * Start speech recognition with callbacks
   */
  public static startListening(options: {
    onInterim: (text: string) => void;
    onFinal: (text: string) => void;
    onError: (error: string) => void;
    onEnd: () => void;
  }): boolean {
    if (!this.isSpeechRecognitionSupported()) {
      options.onError('El reconocimiento de voz no está soportado en este navegador.');
      return false;
    }

    try {
      // Abort previous recognition if running
      this.abortListening();
      // Cancel any ongoing speech synthesis so the mic doesn't hear the bot
      this.cancelSpeech();

      const win = window as unknown as IWindow;
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();

      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let finalTranscript = '';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        if (interimTranscript) {
          options.onInterim(interimTranscript);
        }

        if (finalTranscript) {
          options.onFinal(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'no-speech') {
          options.onError('No detecté sonido. Puedes intentar hablar de nuevo o escribir tu mensaje.');
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          options.onError('El acceso al micrófono fue bloqueado. Revisa los permisos de tu navegador.');
        } else if (event.error !== 'aborted') {
          options.onError(`Aviso de voz: ${event.error || 'intenta de nuevo'}`);
        }
      };

      recognition.onend = () => {
        this.recognitionInstance = null;
        options.onEnd();
      };

      this.recognitionInstance = recognition;
      recognition.start();
      return true;
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      options.onError('No se pudo inicializar el micrófono.');
      return false;
    }
  }

  /**
   * Stop active listening
   */
  public static stopListening() {
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.stop();
      } catch (e) {
        // ignore
      }
      this.recognitionInstance = null;
    }
  }

  /**
   * Abort listening immediately
   */
  public static abortListening() {
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.abort();
      } catch (e) {
        // ignore
      }
      this.recognitionInstance = null;
    }
  }

  /**
   * Speak text in Spanish using SpeechSynthesis with lip-sync and interruption support
   */
  public static speak(
    text: string,
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
      onBoundary?: (charIndex: number) => void;
    }
  ): void {
    if (!this.isSpeechSynthesisSupported()) {
      callbacks?.onStart?.();
      setTimeout(() => callbacks?.onEnd?.(), 1800);
      return;
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Clean markdown tags or emojis for cleaner speech
      const cleanSpeech = text
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/[*_#`~]/g, '')
        .trim();

      if (!cleanSpeech) {
        callbacks?.onEnd?.();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanSpeech);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0; // natural conversational cadence
      utterance.pitch = 1.15; // slightly warm and friendly

      // Select best Spanish voice
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(
        (v) =>
          (v.lang.startsWith('es') || v.lang.includes('es_')) &&
          (v.name.includes('Natural') ||
            v.name.includes('Online') ||
            v.name.includes('Google') ||
            v.name.includes('Mónica') ||
            v.name.includes('Paulina') ||
            v.name.includes('Jorge') ||
            v.name.includes('Helena'))
      ) || voices.find((v) => v.lang.startsWith('es'));

      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      utterance.onstart = () => {
        this.isSpeakingNow = true;
        callbacks?.onStart?.();
      };

      utterance.onboundary = (event) => {
        callbacks?.onBoundary?.(event.charIndex);
      };

      utterance.onend = () => {
        this.isSpeakingNow = false;
        callbacks?.onEnd?.();
      };

      utterance.onerror = (err) => {
        this.isSpeakingNow = false;
        console.warn('Speech synthesis utterance error:', err);
        callbacks?.onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Error invoking speechSynthesis:', err);
      this.isSpeakingNow = false;
      callbacks?.onEnd?.();
    }
  }

  /**
   * Immediately cancel any speech (for interrupting the AI)
   */
  public static cancelSpeech(): void {
    if (this.isSpeechSynthesisSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
    this.isSpeakingNow = false;
  }

  public static isSpeaking(): boolean {
    return this.isSpeakingNow;
  }

  /**
   * Send user's message to backend Gemini conversational proxy
   */
  public static async queryGeminiCompanion(params: {
    message: string;
    history?: VoiceChatMessage[];
    currentEmotion?: EmotionType;
    botName?: string;
    userName?: string;
  }): Promise<VoiceApiResponse> {
    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: params.message,
        history: params.history || [],
        currentEmotion: params.currentEmotion || 'tranquilo',
        botName: params.botName || 'Milo',
        userName: params.userName || 'amigo',
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      if (errJson && errJson.fallback) {
        return errJson.fallback;
      }
      throw new Error(errJson?.error || 'No se pudo comunicar con el servidor de inteligencia EMOTI.');
    }

    const data = await response.json();
    return {
      reply: data.reply || 'Estoy aquí contigo para escucharte y apoyarte.',
      expression: (data.expression as BotExpression) || 'SUPPORTIVE',
      detectedEmotion: (data.detectedEmotion as EmotionType) || params.currentEmotion || 'tranquilo',
      wellnessTip: data.wellnessTip,
    };
  }
}
