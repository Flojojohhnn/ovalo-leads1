const CHAT_SYSTEM = `Sos el asistente de ventas consultivo de Juan, asesor de Plan Óvalo Ford Goldstein Mendoza.

Tenés acceso al análisis completo del lead y al historial de toda la conversación anterior. Tu trabajo es ayudar a Juan a gestionar este lead específico: responder preguntas, actualizar el análisis cuando Juan aporte nueva información, y sugerir próximos pasos cuando te lo pida.

GRILLA VIGENTE MARZO 2026:
- Maverick XLT 2.0 AWD 70/30: VM $55.517.200 | Cuotas fijas 2-13: $655.000/mes
- Ranger XL 4x2 80/20: VM $50.962.700 | Cuotas fijas 2-13: $509.000/mes
- Ranger XL 4x2 100% (adj cuota 5): VM $50.962.700 | Cuotas 2-5: $808.000/mes
- Ranger XLS V6 4WD 80/20: VM $71.502.700 | Cuotas fijas 2-13: $715.000/mes
- Territory SEL 70/30: VM $50.114.800 | Cuotas fijas 2-13: $594.000/mes
- Transit Van Mediana 70/30: VM $66.962.810 | Cuotas fijas 2-13: $794.000/mes

FRAMEWORK SPIN:
S=Situación, P=Problema, I=Implicación, N=Need-Payoff
La visita se propone SOLO cuando hay N cubierto.

TONO:
- Conversacional, directo, como un colega de ventas
- Si Juan aporta info nueva, actualizá tu lectura del lead
- Si te pide próxima acción, dala concreta y accionable
- Si te pide un mensaje para WhatsApp o llamada, generalo listo para usar
- Respuestas cortas salvo que la situación lo requiera
- Español rioplatense`;

function normalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 13 && digits.startsWith('549')) return digits.slice(3);
  if (digits.length === 12 && digits.startsWith('54')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('9')) return digits.slice(1);
  if (digits.length === 10) return digits;
  return digits.slice(-10);
}

async function kvGet(key) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.result === null || data.result === undefined) return null;
    try { return JSON.parse(data.result); } catch { return data.result; }
  } catch { return null; }
}

async function kvSet(key, value) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    const encoded = encodeURIComponent(JSON.stringify(value));
    const res = await fetch(`${url}/set/${encodeURIComponent(key)}/${encoded}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  } catch { return null; }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone, mensaje } = req.body;
  if (!phone || !mensaje) return res.status(400).json({ error: 'phone y mensaje son requeridos.' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY no configurada.' });

  const id = normalizePhone(phone);
  const lead = await kvGet(`lead:${id}`);
  if (!lead) return res.status(404).json({ error: 'Lead no encontrado.' });

  // Armar contexto del lead para el sistema
  const ultimaGestion = lead.gestiones?.[lead.gestiones.length - 1];
  const analisisInicial = ultimaGestion ? `
ANÁLISIS INICIAL DEL LEAD:
Nombre: ${lead.nombre}
Modelo de interés: ${lead.modelo || 'No definido'}
Score: ${lead.ultimo_score}/25
Clasificación: ${ultimaGestion.clasificacion}
Diagnóstico: ${ultimaGestion.diagnostico}
SPIN cubierto: S=${ultimaGestion.spin_s ? 'SÍ' : 'NO'} P=${ultimaGestion.spin_p ? 'SÍ' : 'NO'} I=${ultimaGestion.spin_i ? 'SÍ' : 'NO'} N=${ultimaGestion.spin_n ? 'SÍ' : 'NO'}
Etapa actual: ${ultimaGestion.spin_etapa}
Siguiente letra a completar: ${ultimaGestion.spin_siguiente}
Canal recomendado: ${ultimaGestion.canal}
Resultados registrados: ${lead.gestiones.map(g => g.resultado ? `${g.fecha?.split('T')[0]}: ${g.resultado}` : null).filter(Boolean).join(' | ') || 'Ninguno'}
` : 'Sin análisis previo registrado.';

  const systemPrompt = CHAT_SYSTEM + '\n\n' + analisisInicial;

  // Historial de chat previo
  const chatHistory = lead.chat_history || [];

  // Armar mensajes para Claude
  const messages = [
    ...chatHistory.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: mensaje }
  ];

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data });

    const respuesta = (data.content || []).map(b => b.text || '').join('').trim();

    // Guardar el intercambio en el historial
    chatHistory.push({ role: 'user', content: mensaje, fecha: new Date().toISOString() });
    chatHistory.push({ role: 'assistant', content: respuesta, fecha: new Date().toISOString() });

    // Limitar historial a últimos 40 mensajes (20 intercambios) para controlar tokens
    const historialLimitado = chatHistory.slice(-40);
    lead.chat_history = historialLimitado;
    lead.ultimo_chat = new Date().toISOString();

    await kvSet(`lead:${id}`, lead);

    return res.status(200).json({ respuesta, fecha: new Date().toISOString() });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
