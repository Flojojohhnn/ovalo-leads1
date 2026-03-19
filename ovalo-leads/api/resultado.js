// POST /api/resultado — registra el resultado de un contacto

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

function normalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 13 && digits.startsWith('549')) return digits.slice(3);
  if (digits.length === 12 && digits.startsWith('54')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('9')) return digits.slice(1);
  if (digits.length === 10) return digits;
  return digits.slice(-10);
}

async function kvGet(key) {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` }
    });
    const data = await res.json();
    if (!data.result) return null;
    try { return JSON.parse(data.result); } catch { return data.result; }
  } catch { return null; }
}

async function kvSet(key, value) {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const res = await fetch(`${KV_URL}/set`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([key, JSON.stringify(value)])
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

  const { phone, gestion_id, resultado, notas } = req.body;
  if (!phone || !resultado) return res.status(400).json({ error: 'phone y resultado son requeridos.' });

  const id = normalizePhone(phone);
  const lead = await kvGet(`lead:${id}`);
  if (!lead) return res.status(404).json({ error: 'Lead no encontrado.' });

  // Actualizar última gestión o la gestión específica
  const gestions = lead.gestiones || [];
  let target = gestion_id
    ? gestions.find(g => g.id === gestion_id)
    : gestions[gestions.length - 1];

  if (target) {
    target.resultado = resultado;
    target.notas_resultado = notas || '';
    target.fecha_resultado = new Date().toISOString();
  }

  lead.ultimo_resultado = resultado;
  await kvSet(`lead:${id}`, lead);

  // Actualizar índice
  let index = await kvGet('leads:index') || [];
  const idx = index.findIndex(l => l.id === id);
  if (idx >= 0) {
    index[idx].ultimo_resultado = resultado;
    index[idx].ultima_gestion = new Date().toISOString().split('T')[0];
  }
  await kvSet('leads:index', index);

  return res.status(200).json({ ok: true });
}
