import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";

export function deterministicEmbedding(text: string, dimensions = 96) {
  const vector = Array.from({ length: dimensions }, () => 0);
  const tokens = text.normalize("NFKC").toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  for (const token of tokens) {
    let hash = 2166136261;
    for (const char of token) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
    vector[Math.abs(hash) % dimensions] += 1;
  }
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  return magnitude ? vector.map((value) => value / magnitude) : vector;
}

export async function embedText(text: string) {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return { values: deterministicEmbedding(text), provider: "local" as const };
  const client = new GoogleGenerativeAI(key);
  const model = client.getGenerativeModel({ model: process.env.GEMINI_EMBEDDING_MODEL || "text-embedding-004" });
  const result = await model.embedContent(text);
  return { values: result.embedding.values, provider: "gemini" as const };
}
