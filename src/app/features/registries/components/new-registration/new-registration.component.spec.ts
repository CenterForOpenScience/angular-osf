import { MockComponent, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { RegistriesSelectors } from '@osf/features/registries/store';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';

import { NewRegistrationComponent } from './new-registration.component';

import { MOCK_PROVIDER_SCHEMAS } from '@testing/mocks/registries.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('NewRegistrationComponent', () => {
  let component: NewRegistrationComponent;
  let fixture: ComponentFixture<NewRegistrationComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  const PROJECTS = [{ id: 'p1', title: 'P1' }];
  const PROVIDER_SCHEMAS = MOCK_PROVIDER_SCHEMAS;

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create()
      .withParams({ providerId: 'prov-1' })
      .withQueryParams({ projectId: 'proj-1' })
      .build();
    mockRouter = RouterMockBuilder.create().withUrl('/x').build();

    await TestBed.configureTestingModule({
      imports: [NewRegistrationComponent, OSFTestingModule, MockComponent(SubHeaderComponent)],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getProjects, value: PROJECTS },
            { selector: RegistriesSelectors.getProviderSchemas, value: PROVIDER_SCHEMAS },
            { selector: RegistriesSelectors.isDraftSubmitting, value: false },
            { selector: RegistriesSelectors.getDraftRegistration, value: { id: 'draft-1' } },
            { selector: RegistriesSelectors.isProvidersLoading, value: false },
            { selector: RegistriesSelectors.isProjectsLoading, value: false },
            { selector: UserSelectors.getCurrentUser, value: { id: 'user-1' } },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init with provider and project ids from route', () => {
    expect(component.providerId).toBe('prov-1');
    expect(component.projectId).toBe('proj-1');
    expect(component.fromProject).toBe(true);
  });

  it('should default providerSchema when empty', () => {
    expect(component['draftForm'].get('providerSchema')?.value).toBe('schema-1');
  });

  it('should update project on selection', () => {
    component.onSelectProject('p1');
    expect(component['draftForm'].get('project')?.value).toBe('p1');
  });

  it('should toggle fromProject and add/remove validator', () => {
    component.fromProject = false;
    component.toggleFromProject();
    expect(component.fromProject).toBe(true);
    component.toggleFromProject();
    expect(component.fromProject).toBe(false);
  });

  it('should create draft when form valid', () => {
    const mockActions = {
      createDraft: jest.fn().mockReturnValue(of({})),
    } as any;
    Object.defineProperty(component, 'actions', { value: mockActions });

    component.draftForm.patchValue({ providerSchema: 'schema-1', project: 'proj-1' });
    component.fromProject = true;
    component.createDraft();

    expect(mockActions.createDraft).toHaveBeenCalledWith({
      registrationSchemaId: 'schema-1',
      provider: 'prov-1',
      projectId: 'proj-1',
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/registries/drafts/', 'draft-1', 'metadata']);
  });
});
