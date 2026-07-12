# API

Responses are `{ success: true, data }` or `{ success: false, error: { code, message } }`. All protected routes use the Auth.js session and server-side role checks.

Existing endpoints remain unchanged for auth/health, complaints, evidence, seating, students, documents, syllabus, ledger, food, SOS, rules, audit, and system/users.

## ClassGuard

- `GET|POST /api/chat/sessions`
- `GET|DELETE /api/chat/sessions/:id`
- `POST /api/chat/sessions/:id/messages`

## TruthLens

- `POST /api/truthlens/check`, `POST /api/truthlens/check-image`, `GET /api/truthlens/:publicId`
- `GET /api/teacher/truthlens`, `GET /api/teacher/truthlens/analytics`
- `GET|POST /api/teacher/notices`, `PATCH|DELETE /api/teacher/notices/:id`

## Behaviour intelligence (teacher/admin)

- `GET /api/teacher/behaviour-analysis`
- `GET /api/teacher/behaviour-analysis/timeline`
- `GET /api/teacher/behaviour-analysis/heatmap`
- `GET /api/teacher/behaviour-analysis/correlations`
- `GET /api/teacher/behaviour-analysis/sequences`
- `POST /api/teacher/behaviour-analysis/generate-summary`

## Democracy

- `GET|POST /api/democracy/proposals`, `GET /api/democracy/proposals/:id`, `POST .../:id/vote`, `GET .../:id/results`
- `GET /api/democracy/polls`, `GET /api/democracy/polls/:id`, `POST .../:id/vote`, `GET .../:id/results`
- `GET /api/democracy/elections`, `GET /api/democracy/elections/:id`
- `GET /api/democracy/actions`, `GET /api/democracy/actions/:id`
- `GET /api/teacher/democracy/proposals`, `PATCH /api/teacher/democracy/proposals/:id`
- `POST /api/teacher/democracy/polls`, `POST /api/teacher/democracy/impeachment/open`
- `POST /api/teacher/democracy/elections`, `POST /api/teacher/democracy/elections/:id/candidates`
- `PATCH /api/teacher/democracy/actions/:id`

## Competition demo

- `POST /api/admin/demo` with `{ action: "start" | "reset" }` (admin only). Reset is scoped to labelled demo records.
