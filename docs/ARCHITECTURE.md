# Architecture

The application is one Next.js App Router deployment. Client pages call relative `/api/*` Route Handlers; handlers perform authentication, Zod validation, authorization, business logic, and Mongoose persistence. There is no separate backend.

```mermaid
flowchart LR
  UI[Responsive React UI] --> API[Next.js Route Handlers]
  API --> AUTH[NextAuth JWT authorization]
  API --> DB[(MongoDB collections)]
  API --> FS[(MongoDB GridFS)]
  API --> EXT[Optional Gemini and Pusher]
```

The central trust boundary is the schema. `Complaint`, `LedgerEntry`, and `SosAlert` cannot store student/session references. An authenticated ID is used transiently to create a daily complaint HMAC in `SubmissionLimit`; it has no complaint ID and expires. Evidence is re-encoded before GridFS storage.

Mongoose connections are cached. Indexes cover unique IDs, statuses, lookup hashes, and TTL limits. Binary processing uses the Node runtime. Seating reserves invalid seats, honors fixed/accessibility placement, then sorts by height. Curriculum becomes overlapping chunks; retrieval returns exact stored source text and rejects weak matches.
