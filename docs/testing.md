# OSF Angular Unit Testing Guide

## Table of Contents

1. [Test Stack](#1-test-stack)
2. [Project Testing Infrastructure](#2-project-testing-infrastructure)
3. [Test File Structure](#3-test-file-structure)
4. [TestBed Configuration](#4-testbed-configuration)
5. [Mocking Strategies](#5-mocking-strategies)
6. [Store Mocking](#6-store-mocking)
7. [Router & Route Mocking](#7-router--route-mocking)
8. [Service Mocking](#8-service-mocking)
9. [Signal-Based Testing](#9-signal-based-testing)
10. [Async Operations](#10-async-operations)
11. [Form Testing](#11-form-testing)
12. [Dialog Testing](#12-dialog-testing)
13. [Edge Cases](#13-edge-cases)
14. [Testing Angular Services (HTTP)](#14-testing-angular-services-http)
15. [Testing NGXS State](#15-testing-ngxs-state)
16. [Test Data](#16-test-data)
17. [Coverage Enforcement](#17-coverage-enforcement)
18. [Best Practices](#18-best-practices)
19. [Appendix: Assertion Patterns](#appendix-assertion-patterns)

---

## 1. Test Stack

| Tool                      | Purpose                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| **Jest**                  | Test runner & assertion library                                                               |
| **Angular TestBed**       | Component / service compilation                                                               |
| **ng-mocks**              | `MockComponents`, `MockModule`, `MockProvider`                                                |
| **NGXS**                  | State management — mocked via `provideMockStore()` for components, real store for state tests |
| **RxJS**                  | Observable / Subject-based async testing                                                      |
| **HttpTestingController** | HTTP interception for service and state integration tests                                     |
| **Custom utilities**      | `src/testing/` — builders, factories, mock data                                               |

---

## 2. Project Testing Infrastructure

### Directory: `src/testing/`

```
src/testing/
├── osf.testing.provider.ts       ← provideOSFCore(), provideOSFHttp()
├── osf.testing.module.ts         ← OSFTestingModule (legacy — prefer providers)
├── providers/                    ← Builder-pattern mocks for services
│   ├── store-provider.mock.ts
│   ├── route-provider.mock.ts
│   ├── router-provider.mock.ts
│   ├── toast-provider.mock.ts
│   ├── custom-confirmation-provider.mock.ts
│   ├── custom-dialog-provider.mock.ts
│   ├── component-provider.mock.ts
│   ├── loader-service.mock.ts
│   └── dialog-provider.mock.ts
├── mocks/                        ← Mock domain models (89+ files)
│   ├── registries.mock.ts
│   ├── draft-registration.mock.ts
│   └── ...
└── data/                         ← JSON API response fixtures
    ├── dashboard/
    ├── addons/
    └── files/
```

### `provideOSFCore()` — mandatory base provider

Every component test must include `provideOSFCore()`. It configures animations, translations, and environment tokens.

```typescript
export function provideOSFCore() {
  return [
    provideNoopAnimations(),
    importProvidersFrom(TranslateModule.forRoot()),
    TranslationServiceMock,
    EnvironmentTokenMock,
  ];
}
```

> **Never** import `OSFTestingModule` directly in new tests. It is retained for legacy compatibility only. Use `provideOSFCore()` instead.

---

## 3. Test File Structure

### Core rules

- Prefer a single flat `describe` block per file to keep tests searchable and prevent state leakage. Use nested `describe` blocks when it significantly simplifies setup or groups logically distinct behaviors.
- For specs where all tests share a single configuration, use `beforeEach` with `TestBed.configureTestingModule` directly. Use a `setup()` helper when tests need different selector values, route configs, or other overrides.
- No `TestBed.resetTestingModule()` in `afterEach` — Angular auto-resets.
- Use actual interfaces/types for mock data instead of `any`.
- Co-locate unit tests with components using `*.spec.ts`.

### Standard structure

```typescript
describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({ ... });
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### `setup()` helper — parameterised tests

Use when tests need different selector values or route configs. Avoids duplicating `TestBed` configuration across tests.

Extend `BaseSetupOverrides` from `@testing/providers/store-provider.mock` when the spec only needs standard route/selector overrides. Add component-specific fields as needed.

Use `mergeSignalOverrides` from `@testing/providers/store-provider.mock` to apply selector overrides on top of default signal values.

Use `withNoParent()` on `ActivatedRouteMockBuilder` when testing components that guard against a missing parent route.

```typescript
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';

interface SetupOverrides extends BaseSetupOverrides {
  routerUrl?: string;
}

function setup(overrides: SetupOverrides = {}) {
  const routeBuilder = ActivatedRouteMockBuilder.create()
    .withParams(overrides.routeParams ?? { id: 'draft-1' });
  if (overrides.hasParent === false) routeBuilder.withNoParent();
  const mockRoute = routeBuilder.build();

  const mockRouter = RouterMockBuilder.create()
    .withUrl(overrides.routerUrl ?? '/registries/drafts/reg-1/1')
    .build();

  const defaultSignals = [{ selector: MySelectors.getData, value: mockData }];
  const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

  TestBed.configureTestingModule({
    imports: [MyComponent],
    providers: [
      provideOSFCore(),
      MockProvider(ActivatedRoute, mockRoute),
      MockProvider(Router, mockRouter),
      provideMockStore({ signals }),
    ],
  });

  const store = TestBed.inject(Store);
  const fixture = TestBed.createComponent(MyComponent);
  return { fixture, component: fixture.componentInstance, store };
}

// Usage
it('should handle missing data', () => {
  const { component } = setup({
    selectorOverrides: [{ selector: MySelectors.getData, value: null }],
  });
  expect(component.hasData()).toBe(false);
});

it('should not dispatch when parent route is absent', () => {
  const { store } = setup({ hasParent: false });
  expect(store.dispatch).not.toHaveBeenCalled();
});
```

---

## 4. TestBed Configuration

### Standalone components (standard)

```typescript
TestBed.configureTestingModule({
  imports: [
    ComponentUnderTest,
    ...MockComponents(ChildA, ChildB),
    MockModule(PrimeNGModule),
  ],
  providers: [
    provideOSFCore(),
    MockProvider(ActivatedRoute, mockRoute),
    MockProvider(Router, mockRouter),
    MockProvider(ToastService, ToastServiceMock.simple()),
    provideMockStore({ signals: [...] }),
  ],
});
```

### Components with signal-input children

Use `overrideComponent` when a child uses Angular signal viewChild and `MockComponents` cannot stub it correctly.

```typescript
TestBed.configureTestingModule({ ... })
  .overrideComponent(FilesControlComponent, {
      remove: { imports: [FilesTreeComponent] },
      add: {
        imports: [
          MockComponentWithSignal('osf-files-tree', [
            'files',
            'selectionMode',
            'totalCount',
            'storage',
            'currentFolder',
            'isLoading',
            'scrollHeight',
            'viewOnly',
            'resourceId',
            'provider',
            'selectedFiles',
          ]),
        ],
      },
    });
```

---

## 5. Mocking Strategies

### Priority order

Always check `@testing/` before writing inline mocks. Builders and factories almost certainly exist.

1. Use existing builders/factories from `@testing/providers/`
2. Use `MockProvider` with an explicit mock object
3. Use `MockComponents` / `MockModule` from ng-mocks
4. Use `MockComponentWithSignal` for signal-input children
5. Inline `jest.fn()` mocks as a last resort

### Quick reference

| Need                       | Use                                                     |
| -------------------------- | ------------------------------------------------------- |
| Store selectors / dispatch | `provideMockStore()`                                    |
| Router                     | `RouterMockBuilder`                                     |
| ActivatedRoute             | `ActivatedRouteMockBuilder`                             |
| ToastService               | `ToastServiceMock.simple()`                             |
| CustomConfirmationService  | `CustomConfirmationServiceMock.simple()`                |
| CustomDialogService        | `CustomDialogServiceMockBuilder`                        |
| LoaderService              | `new LoaderServiceMock()`                               |
| Child components           | `MockComponents(...)` or `MockComponentWithSignal(...)` |
| PrimeNG modules            | `MockModule(...)`                                       |

> **Rule:** Bare `MockProvider(Service)` creates ng-mocks stubs, not `jest.fn()`. When you need `.mockImplementation`, `.mockClear`, or assertion checking, always pass an explicit mock as the second argument.

---

## 6. Store Mocking

### `provideMockStore` configuration options

| Config key  | Maps to                               | Use case                             |
| ----------- | ------------------------------------- | ------------------------------------ |
| `signals`   | `store.selectSignal()`                | Signal-based selectors (most common) |
| `selectors` | `store.select()` / `selectSnapshot()` | Observable-based selectors           |
| `actions`   | `store.dispatch()` return value       | When component reads dispatch result |

```typescript
provideMockStore({
  signals: [
    { selector: RegistriesSelectors.getDraftRegistration, value: mockDraft },
    { selector: RegistriesSelectors.getStepsState, value: stepsStateSignal },
  ],
  actions: [
    { action: new CreateDraft({ ... }), value: { id: 'new-draft' } },
  ],
})
```

### `mergeSignalOverrides` — applying selector overrides in `setup()`

Use `mergeSignalOverrides(defaults, overrides)` from `@testing/providers/store-provider.mock` instead of inlining the merge logic. It replaces matching selectors and preserves the rest.

```typescript
import { mergeSignalOverrides } from '@testing/providers/store-provider.mock';

const defaultSignals = [
  { selector: MySelectors.getData, value: [] },
  { selector: MySelectors.isLoading, value: false },
];
const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);
```

### Dispatch assertions

```typescript
expect(store.dispatch).toHaveBeenCalledWith(new MyAction('id'));
expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(MyAction));

// Filter by action type across multiple dispatches
const calls = (store.dispatch as jest.Mock).mock.calls.filter(([a]: [any]) => a instanceof GetProjects);
expect(calls.length).toBe(1);
```

### Clearing init dispatches

When `ngOnInit` dispatches and you need isolated per-test assertions:

```typescript
(store.dispatch as jest.Mock).mockClear();
component.doSomething();
expect(store.dispatch).toHaveBeenCalledWith(new SpecificAction());
```

---

## 7. Router & Route Mocking

### ActivatedRoute

```typescript
const mockRoute = ActivatedRouteMockBuilder.create()
  .withParams({ id: 'draft-1' })
  .withQueryParams({ projectId: 'proj-1' })
  .withData({ feature: 'registries' })
  .build();

// Nested child routes
const mockRoute = ActivatedRouteMockBuilder.create()
  .withParams({ id: 'reg-1' })
  .withFirstChild((child) => child.withParams({ step: '2' }))
  .build();

// No parent route (for testing components that guard against missing parent)
const mockRoute = ActivatedRouteMockBuilder.create()
  .withParams({ id: 'reg-1' })
  .withNoParent()
  .build();
```

### Router

```typescript
const mockRouter = RouterMockBuilder.create().withUrl('/registries/drafts/reg-1/metadata').build();

expect(mockRouter.navigate).toHaveBeenCalledWith(['../1'], expect.objectContaining({ relativeTo: expect.anything() }));
expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/registries/prov-1/new');
```

---

## 8. Service Mocking

### Simple factories

```typescript
const toastService = ToastServiceMock.simple();
const confirmationService = CustomConfirmationServiceMock.simple();
// Returns plain objects with jest.fn() methods — safe to assert on directly
```

### Builder pattern

```typescript
const mockDialog = CustomDialogServiceMockBuilder.create()
  .withOpen(
    jest.fn().mockReturnValue({
      onClose: dialogClose$.pipe(),
      close: jest.fn(),
    })
  )
  .build();
```

### Inline mock (no builder exists)

```typescript
const mockFilesService = {
  uploadFile: jest.fn(),
  getFileGuid: jest.fn(),
};
MockProvider(FilesService, mockFilesService);
```

---

## 9. Signal-Based Testing

### `WritableSignal` for dynamic state

Pass a `WritableSignal` as the selector value to change state mid-test. The mock store detects `isSignal(value)` and returns it as-is, so updates propagate automatically.

```typescript
let stepsStateSignal: WritableSignal<{ invalid: boolean }[]>;

beforeEach(() => {
  stepsStateSignal = signal([{ invalid: true }]);
  provideMockStore({
    signals: [{ selector: RegistriesSelectors.getStepsState, value: stepsStateSignal }],
  });
});

it('should react to signal changes', () => {
  expect(component.isDraftInvalid()).toBe(true);
  stepsStateSignal.set([{ invalid: false }]);
  expect(component.isDraftInvalid()).toBe(false);
});
```

### Setting signal inputs

```typescript
fixture.componentRef.setInput('attachedFiles', []);
fixture.componentRef.setInput('projectId', 'project-1');
fixture.detectChanges();

// Never use direct property assignment for signal inputs
```

---

## 10. Async Operations

### `fakeAsync` + `tick` for debounced operations

```typescript
it('should dispatch after debounce', fakeAsync(() => {
  (store.dispatch as jest.Mock).mockClear();
  component.onProjectFilter('abc');
  tick(300);
  expect(store.dispatch).toHaveBeenCalledWith(new GetProjects('user-1', 'abc'));
}));

// Deduplication — only the last value dispatches
it('should debounce rapid calls', fakeAsync(() => {
  (store.dispatch as jest.Mock).mockClear();
  component.onProjectFilter('a');
  component.onProjectFilter('ab');
  component.onProjectFilter('abc');
  tick(300);
  const calls = (store.dispatch as jest.Mock).mock.calls.filter(([a]: [any]) => a instanceof GetProjects);
  expect(calls.length).toBe(1);
}));
```

### `done` callback for output emissions

```typescript
it('should emit attachFile', (done) => {
  component.attachFile.subscribe((f) => {
    expect(f).toEqual({ id: 'file-1' });
    done();
  });
  component.selectFile({ id: 'file-1' } as FileModel);
});
```

---

## 11. Form Testing

### Validation and submit

```typescript
it('should be invalid when title is empty', () => {
  component.metadataForm.patchValue({ title: '' });
  expect(component.metadataForm.get('title')?.valid).toBe(false);
});

it('should trim values on submit', () => {
  component.metadataForm.patchValue({
    title: '  Padded Title  ',
    description: '  Padded Desc  ',
  });
  (store.dispatch as jest.Mock).mockClear();
  component.submitMetadata();
  expect(store.dispatch).toHaveBeenCalledWith(
    new UpdateDraft('draft-1', expect.objectContaining({ title: 'Padded Title' }))
  );
});
```

### Validator toggling & touched state

```typescript
it('should toggle validator', () => {
  component.toggleFromProject();
  expect(component.draftForm.get('project')?.validator).toBeTruthy();
  component.toggleFromProject();
  expect(component.draftForm.get('project')?.validator).toBeNull();
});

it('should mark form touched on init when invalid', () => {
  expect(component.metadataForm.touched).toBe(true);
});
```

---

## 12. Dialog Testing

### Subject-based `onClose`

Always use a real `Subject` for `onClose` — `MockProvider` cannot auto-generate reactive streams. Use `provideDynamicDialogRefMock()` where applicable.

```typescript
const dialogClose$ = new Subject<any>();
const mockDialog = CustomDialogServiceMockBuilder.create()
  .withOpen(
    jest.fn().mockReturnValue({
      onClose: dialogClose$.pipe(),
      close: jest.fn(),
    })
  )
  .build();

it('should navigate on confirm', () => {
  component.openConfirmDialog();
  dialogClose$.next(true);
  expect(mockRouter.navigate).toHaveBeenCalledWith(['/new-reg-1/overview']);
});

it('should not navigate on cancel', () => {
  component.openConfirmDialog();
  dialogClose$.next(false);
  expect(mockRouter.navigate).not.toHaveBeenCalled();
});
```

### Chained dialogs

```typescript
it('should pass data between dialogs', () => {
  const selectClose$ = new Subject<any>();
  const confirmClose$ = new Subject<any>();
  let callCount = 0;

  (dialog.open as jest.Mock).mockImplementation(() => {
    callCount++;
    const subj = callCount === 1 ? selectClose$ : confirmClose$;
    return { onClose: subj.pipe(), close: jest.fn() };
  });

  component.openSelectComponentsDialog();
  selectClose$.next(['comp-1']);

  expect(dialog.open).toHaveBeenCalledTimes(2);
  const secondArgs = (dialog.open as jest.Mock).mock.calls[1];
  expect(secondArgs[1].data.components).toEqual(['comp-1']);
});
```

### Confirmation service (auto-confirm pattern)

```typescript
it('should dispatch on confirm', () => {
  mockConfirmation.confirmDelete.mockImplementation(({ onConfirm }: any) => onConfirm());
  (store.dispatch as jest.Mock).mockClear();
  component.deleteDraft();
  expect(store.dispatch).toHaveBeenCalledWith(new DeleteDraft('draft-1'));
});
```

---

## 13. Edge Cases

### `ngOnDestroy` — conditional cleanup

Components that auto-save on destroy must skip saves when the resource was already deleted. Test both paths.

```typescript
it('should skip updates on destroy when draft was deleted', () => {
  (store.dispatch as jest.Mock).mockClear();
  component.isDraftDeleted = true;
  component.ngOnDestroy();
  expect(store.dispatch).not.toHaveBeenCalled();
});

it('should dispatch update on destroy when fields changed', () => {
  component.metadataForm.patchValue({ title: 'Changed Title' });
  (store.dispatch as jest.Mock).mockClear();
  component.ngOnDestroy();
  expect(store.dispatch).toHaveBeenCalledWith(
    new UpdateDraft('draft-1', expect.objectContaining({ title: 'Changed Title' }))
  );
});

it('should not dispatch update on destroy when fields are unchanged', () => {
  (store.dispatch as jest.Mock).mockClear();
  component.ngOnDestroy();
  expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdateDraft));
});
```

### Null / undefined selector values

```typescript
it('should handle null draft', () => {
  const { component } = setup({
    selectorOverrides: [{ selector: Selectors.getDraft, value: null }],
  });
  expect(component).toBeTruthy();
});
```

### Empty arrays vs populated arrays

```typescript
it('should mark invalid when required field has empty array', () => {
  const { component } = setup({
    selectorOverrides: [{ selector: Selectors.getStepsData, value: { field1: [] } }],
  });
  expect(component.steps()[1].invalid).toBe(true);
});

it('should not mark invalid with non-empty array', () => {
  const { component } = setup({
    selectorOverrides: [{ selector: Selectors.getStepsData, value: { field1: ['item'] } }],
  });
  expect(component.steps()[1].invalid).toBe(false);
});
```

### Missing links / properties

```typescript
it('should not upload when no upload link', () => {
  currentFolderSignal.set({ links: {} } as FileFolderModel);
  component.uploadFiles(file);
  expect(mockFilesService.uploadFile).not.toHaveBeenCalled();
});
```

### File size limits

```typescript
it('should warn on oversized file', () => {
  const oversizedFile = new File([''], 'big.bin');
  Object.defineProperty(oversizedFile, 'size', { value: FILE_SIZE_LIMIT });
  component.onFileSelected({ target: { files: [oversizedFile] } } as unknown as Event);
  expect(toastService.showWarn).toHaveBeenCalledWith('shared.files.limitText');
});
```

### Deduplication

```typescript
it('should deduplicate file selection', () => {
  const file = { id: 'file-1' } as FileModel;
  component.onFileTreeSelected(file);
  component.onFileTreeSelected(file);
  expect(component.filesSelection).toEqual([file]);
});
```

### Conditional dispatch based on state

```typescript
it('should not dispatch when submitting', () => {
  const { store } = setup({
    selectorOverrides: [
      { selector: Selectors.isDraftSubmitting, value: true },
      { selector: Selectors.getDraft, value: { ...DEFAULT_DRAFT, hasProject: true } },
    ],
  });
  expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchProjectChildren));
});
```

---

## 14. Testing Angular Services (HTTP)

All services that make HTTP requests must be tested using `HttpClientTestingModule` and `HttpTestingController`. Only use data from `@testing/data` mocks when flushing requests — never hardcode response values inline.

### Setup

```typescript
import { HttpTestingController } from '@angular/common/http/testing';
import { provideOSFCore, provideOSFHttp } from '@testing/osf.testing.provider';

let service: YourService;

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [],
    providers: [provideOSFCore(), provideOSFHttp(), YourService],
  });
  service = TestBed.inject(YourService);
});
```

### Example test

```typescript
it('should call correct endpoint and return expected data', () => {
  const httpMock = TestBed.inject(HttpTestingController);

  service.getSomething().subscribe((data) => {
    expect(data).toEqual(mockData);
  });

  const req = httpMock.expectOne('/api/endpoint');
  expect(req.request.method).toBe('GET');
  req.flush(getMockDataFromTestingData());

  httpMock.verify();
});
```

### Key rules

- Use `provideOSFCore() + provideOSFHttp()` to isolate the service
- Always call `httpMock.expectOne()` to verify the URL and method
- Always call `req.flush()` with data from `@testing/data` — never hardcode responses inline
- Add `httpMock.verify()` at the end of each test to catch unflushed requests
- Error handling paths must also be tested

---

## 15. Testing NGXS State

The OSF Angular strategy for NGXS state testing is to create **small integration test scenarios** rather than isolated unit tests. This is a deliberate design decision.

### Why integration testing for NGXS?

- Actions tested in isolation are hard to mock and produce garbage-in/garbage-out tests
- Selectors tested in isolation are easy to mock but equally produce false positives
- States tested in isolation are easy to invoke but provide no meaningful validation
- Mocking service calls during state tests introduces false positives — mocked responses may not reflect actual backend behaviour

### Test outline — required steps

1. **Dispatch the primary action** — kick off the state logic under test
2. **Dispatch any dependent actions** — include secondary actions that rely on the primary action's outcome
3. **Verify the loading selector is `true`** — ensure loading state activates during the async flow
4. **Flush HTTP requests with `@testing/data` mocks** — confirm correct requests are made and flushed with known data
5. **Verify the loading selector is `false`** — ensure loading deactivates after the response is handled
6. **Verify the primary data selector** — check the core selector returns expected state
7. **Verify additional selectors** — assert derived selectors relevant to the action
8. **Call `httpMock.verify()`** — confirm no HTTP requests remain unhandled

### Example

```typescript
it('should test action, state and selectors', () => {
  const httpMock = TestBed.inject(HttpTestingController);
  let result: any[] = [];

  // 1. Dispatch dependent action first
  store.dispatch(new GetAuthorizedStorageAddons('reference-id')).subscribe();

  // 2. Dispatch primary action
  store.dispatch(new GetAuthorizedStorageOauthToken('account-id')).subscribe(() => {
    result = store.selectSnapshot(AddonsSelectors.getAuthorizedStorageAddons);
  });

  // 3. Loading selector is true
  const loading = store.selectSignal(AddonsSelectors.getAuthorizedStorageAddonsLoading);
  expect(loading()).toBeTruthy();

  // 4a. Flush dependent action HTTP request
  let req = httpMock.expectOne('api/path/dependency/action');
  expect(req.request.method).toBe('GET');
  req.flush(getAddonsAuthorizedStorageData());

  // 4b. Flush primary action HTTP request
  req = httpMock.expectOne('api/path/primary/action');
  expect(req.request.method).toBe('PATCH');
  const addonWithToken = getAddonsAuthorizedStorageData(1);
  addonWithToken.data.attributes.oauth_token = 'ya2.34234324534';
  req.flush(addonWithToken);

  // 5. Loading selector is false
  expect(loading()).toBeFalsy();

  // 6. Primary selector — verify only the targeted record was updated
  const oauthToken = store.selectSnapshot(AddonsSelectors.getAuthorizedStorageAddonOauthToken(result[0].id));
  expect(oauthToken).toBe('ya29.A0AS3H6NzDCKgrUx');

  // 7. Other selector — verify untargeted record is unchanged
  const otherToken = store.selectSnapshot(AddonsSelectors.getAuthorizedStorageAddonOauthToken(result[1].id));
  expect(otherToken).toBe(result[1].oauthToken);

  // 8. No outstanding requests
  httpMock.verify();
});
```

---

## 16. Test Data

Test data lives in two directories under `src/testing/`. Always use these — never hardcode response values inline in tests.

### `testing/mocks/` — domain model mocks (89+ files)

Pre-built mock objects for domain models used directly in component tests. Imported via `@testing/mocks/*`.

| File                         | Purpose                                        |
| ---------------------------- | ---------------------------------------------- |
| `registries.mock.ts`         | `MOCK_DRAFT_REGISTRATION`, `MOCK_PAGES_SCHEMA` |
| `draft-registration.mock.ts` | `MOCK_DRAFT_REGISTRATION` with full shape      |
| `schema-response.mock.ts`    | Schema response fixtures                       |
| `contributors.mock.ts`       | Contributor model mocks                        |
| `project.mock.ts`            | Project model mocks                            |

### `testing/data/` — JSON API response fixtures

Centralised raw JSON API responses used for HTTP flush in service and state integration tests. Imported via `@testing/data/*`.

| File                                  | Purpose                           |
| ------------------------------------- | --------------------------------- |
| `addons.authorized-storage.data.ts`   | Authorised storage addon fixtures |
| `addons.external-storage.data.ts`     | External storage addon fixtures   |
| `addons.configured.data.ts`           | Configured addon state fixtures   |
| `addons.operation-invocation.data.ts` | Operation invocation fixtures     |

### Why centralised test data matters

- Any change to an underlying data model produces cascading test failures, exposing the full scope of a refactor
- Hardcoded inline values lead to false positives and missed regressions
- Consistent data across tests makes selector and state assertions directly comparable

### Data structure principles

1. Include enough data to cover all relevant permutations required by the test suite
2. Ensure data reflects all possible states of the model

---

## 17. Coverage Enforcement

This project strictly enforces 90%+ test coverage through GitHub Actions CI.

### Coverage requirements

| File type     | Requirement        | Notes                                      |
| ------------- | ------------------ | ------------------------------------------ |
| `*.ts`        | 90%+ line & branch | Zero exceptions                            |
| Services      | 90%+               | Must mock HTTP via `HttpTestingController` |
| Components    | 90%+               | DOM + Input + Output event coverage        |
| Pipes / utils | 90%+               | All edge cases tested                      |
| NGXS state    | 90%+               | Integration test approach required         |

### Enforcement pipeline

- **GitHub Actions CI:** runs on every PR and push — build fails if a single uncovered branch, line, or function exists

> **Tip:** Use `npm run test:watch` during development to maintain coverage incrementally rather than discovering gaps at push time.

---

## 18. Best Practices

1. **Always use `provideOSFCore()`** — never import `OSFTestingModule` directly in new tests.
2. **Always use `provideMockStore()`** — never mock `component.actions` via `Object.defineProperty`.
3. **Always pass explicit mocks to `MockProvider`** when you need `jest.fn()` assertions. Bare `MockProvider(Service)` creates ng-mocks stubs.
4. **Check `@testing/` before creating inline mocks** — builders and factories almost certainly exist.
5. **Prefer a single flat `describe` block** per file to keep tests searchable and prevent state leakage. Use nested `describe` blocks when it significantly simplifies setup or groups logically distinct behaviors. No `afterEach`.
6. **No redundant tests** — merge tests that cover the same code path.
7. **Use `(store.dispatch as jest.Mock).mockClear()`** when `ngOnInit` dispatches and you need isolated per-test assertions.
8. **Use `WritableSignal` for dynamic state** — pass `signal()` values to `provideMockStore` when tests need to mutate state mid-test.
9. **Use `Subject` for dialog `onClose`** — gives explicit control over dialog result timing. Use `provideDynamicDialogRefMock()` where applicable.
10. **Use `fakeAsync` + `tick`** for debounced operations — specify the exact debounce duration.
11. **Use `fixture.componentRef.setInput()`** for signal inputs — never direct property assignment.
12. **Use `ngMocks.faster()`** when all tests in a file share identical `TestBed` config — reuses the compiled module for speed. Do not use if any test requires a different config: shared state will cause subtle test pollution.
13. **Use typed mock interfaces** (`ToastServiceMockType`, `RouterMockType`, etc.) — avoid `any`.
14. **Test both positive and negative paths** — confirm an action fires AND confirm it does not fire when conditions are not met.
15. **Only use `@testing/data` fixtures in HTTP flushes** — never hardcode response values inline in service or state tests.
16. **Each test should highlight the most critical aspect of the code** — if a test fails during a refactor, it should clearly signal that a core feature was impacted.

---

## Appendix: Assertion Patterns

### Action dispatch

```typescript
expect(store.dispatch).toHaveBeenCalledWith(new MyAction('id'));
expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(MyAction));
expect(store.dispatch).toHaveBeenCalledWith(new UpdateDraft('draft-1', expect.objectContaining({ title: 'Changed' })));
```

### Router navigation

```typescript
expect(mockRouter.navigate).toHaveBeenCalledWith(['../1'], expect.objectContaining({ relativeTo: expect.anything() }));
expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/target');
```

### Dialog open calls

```typescript
expect(mockDialog.open).toHaveBeenCalled();
const callArgs = (mockDialog.open as jest.Mock).mock.calls[0];
expect(callArgs[1].header).toBe('expected.title');
expect(callArgs[1].data.draftId).toBe('draft-1');
```

### Filtering dispatch calls by action type

```typescript
const calls = (store.dispatch as jest.Mock).mock.calls.filter(([a]: [any]) => a instanceof GetProjects);
expect(calls.length).toBe(1);
expect(calls[0][0]).toEqual(new GetProjects('user-1', 'abc'));
```
