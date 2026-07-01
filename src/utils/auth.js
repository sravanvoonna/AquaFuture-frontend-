// ─── AquaFuture Auth Utility (Mock JWT) ───────────────────────────────────────
// Creates a compact JWT-format token (header.payload.signature) stored in
// localStorage. No real backend — the signature is a HMAC-like hash for demo.

const SECRET = 'aquafuture-jwt-2024-secret';
const TOKEN_KEY = 'af_token';
const SESSION_MINS = 15;

// ── Base64url helpers ─────────────────────────────────────────────────────────
const b64url = (str) =>
  btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

const b64urlDecode = (str) =>
  atob(str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + ((4 - (str.length % 4)) % 4), '='));

// ── Simple hash (djb2-based, for demo purposes) ───────────────────────────────
const hashStr = (s) => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
};

// ── Create token ─────────────────────────────────────────────────────────────
export function createToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({
    sub: user.email,
    name: user.name,
    email: user.email,
    iat: now,
    exp: now + SESSION_MINS * 60,
    jti: Math.random().toString(36).slice(2),
  }));
  const signature = b64url(hashStr(`${header}.${payload}.${SECRET}`));
  return `${header}.${payload}.${signature}`;
}

// ── Parse & validate token ────────────────────────────────────────────────────
export function parseToken(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(b64urlDecode(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;           // expired
    // verify signature
    const expected = b64url(hashStr(`${parts[0]}.${parts[1]}.${SECRET}`));
    if (expected !== parts[2]) return null;        // tampered
    return payload;
  } catch {
    return null;
  }
}

// ── Extend expiry on activity (reset 15-min window) ──────────────────────────
export function refreshToken() {
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return;
  const payload = parseToken(raw);
  if (!payload) return;
  const extended = createToken({ email: payload.email, name: payload.name });
  localStorage.setItem(TOKEN_KEY, extended);
}

// ── Persist & read ────────────────────────────────────────────────────────────
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function loadToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ── Get current user from stored token ───────────────────────────────────────
export function getCurrentUser() {
  const raw = loadToken();
  return raw ? parseToken(raw) : null;
}

// ── Remaining session seconds ─────────────────────────────────────────────────
export function secondsRemaining() {
  const raw = loadToken();
  if (!raw) return 0;
  const payload = parseToken(raw);
  if (!payload) return 0;
  return Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
}
