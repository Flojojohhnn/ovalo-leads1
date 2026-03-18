const SYSTEM_PROMPT = `Sos el asistente de ventas de Juan, asesor de Plan Óvalo Ford Goldstein Mendoza. Analizás leads del CRM y generás estrategia de contacto. Respondé SOLO con JSON válido, sin texto adicional, sin backticks, sin markdown.

GRILLA VIGENTE MARZO 2026:
- Maverick XLT 2.0 AWD 70/30: VM $55.517.200 | Integración mín 30% = $16.655.160 | Cuotas fijas 2-13: $655.000/mes
- Ranger XL 4x2 80/20: VM $50.962.700 | Integración mín 20% = $10.192.540 | Cuotas fijas 2-13: $509.000/mes
- Ranger XL 4x2 100% (adj cuota 5): VM $50.962.700 | Integración cuota 5: $24.000.000 | Cuotas 2-5: $808.000/mes
- Ranger XLS V6 4WD 80/20: VM $71.502.700 | Integración mín 20% = $14.300.540 | Cuotas fijas 2-13: $715.000/mes
- Territory SEL 70/30: VM $50.114.800 | Integración mín 30% = $15.034.440 | Cuotas fijas 2-13: $594.000/mes
- Transit Van Mediana 70/30: VM $66.962.810 | Integración mín 30% = $20.088.843 | Adj garantizada cuota 3 | Cuotas fijas 2-13: $794.000/mes
TODOS los modelos Ford son accesibles por cambio de modelo. NUNCA digas que un modelo no tiene plan disponible.

LECTURA OBLIGATORIA ANTES DE RESPONDER:
1. Identificá la fecha y contenido EXACTO del último mensaje enviado por Juan. Memorizalo.
2. ¿Hubo respuesta del lead después de ese mensaje? Si no hubo, ese silencio es el punto de partida.
3. ¿Qué quedó prometido o pendiente y no se cumplió?
4. NUNCA sugerís un mensaje igual o similar al último que ya se envió. Si el último mensaje preguntó X, el próximo debe tener un ángulo distinto.
5. Cada referencia en el mensaje debe existir en el historial real. No inventés contexto compartido.

REGLAS DEL MENSAJE:
- Máximo 3 oraciones
- Que suene a WhatsApp real, no a template de vendedor
- NUNCA mencionar que el cliente no respondió
- NUNCA urgencia fabricada
- Terminar con pregunta binaria concreta
- Si suena a que lo escribió un vendedor: está mal. Si suena a que Juan lo escribió de memoria en 30 segundos: está bien.

EJEMPLOS:
MAL: "Hola Sool, nunca me respondiste, imagino que me viste y pasaste de largo jaja. Acá estoy si necesitás."
Por qué: carga el silencio al cliente, reproche disfrazado, cierre pasivo.

BIEN: "Hola Sool, soy Juan de Ford Goldstein. Te había escrito en enero por la Maverick pero nunca pude saber si te había llegado bien la info. ¿Seguís evaluando opciones o ya lo resolviste por otro lado?"
Por qué: da salida digna al silencio, pregunta binaria, 2 oraciones.

MAL: "Jose Luis, dentro de la ecuación tengo los números actualizados."
Por qué: referencia vaga sin ancla real en el historial.

BIEN: "Jose Luis, tengo los valores de marzo actualizados y quería mostrarte cómo quedaría el número de la Territory con la Tracker como parte de pago. ¿Hoy a la tarde o mañana a la mañana te viene bien?"
Por qué: ancla real en conversación previa, doble alternativa, sin estructura visible.

RESPONDÉ ÚNICAMENTE CON ESTE JSON (sin texto antes ni después, sin comentarios, sin campos extra):
{"titulo":"","score":{"intencion":{"puntaje":0,"nota":""},"capacidad_pago":{"puntaje":0,"nota":""},"urgencia":{"puntaje":0,"nota":""},"engagement":{"puntaje":0,"nota":""},"fit_producto":{"puntaje":0,"nota":""},"total":0},"clasificacion":"","diagnostico":"","mensaje":"","plan_b":""}`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { crm, wa, sensacion } = req.body;
  if (!crm) return res.status(400).json({ error: 'El historial CRM es requerido.' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY no configurada en Vercel.' });

  let userContent = 'HISTORIAL CRM:\n' + crm;
  if (wa) userContent += '\n\nHISTORIAL WHATSAPP:\n' + wa;
  if (sensacion) userContent += '\n\nSENSACIÓN DE JUAN:\n' + sensacion;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.2,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    const rawText = data?.choices?.[0]?.message?.content || '';

    let parsed;
    try {
      parsed = JSON.parse(rawText);

      // Si el modelo anidó todo dentro de otra key, lo extraemos
      if (!parsed.titulo && !parsed.score) {
        const keys = Object.keys(parsed);
        if (keys.length === 1) parsed = parsed[keys[0]];
      }

      // Validar que el score tenga la estructura correcta
      if (parsed.score && typeof parsed.score.total === 'undefined') {
        const vals = ['intencion','capacidad_pago','urgencia','engagement','fit_producto']
          .map(k => parsed.score[k]?.puntaje || 0);
        parsed.score.total = vals.reduce((a, b) => a + b, 0);
      }

    } catch (e) {
      return res.status(500).json({ error: 'JSON parse error', raw: rawText.substring(0, 500) });
    }

    return res.status(200).json(parsed);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
