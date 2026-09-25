# 📂 Folder Structure

Project based on principle **Feature-based Architecture**: each feature owns its UI, routes, models, mappers, services, and store when needed. Shared and core code live outside features.

```bash
📦 src/
 ├── 📂 app/
 │   ├── 📂 features/                    # Feature modules
 │   │   └── 📂 feature-name/
 │   │       ├── 📂 components/          # Feature UI pieces
 │   │       ├── 📂 pages/               # Route-level pages (when used)
 │   │       ├── 📂 models/              # Feature-local *.model.ts types
 │   │       ├── 📂 mappers/             # Feature API ↔ domain mappers
 │   │       ├── 📂 services/            # Feature HTTP / facade services
 │   │       ├── 📂 store/               # Feature NGXS state (actions, model, state, selectors)
 │   │       ├── 📂 enums/               # Feature enums
 │   │       ├── 📂 constants/           # Feature constants
 │   │       ├── feature.routes.ts       # Feature routes
 │   │       └── feature.component.ts    # Feature shell / entry component
 │   │
 │   ├── 📂 core/                        # App-wide infrastructure
 │   │   ├── 📂 components/              # Shell UI (header, banners, …)
 │   │   ├── 📂 services/                # Global services
 │   │   ├── 📂 store/                   # Core NGXS state (user, emails, …)
 │   │   ├── 📂 models/                  # Core config / routing types
 │   │   ├── 📂 guards/
 │   │   ├── 📂 interceptors/
 │   │   ├── 📂 helpers/
 │   │   └── 📂 provider/
 │   │
 │   ├── 📂 shared/                      # Cross-feature reusable code
 │   │   ├── 📂 components/              # Shared UI
 │   │   ├── 📂 directives/
 │   │   ├── 📂 pipes/
 │   │   ├── 📂 services/                # Shared HTTP / helpers
 │   │   ├── 📂 stores/                  # Shared NGXS domains
 │   │   ├── 📂 models/                  # Shared domain + JSON:API models
 │   │   ├── 📂 mappers/                 # Shared mappers
 │   │   ├── 📂 enums/
 │   │   ├── 📂 guards/
 │   │   └── 📂 helpers/
 │   │
 │   ├── app.component.ts
 │   ├── app.config.ts
 │   ├── app.config.server.ts            # SSR app config
 │   ├── app.routes.ts
 │   └── app.routes.server.ts            # SSR routes
 │
 ├── 📂 assets/
 ├── 📂 environments/
 ├── 📂 styles/
 ├── 📂 testing/                         # Test helpers, mocks, builders (@testing/*)
 ├── main.ts                             # Browser bootstrap
 ├── main.server.ts                      # SSR bootstrap
 ├── server.ts                           # Express / SSR server entry
 └── index.html
```

---

## 📋 Models and mappers

- Types live in `*.model.ts` files (interfaces/types, not classes).
- Shared catalog: `shared/models/<domain>/` with optional `*-json-api.model.ts` twins.
- Feature-local types: `features/<feature>/models/`.
- Mappers convert JSON:API ↔ domain at the service boundary.

See [Models Conventions](./models.md).

---

## 🗃️ State

- Shared domains: `shared/stores/<domain>/`
- Feature domains: `features/<feature>/store/`
- Core domains: `core/store/`

See [NGXS State Management](./ngxs.md).

---

## SSR

Server-side rendering, route render modes, config, and bot traffic are documented in [SSR](./ssr.md). Render metrics are in [SSR metrics](./ssr-metrics.md).

---

## 🚀 Dynamic File Generation (Schematics)

Use Angular CLI for scaffolding:

```sh
ng generate component feature-name/components/new-component
```

### 📌 Other Schematics:

| **Entity**       | **Command**                                |
| ---------------- | ------------------------------------------ |
| 📌 **Service**   | `ng g s feature-name/services/new-service` |
| 🔐 **Guard**     | `ng g g feature-name/guards/auth-guard`    |
| 🔄 **Pipe**      | `ng g p shared/pipes/currency-format`      |
| ✨ **Directive** | `ng g d shared/directives/highlight`       |
