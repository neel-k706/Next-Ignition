# NextIgnition Backend Integration Roadmap

> **Scope**  
> - Current app = fully interactive frontend with mock data (`TEST_MODE` in `AuthContext`).  
> - Target = production-grade full‑stack experience powered by Supabase (or equivalent) with clear role entitlements, multi-account switching, premium gating, and email channel separation.

---

## 1. Architecture Context (from `/docs` + current code)

- **Clients**: Expo/React Native app (Android, iOS, Web). Navigation via Expo Router; UI components already mapped to role flows found in `/docs/00-12`.
- **Backend target**: Supabase (Postgres, Auth, Storage, Edge Functions) + Serverless utilities for heavy workloads (e.g., PDF conversions, AI summarizer).
- **Data domains**:
  1. **Identity & Profiles** (multi-role capability)
  2. **Content & Networking** (feed, chat, DMs, webinars, events)
  3. **Funding & Documents** (pitch decks, investor interactions)
  4. **Mentorship & Sessions**
  5. **Notifications & Emails**
  6. **Subscriptions & Entitlements**
  7. **Admin & Moderation**

---

## 2. Multi-Account Access Requirement

- **Behaviour**: One user can own up to **three role profiles (Founder, Investor, Expert)** simultaneously and switch instantly (IG-style).
- **Implications**:
  - `users` table stores primary identity (email/login).
  - `profiles` table becomes `user_profiles` keyed by `(user_id, role)` with max 3 entries.
  - Session payload must include `active_profile_id`; frontend switcher updates context + API auth header.
  - ACL/feature flags evaluated per profile, not per user.
  - Activity logs link to both `user_id` and `profile_id`.

---

## 3. Communication Channels (email policy)

| Email | Purpose | Behaviour |
|-------|---------|-----------|
| `support@nextignition.com` | Two-way human communication | Ticket replies, complaints, feedback. All outbound responses come from this inbox. |
| `connect@nextignition.com` | **No-reply** automated system messages | OTPs, login credentials, onboarding nudges, verification notices, account activity alerts. Ensure Reply-To is blank/blocked. |
| `spark@nextignition.com` | Marketing & lifecycle | Newsletters, feature launches, webinar invites, promotional offers. Segment by subscription tier. |

Technical to-dos:
1. Configure domain + SPF/DKIM for all three.
2. Template folders per channel (e.g., Postmark/Mailgun).  
3. Backend service chooses sender based on notification type.

---

## 4. Feature Tiers (from `Document.pdf` + `Document (1).pdf`)

| Tier | Highlights (non-exhaustive) |
|------|-----------------------------|
| **Free** | Registration/login, profile setup, social links, browse/post/comment/save content, basic connections, free webinars, 7-day recordings, AI auto-approval, welcome email. |
| **Pro** | Startup details submission, pitch deck/video upload, mentorship access, DM initiation, reviews/ratings, consultation booking, 1-month recordings, limited live chat, discovery visibility, proof badges. |
| **Elite** | Full live streaming, large live sessions, extended recordings, direct Digitas team, MVP support, priority tech support, profile summarizer, progress tracking, co-founder matching, MVP support tickets, field-specific investor connections. |

> **Current state**: UI shows plan badges + gates certain components, but backend does not enforce entitlements nor process payments. Payment integration is deferred (future Razorpay/Stripe). For now, we must store plan metadata + enforce feature visibility server-side.

---

## 5. Backend Integration Phases

### Phase 0 — Readiness & Tooling (Week 0)
1. **Environment**  
   - Provision Supabase project (Database, Auth, Storage).  
   - Enable RLS (Row Level Security) globally.  
   - Configure buckets: `avatars`, `pitch-decks`, `pitch-videos`, `documents`.
2. **Secrets & DevOps**  
   - Populate `.env` / Expo config for Supabase keys.  
   - Create migration pipeline (`supabase db push`) + CI smoke tests.  
   - Decide on hosting for serverless jobs (Supabase Functions, Cloudflare Workers, or AWS Lambda).

### Phase 1 — Authentication & Multi-Profile Identity (Week 1)
1. **Schema**  
   - `users` (mirrors Supabase auth)  
   - `user_profiles` (id, user_id FK, role enum, status, bio, subscription_tier, progress flags)  
   - `profile_switch_logs` (audit).  
2. **API/Services**  
   - Extend `AuthContext` to use real Supabase session, fallback to mock in dev.  
   - Endpoints: `POST /profiles/switch`, `GET /profiles`, `PATCH /profiles/:id`.  
   - Enforce cap of 3 profiles per user.  
3. **Frontend updates**  
   - Replace `testLogin()` with real login; store `active_profile_id` in context.  
   - Add account switcher UI hooking to new endpoint.

### Phase 2 — Core Domain Models (Week 2)
Tables/services to implement (with RLS):
1. **Networking & Feed**: `posts`, `comments`, `saves`, `connections`, `activity_feed`.
2. **Chat & Messaging**: `conversations`, `conversation_members`, `messages`, `message_reads`.  
   - Add web socket/Realtime channel for new messages (Supabase Realtime).
3. **Notifications**: `notifications`, `notification_preferences`, background worker pushing to Expo push + email (see section 3).
4. **Documents/Funding**: `startups`, `pitch_materials`, `investor_views`, `funding_requests`, `meeting_requests`.
5. **Mentorship & Sessions**: `experts`, `mentorship_requests`, `sessions`, `session_notes`.
6. **Events/Webinars**: `events`, `event_registrations`, `recordings`.

Deliverables: CRUD APIs (REST or RPC), server-side validation, file upload endpoints streaming to Supabase Storage.

### Phase 3 — Admin & Moderation (Week 3)
1. **Roles**: System roles (`admin`, `staff`).  
2. **Panels**: Endpoints powering `/app/(admin)` views: user list, approvals, flags, analytics snapshots.  
3. **Manual review queue**: `review_tasks` capturing pitch deck approvals, profile verifications, content flags.  
4. **Audit log**: `admin_actions` table for compliance.

### Phase 4 — Communication Infrastructure (Week 3-4 overlap)
1. **Notification router** chooses email channel:  
   - Support events → `support@` (two-way) via ticket system (e.g., Zendesk API).  
   - System events (OTP, login, verification) → `connect@` (no reply).  
   - Marketing cadence → `spark@`.  
2. **Template library**: store JSON/markdown definitions; include placeholders for user/profile-specific data.  
3. **Backend triggers** hooking to key events (registration, profile switch, funding status, mentorship decisions).  
4. **Logging**: store email delivery status (bounce, open) for compliance.

### Phase 5 — Subscription & Entitlements (Week 4)
1. **Schema**: `plans`, `plan_features`, `subscriptions`, `invoices` (placeholder), `trial_status`.  
2. **Feature flagging**: Build middleware that checks `profile.subscription_tier` → allowed capabilities.  
3. **UI gating**: Already present; connect to backend decisions.  
4. **Future payment hook**: keep `payment_reference` field ready (Razorpay/Stripe). For now, allow manual upgrades (admin toggles plan).  
5. **Tier enforcement** referencing Document PDFs:
   - Free: enforce access to free-only endpoints (limit pitch deck uploads, view-only).  
   - Pro: unlock pitch uploads, mentorship, limited streaming, 1‑month recording access.  
   - Elite: unlock advanced streaming, extended recordings, MVP ticketing, co-founder matching, summarizer.

### Phase 6 — Observability, QA, Deployment (Week 5)
1. **Testing**: Unit tests for utility functions, integration tests via Supabase local emulator, end-to-end flows (Detox/Playwright).  
2. **Monitoring**:  
   - Error tracking (Sentry).  
   - Performance metrics (Supabase logs, Vercel/Expo EAS metrics).  
3. **Deployment**:  
   - Stage environment mirroring prod.  
   - Automated database migrations via CI.  
   - Blue/green strategy for mobile builds via EAS.

---

## 6. Step-by-Step Backlog (Detailed)

1. **Foundational**
   - [ ] Create Supabase project & buckets; enable RLS.  
   - [ ] Configure CI pipeline (`lint`, `typecheck`, `supabase db lint`).  
   - [ ] Document env setup in `docs/16-deployment.md`.
2. **Auth & Profiles**
   - [ ] Implement `user_profiles` schema + active profile resolver.  
   - [ ] Replace `testLogin` with Supabase Auth.  
   - [ ] Build `/profiles/switch` endpoint + UI toggle.  
   - [ ] Add multi-profile analytics (counts, last switch).
3. **Core APIs**
   - [ ] Funding portal: upload endpoints writing to storage + metadata table.  
   - [ ] Mentorship: request lifecycle (create, accept/decline, session notes).  
   - [ ] Chat Realtime channel + message persistence.  
   - [ ] Discover/feed endpoints with pagination.
4. **Notifications & Emails**
   - [ ] Generic `notifications.create()` service.  
   - [ ] Email dispatcher with channels (support/connect/spark).  
   - [ ] Expo push integration for mobile.  
   - [ ] User preference management.
5. **Admin Tools**
   - [ ] Review queues for pitch decks, profiles, content.  
   - [ ] Role management + feature toggles.  
   - [ ] Audit logs.
6. **Subscriptions**
   - [ ] Plan metadata from PDF (Free/Pro/Elite).  
   - [ ] Entitlement middleware & server checks.  
   - [ ] Manual upgrade/downgrade workflow (admin).  
   - [ ] Payment service placeholder (capture intent, mark paid).  
   - [ ] Extend UI badges to use backend data.  
7. **QA + Launch**
   - [ ] Seed scripts to populate demo data.  
   - [ ] Load testing for chat/funding endpoints.  
   - [ ] Security review (RLS policies, rate limiting).  
   - [ ] Final checklist & go-live.

---

## 7. Sign-In & Account Management Notes

- **Current**: UI uses mock credentials; real login intentionally bypassed.  
- **Target**: Supabase email/password + optional magic link/OTP (sent via `connect@`).  
- **Multi-role**: After login, user selects or creates role profile; switching updates context + re-fetches data scoped to `profile_id`.  
- **Session Handling**:  
  - Access token stored by Supabase Auth helpers.  
  - `active_profile_id` persisted in AsyncStorage for quick rehydration.  
  - Device management & security screens already exist; connect to Supabase `auth.mfa` / `auth.admin.listFactors`.

---

## 8. Deliverables & Owners

| Phase | Owner | Outputs |
|-------|-------|---------|
| 0 | Platform/DevOps | Supabase project, CI, env docs |
| 1 | Identity squad | Auth integration, multi-profile API, UI switcher |
| 2 | Feature squads | Funding, Mentorship, Chat, Discover APIs |
| 3 | Admin squad | Review queue, admin APIs, audit logs |
| 4 | Notifications squad | Email/push pipeline, template library, channel enforcement |
| 5 | Monetization squad | Plan schema, entitlements, manual upgrade flow |
| 6 | QA/Release | Tests, monitoring, deployment checklist |

---

## 9. Reference Docs

- `/docs/00-16` – user flows, features, architecture.  
- `Document.pdf`, `Document (1).pdf` – tier matrices and premium feature scope.  
- `ARCHITECTURE_ANALYSIS.md` – previous deep dive summary.  
- `IMPLEMENTATION_STATUS.md` – current completion tracker.

---

### Final Notes

- Keep backend **feature-flag friendly** so future integrations (AI summarizer, document automation, Razorpay/Stripe) drop in without schema rewrites.
- All communications must respect the three dedicated inbox roles.
- Premium UI states already exist; backend now needs to authoritatively gate every API/Realtime channel based on subscription tier + profile role.


