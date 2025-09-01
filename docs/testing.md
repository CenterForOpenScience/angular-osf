# OSF Angular Testing Strategy

## Overview

The OSF Angular project uses a modular and mock-driven testing strategy. A shared `testing/` folder provides reusable mocks, mock data, and testing module configuration to support consistent and maintainable unit tests across the codebase.

---

## Index

- [Best Practices](#best-practices)
- [Summary Table](#summary-table)
- [Test Coverage Enforcement (100%)](#test-coverage-enforcement-100)
- [Key Structure](#key-structure)
- [Testing Angular Services (with HTTP)](#testing-angular-services-with-http)
- [Testing Angular Components](#testing-angular-components)
- [Testing Angular Pipes](#testing-angular-pipes)
- [Testing Angular Directives](#testing-angular-directives)
- [Testing Angular NGXS](#testing-ngxs)

--

## Best Practices

- Always import `OsfTestingModule` or `OsfTestingStoreModule` to minimize boilerplate and get consistent mock behavior.
- Use mocks and mock-data from `testing/` to avoid repeating test setup.
- Avoid real HTTP, translation, or store dependencies in unit tests by default.
- Co-locate unit tests with components using `*.spec.ts`.

---

## Summary Table

| Location                | Purpose                                |
| ----------------------- | -------------------------------------- |
| `osf.testing.module.ts` | Unified test module for shared imports |
| `mocks/*.mock.ts`       | Mock services and tokens               |
| `data/*.data.ts`        | Static mock data for test cases        |

---

## Test Coverage Enforcement (100%)

This project **strictly enforces 100% test coverage** through the following mechanisms:

### Husky Pre-Push Hook

Before pushing any code, Husky runs a **pre-push hook** that executes:

```bash
npm run test:coverage
```

This command:

- Runs the full test suite with `--coverage`.
- Fails the push if **coverage drops below 100%**.
- Ensures developers never bypass test coverage enforcement locally.

> Pro Tip: Use `npm run test:watch` during development to maintain coverage incrementally.

---

### GitHub Actions CI

Every pull request and push runs GitHub Actions that:

- Run `npm run test:coverage`.
- Verify test suite passes with **100% code coverage**.
- Fail the build if even **1 uncovered branch/line/function** exists.

This guarantees **test integrity in CI** and **prevents regressions**.

---

### Coverage Expectations

| File Type   | Coverage Requirement                       |
| ----------- | ------------------------------------------ |
| `*.ts`      | 100% line & branch                         |
| `*.spec.ts` | Required per file                          |
| Services    | Must mock HTTP via `HttpTestingController` |
| Components  | DOM + Input + Output event coverage        |
| Pipes/Utils | All edge cases tested                      |

---

### Summary

- **Zero exceptions** for test coverage.
- **Push blocked** without passing 100% tests.
- GitHub CI double-checks every PR.

## Key Structure

### `testing/osf.testing.module.ts`

This module centralizes commonly used providers, declarations, and test utilities. It's intended to be imported into any `*.spec.ts` test file to avoid repetitive boilerplate.

Example usage:

```ts
import { TestBed } from '@angular/core/testing';
import { OsfTestingModule } from 'testing/osf.testing.module';

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [OsfTestingModule],
  }).compileComponents();
});
```

### OSFTestingModule

**Imports:**

- `NoopAnimationsModule` – disables Angular animations for clean, predictable unit tests.
- `BrowserModule` – required for bootstrapping Angular features.
- `CommonModule` – provides core Angular directives (e.g., `ngIf`, `ngFor`).
- `TranslateModule.forRoot()` – sets up the translation layer for template-based testing with `@ngx-translate`.

**Providers:**

- `provideNoopAnimations()` – disables animation via the new standalone provider API.
- `provideRouter([])` – injects an empty router config for component-level testing.
- `provideHttpClient(withInterceptorsFromDi())` – ensures DI-compatible HTTP interceptors are respected in tests.
- `provideHttpClientTesting()` – injects `HttpTestingController` for mocking HTTP requests in unit tests.
- `TranslationServiceMock` – mocks i18n service methods.
- `EnvironmentTokenMock` – mocks environment config values.

---

### OSFTestingStoreModule

**Imports:**

- `OSFTestingModule` – reuses core mocks and modules.

**Providers:**

- `StoreMock` – mocks NgRx Store for selector and dispatch testing.
- `ToastServiceMock` – injects a mock version of the UI toast service.

### `testing/mocks/`

Provides common service and token mocks to isolate unit tests from real implementations.

**examples**

- `environment.token.mock.ts` – Mocks environment tokens like base API URLs.
- `store.mock.ts` – NGXS or other store-related mocks.
- `translation.service.mock.ts` – Prevents needing actual i18n setup during testing.
- `toast.service.mock.ts` – Mocks user feedback services to track invocations without UI.

---

### `testing/data/`

Includes fake/mock data used by tests to simulate external API responses or internal state.

Only use data from the `testing/data` data mocks to ensure that all data is the centralized.

**examples**

- `addons.authorized-storage.data.ts`
- `addons.external-storage.data.ts`
- `addons.configured.data.ts`
- `addons.operation-invocation.data.ts`

---

---

## Testing Angular Services (with HTTP)

All OSF Angular services that make HTTP requests must be tested using `HttpClientTestingModule` and `HttpTestingController`.

### Setup

```ts
import { HttpTestingController } from '@angular/common/http/testing';
import { OSFTestingModule } from '@testing/osf.testing.module';

let service: YourService;

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [OSFTestingModule],
    providers: [YourService],
  });

  service = TestBed.inject(YourService);
});
```

### Example Test

```ts
it('should call correct endpoint and return expected data', inject(
  [HttpTestingController],
  (httpMock: HttpTestingController) => {
    service.getSomething().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/api/endpoint');
    expect(req.request.method).toBe('GET');
    req.flush(getMockDataFromTestingData());

    httpMock.verify(); // Verify no outstanding HTTP calls
  }
));
```

### Key Rules

- Use `OSFTestingModule` to isolate the service
- Inject and use `HttpTestingController`
- Always call `httpMock.expectOne()` to verify the URL and method
- Always call `req.flush()` to simulate the backend response
- Add `httpMock.verify()` in each `it` to catch unflushed requests

---

## Testing Angular Components

- coming soon

---

## Testing Angular Pipes

- coming soon

---

## Testing Angular Directives

- coming soon

---

## Testing NGXS

- coming soon

---
