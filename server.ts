import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { spawn } from "child_process";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  registerUser,
  loginUser,
  issueSession,
  clearAuthCookie,
  getSessionUser,
  requireAuth,
  publicUser,
  updateUserStats,
  DEFAULT_STATS,
} from "./server/auth";
import {
  rateLimit,
  securityHeaders,
  sanitizeErrorMessage,
  signProgressPayload,
  verifyProgressToken,
  validateGradeInput,
  validateChatInput,
} from "./server/security";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || (process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1");

app.set("trust proxy", 1);
app.use(securityHeaders);
app.use(express.json({ limit: "32kb" }));

// --- Auth routes ---
app.post("/api/auth/register", rateLimit(5, 15 * 60 * 1000), (req, res) => {
  try {
    const username = typeof req.body.username === "string" ? req.body.username.trim() : "";
    const email = typeof req.body.email === "string" ? req.body.email.trim() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";
    const stats = req.body.stats && typeof req.body.stats === "object" ? req.body.stats : DEFAULT_STATS;

    if (!username || !email || !password) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    const user = registerUser(username, email, password, stats);
    issueSession(res, user);
    res.json({ user: publicUser(user) });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Registration failed." });
  }
});

app.post("/api/auth/login", rateLimit(10, 15 * 60 * 1000), (req, res) => {
  try {
    const username = typeof req.body.username === "string" ? req.body.username.trim() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required." });
      return;
    }

    const user = loginUser(username, password);
    issueSession(res, user);
    res.json({ user: publicUser(user) });
  } catch (err) {
    res.status(401).json({ error: err instanceof Error ? err.message : "Login failed." });
  }
});

app.post("/api/auth/logout", (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

app.get("/api/auth/me", (req, res) => {
  const user = getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }
  res.json({ user: publicUser(user) });
});

app.put("/api/auth/stats", requireAuth, (req, res) => {
  try {
    const user = (req as express.Request & { user: { id: string } }).user;
    const stats = req.body.stats;
    if (!stats || typeof stats !== "object") {
      res.status(400).json({ error: "Invalid stats payload." });
      return;
    }
    const updated = updateUserStats(user.id, stats);
    res.json({ user: publicUser(updated) });
  } catch (err) {
    res.status(500).json({ error: sanitizeErrorMessage(err) });
  }
});

// --- Signed progress tokens ---
app.post("/api/progress/export", requireAuth, (req, res) => {
  const user = (req as express.Request & { user: { stats: object } }).user;
  const token = signProgressPayload(user.stats);
  res.json({ token });
});

app.post("/api/progress/import", requireAuth, (req, res) => {
  const token = typeof req.body.token === "string" ? req.body.token.trim() : "";
  if (!token) {
    res.status(400).json({ error: "Token is empty." });
    return;
  }

  const parsed = verifyProgressToken(token);
  if (!parsed || typeof parsed !== "object" || !("completedFloors" in parsed)) {
    res.status(400).json({ error: "Invalid or tampered progress token." });
    return;
  }

  res.json({ stats: parsed });
});

app.post("/api/progress/sign", rateLimit(10, 60 * 1000), (req, res) => {
  const stats = req.body.stats;
  if (!stats || typeof stats !== "object" || !stats.completedFloors) {
    res.status(400).json({ error: "Invalid stats payload." });
    return;
  }
  res.json({ token: signProgressPayload(stats) });
});

app.post("/api/progress/verify", rateLimit(10, 60 * 1000), (req, res) => {
  const token = typeof req.body.token === "string" ? req.body.token.trim() : "";
  if (!token) {
    res.status(400).json({ error: "Token is empty." });
    return;
  }
  const parsed = verifyProgressToken(token);
  if (!parsed) {
    res.status(400).json({ error: "Invalid or tampered progress token." });
    return;
  }
  res.json({ stats: parsed });
});

// --- AI Coach ---
app.post("/api/chat", rateLimit(20, 60 * 1000), async (req, res) => {
  try {
    const validationError = validateChatInput(req.body);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    const { message, language, floor, code } = req.body;

    if (!ai) {
      res.json({
        response:
          "⚠️ [AI Agent Offline] GEMINI_API_KEY is not configured. This is " +
          String(language || "general").toUpperCase() +
          " Floor " +
          String(floor || 1) +
          ". Try matching your code to the lesson requirements and click BUILD.",
      });
      return;
    }

    const systemInstruction = `You are "SkyLine Coach Mentor", an expert computer science teacher guiding a building apprentice inside CodeSyllabus. 
Develop extreme visual, physical analogies of code:
- Variables = labeled cardboard boxes holding single contents
- Functions = soda vending machines (input goes in, cold can drops out)
- HTML Tags = physical construction billboards, doors, or document compartments
- SQL Relational DB = tidy office filing cabinet folders indexed by track ID numbers

Speak with friendly, encouraging, professional architecture tones. Translate dry tech terms into physical metaphors. Give clean, highly scannable bullet hints instead of spoiling complete solutions instantly. Keep layout text beautifully spaced.`;

    const promptText = `
Student District: ${language || "General"}
Active Building Level: Floor ${floor || 1}
Apprentice's Draft Code:
\`\`\`${language || "code"}
${code || "No draft code yet"}
\`\`\`

Apprentice Query: "${message}"

Please tutor me on this active lesson. Guide me visually with CodeSyllabus building blocks!`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptText,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.8,
        },
      });
    } catch (eFirst: unknown) {
      const msg = eFirst instanceof Error ? eFirst.message : "unknown";
      console.warn("Primary gemini-2.5-flash failed. Trying fallback...", msg);
      try {
        response = await ai.models.generateContent({
          model: "gemini-2.5-pro",
          contents: promptText,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          },
        });
      } catch {
        const lowerQ = String(message).toLowerCase();
        let fallbackMessage =
          `🔧 **[SkyLine Coach - Offline Backup]**\nLocalized advice for **${String(language || "general").toUpperCase()} Floor ${floor || 1}**.\n\n`;

        if (lowerQ.includes("analogy") || lowerQ.includes("metaphor") || lowerQ.includes("explain")) {
          fallbackMessage +=
            "💡 Think of variables as labeled boxes and functions as vending machines. Match the lesson requirements exactly.";
        } else if (lowerQ.includes("check") || lowerQ.includes("error") || lowerQ.includes("bug")) {
          fallbackMessage += `🚨 Review your draft:\n\`\`\`\n${code || ""}\n\`\`\``;
        } else {
          fallbackMessage += "👷 Check syntax, quotes, and indentation, then click BUILD FLOOR SECTOR.";
        }

        res.json({ response: fallbackMessage });
        return;
      }
    }

    res.json({ response: response.text || "Try compiling your solution!" });
  } catch (error) {
    console.error("Gemini server error:", error);
    res.status(500).json({ error: sanitizeErrorMessage(error) });
  }
});

// --- Grading ---
function runPythonGrader(payload: string): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const tryCmd = (cmd: string) => {
      const py = spawn(cmd, [path.join(process.cwd(), "grade.py")], {
        stdio: ["pipe", "pipe", "pipe"],
        windowsHide: true,
      });
      let stdout = "";
      let stderr = "";

      py.stdin.write(payload);
      py.stdin.end();

      py.stdout.on("data", (data) => {
        stdout += data.toString();
      });
      py.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      py.on("close", (code) => {
        if (code === 0) {
          try {
            resolve(JSON.parse(stdout));
          } catch {
            reject(new Error("Failed to parse grader output."));
          }
        } else {
          reject(new Error(stderr || `Grader exited with code ${code}`));
        }
      });
      py.on("error", reject);
    };

    tryCmd("python3");
  });
}

function tsFallbackGrade(code: string, expected: string) {
  const normUser = (code || "")
    .trim()
    .replace(/\s+/g, "")
    .toLowerCase()
    .replace(/'/g, '"')
    .replace(/;/g, "");
  let passed = false;
  let details = "";
  let suggestion = "";

  if (!expected || expected.trim() === "") {
    passed = normUser.length > 0;
    if (!passed) {
      details = "Your workspace appears empty.";
      suggestion = "Provide a valid solution to complete this lesson.";
    }
  } else if (expected.includes("&&")) {
    const parts = expected
      .split("&&")
      .map((p) => p.trim().replace(/\s+/g, "").toLowerCase().replace(/'/g, '"').replace(/;/g, ""));
    passed = parts.every((part) => normUser.includes(part));
    if (!passed) {
      const rawParts = expected.split("&&").map((p) => p.trim());
      const missing = rawParts.filter((_, i) => !normUser.includes(parts[i]));
      details = `Your code is missing required elements: ${missing.join(", ")}.`;
      suggestion = `Make sure to include: ${missing[0]}`;
    }
  } else if (expected.includes("||")) {
    const parts = expected
      .split("||")
      .map((p) => p.trim().replace(/\s+/g, "").toLowerCase().replace(/'/g, '"').replace(/;/g, ""));
    passed = parts.some((part) => normUser.includes(part));
    if (!passed) {
      details = `Your code did not match the expected pattern: ${expected}`;
      suggestion = "Ensure you are using the correct syntax from the lesson.";
    }
  } else {
    const normTarget = expected.trim().replace(/\s+/g, "").toLowerCase().replace(/'/g, '"').replace(/;/g, "");
    passed = normUser.includes(normTarget);
    if (!passed) {
      details = `Required structure not found. Expected: ${expected}`;
      suggestion = `Verify you included: ${expected}`;
    }
  }

  const lineCount = (code || "").split("\n").length;
  return {
    success: passed,
    executionOutput: passed
      ? `[Pattern Check] Verified successfully (${lineCount} lines). Live execution skipped — sign in for full sandbox.`
      : "[Pattern Check] Code did not match required structures.",
    metrics: {
      linesOfCode: lineCount,
      characterCount: (code || "").length,
      commentCount: 0,
      complexityRating: lineCount > 5 ? "Medium" : "Low",
    },
    feedback: {
      validationDetails: passed ? "Pattern match passed." : details || "Syntax validation mismatch.",
      debuggerGuidance: passed ? "Structure looks correct." : suggestion,
    },
  };
}

app.post("/api/grade", rateLimit(30, 60 * 1000), async (req, res) => {
  const validationError = validateGradeInput(req.body);
  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  const { language, code, expected, floor } = req.body;
  const isAuthenticated = !!getSessionUser(req);
  const allowExecution = isAuthenticated;

  const payload = JSON.stringify({
    language: language || "python",
    code: code || "",
    expected: expected || "",
    floor_level: floor || 1,
    allow_execution: allowExecution,
  });

  try {
    let result: Record<string, unknown>;
    try {
      result = await runPythonGrader(payload);
    } catch {
      try {
        result = await new Promise((resolve, reject) => {
          const py = spawn("python", [path.join(process.cwd(), "grade.py")], {
            stdio: ["pipe", "pipe", "pipe"],
            windowsHide: true,
          });
          let stdout = "";
          let stderr = "";
          py.stdin.write(payload);
          py.stdin.end();
          py.stdout.on("data", (d) => (stdout += d.toString()));
          py.stderr.on("data", (d) => (stderr += d.toString()));
          py.on("close", (code) => {
            if (code === 0) {
              try {
                resolve(JSON.parse(stdout));
              } catch {
                reject(new Error("parse error"));
              }
            } else {
              reject(new Error(stderr));
            }
          });
          py.on("error", reject);
        });
      } catch {
        result = tsFallbackGrade(code || "", expected || "");
      }
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: sanitizeErrorMessage(err) });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`CodeSyllabus server running at http://${HOST}:${PORT}`);
  });
}

startServer();
