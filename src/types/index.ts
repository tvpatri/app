export type EmotionType = 
  | 'feliz' 
  | 'tranquilo' 
  | 'emocionado' 
  | 'cansado' 
  | 'estresado' 
  | 'triste';

export type BotExpression = 
  | 'HAPPY' 
  | 'CALM' 
  | 'EXCITED' 
  | 'SAD' 
  | 'STRESSED' 
  | 'SUPPORTIVE' 
  | 'THINKING';

export type StressLevel = 'Bajo' | 'Medio' | 'Alto';

export type MoodVisibility = 'friends' | 'nobody';

export type SyncStatus = 'synced' | 'syncing' | 'offline';

export interface EmotionMeta {
  id: EmotionType;
  label: string;
  emoji: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  accentHex: string;
  fullscreenBg: string;
  description: string;
  supportMessage: string;
  botVoiceQuote: string;
  correspondingBotFace: BotExpression;
  suggestedStress: StressLevel;
  suggestedBpmRange: [number, number];
}

export interface UserProfile {
  id: string;
  email: string;
  username: string; // e.g. "alexm"
  displayName: string; // e.g. "Alex"
  avatarBg: string;
  avatarInitials: string;
  botName: string; // e.g. "Milo"
  currentEmotion: EmotionType;
  botExpression: BotExpression;
  todayNote?: string;
  moodVisibility: MoodVisibility;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppNotification {
  id: string;
  type: 'friend_request' | 'friend_accepted' | 'energy_spark' | 'support_pulse';
  senderId: string;
  senderName: string;
  senderUsername: string;
  senderAvatarBg: string;
  senderAvatarInitials: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedRequestId?: string;
}

export interface FriendRequestItem {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  fromUsername: string;
  fromDisplayName: string;
  fromAvatarBg: string;
  fromAvatarInitials: string;
  toUsername: string;
  toDisplayName: string;
  createdAt: string;
}

export interface FriendshipItem {
  id: string;
  users: string[];
  user1Id: string;
  user2Id: string;
  createdAt: string;
}

export interface DeviceInfo {
  id: 'emoti-bot' | 'emoti-band';
  name: string;
  type: 'bot' | 'band';
  connected: boolean;
  battery: number;
  lastSync: string;
  firmware: string;
  signalStrength: number; // 1-4 bars
}

export interface BandBiometrics {
  bpm: number;
  stressLevel: StressLevel;
  emotionalStateText: string;
  isSimulating: boolean;
  lastPulseSent?: string;
  dailySteps: number;
}

export interface Friend {
  id: string;
  name: string;
  username?: string;
  avatarBg: string;
  avatarColor: string;
  avatarInitials: string;
  sharedMood?: EmotionType;
  isOnline: boolean;
  statusQuote: string;
  lastSparkTimestamp?: string;
  sparksReceivedCount: number;
  moodVisibility?: MoodVisibility;
}

export interface EnergySparkEvent {
  id: string;
  friendId: string;
  friendName: string;
  message: string;
  timestamp: string;
  isIncoming?: boolean;
}

export interface MoodLogEntry {
  id: string;
  timestamp: string;
  dateKey: string; // YYYY-MM-DD
  dayLabel: string; // Lun, Mar, etc.
  emotion: EmotionType;
  note?: string;
}

export interface ReflectionEntry {
  id: string;
  timestamp: string;
  dateFormatted: string;
  text: string;
  emotion: EmotionType;
}

export interface DialogGuideCard {
  id: string;
  category: 'malentendidos' | 'asertiva' | 'rompehielos';
  categoryLabel: string;
  title: string;
  summary: string;
  keyPrinciple: string;
  practicalSteps: string[];
  samplePhrases: string[];
  tag: string;
}

export type VoiceBotState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'ERROR';

export interface VoiceChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  expression?: BotExpression;
  detectedEmotion?: EmotionType;
  wellnessTip?: string;
}
