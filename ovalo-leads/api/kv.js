// Helper KV — Vercel KV (Upstash Redis REST API)

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

export function normalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 13 && digits.startsWith('549')) return digits.slice(3);
  if (digits.length === 12 && digits.startsWith('54')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('9')) return digits.slice(1);
  if (digits.length === 10) return digits;
  return digits.slice(-10);
}

export async function kvGet(key) {
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

export async function kvSet(key, value) {
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

export async function updateIndex(phone, summary) {
  let index = await kvGet('leads:index') || [];
  const idx = index.findIndex(l => l.id === phone);
  if (idx >= 0) index[idx] = { ...index[idx], ...summary };
  else index.unshift(summary);
  await kvSet('leads:index', index);
}
