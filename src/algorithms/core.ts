export type StrikeStatus = "safe" | "warning_one" | "final_warning" | "impeached";
export function strikeState(verifiedCount: number, threshold = 3) {
  const warnings = Math.min(verifiedCount, threshold);
  return { warnings, strikesLeft: Math.max(threshold - warnings, 0), status: (verifiedCount >= threshold ? "impeached" : verifiedCount === 2 ? "final_warning" : verifiedCount === 1 ? "warning_one" : "safe") as StrikeStatus };
}
export function cosineSimilarity(a: number[], b: number[]) {
  if (!a.length || a.length !== b.length) return 0;
  let dot = 0, aa = 0, bb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; aa += a[i] ** 2; bb += b[i] ** 2; }
  return aa && bb ? dot / (Math.sqrt(aa) * Math.sqrt(bb)) : 0;
}
export function chunkText(text: string, size = 1000, overlap = 150) {
  const clean = text.replace(/\s+/g, " ").trim(); const chunks: string[] = [];
  for (let start = 0; start < clean.length; start += size - overlap) { const value = clean.slice(start, start + size).trim(); if (value) chunks.push(value); if (start + size >= clean.length) break; }
  return chunks;
}
export type Student = { _id: string; name: string; heightCm: number; visionImpairment?: boolean; hearingImpairment?: boolean; fixedSeat?: { row: number; column: number }; isKuddus?: boolean };
export function generateSeats(students: Student[], rows: number, columns: number, aisleColumns: number[] = [], blocked: {row:number;column:number}[] = []) {
  const invalid = new Set([...blocked.map(s => `${s.row}:${s.column}`)]); aisleColumns.forEach(c => { for(let r=1;r<=rows;r++) invalid.add(`${r}:${c}`); });
  const seats = Array.from({ length: rows * columns }, (_, i) => ({ row: Math.floor(i / columns) + 1, column: i % columns + 1 })).filter(s => !invalid.has(`${s.row}:${s.column}`));
  const used = new Set<string>(); const result: Array<Student & {row:number;column:number}> = [];
  for (const student of students.filter(s => s.fixedSeat)) { const seat = student.fixedSeat!; if (!invalid.has(`${seat.row}:${seat.column}`)) { result.push({...student,...seat}); used.add(`${seat.row}:${seat.column}`); } }
  const remainingSeats = seats.filter(s => !used.has(`${s.row}:${s.column}`));
  const remaining = students.filter(s => !s.fixedSeat).sort((a,b) => Number(Boolean(b.visionImpairment || b.hearingImpairment)) - Number(Boolean(a.visionImpairment || a.hearingImpairment)) || a.heightCm - b.heightCm);
  remaining.forEach((student, i) => { if (remainingSeats[i]) result.push({ ...student, ...remainingSeats[i] }); });
  return result;
}
export function visibilityScore(assignments: Array<Student & {row:number;column:number}>) {
  const k = assignments.find(a => a.isKuddus); if (!k) return { visibilityStatus: "blocked", score: 0, explanation: ["Kuddus is not in the plan."] };
  const blockers = assignments.filter(a => a.row < k.row && Math.abs(a.column - k.column) <= 0.5 && a.heightCm > k.heightCm + 5);
  return blockers.length ? { visibilityStatus: "partially_blocked", score: 55, explanation: [`${blockers.length} taller student(s) may obstruct the teacher's sightline.`] } : { visibilityStatus: "clear", score: 100, explanation: ["Teacher-to-Kuddus sightline is clear.", "Accessibility and height-order constraints were applied."] };
}
export function ledgerTotals(entries: Array<{type:string;amount?:number;quantity?:number; calories?:number}>) { return entries.reduce((a,e) => ({ cash: a.cash + (e.type !== "stolen_food" ? e.amount ?? 0 : 0), food: a.food + (e.type === "stolen_food" ? e.quantity ?? 0 : 0), calories: a.calories + (e.quantity ?? 0) * (e.calories ?? 0) }), { cash: 0, food: 0, calories: 0 }); }
