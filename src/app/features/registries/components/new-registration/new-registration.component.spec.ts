import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { CreateDraft, GetProjects, GetProviderSchemas, RegistriesSelectors } from '@osf/features/registries/store';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ToastService } from '@osf/shared/services/toast.service';
import { GetRegistryProvider } from '@shared/stores/registration-provider';

import { NewRegistrationComponent } from './new-registration.component';

import { MOCK_PROVIDER_SCHEMAS } from '@testing/mocks/registries.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('NewRegistrationComponent', () => {
  let component: NewRegistrationComponent;
  let fixture: ComponentFixture<NewRegistrationComponent>;
  let store: Store;
  let mockRouter: RouterMockType;

  beforeEach(() => {
    const mockActivatedRoute = ActivatedRouteMockBuilder.create()
      .withParams({ providerId: 'prov-1' })
      .withQueryParams({ projectId: 'proj-1' })
      .build();
    mockRouter = RouterMockBuilder.create().withUrl('/x').build();

    TestBed.configureTestingModule({
      imports: [NewRegistrationComponent, MockComponent(SubHeaderComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(ToastService),
        MockProvider(Router, mockRouter),
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getProjects, value: [{ id: 'p1', title: 'P1' }] },
            { selector: RegistriesSelectors.getProviderSchemas, value: MOCK_PROVIDER_SCHEMAS },
            { selector: RegistriesSelectors.isDraftSubmitting, value: false },
            { selector: RegistriesSelectors.getDraftRegistration, value: { id: 'draft-1' } },
            { selector: RegistriesSelectors.isProvidersLoading, value: false },
            { selector: RegistriesSelectors.isProjectsLoading, value: false },
            { selector: UserSelectors.getCurrentUser, value: { id: 'user-1' } },
          ],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(NewRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch initial data fetching on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(new GetProjects('user-1', ''));
    expect(store.dispatch).toHaveBeenCalledWith(new GetRegistryProvider('prov-1'));
    expect(store.dispatch).toHaveBeenCalledWith(new GetProviderSchemas('prov-1'));
  });

  it('should init fromProject as true when projectId is present', () => {
    expect(component.fromProject()).toBe(true);
  });

  it('should init form with project id from route', () => {
    expect(component.draftForm.get('project')?.value).toBe('proj-1');
  });

  it('should default providerSchema when schemas are available', () => {
    expect(component.draftForm.get('providerSchema')?.value).toBe('schema-1');
  });

  it('should toggle fromProject and add/remove validator', () => {
    component.fromProject.set(false);
    component.toggleFromProject();
    expect(component.fromProject()).toBe(true);
    expect(component.draftForm.get('project')?.validator).toBeTruthy();

    component.toggleFromProject();
    expect(component.fromProject()).toBe(false);
    expect(component.draftForm.get('project')?.validator).toBeNull();
  });

  it('should dispatch createDraft and navigate when form is valid', () => {
    component.draftForm.patchValue({ providerSchema: 'schema-1', project: 'proj-1' });
    component.fromProject.set(true);
    (store.dispatch as jest.Mock).mockClear();

    component.createDraft();

    expect(store.dispatch).toHaveBeenCalledWith(
      new CreateDraft({ registrationSchemaId: 'schema-1', provider: 'prov-1', projectId: 'proj-1' })
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/registries/drafts/', 'draft-1', 'metadata']);
  });

  it('should not dispatch createDraft when form is invalid', () => {
    component.draftForm.patchValue({ providerSchema: '' });
    (store.dispatch as jest.Mock).mockClear();

    component.createDraft();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(CreateDraft));
  });

  it('should dispatch getProjects after debounced filter', fakeAsync(() => {
    (store.dispatch as jest.Mock).mockClear();

    component.onProjectFilter('abc');
    tick(300);

    expect(store.dispatch).toHaveBeenCalledWith(new GetProjects('user-1', 'abc'));
  }));

  it('should not dispatch duplicate getProjects for same filter value', fakeAsync(() => {
    (store.dispatch as jest.Mock).mockClear();

    component.onProjectFilter('abc');
    tick(300);
    component.onProjectFilter('abc');
    tick(300);

    const getProjectsCalls = (store.dispatch as jest.Mock).mock.calls.filter(
      ([action]: [any]) => action instanceof GetProjects
    );
    expect(getProjectsCalls.length).toBe(1);
  }));

  it('should debounce rapid filter calls and dispatch only the last value', fakeAsync(() => {
    (store.dispatch as jest.Mock).mockClear();

    component.onProjectFilter('a');
    component.onProjectFilter('ab');
    component.onProjectFilter('abc');
    tick(300);

    const getProjectsCalls = (store.dispatch as jest.Mock).mock.calls.filter(
      ([action]: [any]) => action instanceof GetProjects
    );
    expect(getProjectsCalls.length).toBe(1);
    expect(getProjectsCalls[0][0]).toEqual(new GetProjects('user-1', 'abc'));
  }));
});
