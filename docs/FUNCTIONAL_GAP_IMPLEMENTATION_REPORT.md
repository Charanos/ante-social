# Functional Gap Implementation Report

Date: 2026-02-26

## Scope Completed

This implementation pass closed the remaining functional integration gaps across backend and frontend without changing the existing visual design system.

## Backend Changes

1. Auth service build fix
- Added typed timestamp fields to `User` schema so `createdAt`/`updatedAt` usage compiles cleanly.
- File: `backend/libs/database/src/schemas/user.schema.ts`

2. Wallet limits endpoint
- Added real daily limits endpoint:
  - `GET /wallet/limits`
- Response includes tier, date, min limits, max limits, used, and remaining values for deposit/withdrawal in USD/KSH.
- Files:
  - `backend/apps/wallet-service/src/wallet/wallet.service.ts`
  - `backend/apps/wallet-service/src/wallet/wallet.controller.ts`

3. Settings sessions endpoints
- Added authenticated session management endpoints:
  - `GET /auth/settings/sessions`
  - `DELETE /auth/settings/sessions/:sessionId`
- Current implementation maps to active refresh session model and supports revoking current session.
- Files:
  - `backend/apps/auth-service/src/auth/auth.controller.ts`
  - `backend/apps/auth-service/src/auth/auth.service.ts`

4. Admin analytics contract endpoints
- Added dedicated analytics endpoints:
  - `GET /admin/analytics/overview`
  - `GET /admin/analytics/revenue?from=...&to=...`
  - `GET /admin/analytics/users?from=...&to=...`
  - `GET /admin/analytics/markets?from=...&to=...`
- Implemented date-range metrics and aggregations for totals and trends/distributions.
- Files:
  - `backend/apps/admin-service/src/admin/admin.controller.ts`
  - `backend/apps/admin-service/src/analytics/analytics.service.ts`

## Frontend and BFF Integration Changes

1. New API proxy routes
- Added Next.js API proxy routes:
  - `src/app/api/wallet/limits/route.ts`
  - `src/app/api/settings/sessions/route.ts`
  - `src/app/api/settings/sessions/[id]/route.ts`
  - `src/app/api/admin/analytics/overview/route.ts`
  - `src/app/api/admin/analytics/revenue/route.ts`
  - `src/app/api/admin/analytics/users/route.ts`
  - `src/app/api/admin/analytics/markets/route.ts`

2. Shared typed API methods
- Extended shared API surface:
  - `walletApi.getLimits()`
  - `settingsApi.getSessions()`
  - `settingsApi.revokeSession()`
  - `adminApi.getAnalyticsOverview()`
  - `adminApi.getAnalyticsRevenue()`
  - `adminApi.getAnalyticsUsers()`
  - `adminApi.getAnalyticsMarkets()`
- Added associated response types.
- File: `src/lib/api/index.ts`

3. Wallet checkout now uses backend limits
- Replaced pure tier heuristic for operational limits with backend-driven limits plus fallback.
- UI/UX preserved, only data source changed.
- File: `src/app/dashboard/wallet/checkout/CheckoutContent.tsx`

4. Settings security now uses real sessions
- Added active sessions list with refresh and revoke actions.
- Added revoke flow with sign-out when current session is revoked.
- Preserved existing styling and interaction patterns.
- File: `src/app/dashboard/settings/page.tsx`

5. Admin market oversight actions
- Added close and settle controls on admin market detail page with live refresh and error handling.
- Added settle action on admin markets list for closed markets.
- Files:
  - `src/app/dashboard/admin/markets/[id]/page.tsx`
  - `src/app/dashboard/admin/markets/page.tsx`

6. Admin analytics dashboard wiring
- Switched analytics page to use dedicated backend analytics endpoints with date-range params.
- Export CSV now uses real analytics payloads.
- File: `src/app/dashboard/admin/analytics/page.tsx`

7. My forecasts edit flow enabled
- Replaced “Update unavailable” behavior with real update flow:
  - Loads market outcomes
  - Validates 5-minute edit window
  - Submits PATCH update
  - Updates UI on success
- Enforced same 5-minute window for showing cancel action in ticket view.
- File: `src/app/dashboard/markets/my-forecasts/[positionId]/page.tsx`

## Verification Results

1. Frontend TypeScript
- `npx tsc --noEmit` passed.

2. Frontend production build
- `npm run build` passed.

3. Backend build
- `npm run build` passed for all services.

4. Backend tests
- `npm run test` (backend) passed:
  - unit tests: pass
  - e2e tests: pass

5. Frontend lint status
- `npm run lint` reports existing repo-wide warnings and one existing lint error unrelated to this patch set (`react-hooks/set-state-in-effect` in pre-existing files).

## Notes

1. Session model
- Current session endpoints reflect current refresh-token architecture (single refresh session per user). Multi-device persistent session inventory would require a dedicated session collection and token/device tracking model.

2. Design preservation
- No intentional changes were made to the established glassmorphism UI language, component hierarchy, or motion behavior.
