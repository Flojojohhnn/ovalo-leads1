// GET /api/lead?phone=xxx — busca un lead por teléfono

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const _secret = process.env.API_SECRET_KEY;
  if (_secret && req.headers['x-api-key'] !== _secret) return res.status(401).json({ error: 'Unauthorized' });

  const { phone } = req.query;
  if (!phone) return res.status(400).json({ error: 'Phone requerido.' });

  const id = normalizePhone(phone);
  if (!id || id.length < 8) return res.status(400).json({ error: 'Teléfono inválido.' });

  const lead = await kvGet(`lead:${id}`);
  if (!lead) return res.status(404).json({ found: false, id });

  return res.status(200).json({ found: true, lead });
}
