# Architecture

The application remains one Next.js App Router deployment. Route Handlers authenticate, validate with Zod, authorize roles, execute deterministic services, and persist through Mongoose. MongoDB is the only application database.

```mermaid
flowchart LR
  UI[Responsive React UI] --> API[Route Handlers]
  API --> AUTH[Auth.js JWT roles]
  API --> DB[(MongoDB and GridFS)]
  API --> TOOLS[Role-checked tool gateway]
  TOOLS --> SAFE[Sanitized context]
  SAFE --> GEMINI[Optional Gemini]
  GEMINI --> ZOD[Zod validation]
  ZOD --> UI
```

Gemini never receives a database connection or raw complaint/SOS evidence. Chat messages store grounded citations but not confidential source material.

```mermaid
flowchart TD
  Input[Text URL or cleaned image] --> Normalize
  Normalize --> Retrieve[Rules notices curriculum]
  Retrieve --> Compare[Date authority contradiction]
  Input --> Image[Sharp metadata strip SHA-256 perceptual hash]
  Image --> Compare
  Compare --> Result[Grounded non-absolute result]
```

TruthLens stores anonymous checks and safe technical indicators. Fingerprints support duplicate detection; binary uploads are not retained by this module.

```mermaid
flowchart LR
  C[Verified complaints] --> D[Deterministic analysis]
  S[Acknowledged/resolved SOS] --> D
  L[Anonymous ledger] --> D
  R[TruthLens aggregates] --> D
  D --> Score[Transparent risk score]
  D --> Hotspot
  D --> Trend
  D --> Correlation
  D --> Explain[Optional sanitized explanation]
```

Rejected complaints are excluded and pending complaints do not affect the score. No service changes a role, deletes an account, or punishes a person.

```mermaid
sequenceDiagram
  participant Student
  participant Server
  participant Votes as AnonymousVote
  Student->>Server: authenticated vote
  Server->>Server: validate eligibility and poll window
  Server->>Server: HMAC(userId + pollId)
  Server->>Votes: pollId + token + choice
  Votes-->>Server: unique compound index enforces one vote
  Server-->>Student: identity-separated receipt
```

Cross-module flow: report → verify → correlate → detect patterns → explain → vote/respond → track action → prevent repetition. Recurring issues may suggest a proposal, but only a teacher can approve/open a vote. Three verified strikes only establish impeachment eligibility; an authorized teacher must open the vote.
