import crypto from "crypto";
import fs from "fs";
import path from "path";
import type { Request, Response, NextFunction } from "express";
import { SESSION_SECRET } from "./security";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
export const AUTH_COOKIE = "codesyllabus_session";

export interface UserStats {
  level: number;
  xp: number;
  maxXp: number;
  gold: number;
  completedFloors: Record<string, number>;
}

export interface StoredUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  stats: UserStats;
  createdAt: string;
}

interface UserStore {
  users: Record<string, StoredUser>;
}

const DEFAULT_STATS: UserStats = {
  level: 1,
  xp: 0,
  maxXp: 150,
  gold: 150,
  completedFloors: {
    python: 0,
    javascript: 0,
    html: 0,
    sql: 0,
    rust: 0,
    go: 0,
    c: 0,
    csharp: 0,
    kotlin: 0,
    bash: 0,
  },
};

function ensureDataDir() {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadStore(): UserStore {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    return { users: {} };
  }
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8")) as UserStore;
  } catch {
    return { users: {} };
  }
}

function saveStore(store: UserStore) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(store, null, 2), "utf8");
}

function hashPassword(password: string, salt?: string) {
  const passwordSalt = salt || crypto.randomBytes(16).toString("hex");
  const passwordHash = crypto.scryptSync(password, passwordSalt, 64).toString("hex");
  return { passwordHash, passwordSalt };
}

function verifyPassword(password: string, passwordHash: string, passwordSalt: string): boolean {
  const derived = crypto.scryptSync(password, passwordSalt, 64).toString("hex");
  const a = Buffer.from(passwordHash, "hex");
  const b = Buffer.from(derived, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function createSessionToken(userId: string): string {
  const payload = { sub: userId, exp: Date.now() + SESSION_MAX_AGE_MS };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

function parseSessionToken(token: string): { sub: string } | null {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;

  const data = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");

  try {
    if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as { sub: string; exp: number };
    if (!payload.sub || payload.exp < Date.now()) return null;
    return { sub: payload.sub };
  } catch {
    return null;
  }
}

function findUserByUsername(store: UserStore, username: string): StoredUser | null {
  const key = username.toLowerCase();
  return Object.values(store.users).find((u) => u.username.toLowerCase() === key) || null;
}

function setAuthCookie(res: Response, token: string) {
  const secure = process.env.NODE_ENV === "production";
  const parts = [
    `${AUTH_COOKIE}=${token}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Strict",
    `Max-Age=${Math.floor(SESSION_MAX_AGE_MS / 1000)}`,
  ];
  if (secure) parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}

export function clearAuthCookie(res: Response) {
  const secure = process.env.NODE_ENV === "production";
  const parts = [`${AUTH_COOKIE}=`, "HttpOnly", "Path=/", "SameSite=Strict", "Max-Age=0"];
  if (secure) parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}

function parseCookies(req: Request): Record<string, string> {
  const header = req.headers.cookie || "";
  return header.split(";").reduce<Record<string, string>>((acc, part) => {
    const [k, ...v] = part.trim().split("=");
    if (k) acc[k] = decodeURIComponent(v.join("="));
    return acc;
  }, {});
}

export function getSessionUser(req: Request): StoredUser | null {
  const token = parseCookies(req)[AUTH_COOKIE];
  if (!token) return null;

  const session = parseSessionToken(token);
  if (!session) return null;

  const store = loadStore();
  return store.users[session.sub] || null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }
  (req as Request & { user: StoredUser }).user = user;
  next();
}

export function registerUser(username: string, email: string, password: string, stats?: UserStats) {
  const store = loadStore();
  if (findUserByUsername(store, username)) {
    throw new Error("Username is already registered.");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email address.");
  }

  const { passwordHash, passwordSalt } = hashPassword(password);
  const id = crypto.randomUUID();
  const user: StoredUser = {
    id,
    username: username.trim(),
    email: email.trim(),
    passwordHash,
    passwordSalt,
    stats: stats || DEFAULT_STATS,
    createdAt: new Date().toISOString(),
  };

  store.users[id] = user;
  saveStore(store);
  return user;
}

export function loginUser(username: string, password: string) {
  const store = loadStore();
  const user = findUserByUsername(store, username);
  if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
    throw new Error("Invalid username or password.");
  }
  return user;
}

export function issueSession(res: Response, user: StoredUser) {
  const token = createSessionToken(user.id);
  setAuthCookie(res, token);
  return token;
}

export function updateUserStats(userId: string, stats: UserStats) {
  const store = loadStore();
  const user = store.users[userId];
  if (!user) throw new Error("User not found.");
  user.stats = stats;
  saveStore(store);
  return user;
}

export function publicUser(user: StoredUser) {
  return {
    username: user.username,
    email: user.email,
    stats: user.stats,
  };
}

export { DEFAULT_STATS };
