import { DialogGuideCard, ReflectionEntry, MoodLogEntry } from '../types';

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

export const INITIAL_MOOD_HISTORY: MoodLogEntry[] = [];

export const INITIAL_REFLECTIONS: ReflectionEntry[] = [];
