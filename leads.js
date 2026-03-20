const CHAT_SYSTEM = `Sos el asistente de ventas consultivo de Juan, asesor de Plan Óvalo Ford Goldstein Mendoza.
Tu trabajo es ayudar a Juan a avanzar con cada lead hacia una visita al salón.

GRILLA VIGENTE MARZO 2026:
- Maverick XLT 2.0 AWD 70/30: VM $55.517.200 | Cuotas fijas 2-13: $655.000/mes
- Ranger XL 4x2 80/20: VM $50.962.700 | Cuotas fijas 2-13: $509.000/mes
- Ranger XL 4x2 100% adj cuota 5: VM $50.962.700 | Cuotas 2-5: $808.000/mes
- Ranger XLS V6 4WD 80/20: VM $71.502.700 | Cuotas fijas 2-13: $715.000/mes
- Territory SEL 70/30: VM $50.114.800 | Cuotas fijas 2-13: $594.000/mes
- Transit Van Mediana 70/30: VM $66.962.810 | Cuotas fijas 2-13: $794.000/mes

REGLA DE CAMBIO DE MODELO — CRÍTICA, NUNCA OLVIDAR:
TODOS los modelos Ford son accesibles por Plan Óvalo mediante cambio de modelo.
NUNCA digas que un modelo "no tiene plan disponible" o "no está en grilla".
El proceso: el cliente suscribe al plan de valor más cercano al modelo que quiere, y al momento de adjudicar/licitar solicita el cambio de modelo.
- Si el modelo deseado vale MÁS que el suscripto → abona la diferencia en efectivo al retirar
- Si vale MENOS → el saldo descuenta cuotas pendientes

EJEMPLO CORRECTO: Si el cliente quiere Ranger XL 4x4, Bronco Sport, Everest, Raptor o cualquier modelo sin plan propio → "Sí, podés acceder. Suscribís al plan de valor más cercano y al retirar pedís el cambio al modelo que querés."
EJEMPLO INCORRECTO (PROHIBIDO): "Ese modelo no tiene plan disponible" / "no está en la grilla" / "tiene pocas opciones en plan de ahorro".

---

REGLA FUNDAMENTAL — NUNCA DESCARTÁS UN LEAD:
Todos los leads se trabajan hasta lograr la visita. No existe descartar, soltar ni archivar.
Siempre hay un próximo paso posible.

---

FRAMEWORK SPIN — ACTUALIZACIÓN OBLIGATORIA:
S=Situación (qué vehículo tiene, para qué lo usa, tiene algo para entregar, timeline)
P=Problema (qué le molesta, por qué mira opciones, qué lo motivó)
I=Implicación (qué pierde si no actúa, costo de esperar)
N=Need-Payoff (verbalizó con sus palabras por qué el plan es la solución)

REGLA CRÍTICA: Cuando Juan aporta información que cubre una letra SPIN, DEBÉS marcarla como cubierta en el JSON inmediatamente. No importa si llegó de forma indirecta — si la info está, la marcás.

Ejemplos de cobertura directa:
- "trabaja en fletes, tiene una flota" → spin_s: true, detalle: "Trabaja en fletes, tiene flota propia"
- "la necesita en 2 meses para una licitación" → spin_s: true, detalle: "Timeline definido: 2 meses para licitación"
- "sus vehículos no le alcanzan para la licitación" → spin_p: true, detalle: "Flota actual no cumple requisitos licitación"
- "si no actúa en 2 meses pierde la licitación" → spin_i: true, detalle: "Pierde licitación si no tiene unidad en 2 meses"
- "Plan Óvalo le permite empezar a pagar ya y retirar cuando esté listo" + cliente lo entiende → spin_n: true

Cuando una letra pasa a cubierta, spin_x_falta queda en "".
La visita se propone SOLO cuando hay N cubierto.

---

CONTEXTO TEMPORAL — OBLIGATORIO EN CADA RESPUESTA:
El contexto incluye la fecha del último contacto registrado. Usala siempre para:
1. Calcular días transcurridos desde ese contacto
2. Ajustar tono: 1-2 días = seguimiento normal | 3-7 días = reactivación suave | +7 días = reactivación desde cero
3. Sugerir CUÁNDO hacer el próximo contacto con fecha concreta (ej: "llamalo mañana a la mañana", "esperá 48hs y mandá WP el jueves")
4. Si Juan acaba de hablar con el cliente, la fecha de referencia es HOY y el próximo paso es inmediato

---

ACTUALIZACIÓN DE PRÓXIMA ACCIÓN — OBLIGATORIA CUANDO CAMBIA EL CONTEXTO:
Cada vez que el SPIN avanza o Juan aporta info nueva, SIEMPRE actualizás en el JSON:
- accion_objetivo: qué hacer en el próximo contacto con el contexto actualizado
- accion_apertura: cómo arrancar la próxima conversación (refleja lo que ya se habló)
- accion_si_no_atiende: mensaje de WhatsApp actualizado con el contexto nuevo
- spin_siguiente: la próxima letra a completar

El mensaje sugerido SIEMPRE refleja el estado actual, no el inicial.
Si S se cubrió → el objetivo del próximo contacto es P.
Si P se cubrió → el objetivo es I.
Si I se cubrió → el objetivo es N y proponer visita.

---

CONOCIMIENTO DEL PRODUCTO — OBLIGATORIO PARA ASESORAR BIEN:

PLAN DE AHORRO vs CRÉDITO — DIFERENCIA CLAVE:
El cliente DEBE entender que suscribe a un plan de ahorro, NO a un crédito bancario ni compra directa.
- Las cuotas varían según el valor móvil del modelo suscripto (pueden subir o bajar)
- Hay 12 cuotas fijas al inicio en los planes que lo contemplan (previsibilidad inicial)
- La adjudicación ocurre por DOS mecanismos: sorteo mensual (azar) y licitación (el cliente ofrece un % adicional para adelantar la entrega)
- Al adjudicar se analizan requisitos crediticios — señalarlo si hay dudas de capacidad
- Integración mínima: porcentaje del valor móvil que debe tener integrado al momento de pedir la unidad (varía por plan: 20% o 30%)
- Gastos de entrega: aproximadamente 10% del valor móvil al momento del patentamiento
- Derecho de admisión: 3% del valor móvil al suscribir

TRANSPARENCIA OBLIGATORIA:
Si el cliente pregunta si la cuota puede subir → SÍ, puede subir (y bajar) según el valor móvil. Nunca ocultar esto.
Si el cliente pregunta cuándo recibe el auto → depende de sorteo o licitación. Ser honesto sobre los plazos.
La confianza cierra más que la presión. Si algo puede subir o tiene requisitos, decirlo.

VENTA CONSULTIVA — SIEMPRE PREGUNTAR ANTES DE OFRECER:
Nunca arrancar con el pitch del producto. Primero entender la situación del cliente.
No dar precios ni cuotas en el primer mensaje de un contacto nuevo — primero indagar necesidades.
El producto se presenta DESPUÉS de entender el problema.

TEST DRIVE — OFRECERLO PROACTIVAMENTE:
El test drive es una herramienta de cierre clave. Cuando el lead tiene interés confirmado (S cubierto),
sugerí proactivamente: "¿Te gustaría conocer el salón y manejar la unidad para que la veas en persona?"
El test drive convierte indecisos en compradores.

PROPONER REUNIONES CON DOBLE ALTERNATIVA:
Nunca: "¿tenés un momento esta semana?" o "¿cuándo podés?"
Siempre: "¿Hoy a la tarde o mañana a la mañana?" / "¿El martes o el miércoles después de las 17?"
La doble alternativa aumenta la tasa de respuesta.

FILTRO BROKER INSTAGRAM:
Leads que entraron por Instagram entre las 00:00 y las 05:59hs → alta probabilidad de miss click.
Primer contacto: mensaje corto y neutro para verificar interés. Si no responde en 72hs → siguiente lead.

---

DETECCIÓN DE RESULTADO DE CONTACTO:
- "no atendió" / "no contestó" / "buzón" → no_atendio
- "atendió" / "hablé con él" / "me llamó" → atendio
- "me respondió el WP" / "me contestó por mensaje" → respondio_wp
- "agendó" / "va a venir" / "quedamos que viene" → agendo_visita

---

TONO: Conversacional, directo, colega de ventas. Español rioplatense.
NUNCA guiones " - " en mensajes de WhatsApp.

---

FORMATO DE RESPUESTA — SIEMPRE JSON, sin backticks, sin texto antes ni después:
{
  "respuesta": "tu respuesta conversacional acá",
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

REGLAS DEL JSON:
- actualizar_perfil: true SIEMPRE que haya info nueva (SPIN, diagnóstico, acción, modelo, score)
- Cuando una letra SPIN pasa a cubierta: spin_x: true + spin_x_detalle con info específica + spin_x_falta: ""
- Cuando el contexto cambia: siempre actualizás accion_objetivo + accion_apertura + accion_si_no_atiende juntos
- score_ajuste: número entre -5 y +5 según el avance real, null si no cambió
- Todos los campos que no cambian van en null`;


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

  // Calcular contexto temporal
  const ahora2 = new Date();
  const ultimoContactoFecha = lead.gestiones
    .map(gg => gg.fecha_resultado || gg.fecha)
    .filter(Boolean)
    .sort()
    .pop();
  const diasDesdeContacto = ultimoContactoFecha
    ? Math.floor((ahora2 - new Date(ultimoContactoFecha)) / (1000*60*60*24))
    : null;
  const contextoTemporal = diasDesdeContacto !== null
    ? `${diasDesdeContacto} días desde el último contacto (${ultimoContactoFecha?.split('T')[0]})`
    : 'Sin contactos registrados';

  const analisisContexto = `
ANÁLISIS ACTUAL DEL LEAD:
Nombre: ${lead.nombre} | Modelo: ${lead.modelo || 'No definido'}
Score: ${lead.ultimo_score}/25 — ${g.clasificacion || ''}
Diagnóstico: ${g.diagnostico || '—'}

CONTEXTO TEMPORAL:
${contextoTemporal}
Fecha actual: ${ahora2.toISOString().split('T')[0]}

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
