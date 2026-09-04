# Displyfy MVP

Displyfy is a production-oriented creator advertising marketplace built with Next.js, React, TypeScript, Tailwind CSS, and Supabase. It runs without secrets in an honest local demo mode and is structured so production providers can be enabled through environment configuration.

## Local setup

Prerequisites: Node.js `24.20.0` and npm `10.9.2`.

```bash
nvm use
npm install
npm run dev
```

Open `http://localhost:3000`. Do not add an `.env` file for demo mode. Seeded creator, brand, mission, submission, payout, and audit data are loaded from `lib/demo-data.ts`.

Required verification commands:

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

After linking a disposable staging project and creating `.env.local`, run `npm run test:staging-security`. It creates temporary synthetic rows, exercises live RLS/RPC controls, and removes those rows before exiting.

Playwright browsers may be installed once with `npx playwright install chromium`.

## Environment configuration

Copy `.env.example` to `.env.local` only when configuring real services. `DISPLYFY_PROVIDER_MODE=production` activates server-side providers. Production mode must not be enabled until every required credential has been supplied and tested.

For an authenticated Supabase CLI session, create a local staging configuration without printing credentials:

```bash
npm run configure:staging -- <supabase-project-ref>
```

| Variable | Visibility | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Browser-safe | Canonical application URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser-safe | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser-safe | Supabase publishable key protected by RLS |
| `SUPABASE_SECRET_KEY` | Server only | Trusted administrative operations |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Server only | Transactional email |
| `TWILIO_*` | Server only | SMS and phone verification |
| `META_*` | Server only | Future official Instagram Graph API integration |
| `INVITATION_TOKEN_PEPPER` | Server only | Brand invitation token hashing |

Never expose service-role, Twilio, Resend, Meta, or invitation secrets with a `NEXT_PUBLIC_` prefix.

## Database and seed

Install the Supabase CLI, then run:

```bash
supabase start
supabase db reset
```

The initial PostgreSQL 17 schema is in `supabase/migrations/20260904100000_initial_schema.sql`. It creates all normalized MVP tables, constraints, dashboard indexes, deny-by-default RLS, and `reserve_mission_slot`, a row-locking transaction that prevents capacity and budget overbooking. `supabase/seed.sql` contains development organization and mission data and refuses to run when the database identifies itself as production unless an explicit production-seed override is set.

## Architecture

Authentication uses Supabase Auth. Creator email/password and brand magic-link flows use persistent server-readable sessions. Administrator TOTP enrollment and challenge are built into `/admin/mfa`, while authorization independently requires AAL2 in middleware, API routes, and the privileged database function. Application roles live in the protected `profiles.role` column; authorization never trusts editable authentication metadata, client IDs, hidden inputs, or URLs.

RLS isolates creators by `creator_id` and brands by organization membership. Restricted mission details require a non-revoked creator permission with administrator approval. Admin-only internal notes are stored in separate review tables. Service-role access is server-only.

Open missions accept eligible approved creators. Restricted missions additionally require an individual permission. Submission authorization checks creator status, live mission status, deadline, capacity, eligibility, terms version, permission, duplicate URL, and available maximum payout budget. Database constraints and the reservation function repeat the critical protections under concurrency.

Provider interfaces live in `lib/providers.ts`. Demo adapters set `simulated: true` and never claim external delivery, upload, payment, or Meta verification. Notifications are persisted before delivery in production, use idempotency keys, preserve failure categories, and retry with bounded exponential delay. Approval is not rolled back when delivery fails.

Every consequential production state change should write `status_history` and `audit_events` in the same database transaction. Payouts remain manual: an admin verifies eligibility, creates or updates `payout_records`, enters the external transaction reference, and marks the submission paid. No real-money transfer SDK is used.

## Authorization matrix

| Record | Public | Creator | Brand member | Admin |
| --- | --- | --- | --- | --- |
| Public mission summary | Read | Read | Read | Full |
| Restricted mission details | None | Permitted creator only | Owning organization | Full |
| Creator profile/application | None | Own | None | Full |
| Submission/performance | None | Own | Owning mission | Full |
| Brand organization/mission | None | Eligible visibility only | Own organization | Full |
| Internal risk/review notes | None | None | None | Full |
| Payout record | None | Own | Aggregate reporting only | Full |

## Meta, email, and SMS

The MVP uses manual Instagram verification. It does not scrape Instagram or call unofficial APIs. Future Graph API support belongs behind `InstagramVerificationProvider` and must record `meta_api` only after a successful official response. Manual data is labeled `manual_admin_review`, `creator_supplied`, or `brand_supplied`.

Resend and Twilio adapters are present but inactive without secrets. Configure a verified Resend sender, Twilio Messaging Service, and Twilio Verify Service before switching provider mode. A queued notification is not displayed as delivered.

## Deployment readiness

The project is Vercel-compatible but this repository has not been hosted. Before production deployment:

1. Provision Supabase and apply migrations.
2. Configure email confirmation, phone OTP, brand magic links, admin MFA, secure redirect allowlists, and short admin sessions.
3. Add secrets in the hosting platform, never in source control.
4. Create private storage buckets and enforce signed URL policies plus MIME inspection and malware scanning.
5. Exercise authenticated creator, brand, and MFA administrator workflows against staging data and verify audit events.
6. Run the full verification suite against a staging Supabase project.
7. Review the policy text with qualified legal counsel for launch markets.

## Version compatibility note

The requested TypeScript `7.0.2` is explicitly rejected at runtime by the current `typescript-eslint` packages pulled by `eslint-config-next`; their supported TypeScript API range ends before 7. The project therefore pins the nearest supported release, TypeScript `6.0.3`. The React ESLint plugin bundled by the pinned Next config supports ESLint through 9, so ESLint `9.39.5` replaces the requested incompatible `10.9.1`. Vitest `5.0.0` also declares Vite as a peer rather than a bundled dependency, so Vite `8.2.2` is pinned directly. Revisit the requested major versions once the dependent tooling supports them.

## Known MVP limitations

- Demo submissions validate but intentionally do not persist between refreshes.
- Real authentication, contact verification, notifications, uploads, and persistence require environment values and a migrated Supabase project.
- Instagram metrics and placement compliance are manually reviewed.
- Payments are a ledger workflow only; no funds move through Displyfy.
- The included policy pages are product-ready drafts, not jurisdiction-specific legal advice.
