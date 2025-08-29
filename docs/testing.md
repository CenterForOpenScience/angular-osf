# OSF Angular Testing Strategy

## Index

- [Overview](#overview)
  - [Pro-tips](#pro-tips)
- [Best Practices](#best-practices)
- [Summary Table](#summary-table)
- [Test Coverage Enforcement (100%)](#test-coverage-enforcement-100)
- [Key Structure](#key-structure)
- [Testing Angular Services (with HTTP)](#testing-angular-services-with-http)
- [Testing Angular Components](#testing-angular-components)
- [Testing Angular Pipes](#testing-angular-pipes)
- [Testing Angular Directives](#testing-angular-directives)
- [Testing Angular NGXS](#testing-ngxs)

---

## Overview

The OSF Angular project uses a modular and mock-driven testing strategy. A shared `testing/` folder provides reusable mocks, mock data, and testing module configuration to support consistent and maintainable unit tests across the codebase.

---

### Pro-tips

**What to test**

The OSF Angular testing strategy enforces 100% coverage while also serving as a guardrail for future engineers. Each test should highlight the most critical aspect of your code — what you’d want the next developer to understand before making changes. If a test fails during a refactor, it should clearly signal that a core feature was impacted, prompting them to investigate why and preserve the intended behavior.

---

**Test Data**

The OSF Angular Test Data module provides a centralized and consistent source of data across all unit tests. It is intended solely for use within unit tests. By standardizing test data, any changes to underlying data models will produce cascading failures, which help expose the full scope of a refactor. This is preferable to isolated or hardcoded test values, which can lead to false positives and missed regressions.

The strategy for structuring test data follows two principles:

1. Include enough data to cover all relevant permutations required by the test suite.
2. Ensure the data reflects all possible states (stati) of the model.

**Test Scope**

The OSF Angular project defines a `@testing` scope that can be used for importing all testing-related modules.

---

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
| `src/mocks/*.mock.ts`   | Mock services and tokens               |
| `src/data/*.data.ts`    | Static mock data for test cases        |

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

---

## Key Structure

### `src/testing/osf.testing.module.ts`

This module centralizes commonly used providers, declarations, and test utilities. It's intended to be imported into any `*.spec.ts` test file to avoid repetitive boilerplate.

Example usage:

```ts
import { TestBed } from '@angular/core/testing';
import { OsfTestingModule } from '@testing/osf.testing.module';

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

### Testing Mocks

The `src/testing/mocks/` directory provides common service and token mocks to isolate unit tests from real implementations.

**examples**

- `environment.token.mock.ts` – Mocks environment tokens like base API URLs.
- `store.mock.ts` – NGXS or other store-related mocks.
- `translation.service.mock.ts` – Prevents needing actual i18n setup during testing.
- `toast.service.mock.ts` – Mocks user feedback services to track invocations without UI.

---

### Test Data

The `src/testing/data/` directory includes fake/mock data used by tests to simulate external API responses or internal state.

The OSF Angular Test Data module provides a centralized and consistent source of data across all unit tests. It is intended solely for use within unit tests. By standardizing test data, any changes to underlying data models will produce cascading failures, which help expose the full scope of a refactor. This is preferable to isolated or hardcoded test values, which can lead to false positives and missed regressions.

The strategy for structuring test data follows two principles:

1. Include enough data to cover all relevant permutations required by the test suite.
2. Ensure the data reflects all possible states (stati) of the model.

**examples**

- `addons.authorized-storage.data.ts`
- `addons.external-storage.data.ts`
- `addons.configured.data.ts`
- `addons.operation-invocation.data.ts`

---

## Testing Angular Services (with HTTP)

All OSF Angular services that make HTTP requests must be tested using `HttpClientTestingModule` and `HttpTestingController`. This testing style verifies both the API call itself and the logic that maps the response into application data.

When using HttpTestingController to flush HTTP requests in tests, only use data from the @testing/data mocks to ensure consistency and full test coverage.

Any error handling will also need to be tested.

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

## NGXS State Testing Strategy

The OSF Angular strategy for NGXS state testing is to create **small integration test scenarios**. This is a deliberate departure from traditional **black box isolated** testing. The rationale is:

1. **NGXS actions** tested in isolation are difficult to mock and result in garbage-in/garbage-out tests.
2. **NGXS selectors** tested in isolation are easy to mock but also lead to garbage-in/garbage-out outcomes.
3. **NGXS states** tested in isolation are easy to invoke but provide no meaningful validation.
4. **Mocking service calls** during state testing introduces false positives, since the mocked service responses may not reflect actual backend behavior.

This approach favors realism and accuracy over artificial test isolation.

### Test Outline Strategy

1. **Dispatch the primary action** – Kick off the state logic under test.
2. **Dispatch any dependent actions** – Include any secondary actions that rely on the primary action's outcome.
3. **Verify the loading selector is `true`** – Ensure the loading state is activated during the async flow.
4. **Verify the service call using `HttpTestingController` and `@testing/data` mocks** – Confirm that the correct HTTP request is made and flushed with known mock data.
5. **Verify the loading selector is `false`** – Ensure the loading state deactivates after the response is handled.
6. **Verify the primary data selector** – Check that the core selector related to the dispatched action returns the expected state.
7. **Verify any additional selectors** – Assert the output of other derived selectors relevant to the action.
8. **Validate the test with `httpMock.verify()`** – Confirm that all HTTP requests were flushed and none remain unhandled:

```ts
expect(httpMock.verify).toBeTruthy();
```

### Example

This is an example of an NGXS action test that involves both a **primary action** and a **dependent action**. The dependency must be dispatched first to ensure the test environment mimics the actual runtime behavior. This pattern helps validate not only the action effects but also the full selector state after updates. All HTTP requests are flushed using the centralized `@testing/data` mocks.

```ts
it('should test action, state and selectors', inject([HttpTestingController], (httpMock: HttpTestingController) => {
  let result: any[] = [];
  // Dependency Action
  store.dispatch(new GetAuthorizedStorageAddons('reference-id')).subscribe();

  // Primary Action
  store.dispatch(new GetAuthorizedStorageOauthToken('account-id')).subscribe(() => {
    result = store.selectSnapshot(AddonsSelectors.getAuthorizedStorageAddons);
  });

  // Loading selector is true
  const loading = store.selectSignal(AddonsSelectors.getAuthorizedStorageAddonsLoading);
  expect(loading()).toBeTruthy();

  // Http request for service for dependency action
  let request = httpMock.expectOne('api/path/dependency/action');
  expect(request.request.method).toBe('GET');
  // @testing/data response mock
  request.flush(getAddonsAuthorizedStorageData());

  // Http request for service for primary action
  let request = httpMock.expectOne('api/path/primary/action');
  expect(request.request.method).toBe('PATCH');
  // @testing/data response mock with updates
  const addonWithToken = getAddonsAuthorizedStorageData(1);
  addonWithToken.data.attributes.oauth_token = 'ya2.34234324534';
  request.flush(addonWithToken);

  // Full testing of the dependency selector
  expect(result[1]).toEqual(
    Object({
      accountOwnerId: '0b441148-83e5-4f7f-b302-b07b528b160b',
    })
  );

  // Full testing of the primary selector
  let oauthToken = store.selectSnapshot(AddonsSelectors.getAuthorizedStorageAddonOauthToken(result[0].id));
  expect(oauthToken).toBe('ya29.A0AS3H6NzDCKgrUx');

  // Verify only the requested `account-id` was updated
  oauthToken = store.selectSnapshot(AddonsSelectors.getAuthorizedStorageAddonOauthToken(result[1].id));
  expect(oauthToken).toBe(result[1].oauthToken);

  // Loading selector is false
  expect(loading()).toBeFalsy();

  // httpMock.verify to ensure no other api calls are called.
  expect(httpMock.verify).toBeTruthy();
}));
```

---
