# SSR (Server-Side Rendering)

## Index

- [Overview](#overview)
- [Production traffic](#production-traffic)
- [Request flow](#request-flow)
- [Key files](#key-files)
- [Render modes](#render-modes)
- [Configuration](#configuration)
- [SEO-related app behavior](#seo-related-app-behavior)
- [Local development](#local-development)
- [Adding or changing SSR routes](#adding-or-changing-ssr-routes)
- [Related docs](#related-docs)

---

## Overview

OSF uses Angular SSR so search-engine crawlers receive fully rendered HTML for public pages (projects, registrations, preprints, discover pages, and similar).

The SSR stack has two layers:

1. **Angular SSR** — renders the app on the server (`app.config.server.ts`, `app.routes.server.ts`).
2. **Express server** — serves static assets, delegates HTML to Angular, and sends render metrics after the response (`src/server.ts`, `src/server/*`).

In production, **only bot traffic** is routed to the SSR build. Human traffic uses the client-only build. See [Production traffic](#production-traffic).

---

## Production traffic

```
Crawler  → cloud (bot detection) → SSR Node server → HTML + metrics
Browser  → cloud                 → static/CSR build → SPA shell + client render
```

---

## Request flow

1. Request hits Express (`src/server.ts`).
2. Static files (`/assets`, hashed JS/CSS, etc.) are served from `browser/` when possible.
3. HTML navigations go through `createSsrMetricsMiddleware` (`src/server/ssr-metrics.middleware.ts`).
4. Angular SSR renders the page (`AngularNodeAppEngine.handle`).
5. HTML is sent to the client immediately.
6. In the background (`setImmediate`):
   - for bot + HTTP 200: HTML is inspected for completeness and `content_type`
   - a metric payload is POSTed to the OSF API

Bot timing is not blocked by steps 6. See [SSR metrics](./ssr-metrics.md).

---

## Key files

| File                                           | Role                                                   |
| ---------------------------------------------- | ------------------------------------------------------ |
| `src/server.ts`                                | Express entry, static files, wires metrics middleware  |
| `src/main.server.ts`                           | Angular server bootstrap                               |
| `src/app/app.config.server.ts`                 | Server providers: routes, config, i18n loader          |
| `src/app/app.routes.server.ts`                 | Per-route render mode (Server / Client / Prerender)    |
| `src/server/ssr-metrics.middleware.ts`         | Render timing, HTML inspection trigger, metric queue   |
| `src/server/ssr-html-metrics.ts`               | `is_complete` and `content_type` checks                |
| `src/server/ssr-metrics.ts`                    | POST metric payload to API                             |
| `src/server/ssr-server-config.ts`              | Load `config.json` + env for metrics                   |
| `src/server/static-cache-headers.ts`           | Cache headers for static assets                        |
| `src/app/shared/services/meta-tags.service.ts` | Dynamic SEO meta tags (`osf:type`, `osf-dynamic-meta`) |

---

## Render modes

Defined in `src/app/app.routes.server.ts`:

| Mode          | When to use                                                                          | Bot receives                                       |
| ------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------- |
| **Server**    | Public pages that should be indexed (project overview, preprint detail, discover, …) | Full SSR HTML                                      |
| **Client**    | Auth, forms, dashboards, moderation, editors                                         | CSR shell; metrics may report `is_complete: false` |
| **Prerender** | Static legal/help pages (`terms-of-use`, `privacy-policy`, …)                        | Pre-built HTML at build time                       |

**Rules of thumb**

- Public read-only detail or listing page → **Server**
- Login, submit, edit, settings, “my …” pages → **Client**
- Fixed copy that never changes at runtime → **Prerender**

More specific routes must appear **before** broader patterns (e.g. `preprints/:providerId/:id` before `preprints/:providerId`). Unmatched paths fall through to `**` → **Client**.

---

## Configuration

### `assets/config/config.json`

Copied from `assets/config/template.json` for local dev. Deployed with the build. Used for URLs and third-party keys.

Relevant to SSR / metrics:

| Field          | Used by                                                             |
| -------------- | ------------------------------------------------------------------- |
| `apiDomainUrl` | SSR API calls (via `OSFConfigService`) and metrics POST target host |
| `webUrl`       | Canonical URLs in meta tags; full URL in metric payloads            |

### Environment variables (SSR Node process)

| Variable         | Used by                                                                 |
| ---------------- | ----------------------------------------------------------------------- |
| `THROTTLE_TOKEN` | `X-Throttle-Token` on SSR API calls (auth interceptor) and metrics POST |
| `API_DOMAIN_URL` | Fallback if `apiDomainUrl` missing from `config.json`                   |
| `WEB_URL`        | Fallback if `webUrl` missing from `config.json`                         |
| `PORT`           | Express listen port (default `4000`)                                    |

**Throttle token:** SSR page-render API calls read `THROTTLE_TOKEN` from the process environment only (`app.config.server.ts`). It is not taken from `config.json` for auth. Metrics use the same env var via `loadSsrServerConfig`.

### Angular SSR config loading

On the server, `OSFConfigService` does not HTTP-fetch `config.json`. It uses `SSR_CONFIG`, populated at startup from disk in `app.config.server.ts`.

Translations on SSR are loaded from `browser/assets/i18n/en.json` (cached at module load). Browser builds use the HTTP loader as usual.

---

## SEO-related app behavior

### Meta tags

`MetaTagsService` writes dynamic tags with class `osf-dynamic-meta`. Pages also emit `osf:type` (API type: `nodes`, `registrations`, `preprints`, `files`, `users`). Metrics read `osf:type` from the rendered HTML for `content_type`.

Built in `MetaTagsBuilderService` for project, registration, preprint, and file pages. Profile pages call `updateMetaTags` with only `osfType: users` and `mergeDefaults: false`, so they emit a single `osf:type` tag.

---

## Local development

| Command                 | What it does                                  |
| ----------------------- | --------------------------------------------- |
| `npm start`             | CSR dev server (port 4200)                    |
| `npm run start:ssr`     | Dev server with SSR (`dev-ssr` configuration) |
| `npm run build:ssr`     | Production SSR build → `dist/osf/`            |
| `npm run serve:ssr:osf` | Run built Express server (port 4000)          |

Typical local SSR test:

```bash
npm run build:ssr
npm run serve:ssr:osf
```

Set `THROTTLE_TOKEN` in the shell if SSR API calls should bypass throttling locally.

Docker `start:docker` runs the **development** configuration (CSR), not the SSR server. Use `build:ssr` + `serve:ssr:osf` or the Dockerfile `ssr` stage for SSR.

---

## Adding or changing SSR routes

1. Add the route in `app.routes.ts` (browser routes).
2. Add a matching entry in `app.routes.server.ts` with the correct `RenderMode`.
3. If the page should contribute SEO meta, ensure the feature calls `MetaTagsService.updateMetaTags` and sets `osfType` where applicable.
4. For public indexable pages, prefer **Server**. Do not SSR authenticated workflows unless there is a specific SEO need.

---

## Related docs

- [SSR metrics](./ssr-metrics.md) — payload, `is_complete`, dashboards
- [Architecture](./arch.md) — folder layout
- [Docker](./docker.md) — container workflows
