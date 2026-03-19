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

  const { phone, gestion_id, resultado, notas } = req.body;
  if (!phone || !resultado) return res.status(400).json({ error: 'phone y resultado son requeridos.' });

  const id = normalizePhone(phone);
  const lead = await kvGet(`lead:${id}`);
  if (!lead) return res.status(404).json({ error: 'Lead no encontrado.' });

  const gestions = lead.gestiones || [];
  const target = gestion_id
    ? gestions.find(g => g.id === gestion_id)
    : gestions[gestions.length - 1];

  if (target) {
    target.resultado = resultado;
    target.notas_resultado = notas || '';
    target.fecha_resultado = new Date().toISOString();
  }

  lead.ultimo_resultado = resultado;
  await kvSet(`lead:${id}`, lead);

  let index = await kvGet('leads:index') || [];
  const idx = index.findIndex(l => l.id === id);
  if (idx >= 0) {
    index[idx].ultimo_resultado = resultado;
    index[idx].ultima_gestion = new Date().toISOString().split('T')[0];
  }
  await kvSet('leads:index', index);

  return res.status(200).json({ ok: true });
}
