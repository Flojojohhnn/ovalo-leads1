const CHAT_SYSTEM = `Sos el asistente de ventas consultivo de Juan, asesor de Plan Óvalo Ford Goldstein Mendoza.

Tenés acceso al análisis completo del lead y al historial de toda la conversación. Tu trabajo es ayudar a Juan a avanzar con este lead hacia una visita al salón.

GRILLA VIGENTE MARZO 2026:
- Maverick XLT 2.0 AWD 70/30: VM $55.517.200 | Cuotas fijas 2-13: $655.000/mes
- Ranger XL 4x2 80/20: VM $50.962.700 | Cuotas fijas 2-13: $509.000/mes
- Ranger XL 4x2 100% adj cuota 5: VM $50.962.700 | Cuotas 2-5: $808.000/mes
- Ranger XLS V6 4WD 80/20: VM $71.502.700 | Cuotas fijas 2-13: $715.000/mes
- Territory SEL 70/30: VM $50.114.800 | Cuotas fijas 2-13: $594.000/mes
- Transit Van Mediana 70/30: VM $66.962.810 | Cuotas fijas 2-13: $794.000/mes

SPIN: S=Situación P=Problema I=Implicación N=Need-Payoff
La visita se propone SOLO cuando hay N cubierto.

REGLA FUNDAMENTAL — NUNCA SUGERÍS DESCARTAR UN LEAD:
Todos los leads se trabajan hasta lograr la visita al salón. No existe la opción de "descartar", "soltar" o "archivar". Si un lead tiene bajo puntaje o mucho tiempo sin respuesta, la estrategia es reactivación gradual, no abandono. Siempre hay un próximo paso posible.

TONO: Conversacional, directo, colega de ventas. Español rioplatense.
NUNCA guiones " - " en mensajes de WhatsApp.

DETECCIÓN AUTOMÁTICA DE RESULTADOS DE CONTACTO:
Si Juan menciona que hizo un contacto con el lead, detectá el resultado y registralo.
Ejemplos:
- "lo llamé y no atendió" → resultado: no_atendio
- "me respondió el whatsapp" / "me contestó" → resultado: respondio_wp
- "atendió pero dijo que..." / "hablé con él" → resultado: atendio
- "agendó visita" / "va a venir" / "quedamos en que viene" → resultado: agendo_visita
- "me dijo que..." / "comentó que..." sin confirmar canal → resultado: respondio_wp (default)
Si hay resultado detectado, registralo en el JSON. Si no hay contacto mencionado, dejá registro_contacto en null.

FORMATO DE RESPUESTA — SIEMPRE JSON, sin backticks, sin texto antes ni después:
{
  "respuesta": "tu respuesta conversacional",
  "registro_contacto": null,
  "notas_contacto": "",
  "actualizar_perfil": false,
  "perfil": {
    "diagnostico": null,
    "spin_s": null, "spin_s_detalle": null, "spin_s_falta": null,
    "spin_p": null, "spin_p_detalle": null, "spin_p_falta": null,
    "spin_i": null, "spin_i_detalle": null, "spin_i_falta": null,
    "spin_n": null, "spin_n_detalle": null, "spin_n_falta": null,
    "spin_etapa": null, "spin_siguiente": null,
    "canal": null, "razon_canal": null,
    "score_ajuste": null, "modelo": null,
    "accion_objetivo": null, "accion_apertura": null,
    "accion_checklist": null, "accion_si_no_atiende": null,
    "plan_b": null
  }
}

registro_contacto: "atendio" | "no_atendio" | "respondio_wp" | "agendo_visita" | null
notas_contacto: resumen en una línea de lo que pasó en el contacto (para el historial)
actualizar_perfil: true solo cuando hay info nueva que cambia el análisis
Campos de perfil que no cambian van en null.`;

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
Nombre: ${lead.nombre} | Modelo: ${lead.modelo || 'No definido'}
Score: ${lead.ultimo_score}/25 — ${g.clasificacion || ''}
Diagnóstico: ${g.diagnostico || '—'}

SPIN ACTUAL:
S: ${g.spin_s ? 'CUBIERTO — ' + (g.spin_s_detalle || '') : 'FALTA — ' + (g.spin_s_falta || 'sin info')}
P: ${g.spin_p ? 'CUBIERTO — ' + (g.spin_p_detalle || '') : 'FALTA — ' + (g.spin_p_falta || 'sin info')}
I: ${g.spin_i ? 'CUBIERTO — ' + (g.spin_i_detalle || '') : 'FALTA — ' + (g.spin_i_falta || 'sin info')}
N: ${g.spin_n ? 'CUBIERTO — ' + (g.spin_n_detalle || '') : 'FALTA — ' + (g.spin_n_falta || 'sin info')}
Siguiente: ${g.spin_siguiente || '—'}

Canal: ${g.canal || '—'} | Objetivo: ${g.accion_objetivo || '—'}
Historial de contactos: ${lead.gestiones.map(gg => gg.resultado ? `${gg.fecha?.split('T')[0]}: ${gg.resultado}${gg.notas_resultado ? ' ('+gg.notas_resultado+')' : ''}` : null).filter(Boolean).join(' | ') || 'Ninguno'}`;

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

    let parsed;
    try {
      const clean = rawText.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trim();
      parsed = JSON.parse(clean);
    } catch {
      try {
        const match = rawText.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
        else throw new Error('no json');
      } catch {
        parsed = { respuesta: rawText, registro_contacto: null, actualizar_perfil: false, perfil: {} };
      }
    }

    let respuesta = parsed.respuesta || '';
    if (!respuesta || respuesta.trim().startsWith('{')) {
      respuesta = rawText.replace(/\{[\s\S]*\}/, '').trim() || rawText;
    }

    const ahora = new Date().toISOString();
    chatHistory.push({ role: 'user', content: mensaje, fecha: ahora });
    chatHistory.push({ role: 'assistant', content: respuesta, fecha: ahora });
    lead.chat_history = chatHistory.slice(-40);
    lead.ultimo_chat = ahora;

    // Auto-registrar resultado de contacto si fue detectado
    if (parsed.registro_contacto) {
      const ultimaGestion = lead.gestiones[lead.gestiones.length - 1];
      if (ultimaGestion) {
        ultimaGestion.resultado = parsed.registro_contacto;
        ultimaGestion.notas_resultado = parsed.notas_contacto || mensaje.substring(0, 100);
        ultimaGestion.fecha_resultado = ahora;
      }
      lead.ultimo_resultado = parsed.registro_contacto;

      // Actualizar índice
      let index = await kvGet('leads:index') || [];
      const idx = index.findIndex(l => l.id === id);
      if (idx >= 0) {
        index[idx].ultimo_resultado = parsed.registro_contacto;
        index[idx].ultima_gestion = ahora.split('T')[0];
      }
      await kvSet('leads:index', index);
    }

    // Actualizar perfil si corresponde
    let leadActualizado = null;
    if (parsed.actualizar_perfil && parsed.perfil) {
      const p = parsed.perfil;
      const ug = lead.gestiones[lead.gestiones.length - 1];
      if (ug) {
        const campos = [
          'diagnostico','spin_s','spin_s_detalle','spin_s_falta',
          'spin_p','spin_p_detalle','spin_p_falta',
          'spin_i','spin_i_detalle','spin_i_falta',
          'spin_n','spin_n_detalle','spin_n_falta',
          'spin_etapa','spin_siguiente','canal','razon_canal',
          'accion_objetivo','accion_apertura','accion_checklist',
          'accion_si_no_atiende','plan_b'
        ];
        campos.forEach(campo => {
          if (p[campo] !== null && p[campo] !== undefined) ug[campo] = p[campo];
        });
        if (p.score_ajuste) lead.ultimo_score = Math.max(0, Math.min(25, (lead.ultimo_score || 0) + p.score_ajuste));
        if (p.modelo) lead.modelo = p.modelo;
      }
      leadActualizado = { ...lead.gestiones[lead.gestiones.length-1], score: lead.ultimo_score, modelo: lead.modelo };
    }

    await kvSet(`lead:${id}`, lead);

    return res.status(200).json({
      respuesta,
      fecha: ahora,
      registro_contacto: parsed.registro_contacto || null,
      notas_contacto: parsed.notas_contacto || null,
      perfil_actualizado: !!leadActualizado,
      lead_actualizado: leadActualizado
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
