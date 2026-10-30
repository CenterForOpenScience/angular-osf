# Sentry error filtering

Sentry collects JavaScript errors from the OSF Angular app in the browser. Many of those events are not application bugs: flaky networks, cancelled requests, missing/deleted API resources, browser extensions, and stale tabs after a deploy.

## Setup

`Sentry.init` runs in the browser from `src/app/core/provider/application.initialization.provider.ts` after `assets/config/config.json` loads. Set:

| Key                 | Role                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| `sentryDsn`         | Enables Sentry when non-empty                                                                    |
| `sentryEnvironment` | Passed as Sentry’s `environment` option (use the same name as other services for managed Sentry) |

## Filtering

Filtering happens on the client when Sentry starts. Change the lists in `src/app/core/helpers/sentry-filter.helper.ts`. That file is passed into `Sentry.init` from `src/app/core/provider/application.initialization.provider.ts`.

[Sentry filtering docs](https://docs.sentry.io/platforms/javascript/configuration/filtering/)

## How to read Sentry after this

If an issue disappears from Sentry, it was probably filtered here. It does not mean the user stopped hitting the error.

Server failures (HTTP 500–599) and real JavaScript exceptions are still sent.

## What we drop

Three independent checks. An event is dropped if **any** of them match.

### 1. Error message (`ignoreErrors`)

Sentry treats each string as a **substring**. `Failed to fetch` also matches `Failed to fetch dynamically imported module`.

| You will stop seeing                                                | Typical cause                                                                         |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Handled unknown error                                               | Sentry could not extract a real Error from Angular                                    |
| Non-Error promise rejection captured…                               | A promise rejected with `undefined` / `null` / a plain object                         |
| no elements in sequence                                             | RxJS `EmptyError` (empty observable used with `first()` / `single()`)                 |
| ResizeObserver loop…                                                | Browser layout warning                                                                |
| Failed to fetch                                                     | Chrome/Edge: offline, CORS, blocked request, including `api.osf.io` / `addons.osf.io` |
| Load failed                                                         | Safari equivalent of failed fetch (including `files.osf.io`)                          |
| NetworkError when attempting to fetch resource                      | Firefox equivalent of failed fetch                                                    |
| Failed to fetch dynamically imported module                         | Chrome/Edge: lazy chunk failed to load (often an old tab after deploy)                |
| error loading dynamically imported module                           | Firefox: same lazy-chunk failure                                                      |
| Importing a module script failed                                    | Safari: same lazy-chunk failure                                                       |
| ChunkLoadError / Loading chunk … failed                             | Webpack/Vite chunk load failure after deploy                                          |
| AbortError / The operation was aborted / The user aborted a request | Request cancelled (navigation, timeout, user abort)                                   |
| Beacon is not defined                                               | Extension or third-party script; not OSF (`navigator.sendBeacon` is a different API)  |

### 2. Script URL (`denyUrls`)

Errors whose stack frames come from a **browser extension**, not from OSF code:

- `extensions/`
- `chrome://`
- `chrome-extension://`
- `moz-extension://`
- `safari-extension://`
- `safari-web-extension://`
- `ms-browser-extension://`

### 3. HTTP status below 500 (`beforeSend`)

If the event is an HTTP response and the status is **0–499**, it is dropped. Status is read from:

- Angular `HttpErrorResponse` (including nested `ngOriginalError` / `rejection` / `cause`)
- `Http failure response for …: 410`
- `Server returned code 404 with body "…"`
- `Object captured as exception with keys: …` or `Non-Error exception captured with keys: …` when the keys look like an HTTP response

| Status        | Meaning                                | Dropped?            |
| ------------- | -------------------------------------- | ------------------- |
| 0             | No response (offline, CORS, cancelled) | Yes                 |
| 401, 403      | Not signed in / not allowed            | Yes                 |
| 404, 410      | Missing or deleted resource            | Yes                 |
| 409, 422, 429 | Conflict, validation, rate limit       | Yes                 |
| Other 4xx     | Client/request errors                  | Yes                 |
| 500–599       | Server error                           | **No — still sent** |

This includes noisy issues such as `Http failure response for https://api.osf.io/v2/users/…: 410` and `Object captured as exception with keys: error, headers, … status … url` when the status is below 500.

**Side effect:** a 4xx that is actually a frontend bug is also dropped (for example a request URL that contains `undefined`).

## What still goes to Sentry

- HTTP 500–599
- TypeError / ReferenceError / other exceptions that are not in the ignore list and have no HTTP status
- HTTP-looking events where a status cannot be read

## Changing the filters

1. Open `src/app/core/helpers/sentry-filter.helper.ts`.
2. Add a **string** to `SENTRY_IGNORE_ERRORS` for a stable message substring, or a **RegExp** for a pattern.
3. Add to `SENTRY_DENY_URLS` only for third-party script origins.
4. Change `sentryBeforeSend` only if the HTTP status rule should change (for example keep 404s that contain `undefined` in the URL).

After a release, confirm in the Sentry project that volume dropped and that 5xx / real exceptions still appear.
