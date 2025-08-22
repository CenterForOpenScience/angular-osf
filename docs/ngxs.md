# NGXS State Management Overview

The OSF Angular project uses [NGXS](https://www.ngxs.io/) as the state management library for Angular applications. NGXS provides a simple, powerful, and TypeScript-friendly framework for managing state across components and services.

---

## Purpose

The goal of using NGXS is to centralize and streamline the handling of application state, reduce boilerplate, and maintain a predictable flow of data and events throughout the OSF Angular app.

---

## Core Concepts

- **State**: Defines a slice of the application state and how it is modified in response to actions.
- **Actions**: Dispatched to signal state changes or trigger effects (e.g., API calls).
- **Selectors**: Functions that extract and transform data from the store.
- **Store**: Centralized container that holds the application state.
- **Effects** (via `@ngxs-labs/effects` or `@ngxs/store`): Side-effect handling such as HTTP requests, logging, etc.

### Diagram

[![OSF NGRX Diagram](./assets/osf-ngxs-diagram.png)](./assets/osf-ngxs-diagram.png)

---

## Directory Structure

Typical NGXS-related files are organized as follows:

```
src/app/shared/stores/
  └── addons/
      ├── addons.actions.ts       # All action definitions
      ├── addons.models.ts        # Interfaces & data models
      ├── addons.state.ts         # State implementation
      ├── addons.selectors.ts     # Reusable selectors
```

```
src/app/shared/services/
  └── addons/
      ├── addons.service.ts       # External API calls
```

---

## Tooling and Extensions

- [Redux DevTools](https://github.com/zalmoxisus/redux-devtools-extension) is supported. Enable it in development via `NgxsReduxDevtoolsPluginModule`.
- [NGXS Logger Plugin](https://www.ngxs.io/plugins/logger) can be used for debugging dispatched actions and state changes.
- [NGXS Storage Plugin](https://www.ngxs.io/plugins/storage) allows selective persistence of state across reloads.

---

## Testing

- Mock `Store` using `jest.fn()` or test-specific modules for unit testing components and services.

---

## Documentation

Refer to the official NGXS documentation for full API details and advanced usage:
[https://www.ngxs.io/docs](https://www.ngxs.io/docs)
