# Anti-Kuddus Protocol

A full-stack Next.js command center for Class 7B. Six missions share one authentication system, responsive UI, and MongoDB database: anonymous complaints, visibility-aware seating, grounded syllabus negotiation, an anonymous corruption ledger, identity-free SOS alerts, and official-rule fact checking.

## Feature matrix

| Mission | Student experience | Oversight experience | Persistence |
|---|---|---|---|
| Whistleblower | Anonymous report, cleaned evidence, public receipt | Teacher verify/reject queue, safe audit | MongoDB + GridFS |
| Seating | Generate and save a fair classroom grid | Seeded profiles and visibility score | MongoDB |
| Syllabus | Source-grounded topic filter and study timeline | PDF/TXT source processing | GridFS + chunks |
| Ledger | Anonymous cash/food form and charts | Configurable conversion estimates | MongoDB aggregation |
| SOS | Location-only idempotent flare | Polling queue, acknowledge, resolve | MongoDB |
| Fact checker | Grounded verdict with exact rule | Official rule management | MongoDB |

## Stack

Next.js App Router, React, TypeScript, NextAuth credentials/JWT sessions, MongoDB/Mongoose, GridFS, Sharp, Zod, Recharts, Lucide, Vitest, and Playwright. Route Handlers under `src/app/api` are the only backend. See [Architecture](docs/ARCHITECTURE.md), [API](docs/API.md), and [demo script](docs/DEMO_SCRIPT.md).

## Local setup

1. Install Node.js 20+ and MongoDB 7+, or create a MongoDB Atlas cluster.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Fill the required values below.
5. Run `npm run verify:env`, `npm run seed`, then `npm run dev`.
6. Open `http://localhost:3000`.

For Atlas, create a database user, allow your IP, and paste the Node connection string into `MONGODB_URI`. GridFS uses the same database. Gemini and Pusher are optional: when configured, embeddings/grounded generation and live SOS events use them; otherwise local semantic retrieval and polling keep the application usable.

### Required environment values

```env
NEXT_PUBLIC_APP_NAME=Anti-Kuddus Protocol
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_SECRET=<random string, 32+ chars>
MONGODB_URI=<MongoDB connection string>
MONGODB_DB_NAME=anti_kuddus_protocol
ROLL_LOOKUP_SECRET=<random string, 32+ chars>
COMPLAINT_HMAC_SECRET=<different random string, 32+ chars>
```

Optional: `GEMINI_API_KEY`, Gemini model names, all Pusher values from `.env.example`, `MAX_UPLOAD_MB`, and `ENABLE_DEMO_AI_FALLBACK`. Generate secrets with `openssl rand -base64 48` or a trusted password manager. Never reuse HMAC secrets.

## Commands

```bash
npm install
npm run verify:env
npm run seed
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm start
```

`npm run reset:demo` clears transactional demo collections; seed afterward.

## Demo accounts

| Role | Roll | Code |
|---|---:|---|
| Student | 07 or 12 | `student123` |
| Captain Biltu | 02 | `captain123` |
| Captain Miltu | 03 | `captain123` |
| Teacher Rashid Sir | T01 | `teacher123` |
| Admin | A01 | `admin123` |

These are demo credentials. Change every code before real deployment.

## Security and anonymity

- Roll numbers become keyed HMAC lookup hashes; class codes are bcrypt hashes.
- Complaint, ledger, and SOS schemas deliberately contain no submitter identity. Complaint limits use a separate TTL collection with no complaint reference.
- Evidence is decoded, rotated, resized, and JPEG re-encoded by Sharp. Original EXIF and filename are discarded; only teachers can fetch it.
- Protected handlers enforce server-side roles and Zod validation. Safe audit events contain no student identity.
- Secure headers are global and JWT cookies are HTTP-only.

This is practical cryptographic pseudonymization and identity separation, not a formal zero-knowledge proof.

## Testing, trade-offs, and limits

Unit tests cover strike logic, schema anonymity, seating, similarity, chunking, ledger totals, and sightlines. E2E tests need a running seeded test database. Use a distinct test database name.

Known limits: scanned PDFs need OCR, and local semantic vectors are the fallback when Gemini is not configured. Pusher publication/subscription is implemented but uses the documented polling fallback until credentials are supplied. Offline SOS uses a deduplicated IndexedDB queue with automatic online synchronization. Non-AI modules remain usable without vendors.

## Vercel deployment

1. Push to a private Git repository and import into Vercel.
2. Add required production/preview environment values; use Atlas, not localhost.
3. Add optional Gemini/Pusher values if enabled.
4. Deploy. GridFS/Sharp handlers explicitly use Node.js runtime.
5. Run `npm run seed` once from a secure workstation and rotate demo codes.
6. Verify `/api/health`, login, evidence upload, captain response, and warnings.

Screenshot placeholders: landing, dashboard, complaint receipt, third strike, seating grid, syllabus timeline, ledger chart, SOS queue, and fact-check verdict. Follow `docs/DEMO_SCRIPT.md` for a Loom recording.
