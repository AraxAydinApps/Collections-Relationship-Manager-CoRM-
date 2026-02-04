export default async function handler(req, res) {
  // ✅ CORS headers (so browser is happy)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // 🔴 Your Apps Script Web App URL
  const WEBAPP_URL =
    "https://script.google.com/macros/s/AKfycbyl-N86X-NWAzt7fPjX-BUl_DXw09LvGAvuBQDryKcW18G-bKr8Zrhpd0YuQGmUJwVW/exec";

  try {
    const body = req.body || {};

    const r = await fetch(WEBAPP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      redirect: "follow",
    });

    const text = await r.text();

    // Apps Script should return JSON; but we guard anyway
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { ok: false, error: "Upstream non-JSON response", raw: text.slice(0, 500) };
    }

    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ ok: false, error: "Proxy fetch failed", detail: String(e) });
  }
}
