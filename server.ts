import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK securely on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Emoti-Bot Conversational Companion Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { 
      message, 
      history = [], 
      currentEmotion = 'tranquilo', 
      botName = 'Milo', 
      userName = 'amigo' 
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'El mensaje es requerido.' });
    }

    const systemInstruction = `Eres ${botName}, el compañero de bienestar emocional inteligente de EMOTI, un ecosistema de bienestar empático para adolescentes y jóvenes.
Tu usuario se llama "${userName}". Es FUNDAMENTAL que en tu respuesta te dirijas a él/ella por su nombre "${userName}" de forma natural, afectuosa y cercana.
Su estado emocional actual reportado es "${currentEmotion}".
Hablas siempre en español con profunda calidez, paciencia, cercanía y ternura, como un amigo comprensivo y leal que nunca juzga.
Tu tono es suave, protector y reconfortante.
REGLAS OBLIGATORIAS:
- NUNCA uses frases predeterminadas, genéricas o repetitivas.
- Responde DIRECTAMENTE y con precisión a lo que ${userName} te acaba de decir en su mensaje (si habla de sus notas, amigos, tareas, familia, o cómo se siente, habla exactamente de eso).
- Incluye el nombre "${userName}" en tu respuesta hablada para que sepa que estás hablando directamente con él/ella.
- Tus respuestas habladas deben ser naturales, fluidas y concisas: EXACTAMENTE de 1 a 3 oraciones cortas (fáciles de escuchar y comprender por voz).
- Valida siempre los sentimientos del usuario antes de ofrecer reflexiones o pequeños consejos.
- Nunca actúes como un terapeuta clínico formal ni intentes diagnosticar trastornos médicos o psicológicos.
- Si el usuario comparte tristeza, agotamiento o ansiedad, ofrécele consuelo genuino sobre su situación.
- Si celebra un logro o está feliz, comparte su alegría con entusiasmo contagioso llamándolo por su nombre.
- Si detectas angustia severa o crisis extrema, aconséjale con enorme afecto comunicarse con un adulto de confianza, un amigo cercano o una línea de apoyo.

Debes responder SIEMPRE en formato JSON estricto con los siguientes campos:
{
  "reply": "Tu respuesta hablada en español (1 a 3 oraciones cortas mencionando a ${userName} y respondiendo a lo que te dijo)",
  "expression": "HAPPY" | "CALM" | "EXCITED" | "SAD" | "STRESSED" | "SUPPORTIVE" | "THINKING",
  "detectedEmotion": "feliz" | "tranquilo" | "emocionado" | "cansado" | "estresado" | "triste",
  "wellnessTip": "Breve sugerencia práctica opcional de 3 a 7 palabras (ej: 'Respira hondo conmigo', 'Toma un sorbo de agua fresca', '¡Celebremos tu esfuerzo!')"
}`;

    // Format chat history for Gemini SDK
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item.sender === 'user' && item.text) {
          contents.push({
            role: 'user',
            parts: [{ text: item.text }],
          });
        } else if (item.sender === 'bot' && item.text) {
          contents.push({
            role: 'model',
            parts: [{ text: item.text }],
          });
        }
      }
    }

    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: `Te escucho con todo el corazón, ${userName}. Aunque estoy en modo local sin conexión, quiero que sepas que tus sentimientos siempre son válidos e importantes para mí.`,
        expression: 'SUPPORTIVE',
        detectedEmotion: currentEmotion || 'tranquilo',
        wellnessTip: 'Respira hondo y exhala con calma.',
      });
    }

    let response: any = null;
    const modelsToTry = [
      'gemini-3-flash-preview',
      'gemini-3.5-flash',
      'gemini-3.8-flash',
      'gemini-flash-latest',
      'gemini-3.1-flash-lite',
    ];

    for (const modelCandidate of modelsToTry) {
      try {
        const candidatePromise = ai.models.generateContent({
          model: modelCandidate,
          contents,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout ${modelCandidate}`)), 9000)
        );

        response = await Promise.race([candidatePromise, timeoutPromise]);
        if (response && response.text) {
          break; // Successfully got response
        }
      } catch (candidateErr: any) {
        console.warn(`Model ${modelCandidate} failed or timed out:`, candidateErr.message || candidateErr);
      }
    }

    function getDynamicFallback(userMsg: string, name: string, currentEmo: string) {
      const lower = userMsg.toLowerCase();
      const trimmedSnippet = userMsg.length > 50 ? userMsg.slice(0, 48) + '...' : userMsg;

      if (lower.includes('examen') || lower.includes('aprob') || lower.includes('nota') || lower.includes('feliz') || lower.includes('gan') || lower.includes('genial') || lower.includes('content') || lower.includes('fútbol') || lower.includes('amigo')) {
        return {
          reply: `¡Qué gran noticia me cuentas, ${name}! Me llena de orgullo y emoción saber lo que lograste. ¡Disfruta muchísimo este momento tan lindo!`,
          expression: 'EXCITED',
          detectedEmotion: 'feliz',
          wellnessTip: 'Saborea este logro con una sonrisa.',
        };
      }
      if (lower.includes('tarea') || lower.includes('escuela') || lower.includes('colegio') || lower.includes('clase') || lower.includes('profesor') || lower.includes('estudio')) {
        return {
          reply: `Te comprendo totalmente, ${name}. A veces los deberes de la escuela se sienten muy pesados y cuesta entenderlos a la primera. Tómate una pausa y lo retomamos con calma.`,
          expression: 'SUPPORTIVE',
          detectedEmotion: 'cansado',
          wellnessTip: 'Toma un vaso de agua fresca y estira los brazos.',
        };
      }
      if (lower.includes('pelea') || lower.includes('peleé') || lower.includes('enojo') || lower.includes('rabia') || lower.includes('molest') || lower.includes('discut')) {
        return {
          reply: `Siento mucho que hayas tenido ese conflicto, ${name}. Es natural sentirse dolido o enojado cuando las cosas no salen bien con los demás, pero aquí estoy para escucharte y apoyarte.`,
          expression: 'SUPPORTIVE',
          detectedEmotion: 'estresado',
          wellnessTip: 'Inhala profundamente en 4 segundos y suelta el aire.',
        };
      }
      if (lower.includes('triste') || lower.includes('llor') || lower.includes('mal') || lower.includes('solo') || lower.includes('pena') || lower.includes('duele')) {
        return {
          reply: `Te abrazo a la distancia, ${name}. Está bien no estar bien a veces; no tienes que cargar con todo tú solo ni fingir nada conmigo, aquí me quedo contigo.`,
          expression: 'SAD',
          detectedEmotion: 'triste',
          wellnessTip: 'Ponte la mano en el pecho y siente tu calma.',
        };
      }
      if (lower.includes('cansad') || lower.includes('agotad') || lower.includes('sueño') || lower.includes('dormir') || lower.includes('pesad')) {
        return {
          reply: `Tu cuerpo y tu mente te están pidiendo una pausa merecida, ${name}. Has hecho un gran esfuerzo hoy, permítete descansar sin culpas.`,
          expression: 'CALM',
          detectedEmotion: 'cansado',
          wellnessTip: 'Cierra los ojos un momento y regálate silencio.',
        };
      }
      return {
        reply: `Te escucho con muchísima atención, ${name}. Todo lo que me cuentas sobre "${trimmedSnippet}" es importante para mí. Cuéntame un poquito más para acompañarte mejor.`,
        expression: 'SUPPORTIVE',
        detectedEmotion: currentEmo || 'tranquilo',
        wellnessTip: 'Respira hondo y exhala con tranquilidad.',
      };
    }

    if (!response || !response.text) {
      return res.json(getDynamicFallback(message, userName, currentEmotion));
    }

    const rawText = response.text || '';
    let parsedData: {
      reply: string;
      expression: string;
      detectedEmotion: string;
      wellnessTip?: string;
    };

    try {
      const cleanJson = rawText.replace(/```json\n?|\n?```/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    } catch {
      parsedData = {
        reply: rawText || `Estoy aquí contigo, ${userName}. Cuéntame más si lo necesitas.`,
        expression: 'SUPPORTIVE',
        detectedEmotion: currentEmotion || 'tranquilo',
        wellnessTip: 'Tómate una pausa suave.',
      };
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error in /api/gemini/chat:', error);
    return res.json({
      reply: 'Parece que hubo una breve interferencia en mi señal, pero sigo aquí a tu lado. ¿Puedes repetírmelo?',
      expression: 'SUPPORTIVE',
      detectedEmotion: 'tranquilo',
      wellnessTip: 'Intentemos de nuevo en un instante.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`EMOTI Server running on port ${port} (mode: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
