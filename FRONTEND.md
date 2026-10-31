# Frontend Documentation

## Overview
A modern, portfolio-grade React + Vite + Tailwind CSS frontend built for Aman Ahmed's **Journal App** Spring Boot REST API. Designed with a SaaS aesthetic, featuring glassmorphism, responsive mobile-first layouts, dark/light themes, instant 1-click recruiter demo generation, and defensive handling of backend contracts.

---

## Architecture & Integration
- **Framework**: React 18 with Vite and Tailwind CSS.
- **Iconography & Motion**: Lucide React and Framer Motion.
- **Routing**: Client-side hash routing (`/#/dashboard`, `/#/`, `/#/login`, `/#/signup`, `/#/entry/:id`, `/#/settings`), requiring zero server-side forwarding rules or controller modifications.
- **Single Deployment**: The production build outputs directly into `src/main/resources/static/`. Spring Boot serves the frontend and REST API from the exact same origin (no CORS configuration needed, single Render/cloud URL for your resume).
- **Additive Security**: `StaticResourceSecurityConfig.java` defines an `@Order(1)` filter chain matching static assets (`/`, `/index.html`, `/assets/**`, etc.) and Swagger endpoints, ensuring static files are publicly accessible without JWT tokens while keeping all API routes protected.
- **Additive Jackson Handling**: `JacksonConfig.java` registers a `ToStringSerializer` for `org.bson.types.ObjectId` in Jackson 3, ensuring MongoDB IDs serialize as 24-character hexadecimal strings instead of composite timestamp objects.

---

## Quick Start & Commands

### 1. Development Mode (with API Proxy)
The Vite dev server proxies API calls directly to the local Spring Boot backend.
```bash
cd frontend
npm install
npm run dev
```
By default, the Vite proxy forwards `/public`, `/user`, `/Journal`, and `/health-check` to `http://localhost:8081` (the port configured for the `dev` profile in `application-dev.yml`). If you run Spring Boot on port 8080 (e.g. `prod` profile), you can override the target:
```bash
# Optional: override backend port for Vite proxy
VITE_BACKEND_URL=http://localhost:8080 npm run dev
```

### 2. Production Build
Builds the optimized React bundle and writes it straight to `src/main/resources/static/`:
```bash
cd frontend
npm run build
```

### 3. Running Spring Boot
Once built, you only need to run Spring Boot:
```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```
Visit `http://localhost:8081` (or `http://localhost:8080`) in your browser to view the application.

---

## Future Integration Flags (Google OAuth2 & Swagger)

Both feature flags are managed in `frontend/src/config.js`:

```javascript
// frontend/src/config.js

export const CONFIG = {
  // Flag 1: Google OAuth2 Login
  GOOGLE_LOGIN_ENABLED: false,

  // Flag 2: Swagger / OpenAPI Docs
  SWAGGER_ENABLED: false,
  SWAGGER_URL: '/swagger-ui/index.html',
  
  // Developer profile metadata
  DEVELOPER: {
    name: 'Aman Ahmed',
    role: 'Java Backend Engineer',
    github: 'https://github.com/amanahmed',
    linkedin: 'https://linkedin.com/in/amanahmed',
    portfolio: 'https://amanahmed.dev',
  },
};
```

### How to Enable Google OAuth2 Later:
1. Set `GOOGLE_LOGIN_ENABLED: true` in `frontend/src/config.js`.
2. When enabled, a "Continue with Google" button appears on both Login and Signup screens.
3. The button redirects to Spring Security's OAuth2 authorization endpoint:
   ```javascript
   window.location.href = '/oauth2/authorization/google';
   ```
4. Once your backend processes Google authentication, have Spring Security redirect back to the frontend with the JWT:
   ```
   /#/oauth2/redirect?token=<jwt_token>
   ```
   The frontend router automatically extracts the token, stores it in `sessionStorage` via `api/auth.js`, and navigates the user to `/#/dashboard`.

### How to Enable Swagger / OpenAPI Documentation:
1. Set `SWAGGER_ENABLED: true` in `frontend/src/config.js`.
2. An "API Docs" link will immediately appear in the navbar and footer.
3. Clicking the link opens `/swagger-ui/index.html` in a new tab. `StaticResourceSecurityConfig.java` is already pre-configured to allow unauthenticated access to `/swagger-ui/**` and `/v3/api-docs/**`.

---

## Discovered Backend API Contract

| HTTP Method | Route | Access | Request Body | Response (Success) | Response (Error/Empty) | Notes |
|:---|:---|:---|:---|:---|:---|:---|
| `GET` | `/public/health-check` | Public | None | `200 "ok"` (String) | `500` if down | Used for cold-start wake-up detector |
| `POST` | `/public/signup` | Public | `User` `{ username, password, email, sentimentAnalysis }` | `200 OK` (empty) | `400/500` error string | Hashes password with BCrypt |
| `POST` | `/public/login` | Public | `User` `{ username, password }` | `200 OK` (Raw token string) | `401 "Invalid username or password"` | 5-minute (300s) token expiration |
| `GET` | `/user` | Authenticated | None (`Bearer <token>`) | `200 OK` (Greeting + weather string) | `401/403` unauthenticated | Integrates with OpenWeather API & Redis |
| `PUT` | `/user` | Authenticated | `User` `{ username, password }` | `204 NO_CONTENT` | `401/403` unauthenticated | Re-authenticates to refresh JWT subject |
| `DELETE` | `/user` | Authenticated | None (`Bearer <token>`) | `204 NO_CONTENT` | `401/403` unauthenticated | Deletes user from MongoDB |
| `GET` | `/Journal` | Authenticated | None (`Bearer <token>`) | `200 OK` (List of entries) | `404 NOT_FOUND` if empty | Frontend normalizes 404 to empty list `[]` |
| `POST` | `/Journal` | Authenticated | `JournalEntry` `{ title, content, sentiment }` | `201 CREATED` (Created entry) | `400 BAD_REQUEST` | Sets timestamp & persists to Mongo |
| `GET` | `/Journal/id/{id}` | Authenticated | None (`Bearer <token>`) | `200 OK` (Entry object) | `404 NOT_FOUND` | Path includes `/id/{id}` |
| `PUT` | `/Journal/id/{id}` | Authenticated | `JournalEntry` `{ title, content, sentiment }` | `200 OK` (Updated entry) | `404/500` | Requires non-null strings to avoid NPE |
| `DELETE` | `/Journal/id/{id}` | Authenticated | None (`Bearer <token>`) | `204 NO_CONTENT` | `404/500` | Removes entry reference and document |
