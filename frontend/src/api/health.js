// Backend Health & Wake-up Check Service
// Render free-tier instances may take 30-60s to spin up from idle.

export async function checkServerHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch('/public/health-check', {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const text = await res.text();
      return text.includes('ok');
    }
    return false;
  } catch {
    return false;
  }
}
