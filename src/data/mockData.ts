import { Friend, DialogGuideCard, ReflectionEntry, MoodLogEntry } from '../types';

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'f-1',
    name: 'Sofía',
    avatarBg: '#DCD5F5',
    avatarColor: '#3C3068',
    avatarInitials: 'SO',
    sharedMood: 'tranquilo',
    isOnline: true,
    statusQuote: 'Leyendo un ratito con infusión de lavanda ☕',
    sparksReceivedCount: 14,
  },
  {
    id: 'f-2',
    name: 'Mateo',
    avatarBg: '#F5DFD3',
    avatarColor: '#6B3C24',
    avatarInitials: 'MA',
    sharedMood: 'estresado',
    isOnline: true,
    statusQuote: 'Semana de entregas finales, ¡pero enfocado! 💪',
    sparksReceivedCount: 9,
  },
  {
    id: 'f-3',
    name: 'Valentina',
    avatarBg: '#D9E8DE',
    avatarColor: '#1F472D',
    avatarInitials: 'VA',
    sharedMood: 'feliz',
    isOnline: false,
    statusQuote: 'Caminata en el parque con mi perro 🌿',
    sparksReceivedCount: 21,
  },
  {
    id: 'f-4',
    name: 'Diego',
    avatarBg: '#DCEAF4',
    avatarColor: '#1F4263',
    avatarInitials: 'DI',
    sharedMood: 'cansado',
    isOnline: true,
    statusQuote: 'Batería social al 20%, escuchando música 🎧',
    sparksReceivedCount: 7,
  },
];

export const QUICK_SPARK_MESSAGES = [
  'Estoy aquí para ti.',
  '¡Tú puedes con todo!',
  '¿Quieres hablar un momento?',
  'Te mando buena energía y un abrazo.',
  'Tómate un respiro, lo estás haciendo genial.',
];

export const DIALOG_GUIDES: DialogGuideCard[] = [
  {
    id: 'guide-1',
    category: 'malentendidos',
    categoryLabel: 'Resolver malentendidos',
    title: 'Pausar y escuchar antes de reaccionar',
    summary: 'Antes de reaccionar, intenta escuchar lo que la otra persona quiere expresar en lugar de asumir su intención.',
    keyPrinciple: 'Separar el hecho real de nuestra interpretación interna.',
    practicalSteps: [
      'Respira dos segundos antes de responder a un mensaje que te haya incomodado.',
      'Pregunta con curiosidad genuina: "¿Querías decir esto o lo entendí de otra forma?".',
      'Valida primero su sentir antes de defender tu propia postura.',
    ],
    samplePhrases: [
      '"Noté cierta distancia entre nosotros y me gustaría entender si pasó algo."',
      '"Quiero escucharte bien. ¿Me explicas qué sentiste cuando dije eso?"',
      '"Prefiero que lo hablemos con calma para no sacar conclusiones apresuradas."',
    ],
    tag: 'Empatía activa',
  },
  {
    id: 'guide-2',
    category: 'asertiva',
    categoryLabel: 'Comunicación asertiva',
    title: 'Hablar desde el "Yo" en lugar de acusar',
    summary: 'Habla desde lo que tú sientes. En lugar de culpar, explica cómo te hizo sentir una situación específica.',
    keyPrinciple: 'La fórmula mágica: "Cuando ocurre [hecho], yo me siento [emoción], y me gustaría [petición]".',
    practicalSteps: [
      'Evita generalizaciones como "tú siempre..." o "nunca te importa...".',
      'Describe el hecho concreto sin adjetivos descalificativos.',
      'Propón una solución concreta orientada al cuidado mutuo.',
    ],
    samplePhrases: [
      '"Cuando cancelas a última hora, me siento poco valorado. ¿Podríamos avisarnos con más anticipación?"',
      '"Aprecio tu consejo, pero en este momento solo necesito desahogarme sin soluciones inmediatas."',
      '"Te quiero mucho, pero hoy necesito un espacio a solas para recargar mi energía."',
    ],
    tag: 'Límites saludables',
  },
  {
    id: 'guide-3',
    category: 'rompehielos',
    categoryLabel: 'Rompehielos para conversar',
    title: 'Preguntas con alma para profundizar',
    summary: 'Conectar no siempre es hablar del clima; pequeños disparadores abren espacios seguros de vulnerabilidad.',
    keyPrinciple: 'La curiosidad afectuosa abre puertas sin invadir la privacidad.',
    practicalSteps: [
      'Elige momentos tranquilos, sin distracciones de pantallas o ruido.',
      'No juzgues la respuesta ni intentes arreglarla de inmediato.',
      'Comparte también algo tuyo para equilibrar la conversación.',
    ],
    samplePhrases: [
      '¿Qué fue lo mejor o más inesperado de tu día?',
      '¿Hay algo que te gustaría que hagamos juntos este fin de semana?',
      '¿Cómo te has sentido últimamente en tu interior, más allá de la rutina?',
    ],
    tag: 'Conexión genuina',
  },
];

export const INITIAL_MOOD_HISTORY: MoodLogEntry[] = [
  { id: 'm-1', dateKey: '2026-10-08', dayLabel: 'Mié', timestamp: '10:15', emotion: 'tranquilo', note: 'Mañana despejada' },
  { id: 'm-2', dateKey: '2026-10-09', dayLabel: 'Jue', timestamp: '14:30', emotion: 'estresado', note: 'Examen sorpresa' },
  { id: 'm-3', dateKey: '2026-10-10', dayLabel: 'Vie', timestamp: '19:00', emotion: 'emocionado', note: 'Salida con amigos' },
  { id: 'm-4', dateKey: '2026-10-11', dayLabel: 'Sáb', timestamp: '11:45', emotion: 'feliz', note: 'Día soleado en el parque' },
  { id: 'm-5', dateKey: '2026-10-12', dayLabel: 'Dom', timestamp: '17:20', emotion: 'tranquilo', note: 'Tarde de descanso' },
  { id: 'm-6', dateKey: '2026-10-13', dayLabel: 'Lun', timestamp: '09:10', emotion: 'cansado', note: 'Comienzo de semana con sueño' },
  { id: 'm-7', dateKey: '2026-10-14', dayLabel: 'Hoy', timestamp: '11:00', emotion: 'tranquilo', note: 'Conectado al ecosistema' },
];

export const INITIAL_REFLECTIONS: ReflectionEntry[] = [
  {
    id: 'ref-1',
    timestamp: '2026-10-13T18:30:00Z',
    dateFormatted: 'Ayer, 18:30',
    text: 'Agradecí a Sofía por escucharme cuando estuve abrumado. Hablarlo a tiempo cambió mi tarde.',
    emotion: 'tranquilo',
  },
  {
    id: 'ref-2',
    timestamp: '2026-10-11T20:10:00Z',
    dateFormatted: '11 Octubre, 20:10',
    text: 'Aprendí a decir "hoy no puedo salir" sin culpa. Necesitaba dormir bien y recargar energías.',
    emotion: 'feliz',
  },
];
