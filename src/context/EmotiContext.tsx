import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  EmotionType,
  BotExpression,
  DeviceInfo,
  BandBiometrics,
  Friend,
  EnergySparkEvent,
  MoodLogEntry,
  ReflectionEntry,
  StressLevel,
} from '../types';
import { EMOTIONS_CONFIG, BOT_MESSAGES } from '../data/emotionsData';
import {
  INITIAL_FRIENDS,
  INITIAL_MOOD_HISTORY,
  INITIAL_REFLECTIONS,
} from '../data/mockData';
import { useAuth } from './AuthContext';
import { sendSocialEnergySpark, sendSocialSupportPulse } from '../services/firebaseService';

interface ToastData {
  id: number;
  message: string;
  type: 'info' | 'success' | 'spark' | 'pulse';
}

export type MainNavTab = 'home' | 'devices' | 'circle' | 'emotiapp' | 'profile';

interface EmotiContextType {
  // Navigation & Fullscreen
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  emotiAppSubTab: 'home' | 'mood' | 'friends' | 'guide' | 'progress';
  setEmotiAppSubTab: (subTab: 'home' | 'mood' | 'friends' | 'guide' | 'progress') => void;
  viewMode: 'mobile' | 'split';
  setViewMode: (mode: 'mobile' | 'split') => void;

  // Immersive Fullscreen Device Mode
  activeFullscreenDevice: 'bot' | 'band' | null;
  enterFullscreenDevice: (device: 'bot' | 'band') => void;
  exitFullscreenDevice: () => void;

  // Emotional State
  currentEmotion: EmotionType;
  setEmotion: (emotion: EmotionType, note?: string) => void;
  todayNote: string;
  setTodayNote: (note: string) => void;
  moodHistory: MoodLogEntry[];

  // Devices & Bluetooth
  devices: {
    bot: DeviceInfo;
    band: DeviceInfo;
  };
  isBluetoothScanning: boolean;
  discoveredDevices: ('emoti-bot' | 'emoti-band')[];
  startBluetoothScan: () => void;
  connectDevice: (deviceId: 'emoti-bot' | 'emoti-band') => void;
  disconnectDevice: (deviceId: 'emoti-bot' | 'emoti-band') => void;
  areAllDevicesConnected: boolean;

  // Emoti-Bot State & Personalization
  botName: string;
  setBotName: (name: string) => void;
  botExpression: BotExpression;
  setBotExpression: (face: BotExpression) => void;
  cycleBotExpression: () => void;
  botMessage: string;
  setBotMessage: (msg: string) => void;
  touchBot: () => void;
  isBotPetted: boolean;
  syncBotWithEmotion: () => void;
  triggerBotVoiceQuote: () => void;

  // Emoti-Band State
  bandBiometrics: BandBiometrics;
  isPulseVibrating: boolean;
  isMeasuringBiometrics: boolean;
  measureBiometrics: () => void;
  sendSupportPulse: (friendName?: string, friendId?: string) => void;
  simulateBiometricChange: () => void;

  // Friends & Social Sparks
  friends: Friend[];
  totalSparksSent: number;
  totalPulsesSent: number;
  sparksHistory: EnergySparkEvent[];
  sendEnergySpark: (friendId: string, message: string, friendName?: string) => void;
  sparkBurstActive: boolean;
  triggerSparkBurst: () => void;

  // Reflections / Progress
  reflections: ReflectionEntry[];
  addReflection: (text: string) => void;

  // Notifications & Toast
  toast: ToastData | null;
  showToast: (message: string, type?: 'info' | 'success' | 'spark' | 'pulse') => void;
}

const STORAGE_KEY = 'emoti_ecosystem_state_v3';

const EmotiContext = createContext<EmotiContextType | undefined>(undefined);

export const EmotiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userProfile, updateUserProfile, acceptedFriends } = useAuth();

  // Navigation states
  const [activeTab, setActiveTab] = useState<MainNavTab>('home');
  const [emotiAppSubTab, setEmotiAppSubTab] = useState<'home' | 'mood' | 'friends' | 'guide' | 'progress'>('home');
  const [viewMode, setViewMode] = useState<'mobile' | 'split'>('mobile');

  // Fullscreen Device Mode
  const [activeFullscreenDevice, setActiveFullscreenDevice] = useState<'bot' | 'band' | null>(null);

  // Emotional states
  const [currentEmotion, setCurrentEmotionState] = useState<EmotionType>('tranquilo');
  const [todayNote, setTodayNote] = useState<string>('Sintonizando con mi bienestar.');
  const [moodHistory, setMoodHistory] = useState<MoodLogEntry[]>(INITIAL_MOOD_HISTORY);

  // Bot Custom Name
  const [botName, setBotNameState] = useState<string>('Milo');

  // Device states
  const [devices, setDevices] = useState<{ bot: DeviceInfo; band: DeviceInfo }>({
    bot: {
      id: 'emoti-bot',
      name: 'Emoti-Bot (Milo)',
      type: 'bot',
      connected: true,
      battery: 92,
      lastSync: 'Ahora mismo',
      firmware: 'v2.4.1',
      signalStrength: 4,
    },
    band: {
      id: 'emoti-band',
      name: 'Emoti-Band Smart Wristband',
      type: 'band',
      connected: true,
      battery: 86,
      lastSync: 'Hace 1 min',
      firmware: 'v1.9.0',
      signalStrength: 4,
    },
  });

  const [isBluetoothScanning, setIsBluetoothScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<('emoti-bot' | 'emoti-band')[]>([
    'emoti-bot',
    'emoti-band',
  ]);

  // Bot states
  const [botExpression, setBotExpression] = useState<BotExpression>('CALM');
  const [botMessage, setBotMessage] = useState<string>('Disfruta este momento.');
  const [isBotPetted, setIsBotPetted] = useState(false);

  // Band biometrics
  const [bandBiometrics, setBandBiometrics] = useState<BandBiometrics>({
    bpm: 70,
    stressLevel: 'Bajo',
    emotionalStateText: 'Sincronizado con EmotiApp: Tranquilo',
    isSimulating: true,
    lastPulseSent: 'Nunca',
    dailySteps: 4320,
  });
  const [isPulseVibrating, setIsPulseVibrating] = useState(false);
  const [isMeasuringBiometrics, setIsMeasuringBiometrics] = useState(false);

  // Friends & Sparks
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [totalSparksSent, setTotalSparksSent] = useState<number>(3);
  const [totalPulsesSent, setTotalPulsesSent] = useState<number>(2);
  const [sparksHistory, setSparksHistory] = useState<EnergySparkEvent[]>([
    {
      id: 'spk-init-1',
      friendId: 'f-1',
      friendName: 'Sofía',
      message: 'Te mando buena energía para tu día ✨',
      timestamp: 'Hoy, 09:40',
      isIncoming: false,
    },
    {
      id: 'spk-init-2',
      friendId: 'f-2',
      friendName: 'Mateo',
      message: '¡Tú puedes con el estudio!',
      timestamp: 'Ayer, 16:15',
      isIncoming: false,
    },
  ]);
  const [sparkBurstActive, setSparkBurstActive] = useState(false);

  // Progress & reflections
  const [reflections, setReflections] = useState<ReflectionEntry[]>(INITIAL_REFLECTIONS);

  // Toast notifications
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (message: string, type: 'info' | 'success' | 'spark' | 'pulse' = 'info') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3800);
  };

  // MULTI-DEVICE REAL-TIME LISTENER:
  // When userProfile changes in Firestore from Device B, Device A immediately receives it and syncs!
  useEffect(() => {
    if (userProfile) {
      if (userProfile.currentEmotion && userProfile.currentEmotion !== currentEmotion) {
        setCurrentEmotionState(userProfile.currentEmotion);
        const config = EMOTIONS_CONFIG[userProfile.currentEmotion];
        if (config) {
          setBotMessage(config.botVoiceQuote || config.supportMessage);
          setBandBiometrics((prev) => ({
            ...prev,
            bpm: config.suggestedBpmRange[0] + 2,
            stressLevel: config.suggestedStress,
            emotionalStateText: `Sincronizado con EmotiApp: ${config.label}`,
          }));
        }
      }

      if (userProfile.botExpression && userProfile.botExpression !== botExpression) {
        setBotExpression(userProfile.botExpression);
      }

      if (userProfile.botName && userProfile.botName !== botName) {
        setBotNameState(userProfile.botName);
        setDevices((prev) => ({
          ...prev,
          bot: {
            ...prev.bot,
            name: `Emoti-Bot (${userProfile.botName})`,
          },
        }));
      }

      if (userProfile.todayNote !== undefined && userProfile.todayNote !== todayNote) {
        setTodayNote(userProfile.todayNote);
      }
    }
  }, [userProfile]);

  // Sync accepted friends list from Firestore into the UI friends list
  useEffect(() => {
    if (acceptedFriends && acceptedFriends.length > 0) {
      const mappedFriends: Friend[] = acceptedFriends.map((af) => ({
        id: af.id,
        name: af.displayName,
        username: af.username,
        avatarBg: af.avatarBg || '#DCD5F5',
        avatarColor: '#292A30',
        avatarInitials: af.avatarInitials || af.displayName.slice(0, 2).toUpperCase(),
        sharedMood: af.moodVisibility === 'friends' ? af.currentEmotion : undefined,
        isOnline: true,
        statusQuote: af.todayNote || 'Conectado a EMOTI',
        sparksReceivedCount: 5,
        moodVisibility: af.moodVisibility,
      }));

      // Combine with mock initial friends if not duplicate
      const combined = [...mappedFriends];
      INITIAL_FRIENDS.forEach((initF) => {
        if (!combined.some((c) => c.name.toLowerCase() === initF.name.toLowerCase())) {
          combined.push(initF);
        }
      });
      setFriends(combined);
    }
  }, [acceptedFriends]);

  // Fullscreen Device Controls
  const enterFullscreenDevice = (device: 'bot' | 'band') => {
    setActiveFullscreenDevice(device);
    try {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {
      // Ignore if browser restricts requestFullscreen without gesture
    }
    showToast(
      device === 'bot'
        ? `Pantalla convertida en ${botName} 🤖`
        : 'Pantalla convertida en Emoti-Band ⌚',
      'spark'
    );
  };

  const exitFullscreenDevice = () => {
    setActiveFullscreenDevice(null);
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch {
      // Fallback
    }
  };

  // Set Bot Name with multi-device cloud broadcast
  const setBotName = (name: string) => {
    const trimmed = name.trim() || 'Milo';
    setBotNameState(trimmed);
    setDevices((prev) => ({
      ...prev,
      bot: {
        ...prev.bot,
        name: `Emoti-Bot (${trimmed})`,
      },
    }));

    if (userProfile && updateUserProfile) {
      updateUserProfile({ botName: trimmed }).catch((err) =>
        console.warn('Could not sync botName to cloud:', err)
      );
    }
    showToast(`Nombre guardado: "${trimmed}"`, 'success');
  };

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.botName) setBotNameState(parsed.botName);
        if (parsed.currentEmotion) setCurrentEmotionState(parsed.currentEmotion);
        if (parsed.devices) setDevices(parsed.devices);
        if (parsed.botExpression) setBotExpression(parsed.botExpression);
        if (parsed.totalSparksSent !== undefined) setTotalSparksSent(parsed.totalSparksSent);
        if (parsed.totalPulsesSent !== undefined) setTotalPulsesSent(parsed.totalPulsesSent);
        if (parsed.moodHistory) setMoodHistory(parsed.moodHistory);
        if (parsed.reflections) setReflections(parsed.reflections);
      }
    } catch {
      // Local storage fallback
    }
  }, []);

  // Save to localStorage as local cache
  useEffect(() => {
    try {
      const payload = {
        botName,
        currentEmotion,
        devices,
        botExpression,
        totalSparksSent,
        totalPulsesSent,
        moodHistory,
        reflections,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Storage save fallback
    }
  }, [botName, currentEmotion, devices, botExpression, totalSparksSent, totalPulsesSent, moodHistory, reflections]);

  // Set Emotion with full multi-device cross-synchronization
  const setEmotion = (emotion: EmotionType, note?: string) => {
    setCurrentEmotionState(emotion);
    if (note !== undefined) setTodayNote(note);

    const config = EMOTIONS_CONFIG[emotion];
    
    // 1. Synchronize Bot Expression & Voice Quote
    const targetFace = config.correspondingBotFace;
    setBotExpression(targetFace);
    setBotMessage(config.botVoiceQuote || config.supportMessage);

    // 2. Synchronize Band Biometrics
    const randomBpm = Math.floor(
      Math.random() * (config.suggestedBpmRange[1] - config.suggestedBpmRange[0] + 1) +
        config.suggestedBpmRange[0]
    );

    setBandBiometrics((prev) => ({
      ...prev,
      bpm: randomBpm,
      stressLevel: config.suggestedStress,
      emotionalStateText: `Sincronizado con EmotiApp: ${config.label}`,
    }));

    // 3. Update Mood History for Today
    const today = new Date();
    const timeStr = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateKey = today.toISOString().split('T')[0];

    setMoodHistory((prev) => {
      const filtered = prev.filter((entry) => entry.dayLabel !== 'Hoy');
      const newEntry: MoodLogEntry = {
        id: `mood-${Date.now()}`,
        dateKey,
        dayLabel: 'Hoy',
        timestamp: timeStr,
        emotion,
        note: note || config.description,
      };
      return [...filtered, newEntry];
    });

    // 4. CRITICAL MULTI-DEVICE SYNC: Broadcast to Cloud Firestore!
    if (userProfile && updateUserProfile) {
      updateUserProfile({
        currentEmotion: emotion,
        botExpression: targetFace,
        todayNote: note !== undefined ? note : todayNote,
      }).catch((err) => console.warn('Could not sync emotion to cloud:', err));
    }

    showToast(`Estado emocional: ${config.label} ${config.emoji}`, 'success');
  };

  // Bot Interactions
  const touchBot = () => {
    setIsBotPetted(true);
    const currentUserName = userProfile?.displayName?.trim() || userProfile?.username?.trim() || 'amigo';
    const friendlyQuotes = [
      `¡Hola, ${currentUserName}! Soy ${botName}, qué lindo sentir tu cariño 💖`,
      `¡Me alegra tanto acompañarte hoy, ${currentUserName}! Respira conmigo.`,
      `Siento tu presencia, ${currentUserName}. Juntos cuidamos tu bienestar ✨`,
      `¡Gracias por estar aquí, ${currentUserName}! Eres una persona muy valiosa y capaz.`,
      `Estoy aquí escuchándote con todo mi corazón, ${currentUserName}.`,
    ];
    const pickedQuote = friendlyQuotes[Math.floor(Math.random() * friendlyQuotes.length)];
    setBotMessage(pickedQuote);
    showToast(`${botName} sintió tu caricia · Respuesta afectiva`, 'spark');

    setTimeout(() => {
      setIsBotPetted(false);
    }, 1800);
  };

  // Cycle through all 7 distinct facial expressions
  const cycleBotExpression = () => {
    const expressions: BotExpression[] = [
      'HAPPY',
      'CALM',
      'EXCITED',
      'SAD',
      'STRESSED',
      'SUPPORTIVE',
      'THINKING',
    ];
    const currentIndex = expressions.indexOf(botExpression);
    const nextFace = expressions[(currentIndex + 1) % expressions.length];
    setBotExpression(nextFace);

    const faceMessages: Record<BotExpression, string> = {
      HAPPY: '¡Qué hermosa sonrisa! Me encanta verte así.',
      CALM: 'Siente la calma interior. Todo fluye a su tiempo.',
      EXCITED: '¡Esa energía es maravillosa! ¡A darlo todo!',
      SAD: 'No estás solo en esto. Estoy aquí contigo.',
      STRESSED: 'Pausa. Respira profundo conmigo. Un paso a la vez.',
      SUPPORTIVE: 'Cuentas conmigo siempre. Juntos podemos.',
      THINKING: 'Mmm... reflexionando en cómo ayudarte a sentirte mejor.',
    };
    setBotMessage(faceMessages[nextFace]);

    // Broadcast expression update to cloud
    if (userProfile && updateUserProfile) {
      updateUserProfile({ botExpression: nextFace }).catch(() => {});
    }

    showToast(`Carita de ${botName}: ${nextFace}`, 'info');
  };

  const syncBotWithEmotion = () => {
    const targetFace = EMOTIONS_CONFIG[currentEmotion].correspondingBotFace;
    setBotExpression(targetFace);
    setBotMessage(EMOTIONS_CONFIG[currentEmotion].botVoiceQuote);
    if (userProfile && updateUserProfile) {
      updateUserProfile({ botExpression: targetFace }).catch(() => {});
    }
    showToast(`${botName} sincronizado con tu emoción actual`, 'success');
  };

  const triggerBotVoiceQuote = () => {
    const currentVoice = EMOTIONS_CONFIG[currentEmotion]?.botVoiceQuote || 'Estoy aquí contigo.';
    setBotMessage(currentVoice);
    showToast(`"${currentVoice}"`, 'spark');
  };

  // Band Biometric Measurement Simulation
  const measureBiometrics = () => {
    setIsMeasuringBiometrics(true);
    showToast('Midiendo biomarcadores con sensor óptico PPG...', 'info');

    setTimeout(() => {
      const config = EMOTIONS_CONFIG[currentEmotion];
      const newBpm = Math.floor(
        Math.random() * (config.suggestedBpmRange[1] - config.suggestedBpmRange[0] + 1) +
          config.suggestedBpmRange[0]
      );

      setBandBiometrics((prev) => ({
        ...prev,
        bpm: newBpm,
        stressLevel: config.suggestedStress,
        emotionalStateText: `Sincronizado con EmotiApp: ${config.label}`,
      }));
      setIsMeasuringBiometrics(false);
      showToast(`Medición completada: ${newBpm} BPM · Estrés ${config.suggestedStress}`, 'success');
    }, 2200);
  };

  // Band Support Pulse
  const sendSupportPulse = (friendName: string = 'Sofía', friendId?: string) => {
    setIsPulseVibrating(true);
    setTotalPulsesSent((prev) => prev + 1);

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setBandBiometrics((prev) => ({
      ...prev,
      lastPulseSent: `Hoy a las ${nowTime}`,
    }));

    // If friendId provided and user logged in, send real cloud notification
    if (userProfile && friendId) {
      sendSocialSupportPulse(userProfile, friendId, friendName).catch(() => {});
    }

    showToast(`Pulso de apoyo enviado · ${friendName} ha recibido tu señal háptica 💓`, 'pulse');

    setTimeout(() => {
      setIsPulseVibrating(false);
    }, 2400);
  };

  const simulateBiometricChange = () => {
    const stressOptions: StressLevel[] = ['Bajo', 'Medio', 'Alto'];
    const randomStress = stressOptions[Math.floor(Math.random() * stressOptions.length)];
    const randomBpm = 64 + Math.floor(Math.random() * 34);

    setBandBiometrics((prev) => ({
      ...prev,
      bpm: randomBpm,
      stressLevel: randomStress,
    }));

    showToast(`Indicadores de Emoti-Band actualizados: ${randomBpm} BPM · Estrés: ${randomStress}`, 'info');
  };

  // Bluetooth Simulation
  const startBluetoothScan = () => {
    setIsBluetoothScanning(true);
    setDiscoveredDevices([]);
    showToast('Buscando dispositivos cercanos...', 'info');

    setTimeout(() => {
      setIsBluetoothScanning(false);
      setDiscoveredDevices(['emoti-bot', 'emoti-band']);
      showToast('Dispositivos Emoti encontrados listos para vincular', 'success');
    }, 1800);
  };

  const connectDevice = (deviceId: 'emoti-bot' | 'emoti-band') => {
    setDevices((prev) => ({
      ...prev,
      [deviceId === 'emoti-bot' ? 'bot' : 'band']: {
        ...prev[deviceId === 'emoti-bot' ? 'bot' : 'band'],
        connected: true,
        lastSync: 'Ahora mismo',
      },
    }));

    const deviceName = deviceId === 'emoti-bot' ? botName : 'Emoti-Band';
    showToast(`${deviceName} conectado exitosamente vía Bluetooth simulado`, 'success');
  };

  const disconnectDevice = (deviceId: 'emoti-bot' | 'emoti-band') => {
    setDevices((prev) => ({
      ...prev,
      [deviceId === 'emoti-bot' ? 'bot' : 'band']: {
        ...prev[deviceId === 'emoti-bot' ? 'bot' : 'band'],
        connected: false,
      },
    }));

    const deviceName = deviceId === 'emoti-bot' ? botName : 'Emoti-Band';
    showToast(`${deviceName} desconectado`, 'info');
  };

  const areAllDevicesConnected = devices.bot.connected && devices.band.connected;

  const triggerSparkBurst = () => {
    setSparkBurstActive(true);
    setTimeout(() => setSparkBurstActive(false), 2200);
  };

  // Social Energy Sparks (Local + Real-time Cloud Push)
  const sendEnergySpark = (friendId: string, message: string, friendName?: string) => {
    const friend = friends.find((f) => f.id === friendId);
    const targetName = friendName || friend?.name || 'Amigo';

    triggerSparkBurst();

    setFriends((prev) =>
      prev.map((f) =>
        f.id === friendId
          ? {
              ...f,
              sparksReceivedCount: f.sparksReceivedCount + 1,
              lastSparkTimestamp: 'Hace un instante',
            }
          : f
      )
    );

    setTotalSparksSent((prev) => prev + 1);

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newSparkEvent: EnergySparkEvent = {
      id: `spk-${Date.now()}`,
      friendId,
      friendName: targetName,
      message,
      timestamp: `Hoy, ${nowTime}`,
      isIncoming: false,
    };
    setSparksHistory((prev) => [newSparkEvent, ...prev]);

    // Push to Firestore if logged in
    if (userProfile && friendId) {
      sendSocialEnergySpark(userProfile, friendId, targetName, message).catch((err) =>
        console.warn('Could not push social spark to Firestore:', err)
      );
    }

    showToast(`¡Tu chispa de energía fue enviada a ${targetName}! ✨`, 'spark');
  };

  // Add reflection
  const addReflection = (text: string) => {
    if (!text.trim()) return;
    const today = new Date();
    const dateFormatted = `Hoy, ${today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newReflection: ReflectionEntry = {
      id: `ref-${Date.now()}`,
      timestamp: today.toISOString(),
      dateFormatted,
      text: text.trim(),
      emotion: currentEmotion,
    };

    setReflections((prev) => [newReflection, ...prev]);
    showToast('Reflexión guardada en Mi Progreso', 'success');
  };

  return (
    <EmotiContext.Provider
      value={{
        activeTab,
        setActiveTab,
        emotiAppSubTab,
        setEmotiAppSubTab,
        viewMode,
        setViewMode,
        activeFullscreenDevice,
        enterFullscreenDevice,
        exitFullscreenDevice,
        currentEmotion,
        setEmotion,
        todayNote,
        setTodayNote,
        moodHistory,
        devices,
        isBluetoothScanning,
        discoveredDevices,
        startBluetoothScan,
        connectDevice,
        disconnectDevice,
        areAllDevicesConnected,
        botName,
        setBotName,
        botExpression,
        setBotExpression,
        cycleBotExpression,
        botMessage,
        setBotMessage,
        touchBot,
        isBotPetted,
        syncBotWithEmotion,
        triggerBotVoiceQuote,
        bandBiometrics,
        isPulseVibrating,
        isMeasuringBiometrics,
        measureBiometrics,
        sendSupportPulse,
        simulateBiometricChange,
        friends,
        totalSparksSent,
        totalPulsesSent,
        sparksHistory,
        sendEnergySpark,
        sparkBurstActive,
        triggerSparkBurst,
        reflections,
        addReflection,
        toast,
        showToast,
      }}
    >
      {children}
    </EmotiContext.Provider>
  );
};

export const useEmoti = () => {
  const context = useContext(EmotiContext);
  if (!context) {
    throw new Error('useEmoti must be used within an EmotiProvider');
  }
  return context;
};
