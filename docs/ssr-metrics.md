# SSR metrics

## Index

- [Overview](#overview)
- [What we track](#what-we-track)
- [When a metric is sent](#when-a-metric-is-sent)
- [When HTML is inspected](#when-html-is-inspected)
- [is_complete rules](#is_complete-rules)
- [content_type](#content_type)
- [Payload and API](#payload-and-api)
- [Related docs](#related-docs)

---

## Overview

After the SSR server sends HTML to a crawler, it POSTs a JSON:API metric to the OSF API. Collection runs in the background and does not delay the response.

Implementation: `src/server/ssr-metrics.middleware.ts`, `src/server/ssr-metrics.ts`, `src/server/ssr-html-metrics.ts`.

In production, the SSR Node process receives **bot traffic only**. Metrics are emitted for HTML navigations on that server.

---

## What we track

| Goal                | Field          | Notes                                                                                                                                 |
| ------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Render success rate | `status`       | Derive success as HTTP 2xx. Failures use `0` (no Angular response) or `500` (render exception).                                       |
| Render speed        | `ttfb`         | Milliseconds from request start until Angular returns a response. Server-side render time, not browser network TTFB.                  |
| Page completeness   | `is_complete`  | Checked from rendered HTML. See [is_complete rules](#is_complete-rules).                                                              |
| Content type        | `content_type` | API resource type from `osf:type` meta (`nodes`, `registrations`, `preprints`, `files`, `users`). Null when not set or not inspected. |
| Bot vs other        | `is_bot`       | From User-Agent regex in middleware.                                                                                                  |
| Crawler identity    | `user_agent`   | Truncated to 512 characters.                                                                                                          |
| Page                | `url`          | Full public URL (`webUrl` + path). **Query string is stripped** (no `view_only` or other params).                                     |

We do **not** track Search Console index status. “Pages by content type” in SSR means **successful bot responses grouped by `content_type`**, not confirmed Google indexing.

---

## When a metric is sent

Sent for **HTML navigations** handled by the metrics middleware.

**Skipped** (no metric):

- `/assets/*`, `/static/*`
- `/.well-known/*`
- Static file extensions (`.js`, `.css`, `.ico`, `.json`, images, fonts, …)

**Included**:

- Successful renders (any HTTP status Angular returns)
- Missing Angular response → `status: 0`
- Render exception → `status: 500`

---

## When HTML is inspected

HTML is read only when:

- User-Agent matches the bot regex (`SEARCH_BOT` in middleware)
- HTTP status is **200**

If not inspected, `is_complete` stays `false` and `content_type` stays `null` even when the page rendered successfully.

On a bot-only SSR host, every 200 could be inspected; today the code also requires a bot regex match.

Inspection runs **after** the response is sent. It clones the response body only when inspection will run.

---

## is_complete rules

Implemented in `inspectSsrHtml` (`src/server/ssr-html-metrics.ts`).

All must pass:

1. **SSR marker** — `<osf-root>` has `ng-server-context` (page was server-rendered, not a bare CSR shell).
2. **Non-empty root** — inner HTML of `<osf-root>` is not empty after whitespace is removed.
3. **Meta tags or allowlisted path** — either:
   - HTML contains `osf-dynamic-meta`, or
   - path is on the meta-optional allowlist (search, discover, terms, user, institutions, meetings, collections, provider landing pages, etc.)

---

## content_type

Read from rendered HTML:

```html
<meta name="osf:type" content="nodes" />
```

Set by `MetaTagsService` (`osfType`). Project, registration, preprint, and file pages go through `MetaTagsBuilderService`. Profile pages set `osfType: users` only.

**Populated for:** projects, registrations, preprints, files, users (`/user/:id` and `/profile`).

**Often null for:** institutions, meetings, collections, search, discover, and any page without `osf:type`. That is expected if those types are out of scope for the metric.

---

## Payload and API

**Endpoint**

```
POST {apiDomainUrl}/_/metrics/events/ssr_metrics/
```

**Headers**

- `Accept: application/vnd.api+json;version=2.20`
- `Content-Type: application/vnd.api+json`
- `X-Throttle-Token: {THROTTLE_TOKEN}` when env is set

**Example body**

```json
{
  "data": {
    "attributes": {
      "url": "https://osf.io/abc12/overview",
      "ttfb": 842,
      "is_bot": true,
      "is_complete": true,
      "content_type": "nodes",
      "status": 200,
      "user_agent": "Mozilla/5.0 (compatible; Googlebot/2.1; ...)"
    }
  }
}
```

If `apiDomainUrl` is missing, the POST is skipped silently.

Failed POSTs are logged with `console.error` in the middleware catch block.

---

## Related docs

- [SSR overview](./ssr.md) — architecture, routes, config
- [Architecture](./arch.md) — file layout
