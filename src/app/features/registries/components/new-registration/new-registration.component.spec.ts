import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { CreateDraft, GetProjects, GetProviderSchemas, RegistriesSelectors } from '@osf/features/registries/store';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ToastService } from '@osf/shared/services/toast.service';
import { GetRegistryProvider, RegistrationProviderSelectors } from '@shared/stores/registration-provider';

import { MOCK_PROVIDER_SCHEMAS } from '@testing/mocks/registries.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { NewRegistrationComponent } from './new-registration.component';

describe('NewRegistrationComponent', () => {
  let component: NewRegistrationComponent;
  let fixture: ComponentFixture<NewRegistrationComponent>;
  let store: Store;
  let mockRouter: RouterMockType;
  let toastService: ToastServiceMockType;

  interface SetupOverrides extends BaseSetupOverrides {
    selectorOverrides?: SignalOverride[];
  }

  const defaultSignals: SignalOverride[] = [
    { selector: RegistriesSelectors.getProjects, value: [{ id: 'p1', title: 'P1' }] },
    { selector: RegistriesSelectors.getProviderSchemas, value: MOCK_PROVIDER_SCHEMAS },
    { selector: RegistriesSelectors.isDraftSubmitting, value: false },
    { selector: RegistriesSelectors.getDraftRegistration, value: { id: 'draft-1' } },
    { selector: RegistriesSelectors.isProvidersLoading, value: false },
    { selector: RegistriesSelectors.isProjectsLoading, value: false },
    { selector: UserSelectors.getCurrentUser, value: { id: 'user-1' } },
    { selector: RegistrationProviderSelectors.getBrandedProvider, value: { id: 'prov-1', allowSubmissions: true } },
  ];

  const setup = (overrides?: SetupOverrides) => {
    const mockActivatedRoute = ActivatedRouteMockBuilder.create()
      .withParams(overrides?.routeParams || { providerId: 'prov-1' })
      .withQueryParams({ projectId: 'proj-1' })
      .build();
    mockRouter = RouterMockBuilder.create().withUrl('/x').build();
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [NewRegistrationComponent, MockComponent(SubHeaderComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(ToastService, toastService),
        MockProvider(Router, mockRouter),
        provideMockStore({
          signals: mergeSignalOverrides(defaultSignals, overrides?.selectorOverrides),
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(NewRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should allow submissions when provider allows it', () => {
    setup();
    expect(component.canShowForm()).toBe(true);
    expect(toastService.showError).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should redirect and show error when submissions are not allowed', () => {
    setup({
      selectorOverrides: [
        {
          selector: RegistrationProviderSelectors.getBrandedProvider,
          value: { id: 'prov-1', allowSubmissions: false },
        },
      ],
    });

    expect(component.canShowForm()).toBe(false);
    expect(toastService.showError).toHaveBeenCalledWith('registries.new.registryClosedForSubmissions');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/registries', 'prov-1']);
  });

  it('should redirect and show error when allowSubmissions is undefined', () => {
    setup({
      selectorOverrides: [{ selector: RegistrationProviderSelectors.getBrandedProvider, value: { id: 'prov-1' } }],
    });

    expect(component.canShowForm()).toBe(false);
    expect(toastService.showError).toHaveBeenCalledWith('registries.new.registryClosedForSubmissions');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/registries', 'prov-1']);
  });

  it('should dispatch initial data fetching on init', () => {
    setup();
    expect(store.dispatch).toHaveBeenCalledWith(new GetProjects('user-1', ''));
    expect(store.dispatch).toHaveBeenCalledWith(new GetRegistryProvider('prov-1'));
    expect(store.dispatch).toHaveBeenCalledWith(new GetProviderSchemas('prov-1'));
  });

  it('should init fromProject as true when projectId is present', () => {
    setup();
    expect(component.fromProject()).toBe(true);
  });

  it('should init form with project id from route', () => {
    setup();
    expect(component.draftForm.get('project')?.value).toBe('proj-1');
  });

  it('should default providerSchema when schemas are available', () => {
    setup();
    expect(component.draftForm.get('providerSchema')?.value).toBe('schema-1');
  });

  it('should toggle fromProject and add/remove validator', () => {
    setup();
    component.fromProject.set(false);
    component.toggleFromProject();
    expect(component.fromProject()).toBe(true);
    expect(component.draftForm.get('project')?.validator).toBeTruthy();

    component.toggleFromProject();
    expect(component.fromProject()).toBe(false);
    expect(component.draftForm.get('project')?.validator).toBeNull();
  });

  it('should dispatch createDraft and navigate when form is valid', () => {
    setup();
    component.draftForm.patchValue({ providerSchema: 'schema-1', project: 'proj-1' });
    component.fromProject.set(true);
    (store.dispatch as Mock).mockClear();

    component.createDraft();

    expect(store.dispatch).toHaveBeenCalledWith(
      new CreateDraft({ registrationSchemaId: 'schema-1', provider: 'prov-1', projectId: 'proj-1' })
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/registries/drafts/', 'draft-1', 'metadata']);
  });

  it('should not dispatch createDraft when form is invalid', () => {
    setup();
    component.draftForm.patchValue({ providerSchema: '' });
    (store.dispatch as Mock).mockClear();

    component.createDraft();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(CreateDraft));
  });

  it('should dispatch getProjects after debounced filter', () => {
    vi.useFakeTimers();
    setup();
    (store.dispatch as Mock).mockClear();

    component.onProjectFilter('abc');
    vi.advanceTimersByTime(300);

    expect(store.dispatch).toHaveBeenCalledWith(new GetProjects('user-1', 'abc'));
  });

  it('should not dispatch duplicate getProjects for same filter value', () => {
    vi.useFakeTimers();
    setup();
    (store.dispatch as Mock).mockClear();

    component.onProjectFilter('abc');
    vi.advanceTimersByTime(300);
    component.onProjectFilter('abc');
    vi.advanceTimersByTime(300);

    const getProjectsCalls = (store.dispatch as Mock).mock.calls
      .map(([action]) => action)
      .filter((action): action is GetProjects => action instanceof GetProjects);

    expect(getProjectsCalls).toHaveLength(1);
    expect(getProjectsCalls[0]).toEqual(new GetProjects('user-1', 'abc'));
  });

  it('should debounce rapid filter calls and dispatch only the last value', () => {
    vi.useFakeTimers();
    setup();
    (store.dispatch as Mock).mockClear();

    component.onProjectFilter('a');
    component.onProjectFilter('ab');
    component.onProjectFilter('abc');
    vi.advanceTimersByTime(300);

    const getProjectsCalls = (store.dispatch as Mock).mock.calls
      .map(([action]) => action)
      .filter((action): action is GetProjects => action instanceof GetProjects);

    expect(getProjectsCalls).toHaveLength(1);
    expect(getProjectsCalls[0]).toEqual(new GetProjects('user-1', 'abc'));
    expect(store.dispatch).not.toHaveBeenCalledWith(new GetProjects('user-1', 'a'));
  });
});
