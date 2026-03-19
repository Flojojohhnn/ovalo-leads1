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
Cuando Juan aporta info nueva que completa una letra SPIN, marcala como cubierta y describí qué información la cubre en "detalle".

TONO: Conversacional, directo, colega de ventas. Español rioplatense.
NUNCA usar guiones " - " en mensajes de WhatsApp sugeridos.

FORMATO DE RESPUESTA — OBLIGATORIO, sin backticks, sin texto antes ni después:
{
  "respuesta": "tu respuesta conversacional acá",
  "actualizar_perfil": false,
  "perfil": {
    "diagnostico": null,
    "spin_s": null, "spin_s_detalle": null, "spin_s_falta": null,
    "spin_p": null, "spin_p_detalle": null, "spin_p_falta": null,
    "spin_i": null, "spin_i_detalle": null, "spin_i_falta": null,
    "spin_n": null, "spin_n_detalle": null, "spin_n_falta": null,
    "spin_etapa": null,
    "spin_siguiente": null,
    "canal": null,
    "razon_canal": null,
    "score_ajuste": null,
    "modelo": null,
    "accion_objetivo": null,
    "accion_apertura": null,
    "accion_checklist": null,
    "accion_si_no_atiende": null,
    "plan_b": null
  }
}

Reglas:
- actualizar_perfil: true SOLO cuando Juan aporta info nueva que realmente cambia el análisis
- Si una letra SPIN pasa a cubierta, incluí su detalle (qué info la cubre) y ponéle que_falta en vacío
- Si una letra sigue sin cubrir pero sabés mejor qué falta, actualizá su que_falta
- Todos los campos de perfil que no cambian van en null`;

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
S (Situación): ${g.spin_s ? 'CUBIERTO — ' + (g.spin_s_detalle || '') : 'FALTA — ' + (g.spin_s_falta || 'sin info')}
P (Problema): ${g.spin_p ? 'CUBIERTO — ' + (g.spin_p_detalle || '') : 'FALTA — ' + (g.spin_p_falta || 'sin info')}
I (Implicación): ${g.spin_i ? 'CUBIERTO — ' + (g.spin_i_detalle || '') : 'FALTA — ' + (g.spin_i_falta || 'sin info')}
N (Need-Payoff): ${g.spin_n ? 'CUBIERTO — ' + (g.spin_n_detalle || '') : 'FALTA — ' + (g.spin_n_falta || 'sin info')}
Etapa: ${g.spin_etapa || '—'} | Siguiente a completar: ${g.spin_siguiente || '—'}

Canal recomendado: ${g.canal || '—'} — ${g.razon_canal || ''}
Última acción sugerida: ${g.accion_objetivo || '—'}
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
        parsed = { respuesta: rawText, actualizar_perfil: false, perfil: {} };
      }
    }

    // Evitar que la respuesta tenga JSON crudo
    let respuesta = parsed.respuesta || '';
    if (!respuesta || respuesta.trim().startsWith('{')) {
      respuesta = rawText.replace(/\{[\s\S]*\}/, '').trim() || rawText;
    }
    const ahora = new Date().toISOString();

    chatHistory.push({ role: 'user', content: mensaje, fecha: ahora });
    chatHistory.push({ role: 'assistant', content: respuesta, fecha: ahora });
    lead.chat_history = chatHistory.slice(-40);
    lead.ultimo_chat = ahora;

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
        if (p.score_ajuste !== null && p.score_ajuste !== undefined) {
          lead.ultimo_score = Math.max(0, Math.min(25, (lead.ultimo_score || 0) + p.score_ajuste));
        }
        if (p.modelo !== null && p.modelo !== undefined) lead.modelo = p.modelo;
      }

      // Actualizar índice si cambia score
      if (p.score_ajuste) {
        let index = await kvGet('leads:index') || [];
        const idx = index.findIndex(l => l.id === id);
        if (idx >= 0) {
          const ug2 = lead.gestiones[lead.gestiones.length - 1];
          index[idx].score = lead.ultimo_score;
          index[idx].spin_s = ug2.spin_s;
          index[idx].spin_p = ug2.spin_p;
          index[idx].spin_i = ug2.spin_i;
          index[idx].spin_n = ug2.spin_n;
          index[idx].spin_siguiente = ug2.spin_siguiente;
          await kvSet('leads:index', index);
        }
      }

      leadActualizado = {
        score: lead.ultimo_score,
        modelo: lead.modelo,
        diagnostico: lead.gestiones[lead.gestiones.length-1]?.diagnostico,
        spin_s: lead.gestiones[lead.gestiones.length-1]?.spin_s,
        spin_s_detalle: lead.gestiones[lead.gestiones.length-1]?.spin_s_detalle,
        spin_s_falta: lead.gestiones[lead.gestiones.length-1]?.spin_s_falta,
        spin_p: lead.gestiones[lead.gestiones.length-1]?.spin_p,
        spin_p_detalle: lead.gestiones[lead.gestiones.length-1]?.spin_p_detalle,
        spin_p_falta: lead.gestiones[lead.gestiones.length-1]?.spin_p_falta,
        spin_i: lead.gestiones[lead.gestiones.length-1]?.spin_i,
        spin_i_detalle: lead.gestiones[lead.gestiones.length-1]?.spin_i_detalle,
        spin_i_falta: lead.gestiones[lead.gestiones.length-1]?.spin_i_falta,
        spin_n: lead.gestiones[lead.gestiones.length-1]?.spin_n,
        spin_n_detalle: lead.gestiones[lead.gestiones.length-1]?.spin_n_detalle,
        spin_n_falta: lead.gestiones[lead.gestiones.length-1]?.spin_n_falta,
        spin_etapa: lead.gestiones[lead.gestiones.length-1]?.spin_etapa,
        spin_siguiente: lead.gestiones[lead.gestiones.length-1]?.spin_siguiente,
        canal: lead.gestiones[lead.gestiones.length-1]?.canal,
        razon_canal: lead.gestiones[lead.gestiones.length-1]?.razon_canal,
        accion_objetivo: lead.gestiones[lead.gestiones.length-1]?.accion_objetivo,
        accion_apertura: lead.gestiones[lead.gestiones.length-1]?.accion_apertura,
        accion_checklist: lead.gestiones[lead.gestiones.length-1]?.accion_checklist,
        accion_si_no_atiende: lead.gestiones[lead.gestiones.length-1]?.accion_si_no_atiende,
        plan_b: lead.gestiones[lead.gestiones.length-1]?.plan_b,
      };
    }

    await kvSet(`lead:${id}`, lead);

    return res.status(200).json({
      respuesta,
      fecha: ahora,
      perfil_actualizado: !!leadActualizado,
      lead_actualizado: leadActualizado
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
