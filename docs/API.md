# API

JSON responses are `{ success: true, data, message? }` or `{ success: false, error: { code, message, fieldErrors? } }`. Protected routes require a NextAuth session.

- Auth/health: `GET|POST /api/auth/[...nextauth]`, `GET /api/health`.
- Complaints: `POST /api/complaints`, `GET /api/complaints/public-stats`, `GET /api/teacher/complaints`, `GET|PATCH /api/teacher/complaints/:id`, `GET /api/teacher/complaints/:id/evidence`.
- Seating: `GET|POST /api/students`, `PATCH|DELETE /api/students/:id`, `POST /api/seat-plans/generate`, `GET /api/seat-plans`.
- Documents/syllabus: `GET /api/documents`, `POST /api/documents/upload`, `POST /api/syllabus/analyze`, `POST /api/syllabus/study-plan`.
- Ledger: `GET|POST /api/ledger`, `GET /api/ledger/analytics`, `GET /api/food-items`, `GET|PATCH /api/teacher/ledger-settings`.
- SOS: `POST /api/sos`, `PATCH /api/sos/:publicId/cancel`, `GET /api/captain/sos`, `PATCH /api/captain/sos/:publicId/acknowledge`, `PATCH /api/captain/sos/:publicId/resolve`.
- Rules/audit: `GET /api/rules/search`, `POST /api/rules/fact-check`, `GET|POST /api/teacher/rules`, `PATCH|DELETE /api/teacher/rules/:id`, `GET /api/teacher/audit`.
