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

async function kvDel(key) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/del/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  } catch { return null; }
}

function normalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 13 && digits.startsWith('549')) return digits.slice(3);
  if (digits.length === 12 && digits.startsWith('54')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('9')) return digits.slice(1);
  if (digits.length === 10) return digits;
  return digits.slice(-10);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone, action, gestion_id, campo, valor } = req.body;
  if (!phone || !action) return res.status(400).json({ error: 'phone y action son requeridos.' });

  const id = normalizePhone(phone);

  // BORRAR LEAD COMPLETO
  if (action === 'delete_lead') {
    await kvDel(`lead:${id}`);
    let index = await kvGet('leads:index') || [];
    index = index.filter(l => l.id !== id);
    await kvSet('leads:index', index);
    return res.status(200).json({ ok: true, action: 'lead_deleted' });
  }

  const lead = await kvGet(`lead:${id}`);
  if (!lead) return res.status(404).json({ error: 'Lead no encontrado.' });

  // BORRAR ÚLTIMA GESTIÓN
  if (action === 'delete_last_gestion') {
    if (lead.gestiones?.length > 0) {
      lead.gestiones.pop();
      if (lead.gestiones.length > 0) {
        const last = lead.gestiones[lead.gestiones.length - 1];
        lead.ultimo_score = last.score || 0;
      } else {
        lead.ultimo_score = 0;
      }
      await kvSet(`lead:${id}`, lead);
      // Actualizar índice
      let index = await kvGet('leads:index') || [];
      const idx = index.findIndex(l => l.id === id);
      if (idx >= 0) {
        index[idx].score = lead.ultimo_score;
        index[idx].total_gestiones = lead.gestiones.length;
      }
      await kvSet('leads:index', index);
    }
    return res.status(200).json({ ok: true, action: 'gestion_deleted' });
  }

  // BORRAR HISTORIAL DE CHAT
  if (action === 'clear_chat') {
    lead.chat_history = [];
    lead.ultimo_chat = null;
    await kvSet(`lead:${id}`, lead);
    return res.status(200).json({ ok: true, action: 'chat_cleared' });
  }

  // CORREGIR RESULTADO DE CONTACTO
  if (action === 'fix_resultado') {
    const gestions = lead.gestiones || [];
    const target = gestion_id
      ? gestions.find(g => g.id === gestion_id)
      : gestions[gestions.length - 1];
    if (target) {
      target.resultado = valor || null;
      target.notas_resultado = req.body.notas || target.notas_resultado || '';
      if (valor) target.fecha_resultado = new Date().toISOString();
      lead.ultimo_resultado = valor || null;
    }
    await kvSet(`lead:${id}`, lead);
    let index = await kvGet('leads:index') || [];
    const idx = index.findIndex(l => l.id === id);
    if (idx >= 0) index[idx].ultimo_resultado = valor || null;
    await kvSet('leads:index', index);
    return res.status(200).json({ ok: true, action: 'resultado_fixed' });
  }

  // EDITAR CAMPO DEL LEAD (nombre, modelo)
  if (action === 'edit_campo') {
    if (campo === 'nombre') lead.nombre = valor;
    if (campo === 'modelo') lead.modelo = valor;
    await kvSet(`lead:${id}`, lead);
    let index = await kvGet('leads:index') || [];
    const idx = index.findIndex(l => l.id === id);
    if (idx >= 0) {
      if (campo === 'nombre') index[idx].nombre = valor;
      if (campo === 'modelo') index[idx].modelo = valor;
    }
    await kvSet('leads:index', index);
    return res.status(200).json({ ok: true, action: 'campo_edited' });
  }

  return res.status(400).json({ error: 'Acción no reconocida.' });
}
