import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

async function configure() {
const envPath = path.resolve(process.cwd(), ".env.local");
const source = await readFile(envPath, "utf8");
const entries = new Map<string, string>();

for (const line of source.split(/\r?\n/)) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (match) entries.set(match[1], match[2]);
}

if (!entries.get("MONGODB_URI")?.trim()) {
  throw new Error("MONGODB_URI is empty. Paste the Atlas URI before configuring the environment.");
}

entries.set("MONGODB_DB_NAME", entries.get("MONGODB_DB_NAME") || "anti_kuddus_protocol");
entries.set("NEXTAUTH_URL", entries.get("NEXTAUTH_URL") || "http://localhost:3000");
for (const key of ["AUTH_SECRET", "ROLL_LOOKUP_SECRET", "COMPLAINT_HMAC_SECRET", "VOTE_HMAC_SECRET"]) {
  if (!entries.get(key)?.trim()) entries.set(key, randomBytes(48).toString("base64url"));
}

const preferredOrder = [
  "MONGODB_URI",
  "MONGODB_DB_NAME",
  "AUTH_SECRET",
  "ROLL_LOOKUP_SECRET",
  "COMPLAINT_HMAC_SECRET",
  "VOTE_HMAC_SECRET",
  "NEXTAUTH_URL",
];
const remaining = [...entries.keys()].filter((key) => !preferredOrder.includes(key));
const output = [...preferredOrder, ...remaining]
  .filter((key) => entries.has(key))
  .map((key) => `${key}=${entries.get(key)}`)
  .join("\n");

await writeFile(envPath, `${output}\n`, { encoding: "utf8", mode: 0o600 });
console.log("Environment configured. Existing MongoDB URI preserved; required secrets generated locally.");
}

configure().catch((error) => {
  console.error(error instanceof Error ? error.message : "Environment configuration failed.");
  process.exit(1);
});
