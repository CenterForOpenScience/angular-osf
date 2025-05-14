# 📂 Folder Structure

Project based on principle **Feature-based Architecture**, this approach provides reusable and consistant
features across the application.

```bash
📦 src/
 ├── 📂 features/            # Каталог із функціональними модулями
 │   ├── 📂 feature-name/
 │   │   ├── 📂 feature.component.ts/html/scss  # Component with template and styles, and base logic file
 │   │   ├── 📂 feature-service.ts              # Service or Facade to provide data for NGXS
 │   │   ├── 📂 feature.store.ts                # NGXS Store for feature
 │   │   ├── 📂 feature.entitity.ts             # Feature Interface for data, Types, Enums
 │   │   ├── 📂 feature.guards.ts               # Guard's for feature routing and permissions
 │   │   ├── 📂 feature.resolvers.ts            # Resolvers for data fetching and preloading
 │   │   ├── 📂 feature.utils.ts                # Additinal utils for feature (formBuilders, converters, mappers)
 │   │   ├── feature.module.ts                  # Optional, if standalone
 │   │   ├── feature.routing.ts                 # Export of standalone components by path
 │
 ├── 📂 core/                # Base module for global services, components, and state
 │   ├── 📂 services/        # Global services (API, Auth, LocalStorage)
 │   ├── 📂 components/      # Global components (Header, Footer, Sidebar)
 │   ├── 📂 store/           # Core state management (Auth, Settings, Router)
 │   ├── core.module.ts      # Optional, but must have a provider for core.
 │
 ├── 📂 shared/              # Shared module for common components, directives, pipes, and services
 │   ├── 📂 ui/              # Shared UI components (Button, Input, Modal), or wrappers for 3rd party
 │   ├── 📂 directives/      # Shared Directives (ClickOutside, Draggable)
 │   ├── 📂 pipes/           # Shared Pipes (Filter, Sort, Format)
 │   ├── 📂 services/        # Services, Facades for shared logic (Http, LocalStorage)
 │   ├── 📂 store/           # Shared State management (Settings, Theme, Language)
 │
 ├── app.routes.ts           # General Entry point for routing
 ├── main.ts                 # Providers Setup and Bootstrap
 ├── package.json            # Dependencies and Scripts


---
```

## 🚀 Dynamic File Generation (Schematics)

Use Angular CLI to generate new feature components, services, and modules.

```sh
ng generate component feature-name/components/new-component

### 📌 Other Schematics:

| **Entity**  | **Command** |
|--------------|----------------------------------------------|
| 📌 **Service**  | `ng g s feature-name/services/new-service` |
| 📦 **Module**  | `ng g m feature-name` |
| 🔐 **Guard**   | `ng g g feature-name/guards/auth-guard` |
| 🔄 **Pipe**    | `ng g p shared/pipes/currency-format` |
| ✨ **Directive** | `ng g d shared/directives/highlight` |


```
