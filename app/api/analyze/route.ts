// app/api/analyze/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// ClauseWatch — Gemini AI Integration Layer (hardened)
// ─────────────────────────────────────────────────────────────────────────────

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// ─── Model configuration ──────────────────────────────────────────────────────
//
// VALID AI STUDIO MODEL NAMES (as of 2025):
//   gemini-2.0-flash          ← recommended: fastest, free tier, JSON mode ✅
//   gemini-1.5-flash          ← stable fallback, proven, JSON mode ✅
//   gemini-1.5-flash-8b       ← smallest/fastest, good for simple tasks
//   gemini-1.5-pro            ← highest quality, rate-limited on free tier
//
// INVALID / NON-EXISTENT:
//   gemini-3.1-flash-lite     ← does not exist — causes "fetch failed"
//   gemini-2.0-flash-lite     ← does not exist
//   gemini-pro                ← deprecated, removed from v1beta
//
// responseMimeType: "application/json" requires one of:
//   gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash
// ─────────────────────────────────────────────────────────────────────────────

const PREFERRED_MODEL  = "gemini-2.5-flash";
const FALLBACK_MODEL   = "gemini-2.5-flash-lite";

// Known-valid models that support generateContent and JSON mode.
// Deprecated model names are intentionally excluded so env values like
// gemini-1.5-flash fail validation before a request can 404.
const VALID_MODELS = new Set([
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
]);

type AnalysisResult = {
  clauses: unknown[];
  missingClauses?: unknown[];
  decision: {
    verdict?: unknown;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type GeminiCallResult = {
  analysis: AnalysisResult;
  modelUsed: string;
};

type GeminiError = Error & {
  status?: number;
};

type JsonParseDiagnostics = {
  message: string;
  position?: number;
  line?: number;
  column?: number;
  length: number;
  likelyTruncated: boolean;
  tail: string;
};

function toError(err: unknown): GeminiError {
  return err instanceof Error ? err : new Error(String(err));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitizeJsonText(text: string): string {
  const withoutFences = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  const firstBrace = withoutFences.indexOf("{");
  const lastBrace = withoutFences.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return withoutFences.slice(firstBrace, lastBrace + 1).trim();
  }

  return withoutFences;
}

function getJsonParseDiagnostics(err: unknown, json: string): JsonParseDiagnostics {
  const message = err instanceof Error ? err.message : String(err);
  const positionMatch = message.match(/position\s+(\d+)/i);
  const position = positionMatch ? Number(positionMatch[1]) : undefined;
  let line: number | undefined;
  let column: number | undefined;

  if (typeof position === "number" && Number.isFinite(position)) {
    const before = json.slice(0, position);
    const lines = before.split(/\r?\n/);
    line = lines.length;
    column = lines[lines.length - 1].length + 1;
  }

  return {
    message,
    position,
    line,
    column,
    length: json.length,
    likelyTruncated: !json.trimEnd().endsWith("}"),
    tail: json.slice(Math.max(0, json.length - 500)),
  };
}

function validateAnalysisShape(parsed: unknown): AnalysisResult {
  if (!isRecord(parsed) || !Array.isArray(parsed.clauses)) {
    throw new Error("Gemini response missing 'clauses' array");
  }
  if (!isRecord(parsed.decision)) {
    throw new Error("Gemini response missing 'decision' object");
  }

  return parsed as AnalysisResult;
}

function closePossiblyTruncatedJson(json: string): string {
  const stack: string[] = [];
  let inString = false;
  let escaped = false;

  for (const char of json) {
    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = inString;
      continue;
    }

    if (char === "\"") {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === "{") stack.push("}");
    if (char === "[") stack.push("]");
    if ((char === "}" || char === "]") && stack[stack.length - 1] === char) {
      stack.pop();
    }
  }

  return json.trimEnd() + (inString ? "\"" : "") + stack.reverse().join("");
}

function getJsonRepairCandidates(json: string): string[] {
  const candidates = new Set<string>();
  const withoutTrailingCommas = json.replace(/,\s*([}\]])/g, "$1");

  candidates.add(withoutTrailingCommas);
  candidates.add(closePossiblyTruncatedJson(withoutTrailingCommas));

  return [...candidates].filter(candidate => candidate !== json);
}

function parseAnalysisJson(json: string, label: string): AnalysisResult {
  try {
    return validateAnalysisShape(JSON.parse(json) as unknown);
  } catch (err: unknown) {
    const details = getJsonParseDiagnostics(err, json);

    for (const candidate of getJsonRepairCandidates(json)) {
      try {
        const repaired = validateAnalysisShape(JSON.parse(candidate) as unknown);
        console.warn(`[ClauseWatch] Local JSON repair succeeded (${label})`);
        return repaired;
      } catch {
        // Try the next conservative repair candidate.
      }
    }

    console.error(
      `[ClauseWatch] Malformed Gemini JSON (${label}): ${details.message}; ` +
      `length=${details.length}; position=${details.position ?? "n/a"}; ` +
      `line=${details.line ?? "n/a"}; column=${details.column ?? "n/a"}; ` +
      `likelyTruncated=${details.likelyTruncated}`
    );
    console.error(`[ClauseWatch] Malformed JSON tail (${label}): ${details.tail}`);
    throw new Error(
      `Malformed Gemini JSON: ${details.message}` +
      (details.line ? ` (line ${details.line} column ${details.column})` : "")
    );
  }
}

// Resolve and validate the model name at module load time (not per-request)
function resolveModel(): string {
  const envModel = process.env.GEMINI_MODEL?.trim();

  if (!envModel) {
    console.warn(
      `[ClauseWatch] GEMINI_MODEL not set in .env.local. Using default: ${PREFERRED_MODEL}`
    );
    return PREFERRED_MODEL;
  }

  if (!VALID_MODELS.has(envModel)) {
    console.error(
      `[ClauseWatch] GEMINI_MODEL="${envModel}" is not a recognised AI Studio model.\n` +
      `  Valid options: ${[...VALID_MODELS].join(", ")}\n` +
      `  Falling back to: ${FALLBACK_MODEL}`
    );
    return FALLBACK_MODEL;
  }

  console.log(`[ClauseWatch] Using Gemini model: ${envModel}`);
  return envModel;
}

// Validate the API key at module load time so failures are obvious at startup
function resolveApiKey(): string {
  const key = process.env.GEMINI_API_KEY?.trim();

  if (!key) {
    throw new Error(
      "[ClauseWatch] GEMINI_API_KEY is not set. " +
      "Get a free key at https://aistudio.google.com and add it to .env.local"
    );
  }

  if (!key.startsWith("AIza")) {
    console.warn(
      "[ClauseWatch] GEMINI_API_KEY does not look like a valid AI Studio key " +
      "(expected to start with 'AIza'). Check your .env.local file."
    );
  }

  return key;
}

// Module-level singletons — resolved once, reused across requests
const API_KEY     = resolveApiKey();
const MODEL_NAME  = resolveModel();
const genAI       = new GoogleGenerativeAI(API_KEY);

// ─── Gemini model factory ──────────────────────────────────────────────────────
function getModel(modelName: string) {
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature:      0.1,   // Low = consistent structured output; high = creative but unreliable JSON
      maxOutputTokens:  4096,
      responseMimeType: "application/json", // Forces valid JSON — supported on flash/pro models
    },
    // Relax safety filters for legal content analysis
    // (some contract clauses mention liability, indemnity, etc. which can trigger filters)
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    ],
  });
}

// ─── Contract analysis prompt ─────────────────────────────────────────────────
function buildPrompt(contractText: string): string {
  return `You are CLAUSEWATCH-AGENT, an enterprise AI legal review system. Analyze this contract with the precision of a senior partner at a top-tier law firm.

Return ONLY a valid JSON object. No markdown fences, no explanation, no text outside the JSON.

Identify at most 6 highest-risk clauses. Keep every string short so the JSON fits within the model output limit.

For each clause found, provide:
- id: "c1", "c2", etc.
- clauseType: one of: liability, termination, ip_ownership, payment, governing_law, dispute_resolution, indemnification, confidentiality, warranties, sla, data_privacy, force_majeure, assignment, amendment
- riskLevel: "high" | "medium" | "low"
- riskScore: integer 0-100
- confidenceScore: integer 0-100
- originalText: verbatim quote, max 60 words
- plainEnglish: 1 sentence max
- riskRationale: 1 sentence on specific legal exposure
- recommendation: 1 sentence, specific counter-position
- marketStandardText: 1 short balanced market-standard sentence
- leverageSeverity: "critical" | "high" | "medium"
- estimatedExposure: e.g. "$2.4M" or "Unlimited"
- pageEstimate: integer, 1-based
- benchmarkPercentile: 0-100, how much riskier vs market standard

Identify up to 2 MISSING standard enterprise clauses. For each:
- id: "m1", "m2", etc.
- clauseType: from list above
- description: why this clause is needed
- riskRationale: enterprise risk from its absence
- recommendation: what language to add
- estimatedExposure: financial risk if left missing

Produce an AGENT DECISION object:
- verdict: "APPROVE" | "REVIEW" | "RENEGOTIATE" | "REJECT"
- confidenceScore: 0-100
- reasoning: 1-2 sentences
- urgency: "IMMEDIATE" | "HIGH" | "STANDARD"
- primaryRisk: single biggest danger, 1 sentence
- estimatedTotalExposure: e.g. "$8.2M"
- contractHealthScore: 0-100
- negotiationPriority: "CRITICAL" | "HIGH" | "MEDIUM"
- policyViolations: array of strings
- executiveNarrative: exactly 2 sentences for a CEO, include dollar amounts
- escalationRequired: boolean
- procurementRisk: "BLOCKED" | "CONDITIONAL" | "CLEARED"

Required JSON shape:
{
  "clauses": [...],
  "missingClauses": [...],
  "decision": { "verdict": "...", "confidenceScore": 0, "reasoning": "...", "urgency": "...", "primaryRisk": "...", "estimatedTotalExposure": "...", "contractHealthScore": 0, "negotiationPriority": "...", "policyViolations": [], "executiveNarrative": "...", "escalationRequired": false, "procurementRisk": "..." },
  "agentSummary": "..."
}

CONTRACT TEXT:
${contractText.slice(0, 7000)}`;
}

// ─── Gemini call with retry + model fallback ──────────────────────────────────
async function callGemini(prompt: string): Promise<GeminiCallResult> {
  const modelsToTry = MODEL_NAME === FALLBACK_MODEL
    ? [FALLBACK_MODEL]                      // already on fallback, don't retry with preferred
    : [MODEL_NAME, FALLBACK_MODEL];         // try preferred first, then fallback

  let lastError: Error | null = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[ClauseWatch] Calling ${modelName} (attempt ${attempt})`);

        const model  = getModel(modelName);
        const result = await model.generateContent(prompt);
        const text   = result.response.text();

        if (!text?.trim()) {
          throw new Error("Gemini returned an empty response");
        }

        // Strip any accidental markdown fences even with JSON mode enabled
        const clean = sanitizeJsonText(text);

        const analysis = parseAnalysisJson(clean, `${modelName} attempt ${attempt}`);

        // Basic shape validation — catch malformed responses before they reach the frontend

        console.log(
          `[ClauseWatch] ✓ Analysis complete via ${modelName}: ` +
          `${analysis.clauses.length} clauses, verdict: ${analysis.decision.verdict}`
        );

        return { analysis, modelUsed: modelName };

      } catch (err: unknown) {
        const error = toError(err);
        lastError = error;
        const msg = error.message;

        // 429 = rate limit — wait before retry
        if (error.status === 429 || msg.includes("429") || msg.includes("quota")) {
          const waitMs = attempt === 1 ? 3000 : 8000;
          console.warn(`[ClauseWatch] Rate limit on ${modelName}. Waiting ${waitMs}ms…`);
          await new Promise(r => setTimeout(r, waitMs));
          continue; // retry same model
        }

        // 404 / fetch failed = wrong model name — skip to fallback immediately
        if (
          msg.includes("fetch failed") ||
          msg.includes("404") ||
          msg.includes("not found") ||
          msg.includes("invalid model")
        ) {
          console.error(`[ClauseWatch] Model "${modelName}" not found or unavailable. Trying fallback.`);
          break; // break inner retry loop, try next model
        }

        // JSON parse failure — retry once with same model
        if (msg.includes("JSON") || msg.includes("Unexpected token")) {
          if (attempt === 1) {
            console.warn(`[ClauseWatch] JSON parse failed on ${modelName}, retrying…`);
            continue;
          }
        }

        // Any other error — log and try fallback
        console.error(`[ClauseWatch] Error on ${modelName} attempt ${attempt}: ${msg}`);
        break;
      }
    }
  }

  // All models and retries exhausted
  throw new Error(
    lastError?.message?.includes("quota") || lastError?.message?.includes("429")
      ? "Gemini API rate limit reached. Please wait 60 seconds and try again."
      : lastError?.message?.includes("fetch failed")
        ? `Gemini model unavailable. Check GEMINI_MODEL in .env.local (current: "${MODEL_NAME}")`
        : `AI analysis failed: ${lastError?.message ?? "Unknown error"}`
  );
}

// ─── PDF text extraction ──────────────────────────────────────────────────────
async function extractPdfText(buffer: Buffer): Promise<string> {
  // @ts-ignore
  const pdfParse = (await import("pdf-parse-fork")).default;
  const data     = await pdfParse(buffer);
  const text     = data.text?.trim() ?? "";

  if (text.length < 100) {
    throw new Error(
      "Could not extract readable text from this PDF. " +
      "The file may be scanned or image-based. Please use a text-based PDF."
    );
  }

  return text;
}

// ─── Route handlers ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const contentType = req.headers.get("content-type") ?? "";
    let contractText  = "";
    let sourceLabel   = "";

    // ── Multipart: real PDF upload ───────────────────────────────────────────
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file     = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file provided in form data." }, { status: 400 });
      }
      if (file.type !== "application/pdf") {
        return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
      }
      if (file.size > 15 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large. Maximum size is 15MB." }, { status: 400 });
      }

      const buffer  = Buffer.from(await file.arrayBuffer());
      contractText  = await extractPdfText(buffer);
      sourceLabel   = `PDF: ${file.name} (${(file.size / 1024).toFixed(0)}KB)`;

    // ── JSON: demo text ──────────────────────────────────────────────────────
    } else if (contentType.includes("application/json")) {
      const body   = await req.json();
      contractText = (body.text ?? "").trim();
      sourceLabel  = "Demo text";

      if (!contractText) {
        return NextResponse.json({ error: "No contract text provided." }, { status: 400 });
      }
    } else {
      return NextResponse.json(
        { error: `Unsupported content type: ${contentType}` },
        { status: 415 }
      );
    }

    if (contractText.length < 100) {
      return NextResponse.json(
        { error: "Contract text is too short to analyze (minimum 100 characters)." },
        { status: 400 }
      );
    }

    console.log(`[ClauseWatch] Analyzing — ${sourceLabel} — ${contractText.length} chars`);

    // ── Run analysis ─────────────────────────────────────────────────────────
    const { analysis, modelUsed } = await callGemini(buildPrompt(contractText));

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[ClauseWatch] Done in ${duration}s via ${modelUsed}`);

    return NextResponse.json({
      success:   true,
      analysis,
      meta: {
        model:        modelUsed,
        charCount:    contractText.length,
        clauseCount:  analysis.clauses.length,
        missingCount: analysis.missingClauses?.length ?? 0,
        durationSec:  parseFloat(duration),
        timestamp:    new Date().toISOString(),
      },
    });

  } catch (err: unknown) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    const message  = err instanceof Error ? err.message : "Unexpected server error";

    console.error(`[ClauseWatch] Error after ${duration}s:`, message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ── Health check ──────────────────────────────────────────────────────────────
// GET /api/analyze → confirms route is live, key is configured, model is valid
export async function GET() {
  const keyConfigured  = !!process.env.GEMINI_API_KEY;
  const modelEnv       = process.env.GEMINI_MODEL ?? "(not set)";
  const modelResolved  = MODEL_NAME;
  const modelValid     = VALID_MODELS.has(modelResolved);

  return NextResponse.json({
    status:         "ClauseWatch API online",
    keyConfigured,
    modelEnv,
    modelResolved,
    modelValid,
    fallbackModel:  FALLBACK_MODEL,
    note: !keyConfigured
      ? "⚠ GEMINI_API_KEY not set — add it to .env.local"
      : !modelValid
        ? `⚠ Model "${modelEnv}" unrecognised — using fallback: ${FALLBACK_MODEL}`
        : `✓ Ready — using ${modelResolved}`,
  });
}
