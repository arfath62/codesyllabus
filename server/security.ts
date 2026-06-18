import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";

function requireSecret(name: string, devFallback: string): string {
  const value = process.env[name];
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error(`${name} must be set in production`);
  }
  return devFallback;
}

export const SESSION_SECRET = requireSecret("SESSION_SECRET", "dev-only-change-me-in-production");
export const TOKEN_SECRET = requireSecret("TOKEN_SECRET", "dev-token-secret-change-me");

export const MAX_CODE_LENGTH = 8000;
export const MAX_MESSAGE_LENGTH = 2000;
export const ALLOWED_LANGUAGES = new Set(["python", "javascript", "sql", "html", "rust"]);

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const bucket = rateBuckets.get(key);

    if (!bucket || now > bucket.resetAt) {
      rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (bucket.count >= maxRequests) {
      res.status(429).json({ error: "Too many requests. Please wait and try again." });
      return;
    }

    bucket.count += 1;
    next();
  };
}

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
}

export function sanitizeErrorMessage(err: unknown): string {
  if (process.env.NODE_ENV === "production") {
    return "An internal error occurred.";
  }
  return err instanceof Error ? err.message : "Unknown error";
}

export function signProgressPayload(stats: object): string {
  const payload = Buffer.from(JSON.stringify(stats)).toString("base64url");
  const sig = crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyProgressToken(token: string): object | null {
  const trimmed = token.trim();
  const dot = trimmed.lastIndexOf(".");
  if (dot <= 0) return null;

  const payload = trimmed.slice(0, dot);
  const sig = trimmed.slice(dot + 1);
  const expected = crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("base64url");

  try {
    if (
      sig.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
    ) {
      return null;
    }
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof parsed === "object" && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}

export function validateGradeInput(body: Record<string, unknown>): string | null {
  const code = typeof body.code === "string" ? body.code : "";
  const language = typeof body.language === "string" ? body.language : "python";

  if (!ALLOWED_LANGUAGES.has(language)) {
    return "Unsupported language.";
  }
  if (code.length > MAX_CODE_LENGTH) {
    return `Code exceeds maximum length of ${MAX_CODE_LENGTH} characters.`;
  }
  return null;
}

export function validateChatInput(body: Record<string, unknown>): string | null {
  const message = typeof body.message === "string" ? body.message : "";
  const code = typeof body.code === "string" ? body.code : "";

  if (!message.trim()) {
    return "No query message passed.";
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters.`;
  }
  if (code.length > MAX_CODE_LENGTH) {
    return `Code exceeds maximum length of ${MAX_CODE_LENGTH} characters.`;
  }
  return null;
}
