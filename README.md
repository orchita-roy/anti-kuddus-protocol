# Anti-Kuddus Protocol

A privacy-first, AI-assisted school safety, accountability, and democratic governance platform. The original six missions remain intact; four competition modules connect reporting, verification, correlation, explanation, voting, and implementation tracking in the same Next.js/MongoDB application.

## Feature matrix

| Module | Student/captain experience | Teacher/admin experience | Privacy boundary |
|---|---|---|---|
| Six original missions | Complaints, seating, syllabus, ledger, SOS, fact-check | Review and configuration | Complaints, ledger, SOS contain no student identity |
| ClassGuard AI Copilot | Grounded rules, study, safety, TruthLens, democracy guidance | Sanitized complaint/SOS/pattern intelligence | Role-gated server tools; raw evidence and identities never reach prompts/history |
| ClassGuard TruthLens | Text, URL, message, and screenshot comparison | Official notices and anonymous rumor trends | Metadata-stripped images; fingerprints only; no checker identity |
| Authority Abuse Pattern Analyzer | — | Deterministic score, trend, hotspot, correlation, limitations | Aggregate observable incidents; no diagnosis, guilt, or punishment |
| Democracy or Nothing | Proposal, anonymous vote, election, action tracker | Moderation, poll creation, impeachment unlock, action verification | Poll-scoped HMAC voter token; no individual vote exposure |

## Setup

Requires Node.js 20+ and MongoDB 7+.

```bash
npm install
copy .env.example .env.local
npm run verify:env
npm run seed
npm run dev
```

Generate `AUTH_SECRET`, `ROLL_LOOKUP_SECRET`, `COMPLAINT_HMAC_SECRET`, and `VOTE_HMAC_SECRET` independently (32+ random characters each). Never reuse them. Gemini and Pusher are optional; deterministic retrieval/analytics and polling keep non-AI features available.

New server variables: `VOTE_HMAC_SECRET`, `TRUTHLENS_MAX_UPLOAD_MB`, `ENABLE_TRUTHLENS_WEB_SEARCH`, `ASSISTANT_MAX_CONTEXT_CHARS`, `ASSISTANT_MAX_MESSAGES_PER_HOUR`, and `BEHAVIOUR_ANALYSIS_LOOKBACK_DAYS`. No server secret is exposed to client components.

## Responsible AI and verification limits

ClassGuard uses only sanitized results from approved, role-checked tools. Gemini cannot query MongoDB. Structured responses are Zod-validated and ungrounded citations are rejected. Without adequate official context, the assistant returns `insufficient_context`; deterministic modules remain available if Gemini fails.

TruthLens is limited to school rumors, notices, exam/holiday/payment claims, forwarded messages, and screenshots compared with stored official sources. Its confidence is a heuristic evidence score, not a probability. Metadata removal, SHA-256, perceptual similarity, dimensions, and recompression indicators cannot prove authenticity; the UI never says “100% true/fake” or “definitely manipulated.” Web search is disabled by default.

The behaviour score is transparent: verified complaint frequency/severity 30%, acknowledged/resolved SOS 20%, ledger correlation 15%, repeated location 15%, stored rule matches 10%, and recent acceleration 10%. It is clamped to 0–100. Rejected complaints are excluded. The score is not a psychological assessment, proof of guilt, or automated punishment.

Anonymous voting uses `HMAC_SHA256(VOTE_HMAC_SECRET, userId + pollId)` and a unique `(pollId, anonymousVoterToken)` index. This is cryptographic pseudonymization and identity separation—not formal zero-knowledge voting. Abstentions count toward turnout but not approval; no result removes accounts or roles automatically.

## Commands and deployment

```bash
npm run seed
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm start
npm run reset:demo
```

For Vercel, configure all required secrets, use MongoDB Atlas, deploy, run the seed once from a secure workstation, rotate demo codes, and verify `/api/health`. GridFS and Sharp handlers use the Node runtime. `reset:demo` deletes only explicitly labelled competition demo records.

## Demo accounts

| Role | Roll | Code |
|---|---:|---|
| Student | 07 or 12 | `student123` |
| Captain | 02 or 03 | `captain123` |
| Teacher | T01 | `teacher123` |
| Admin | A01 | `admin123` |

Change all demo codes before a real deployment. See [architecture](docs/ARCHITECTURE.md), [API](docs/API.md), and [competition demo](docs/DEMO_SCRIPT.md).
