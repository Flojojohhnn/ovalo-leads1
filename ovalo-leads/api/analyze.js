const SYSTEM_PROMPT = `Sos el asistente de ventas consultivo de Juan, asesor de Plan Óvalo Ford Goldstein Mendoza. Tu objetivo no es cerrar una visita — es ayudar a Juan a construir la necesidad del cliente para que la visita y la suscripción sean la decisión lógica del lead.

---

GRILLA VIGENTE MARZO 2026:
- Maverick XLT 2.0 AWD 70/30: VM $55.517.200 | Integración mín 30% = $16.655.160 | Cuotas fijas 2-13: $655.000/mes
- Ranger XL 4x2 80/20: VM $50.962.700 | Integración mín 20% = $10.192.540 | Cuotas fijas 2-13: $509.000/mes
- Ranger XL 4x2 100% (adj cuota 5): VM $50.962.700 | Integración cuota 5: $24.000.000 | Cuotas 2-5: $808.000/mes
- Ranger XLS V6 4WD 80/20: VM $71.502.700 | Integración mín 20% = $14.300.540 | Cuotas fijas 2-13: $715.000/mes
- Territory SEL 70/30: VM $50.114.800 | Integración mín 30% = $15.034.440 | Cuotas fijas 2-13: $594.000/mes
- Transit Van Mediana 70/30: VM $66.962.810 | Integración mín 30% = $20.088.843 | Adj garantizada cuota 3 | Cuotas fijas 2-13: $794.000/mes
TODOS los modelos Ford son accesibles por cambio de modelo. NUNCA digas que un modelo no tiene plan disponible.

---

PROCESO DE 4 PASOS FORD GOLDSTEIN:
Paso 1 — Detección de necesidades: verificar dato telefónico, indagar experiencia con la marca, uso del vehículo, modelo de interés, cuándo desea retirar, finalidad, ubicarlo en el plan.
Paso 2 — Test drive + Guía 360: invitación al test drive, agendamiento, envío de ficha técnica.
Paso 3 — Cierre: envío de presupuesto por el medio preferido.
Paso 4 — Contacto posterior 48hs.

El código en el nombre (1.2.3.4) indica pasos completados. Usalo como referencia secundaria.

---

FRAMEWORK SPIN:
S — SITUACIÓN: ¿qué vehículo tiene, para qué lo usa, hace cuánto, si tiene algo para entregar?
P — PROBLEMA: ¿qué le molesta de su situación, por qué mira opciones, qué lo motivó?
I — IMPLICACIÓN: ¿dimensionó el costo de no actuar, qué pierde si espera?
N — NEED-PAYOFF: ¿verbalizó con sus palabras qué solución necesita?

Para cada letra cubierta, describí QUÉ información específica la cubre.
Para cada letra no cubierta, indicá QUÉ pregunta o dato la completaría.

REGLA CRÍTICA: La visita se propone SOLO cuando hay N. Antes de N, el siguiente paso siempre es completar la letra que falta.

---

EXTRACCIÓN DE DATOS — OBLIGATORIO:
- nombre_lead: nombre completo sin códigos (1.2.3.4)
- telefono_lead: solo dígitos sin prefijo internacional (de +5492615016302 extraé 2615016302)

---

LECTURA OBLIGATORIA:
1. Último mensaje exacto de Juan y si hubo respuesta
2. Letras SPIN cubiertas con datos reales
3. Canal histórico de respuesta del lead
4. NUNCA sugerís algo igual al último mensaje enviado

---

CANAL:
LLAMADA: faltan P o I, respondió llamadas antes, caso complejo, mucho tiempo sin contacto.
WHATSAPP: prefiere mensajes, S básico, ya hay suficiente SPIN.

---

TONO:
Llamadas: encuadre primero, preguntas conversacionales, dar antes de pedir.
WhatsApp: máximo 4 oraciones, humano, sin silencio del cliente, sin urgencia fabricada, detalle personal, pregunta binaria. NUNCA guiones " - ".

---

EJEMPLOS:
MAL: "Hola Sool, nunca me respondiste, imagino que me viste y pasaste de largo jaja."
BIEN: "Hola Sool, soy Juan de Ford Goldstein. Te había escrito en enero por la Maverick pero nunca pude saber si te había llegado bien la info. ¿Seguís evaluando opciones o ya lo resolviste por otro lado?"
MAL: "Jose Luis, dentro de la ecuación tengo los números actualizados."
BIEN: "Jose Luis, tengo los valores de marzo actualizados y quería mostrarte cómo quedaría el número de la Territory con la Tracker como parte de pago. ¿Hoy a la tarde o mañana a la mañana te viene bien?"

---

SCORE: cada criterio 1-5 MÁXIMO. Total máximo 25.

---

RESPONDÉ ÚNICAMENTE CON ESTE JSON (sin texto antes ni después, sin backticks):
{
  "nombre_lead": "",
  "telefono_lead": "",
  "titulo": "",
  "score": {
    "intencion": {"puntaje": 0, "nota": ""},
    "capacidad_pago": {"puntaje": 0, "nota": ""},
    "urgencia": {"puntaje": 0, "nota": ""},
    "engagement": {"puntaje": 0, "nota": ""},
    "fit_producto": {"puntaje": 0, "nota": ""},
    "total": 0
  },
  "clasificacion": "",
  "diagnostico": "",
  "spin": {
    "S": {"cubierto": false, "detalle": "", "que_falta": ""},
    "P": {"cubierto": false, "detalle": "", "que_falta": ""},
    "I": {"cubierto": false, "detalle": "", "que_falta": ""},
    "N": {"cubierto": false, "detalle": "", "que_falta": ""},
    "etapa_actual": "",
    "siguiente_letra": ""
  },
  "canal": "llamada",
  "razon_canal": "",
  "accion": {
    "objetivo": "",
    "apertura": "",
    "checklist": [
      {"punto": "", "pregunta_sugerida": "", "dato_que_buscas": ""}
    ],
    "si_no_atiende": "",
    "si_responde_wp": ""
  },
  "plan_b": ""
}

El checklist: 4-6 ítems en orden SPIN empezando por la letra que falta.
Si canal es "whatsapp": accion.apertura queda vacío, accion.si_no_atiende queda vacío, completá accion.si_responde_wp.
Si canal es "llamada": completá apertura, checklist y si_no_atiende. si_responde_wp queda vacío.`;

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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const _secret = process.env.API_SECRET_KEY;
  if (_secret && req.headers['x-api-key'] !== _secret) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { crm, wa, sensacion } = req.body;
  if (!crm) return res.status(400).json({ error: 'El historial CRM es requerido.' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY no configurada.' });

  let userContent = 'HISTORIAL CRM:\n' + crm;
  if (wa) userContent += '\n\nHISTORIAL WHATSAPP:\n' + wa;
  if (sensacion) userContent += '\n\nSENSACIÓN DE JUAN:\n' + sensacion;

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
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userContent }]
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data });

    const rawText = (data.content || []).map(b => b.text || '').join('').trim();
    const clean = rawText.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trim();

    let parsed;
    try { parsed = JSON.parse(clean); }
    catch (e) { return res.status(500).json({ error: 'JSON parse error', raw: rawText.substring(0, 500) }); }

    const rawPhone = parsed.telefono_lead || '';
    const phone = rawPhone ? normalizePhone(rawPhone) : null;

    if (phone && phone.length >= 8) {
      const gestionId = Date.now().toString();

      // Guardar análisis COMPLETO en la gestión
      const nuevaGestion = {
        id: gestionId,
        fecha: new Date().toISOString(),
        // Score completo con notas
        score: parsed.score?.total || 0,
        score_intencion: parsed.score?.intencion?.puntaje || 0,
        score_intencion_nota: parsed.score?.intencion?.nota || '',
        score_capacidad: parsed.score?.capacidad_pago?.puntaje || 0,
        score_capacidad_nota: parsed.score?.capacidad_pago?.nota || '',
        score_urgencia: parsed.score?.urgencia?.puntaje || 0,
        score_urgencia_nota: parsed.score?.urgencia?.nota || '',
        score_engagement: parsed.score?.engagement?.puntaje || 0,
        score_engagement_nota: parsed.score?.engagement?.nota || '',
        score_fit: parsed.score?.fit_producto?.puntaje || 0,
        score_fit_nota: parsed.score?.fit_producto?.nota || '',
        clasificacion: parsed.clasificacion || '',
        // Diagnóstico
        diagnostico: parsed.diagnostico || '',
        // SPIN completo con detalle y qué falta
        spin_s: parsed.spin?.S?.cubierto || false,
        spin_s_detalle: parsed.spin?.S?.detalle || '',
        spin_s_falta: parsed.spin?.S?.que_falta || '',
        spin_p: parsed.spin?.P?.cubierto || false,
        spin_p_detalle: parsed.spin?.P?.detalle || '',
        spin_p_falta: parsed.spin?.P?.que_falta || '',
        spin_i: parsed.spin?.I?.cubierto || false,
        spin_i_detalle: parsed.spin?.I?.detalle || '',
        spin_i_falta: parsed.spin?.I?.que_falta || '',
        spin_n: parsed.spin?.N?.cubierto || false,
        spin_n_detalle: parsed.spin?.N?.detalle || '',
        spin_n_falta: parsed.spin?.N?.que_falta || '',
        spin_etapa: parsed.spin?.etapa_actual || '',
        spin_siguiente: parsed.spin?.siguiente_letra || '',
        // Canal
        canal: parsed.canal || '',
        razon_canal: parsed.razon_canal || '',
        // Acción completa
        accion_objetivo: parsed.accion?.objetivo || '',
        accion_apertura: parsed.accion?.apertura || '',
        accion_checklist: parsed.accion?.checklist || [],
        accion_si_no_atiende: parsed.accion?.si_no_atiende || '',
        accion_si_responde_wp: parsed.accion?.si_responde_wp || '',
        plan_b: parsed.plan_b || '',
        // Resultado del contacto
        resultado: null,
        notas_resultado: '',
        fecha_resultado: null
      };

      const nombreFinal = parsed.nombre_lead || parsed.titulo?.split('—')[0]?.trim() || 'Sin nombre';
      const modeloFinal = parsed.titulo?.split('—')[1]?.trim() || '';

      let lead = await kvGet(`lead:${phone}`);
      if (!lead) {
        lead = {
          id: phone,
          nombre: nombreFinal,
          telefono_original: rawPhone,
          modelo: modeloFinal,
          primera_consulta: new Date().toISOString(),
          gestiones: []
        };
      } else {
        lead.nombre = nombreFinal;
        if (modeloFinal) lead.modelo = modeloFinal;
      }

      lead.gestiones.push(nuevaGestion);
      lead.ultima_gestion = new Date().toISOString();
      lead.ultimo_score = parsed.score?.total || 0;
      lead.ultima_gestion_id = gestionId;

      const saveResult = await kvSet(`lead:${phone}`, lead);

      // Actualizar índice
      let index = await kvGet('leads:index') || [];
      const idx = index.findIndex(l => l.id === phone);
      const summary = {
        id: phone,
        nombre: lead.nombre,
        modelo: lead.modelo,
        score: lead.ultimo_score,
        spin_s: nuevaGestion.spin_s,
        spin_p: nuevaGestion.spin_p,
        spin_i: nuevaGestion.spin_i,
        spin_n: nuevaGestion.spin_n,
        spin_siguiente: nuevaGestion.spin_siguiente,
        spin_etapa: nuevaGestion.spin_etapa,
        ultima_gestion: new Date().toISOString().split('T')[0],
        ultimo_resultado: lead.ultimo_resultado || null,
        total_gestiones: lead.gestiones.length
      };
      if (idx >= 0) index[idx] = summary;
      else index.unshift(summary);
      await kvSet('leads:index', index);

      parsed._gestion_id = gestionId;
      parsed._phone = phone;
      parsed._guardado = !!(saveResult);
    } else {
      parsed._guardado = false;
      parsed._motivo = 'No se pudo extraer teléfono del historial';
    }

    return res.status(200).json(parsed);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
