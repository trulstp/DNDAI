const BASE = "https://api.open5e.com";

const cache = new Map();
const TTL_MS = 15 * 60 * 1000;

function getCached(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    cache.delete(key);
    return null;
  }
  return hit.value;
}
function setCached(key, value) {
  cache.set(key, { value, expires: Date.now() + TTL_MS });
}

async function fetchJson(url) {
  const cached = getCached(url);
  if (cached) return cached;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open5e ${res.status} on ${url}`);
  const data = await res.json();
  setCached(url, data);
  return data;
}

async function fetchAllPages(url, maxPages = 6) {
  let out = [];
  let next = url;
  let pages = 0;

  while (next && pages < maxPages) {
    const data = await fetchJson(next);
    out = out.concat(data.results || []);
    next = data.next;
    pages += 1;
  }
  return out;
}

module.exports = { BASE, fetchJson, fetchAllPages };
