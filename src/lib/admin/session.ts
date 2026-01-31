// Shared session and code stores for admin authentication
// In production, replace with Redis or database storage

type CodeData = { code: string; expires: number };
type SessionData = { email: string; expires: number };

// Using global to persist across hot reloads in development
const globalForAdmin = globalThis as unknown as {
  codeStore: Map<string, CodeData>;
  sessionStore: Map<string, SessionData>;
};

export const codeStore =
  globalForAdmin.codeStore || new Map<string, CodeData>();
export const sessionStore =
  globalForAdmin.sessionStore || new Map<string, SessionData>();

if (process.env.NODE_ENV !== "production") {
  globalForAdmin.codeStore = codeStore;
  globalForAdmin.sessionStore = sessionStore;
}

export function getCodeStore() {
  return codeStore;
}

export function getSessionStore() {
  return sessionStore;
}

export function setCode(
  email: string,
  code: string,
  expiresInMs: number = 10 * 60 * 1000,
) {
  codeStore.set(email.toLowerCase(), {
    code,
    expires: Date.now() + expiresInMs,
  });
}

export function verifyCode(email: string, code: string): boolean {
  const stored = codeStore.get(email.toLowerCase());
  if (!stored) return false;
  if (Date.now() > stored.expires) {
    codeStore.delete(email.toLowerCase());
    return false;
  }
  return stored.code === code;
}

export function deleteCode(email: string) {
  codeStore.delete(email.toLowerCase());
}

export function createSession(
  email: string,
  expiresInMs: number = 24 * 60 * 60 * 1000,
): string {
  const crypto = require("crypto");
  const token = crypto.randomBytes(32).toString("hex");
  sessionStore.set(token, {
    email: email.toLowerCase(),
    expires: Date.now() + expiresInMs,
  });
  return token;
}

export function getSession(token: string): SessionData | null {
  const session = sessionStore.get(token);
  if (!session) return null;
  if (Date.now() > session.expires) {
    sessionStore.delete(token);
    return null;
  }
  return session;
}

export function deleteSession(token: string) {
  sessionStore.delete(token);
}
