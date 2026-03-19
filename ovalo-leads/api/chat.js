const CHAT_SYSTEM = `Sos el asistente de ventas consultivo de Juan, asesor de Plan Óvalo Ford Goldstein Mendoza.

Tenés acceso al análisis completo del lead y al historial de toda la conversación. Ayudás a Juan a gestionar este lead: respondés preguntas, actualizás el análisis cuando Juan aporta info nueva, y sugerís próximos pasos cuando te lo pide.

GRILLA VIGENTE MARZO 2026:
- Maverick XLT 2.0 AWD 70/30: VM $55.517.200 | Cuotas fijas 2-13: $655.000/mes
- Ranger XL 4x2 80/20: VM $50.962.700 | Cuotas fijas 2-13: $509.000/mes
- Ranger XL 4x2 100% adj cuota 5: VM $50.962.700 | Cuotas 2-5: $808.000/mes
- Ranger XLS V6 4WD 80/20: VM $71.502.700 | Cuotas fijas 2-13: $715.000/mes
- Territory SEL 70/30: VM $50.114.800 | Cuotas fijas 2-13: $594.000/mes
- Transit Van Mediana 70/30: VM $66.962.810 | Cuotas fijas 2-13: $794.000/mes

SPIN: S=Situación P=Problema I=Implicación N=Need-Payoff
La visita se propone SOLO cuando hay N cubierto.

TONO: Conversacional, directo, colega de ventas. Español rioplatense.
Si Juan aporta info nueva, actualizá tu lectura.
Si te pide próxima acción, dala concreta.
Si te pide mensaje WP o guión de llamada, generalo listo para usar.
NUNCA usar guiones " - " en mensajes de WhatsApp sugeridos.

FORMATO DE RESPUESTA — MUY IMPORTANTE:
Respondé SIEMPRE con este JSON (sin backticks, sin texto antes ni después):
{
  "respuesta": "tu respuesta conversacional acá",
  "actualizar_perfil": true o false,
  "perfil": {
    "diagnostico": "diagnóstico actualizado si cambió, sino null",
    "spin_s": true o false o null,
    "spin_p": true o false o null,
    "spin_i": true o false o null,
    "spin_n": true o false o null,
    "spin_etapa": "descripción de etapa actual o null",
    "spin_siguiente": "letra a completar o null",
    "canal": "llamada o whatsapp o null",
    "razon_canal": "razón del canal o null",
    "score_ajuste": número entre -5 y +5 o null,
    "modelo": "modelo actualizado si se confirmó o null"
  }
}

Solo ponés actualizar_perfil: true cuando Juan aportó información nueva que realmente cambia el análisis.
Si no hay nada que actualizar, ponés actualizar_perfil: false y todos los campos de perfil en null.`;

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

  const g = lead.gestiones?.[lead.gestiones.length - 1] || {};
  const analisisContexto = `
ANÁLISIS ACTUAL DEL LEAD:
Nombre: ${lead.nombre}
Modelo: ${lead.modelo || 'No definido'}
Score: ${lead.ultimo_score}/25 — ${g.clasificacion || ''}
Diagnóstico: ${g.diagnostico || 'Sin diagnóstico'}
SPIN: S=${g.spin_s ? 'SÍ' : 'NO'} P=${g.spin_p ? 'SÍ' : 'NO'} I=${g.spin_i ? 'SÍ' : 'NO'} N=${g.spin_n ? 'SÍ' : 'NO'}
Etapa: ${g.spin_etapa || '—'} | Siguiente: ${g.spin_siguiente || '—'}
Canal recomendado: ${g.canal || '—'}
Acción sugerida: ${g.accion_objetivo || '—'}
Resultados registrados: ${lead.gestiones.map(gg => gg.resultado ? `${gg.fecha?.split('T')[0]}: ${gg.resultado}${gg.notas_resultado ? ' ('+gg.notas_resultado+')' : ''}` : null).filter(Boolean).join(' | ') || 'Ninguno'}`;

  const systemPrompt = CHAT_SYSTEM + '\n\n' + analisisContexto;
  const chatHistory = lead.chat_history || [];

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
        max_tokens: 1200,
        system: systemPrompt,
        messages
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data });

    const rawText = (data.content || []).map(b => b.text || '').join('').trim();
    const clean = rawText.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trim();

    let parsed;
    try { parsed = JSON.parse(clean); }
    catch { parsed = { respuesta: rawText, actualizar_perfil: false, perfil: {} }; }

    const respuesta = parsed.respuesta || rawText;
    const ahora = new Date().toISOString();

    // Guardar chat
    chatHistory.push({ role: 'user', content: mensaje, fecha: ahora });
    chatHistory.push({ role: 'assistant', content: respuesta, fecha: ahora });
    lead.chat_history = chatHistory.slice(-40);
    lead.ultimo_chat = ahora;

    // Aplicar actualizaciones de perfil si corresponde
    let perfilActualizado = null;
    if (parsed.actualizar_perfil && parsed.perfil) {
      const p = parsed.perfil;
      const ultimaGestion = lead.gestiones[lead.gestiones.length - 1];
      if (ultimaGestion) {
        if (p.diagnostico !== null && p.diagnostico !== undefined) ultimaGestion.diagnostico = p.diagnostico;
        if (p.spin_s !== null && p.spin_s !== undefined) ultimaGestion.spin_s = p.spin_s;
        if (p.spin_p !== null && p.spin_p !== undefined) ultimaGestion.spin_p = p.spin_p;
        if (p.spin_i !== null && p.spin_i !== undefined) ultimaGestion.spin_i = p.spin_i;
        if (p.spin_n !== null && p.spin_n !== undefined) ultimaGestion.spin_n = p.spin_n;
        if (p.spin_etapa !== null && p.spin_etapa !== undefined) ultimaGestion.spin_etapa = p.spin_etapa;
        if (p.spin_siguiente !== null && p.spin_siguiente !== undefined) ultimaGestion.spin_siguiente = p.spin_siguiente;
        if (p.canal !== null && p.canal !== undefined) ultimaGestion.canal = p.canal;
        if (p.razon_canal !== null && p.razon_canal !== undefined) ultimaGestion.razon_canal = p.razon_canal;
        if (p.score_ajuste !== null && p.score_ajuste !== undefined) {
          lead.ultimo_score = Math.max(0, Math.min(25, (lead.ultimo_score || 0) + p.score_ajuste));
        }
        if (p.modelo !== null && p.modelo !== undefined) lead.modelo = p.modelo;
      }
      perfilActualizado = parsed.perfil;
    }

    await kvSet(`lead:${id}`, lead);

    // Actualizar índice si cambió el score
    if (parsed.actualizar_perfil && parsed.perfil?.score_ajuste) {
      let index = await kvGet('leads:index') || [];
      const idx = index.findIndex(l => l.id === id);
      if (idx >= 0) {
        index[idx].score = lead.ultimo_score;
        const g2 = lead.gestiones[lead.gestiones.length - 1];
        if (g2) {
          index[idx].spin_s = g2.spin_s;
          index[idx].spin_p = g2.spin_p;
          index[idx].spin_i = g2.spin_i;
          index[idx].spin_n = g2.spin_n;
        }
        await kvSet('leads:index', index);
      }
    }

    return res.status(200).json({
      respuesta,
      fecha: ahora,
      perfil_actualizado: !!perfilActualizado,
      lead_actualizado: parsed.actualizar_perfil ? {
        score: lead.ultimo_score,
        modelo: lead.modelo,
        diagnostico: lead.gestiones[lead.gestiones.length-1]?.diagnostico,
        spin_s: lead.gestiones[lead.gestiones.length-1]?.spin_s,
        spin_p: lead.gestiones[lead.gestiones.length-1]?.spin_p,
        spin_i: lead.gestiones[lead.gestiones.length-1]?.spin_i,
        spin_n: lead.gestiones[lead.gestiones.length-1]?.spin_n,
        spin_etapa: lead.gestiones[lead.gestiones.length-1]?.spin_etapa,
        spin_siguiente: lead.gestiones[lead.gestiones.length-1]?.spin_siguiente,
        canal: lead.gestiones[lead.gestiones.length-1]?.canal,
      } : null
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
