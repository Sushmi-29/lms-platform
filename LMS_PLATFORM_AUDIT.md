# LMS Platform – Full Audit Report

## Executive Summary

This audit covers the frontend (Next.js 14, Tailwind, Zustand), backend (Node/Express, REST), and database (MySQL) of your Udemy-like LMS. The codebase has a solid base but several **critical** issues (wrong API usage, broken auth flow, schema drift) and many **medium/low** issues (stub components, duplicate code, missing features). Below are the findings, prioritized fixes, and a step-by-step implementation plan.

---

## 1. Frontend Issues

### 1.1 UI / Layout

| Issue | Location | Description |
|-------|----------|-------------|
| **Duplicate sidebar on course detail** | `app/subjects/[subjectId]/page.tsx` | Page renders its own empty left sidebar (`w-72 border-r`) while `layout.tsx` already provides the real sidebar. Result: two columns (one empty) + content. |
| **Subject detail sidebar empty** | `app/subjects/[subjectId]/page.tsx` | Left column is empty; section list is in the layout, not in this page. Either remove this page’s sidebar or consolidate with layout. |
| **Login/Register forms not wired** | `app/auth/login/page.tsx`, `app/auth/register/page.tsx` | Forms have no `onSubmit`, no state, no API calls, no `authStore` update. Buttons do nothing. |
| **Profile page is a stub** | `app/profile/page.tsx` | Only static text; no user data, no API, no auth check. |
| **Inconsistent styling** | Auth pages, Button, Alert | Login/Register use raw `border p-2`; Button is blue; rest of app uses purple. Inconsistent with Udemy-like design. |
| **Video page embed fragile** | `app/subjects/.../video/[videoId]/page.tsx` | Uses `video.youtube_url.replace("watch?v=", "embed/")` — breaks for `youtu.be/xyz` or other URL formats. |
| **Subject page embed fragile** | `app/subjects/[subjectId]/page.tsx` | `getEmbedUrl` uses `url.split("v=")[1]` — no validation; can throw or produce wrong embed. |

### 1.2 Duplicate / Unused Components

| Issue | Location | Description |
|-------|----------|-------------|
| **SubjectSidebar unused** | `components/Sidebar/SubjectSidebar.tsx` | Hardcoded “Subject 1”, “Subject 2”; never used. Layout builds its own sidebar. |
| **VideoPlayer stub** | `components/Video/VideoPlayer.tsx` | `<video>` with empty source; not used for YouTube. |
| **VideoMeta stub** | `components/Video/VideoMeta.tsx` | Placeholder “Video metadata” only. |
| **VideoProgressBar stub** | `components/Video/VideoProgressBar.tsx` | Static 50% bar; not wired to progress API. |
| **AuthGuard does nothing** | `components/Auth/AuthGuard.tsx` | No auth check, no redirect; commented “check auth”. |

### 1.3 Incorrect Layout / API Usage

| Issue | Location | Description |
|-------|----------|-------------|
| **Wrong sections API** | `app/subjects/[subjectId]/layout.tsx` | Calls `apiClient.get(\`/sections/${subjectId}\`)`. Backend has `GET /api/sections/:id` = get **one section by section id**, not sections by subject. Correct: `GET /api/subjects/:subjectId/sections`. |
| **Redundant subject fetch** | Layout + page | Layout fetches sections (with wrong URL); subject detail page fetches full subject again. Double fetch and wrong endpoint for sections. |

### 1.4 State & Re-renders

| Issue | Location | Description |
|-------|----------|-------------|
| **authStore never set** | AppShell, Login | AppShell shows “Profile” when `user` is set, but Login/Register never call API or `authStore.login(user)`. User is never persisted; Profile never shows after login. |
| **Search store on every page** | AppShell | Navbar subscribes to `useSearchStore()`; search only affects home. Minor: store updates cause navbar re-renders on all pages. |
| **localStorage in SSR** | `lib/apiClient.ts` | Interceptor uses `localStorage.getItem("accessToken")`. Fails during SSR (no `window`). Should guard with `typeof window !== 'undefined'` or use client-only API. |

### 1.5 Loading & Error States

| Issue | Location | Description |
|-------|----------|-------------|
| **Subject detail loading** | `app/subjects/[subjectId]/page.tsx` | Only “Loading...” text; no spinner/skeleton. |
| **Video page loading** | `app/subjects/.../video/[videoId]/page.tsx` | “Loading video...” only. |
| **No error UI** | Subject page, Video page, Landing | Errors only `console.error`; no user-facing error message or retry. |
| **Landing** | `app/page.tsx` | Has skeleton loading and empty state; good. |

### 1.6 Folder Structure

| Current | Recommendation |
|---------|----------------|
| `components/common/`, `Layout/`, `Auth/`, `Sidebar/`, `Video/` | OK. Consider `components/landing/` for hero/course list if they grow. |
| `app/subjects/[subjectId]/video/[videoId]/page.tsx` | Matches “course → video” flow. OK. |
| `lib/auth.ts` has empty `login`/`register` | Either implement here or remove; currently dead code. |
| `lib/config.ts` has `apiUrl`; apiClient uses `NEXT_PUBLIC_API_BASE_URL` | Two sources of “API URL”; consolidate to one (e.g. env only in apiClient). |

---

## 2. Backend Issues

### 2.1 API Routes

| Issue | Location | Description |
|-------|----------|-------------|
| **Videos: two routers** | `routes/videoRoutes.ts` vs `modules/videos/index.ts` | App uses `videoRoutes` (correct). `modules/videos` has GET/POST `/` stubs and is **not** mounted; dead code. |
| **Sections by subject** | `subjectRoutes.ts` | Correct: `GET /api/subjects/:subjectId/sections`. Frontend layout must use this, not `GET /api/sections/:id`. |
| **Progress routes stubs** | `modules/progress/index.ts` | GET and POST return placeholder JSON; no DB, no auth. |
| **Users routes stubs** | `modules/users/index.ts` | GET `/` and `/:id` are TODOs; no implementation. |
| **No enrollments API** | — | DB table `enrollments` mentioned by you; no routes, no controller, no service. |
| **No “my courses” / user subjects** | — | No endpoint to list courses enrolled by user. |

### 2.2 Error Handling

| Issue | Location | Description |
|-------|----------|-------------|
| **Generic 500** | `middleware/errorHandler.ts` | All errors become “Something went wrong!” and 500; no 4xx vs 5xx, no validation error formatting. |
| **Controllers swallow errors** | Various controllers | Many use `try/catch` and `res.status(500).json({ message: '...' })` without calling `next(err)`; errorHandler never sees them. |
| **No async error wrapper** | Routes | Unhandled rejections in async route handlers can crash the process; no `asyncHandler` or equivalent. |
| **getVideoByIdController** | `videoController.ts` | `rows[0]` can be undefined; no 404 check. |

### 2.3 Security (JWT & Auth)

| Issue | Location | Description |
|-------|----------|-------------|
| **Default JWT secret** | `config/env.ts` | `JWT_SECRET: process.env.JWT_SECRET || 'secret'`. If env not set, production is insecure. |
| **No token revocation** | Logout | Logout deletes refresh token in DB but access token remains valid until expiry (15m). Acceptable for short TTL but worth documenting. |
| **authMiddleware** | `authMiddleware.ts` | Puts full `decoded` (e.g. `{ userId, iat, exp }`) in `req.user`. Some code may expect `req.user.userId`. Inconsistent typing (`any`). |
| **No rate limiting** | app.ts | Login/register not rate-limited; vulnerable to brute force. |
| **CORS** | app.ts | `origin: "http://localhost:3001"` is correct for dev; ensure production uses real frontend origin. |
| **Password validation** | authController | No min length, complexity, or email format validation. |

### 2.4 Validation

| Issue | Description |
|-------|-------------|
| **No validation library** | No joi, zod, express-validator, or similar. All validation is manual `if (!x) return 400`. |
| **Subject create** | Only checks `title` and `order_index`; no sanitization, no max length. |
| **Auth** | No email format, no password strength. |
| **IDs** | Some use `parseInt(id, 10)` and `isNaN()`; good. Video controller uses `Number(req.params.videoId)` without NaN check. |

---

## 3. Database Issues

### 3.1 Schema vs Code

| Issue | Description |
|-------|-------------|
| **Migration missing columns** | `001_create_tables.sql` defines `subjects` with only `id, title, description, order_index`. Seed and `subjectService` use `thumbnail, rating, price, instructor, created_at`. Either migration is outdated or DB was altered manually — **schema drift**. |
| **enrollments table** | You listed `enrollments` in DB; it does **not** exist in `001_create_tables.sql`. If it exists in DB, add a migration; if not, create one for enrollment feature. |
| **created_at on subjects** | Service returns `created_at`; migration has no `created_at` on `subjects`. |

### 3.2 Relations & Foreign Keys

| Table | Current | Note |
|-------|---------|------|
| users | OK | — |
| subjects | OK | Add FKs if you add `instructor_id` later (e.g. to users). |
| sections | FK to subjects | OK. |
| videos | FK to sections | OK. |
| video_progress | FK user_id, video_id | OK. Unique (user_id, video_id) good. |
| refresh_tokens | FK user_id | OK. Consider index on (token) for logout/lookup. |
| enrollments | **Missing in migration** | Should be (user_id, subject_id) with FKs and unique constraint. |

### 3.3 Recommended Schema Additions

- **subjects**: add `thumbnail`, `rating`, `price`, `instructor`, `created_at` (or match seed) in a new migration.
- **enrollments**: `id`, `user_id`, `subject_id`, `enrolled_at`, UNIQUE(user_id, subject_id), FK user_id → users, FK subject_id → subjects.
- **refresh_tokens**: INDEX on `token` for faster lookup.
- **video_progress**: optional INDEX (user_id) for “all progress for user” queries.

---

## 4. API Integration Issues

### 4.1 Incorrect / Inconsistent Usage

| Issue | Frontend | Backend | Fix |
|-------|----------|---------|-----|
| **Sections by subject** | `GET /sections/:subjectId` | Sections by subject: `GET /subjects/:subjectId/sections` | Change layout to `GET /subjects/${subjectId}/sections`. |
| **Response shape** | Expects `res.data.data` | Most endpoints use `res.json({ data: ... })` | Consistent; keep and document. |
| **Auth response** | Not used | Returns `{ accessToken, refreshToken, user }` | Login/Register must call API and store tokens + set authStore. |
| **Progress** | `lib/progress.ts` is stub | Progress routes are stubs | Implement both sides. |

### 4.2 Base URL & CORS

- Frontend: `NEXT_PUBLIC_API_BASE_URL` (e.g. `http://localhost:3000/api`). Backend: port 3000, CORS origin 3001. So frontend likely runs on 3001; base URL 3000 is correct. Document this.
- apiClient uses `withCredentials: true`; backend must use credentials in CORS (you do). Good.

---

## 5. Feature Gaps (vs Udemy-like LMS)

| Feature | Status | Priority |
|---------|--------|----------|
| **User registration / login** | API done; frontend not wired | High |
| **Course enrollment** | No API, no DB in migration, no UI | High |
| **“My courses” page** | Missing | High |
| **Course detail with curriculum** | Partially done (layout sidebar + page); wrong API for sections | High |
| **Video watch page** | Exists; no progress save, fragile embed URL | High |
| **Course progress tracking** | Table exists; API stubs; frontend stub | High |
| **Search** | Client-side filter on landing; no backend search | Medium |
| **Profile** | Stub page; no GET /users/me or profile update | Medium |
| **Auth guard** | Component exists but does nothing | Medium |
| **Token refresh** | Backend has /auth/refresh; frontend doesn’t use it on 401 | Medium |
| **Wishlist / cart** | Not present | Low |
| **Reviews / ratings** | subjects.rating stored; no per-user reviews | Low |
| **Certificates** | Not present | Low |

---

## 6. Code Quality

### 6.1 Patterns & Duplication

- **Duplicate auth logic**: `utils/password.ts` (unused) vs `authService` (hash/verify). **Duplicate JWT**: `utils/jwt.ts` (unused) vs `authService` (tokens). Remove or consolidate.
- **subjectService.createSubject**: Inserts only `title, description, order_index`; return type and SELECT include thumbnail/rating/price/instructor — will be null if columns exist, or error if they don’t.
- **YouTube URL parsing**: Repeated and fragile in subject page and video page; extract one `getYouTubeEmbedUrl(url)` and handle `watch?v=`, `youtu.be/`, etc.
- **Type safety**: Many `any` (subject, video, sections, req.user). Add proper types/interfaces and use them in API responses and frontend.

### 6.2 Maintainability

- **No shared API types** between frontend and backend (e.g. Subject, User, Enrollment). Consider a shared package or at least copy interfaces.
- **Inconsistent controller style**: Some use `next(error)`, others `res.status(500).json(...)`.
- **Magic numbers**: e.g. 7 days refresh, 15m access; move to env or constants.

---

## 7. Performance

- **Landing**: Single fetch for all subjects; client-side filter. Fine for small lists; for large catalogs add backend search/pagination.
- **Subject layout**: Fetches sections then N requests for videos per section (one per section). Backend already has `GET /subjects/:id` with full sections + videos; layout could use that single response instead of 1 + N calls (after fixing endpoint).
- **No caching**: No React Query/SWR; every navigation refetches. Consider caching for subject/course data.
- **apiClient**: No retry or refresh-on-401; every 401 just logs and rejects.

---

## 8. List of All Problems (Summary)

1. **Frontend**: Wrong sections API in layout (`/sections/:subjectId` → `/subjects/:subjectId/sections`).  
2. **Frontend**: Login/Register not implemented (no API, no authStore).  
3. **Frontend**: authStore never set; Profile never shows as “logged in”.  
4. **Frontend**: Duplicate/empty sidebar on subject detail page.  
5. **Frontend**: SubjectSidebar, VideoPlayer, VideoMeta, VideoProgressBar, AuthGuard stubs or unused.  
6. **Frontend**: Fragile YouTube embed URL parsing in two places.  
7. **Frontend**: localStorage in apiClient without SSR guard.  
8. **Frontend**: No error UI or retry on subject/video fetch.  
9. **Backend**: Progress and users routes are stubs.  
10. **Backend**: modules/videos (stub router) dead code.  
11. **Backend**: Default JWT secret; no rate limiting; no request validation library.  
12. **Backend**: getVideoByIdController doesn’t return 404 when video missing.  
13. **Backend**: Error handler always 500; controllers don’t always use next(err).  
14. **Database**: Migration missing subjects columns (thumbnail, rating, price, instructor, created_at) and enrollments table.  
15. **Feature**: No enrollment API or “my courses”; no token refresh on frontend; profile not implemented.  

---

## 9. Prioritized Fixes

### High priority (blocking or security)

1. **Fix subject layout API**: Use `GET /subjects/:subjectId/sections` (or use full subject from `GET /subjects/:id` and stop separate section fetch).  
2. **Wire Login/Register**: Forms call POST /api/auth/login and /register, store tokens (e.g. localStorage or httpOnly cookie), set `authStore.login(user)`, redirect to home or profile.  
3. **Guard API client for SSR**: Only use localStorage when `typeof window !== 'undefined'`.  
4. **JWT secret**: Require `JWT_SECRET` in production (no default 'secret').  
5. **Database migration**: Add missing subject columns and create enrollments table; align code with schema.  
6. **Subject detail page**: Remove duplicate empty sidebar; rely on layout for curriculum.  
7. **Video 404**: In getVideoByIdController, if `rows[0]` is undefined, return 404.  

### Medium priority (UX and consistency)

8. **Implement progress API**: GET/POST /api/progress with auth, read/write video_progress; wire frontend progress bar and save on pause/seek.  
9. **Enrollment flow**: Backend enrollments CRUD + “my courses” endpoint; frontend “Enroll” on course detail and “My courses” page.  
10. **Profile**: GET /api/users/me (auth), frontend profile page shows and optionally updates name/email.  
11. **AuthGuard**: Check auth (token or authStore), redirect to /auth/login when unauthenticated on protected routes.  
12. **401 interceptor**: On 401, try refresh token; if success retry request; if fail redirect to login and clear authStore.  
13. **Centralize YouTube embed**: Single `getYouTubeEmbedUrl(url)` and use everywhere.  
14. **Error UI**: Subject and video pages show error state + retry instead of only console.  
15. **Remove dead code**: SubjectSidebar or use it; remove or use VideoPlayer/VideoMeta/VideoProgressBar; remove utils/password and utils/jwt or consolidate.  

### Low priority (polish and scale)

16. **Validation**: Add express-validator or zod for auth and subject/section/video bodies.  
17. **Rate limiting**: On /auth/login and /auth/register.  
18. **Search**: Backend GET /api/subjects?q= for search; optional pagination.  
19. **Loading**: Use Spinner component on subject and video pages.  
20. **Shared types**: Define Subject, User, etc. once and reuse in frontend/backend.  
21. **Consistent error handling**: Controllers use next(err); errorHandler distinguishes 4xx/5xx and validation errors.  

---

## 10. Recommended Architectural Improvements

- **Single source of course data on subject route**: Use one `GET /subjects/:id` (with sections + videos) for both the subject page and the layout sidebar; avoid layout calling a different or wrong endpoint.  
- **API layer**: Optional BFF or at least a small `api/` module on frontend (e.g. `api/auth.ts`, `api/subjects.ts`) that wraps apiClient and types responses.  
- **Auth**: After login, store tokens; use axios interceptor to attach access token and, on 401, call refresh then retry; on refresh failure, redirect to login and clear state.  
- **Protected routes**: Wrap dashboard, profile, my-courses, and video watch in AuthGuard (or middleware) that checks token/authStore and redirects.  
- **Backend**: Use asyncHandler(controller) so rejections are passed to errorHandler; validate input with a library; require JWT_SECRET in production.  
- **DB**: One migration per change; no manual ALTER without a migration file.  

---

## 11. Step-by-Step Implementation Plan

### Phase 1: Critical fixes (1–2 days)

1. **DB**: Create migration `002_subjects_enrollments.sql`: add to subjects (thumbnail, rating, price, instructor, created_at if missing); create enrollments (user_id, subject_id, enrolled_at, FKs, unique).  
2. **Backend**: Fix getVideoByIdController 404; require JWT_SECRET when NODE_ENV=production.  
3. **Frontend**: Fix layout to use `GET /subjects/${subjectId}/sections` (or use subject response from page and pass sections to layout via context/store). Prefer single fetch: layout or page fetches `GET /subjects/:id` once; use that for both sidebar and main content.  
4. **Frontend**: Remove duplicate sidebar from `app/subjects/[subjectId]/page.tsx`; keep one column (main content).  
5. **Frontend**: apiClient: only access localStorage inside `typeof window !== 'undefined'`.  
6. **Frontend**: Implement Login page: state (email, password), onSubmit → POST /api/auth/login, on success store accessToken/refreshToken (e.g. localStorage), authStore.login(user), redirect to `/`. Same for Register with POST /api/auth/register.  
7. **Frontend**: Logout: call POST /api/auth/logout with refreshToken, clear tokens and authStore, redirect to `/`.  

### Phase 2: Enrollment and “My courses” (1–2 days)

8. **Backend**: Enrollments service + controller: enroll(userId, subjectId), listByUser(userId), optional unenroll.  
9. **Backend**: Routes: POST /api/enrollments (body: subjectId, auth), GET /api/enrollments (auth) or GET /api/users/me/courses.  
10. **Frontend**: Course detail page: “Enroll” button when not enrolled; call enroll API then show “Go to course” or first video.  
11. **Frontend**: “My courses” page at `/my-courses`: fetch enrolled courses, list as cards linking to subject detail.  
12. **Frontend**: Protect /profile and /my-courses with AuthGuard (redirect to login if no token/user).  

### Phase 3: Progress and profile (1 day)

13. **Backend**: Implement progress: GET /api/progress (auth) or GET /api/progress/video/:videoId; POST/PATCH /api/progress (videoId, last_position_seconds, is_completed).  
14. **Frontend**: On video page, load progress; on pause/seek/complete, POST progress; optional progress bar showing completion.  
15. **Backend**: GET /api/users/me (auth) returning id, name, email.  
16. **Frontend**: Profile page: fetch /users/me, display; optional form to update name/email (if you add PATCH /users/me).  

### Phase 4: Robustness and UX (1 day)

17. **Frontend**: 401 interceptor: try refresh token, retry request; else clear tokens, authStore.logout(), redirect to login.  
18. **Frontend**: Centralize YouTube embed URL helper; use on subject and video pages.  
19. **Frontend**: Subject and video pages: error state + retry; use Spinner where appropriate.  
20. **Backend**: Add express-validator (or similar) for auth and key endpoints; return 400 with validation messages.  
21. **Backend**: Controllers use next(err); errorHandler returns appropriate status and message.  

### Phase 5: Cleanup and optional (ongoing)

22. Remove or implement SubjectSidebar, VideoPlayer, VideoMeta, VideoProgressBar.  
23. Remove utils/password.ts and utils/jwt.ts or merge into authService.  
24. Add rate limiting for auth routes.  
25. Optional: backend search GET /api/subjects?q=; frontend search bar can use it for server-side filter.  
26. Optional: Shared TypeScript types for API contracts.  

---

**End of audit.** Use the problem list and prioritized fixes as a backlog; follow the phases for a clear path to a minimal but complete Udemy-like LMS.
