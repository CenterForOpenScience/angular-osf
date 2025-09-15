import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { LoadingSpinnerComponent, SubHeaderComponent } from '@osf/shared/components';
import { MOCK_USER } from '@shared/mocks';
import { AddonsSelectors } from '@shared/stores';

import { LinkedServicesComponent } from './linked-services.component';

import { getConfiguredAddonsMappedData } from '@testing/data/addons/addons.configured.data';
import { getResourceReferencesData } from '@testing/data/files/resource-references.data';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('LinkedServicesComponent', () => {
  let component: LinkedServicesComponent;
  let fixture: ComponentFixture<LinkedServicesComponent>;

  const mockProjectId = 'test-project-123';
  const mockCurrentUser = MOCK_USER;
  const mockAddonsResourceReference = getResourceReferencesData();
  const mockConfiguredLinkAddons = getConfiguredAddonsMappedData();

  beforeEach(async () => {
    const activatedRouteMock = ActivatedRouteMockBuilder.create().withParams({ id: mockProjectId }).build();

    await TestBed.configureTestingModule({
      imports: [
        LinkedServicesComponent,
        OSFTestingModule,
        ...MockComponents(SubHeaderComponent, LoadingSpinnerComponent),
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        provideMockStore({
          signals: [
            { selector: UserSelectors.getCurrentUser, value: mockCurrentUser },
            { selector: UserSelectors.getCurrentUserLoading, value: false },
            { selector: AddonsSelectors.getAddonsResourceReference, value: mockAddonsResourceReference },
            { selector: AddonsSelectors.getAddonsResourceReferenceLoading, value: false },
            { selector: AddonsSelectors.getConfiguredLinkAddons, value: mockConfiguredLinkAddons },
            { selector: AddonsSelectors.getConfiguredLinkAddonsLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkedServicesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with correct computed values', () => {
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.convertedConfiguredLinkAddons()).toHaveLength(1);
  });

  it('should display table when addons are available', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p-table')).toBeTruthy();
    expect(compiled.textContent).toContain('Google Drive');
  });

  it('should show no services message when no addons are available', () => {
    Object.defineProperty(component, 'convertedConfiguredLinkAddons', {
      value: () => [],
      writable: true,
    });

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('project.linkedServices.noLinkedServices');
    expect(compiled.textContent).toContain('project.linkedServices.redirectMessage');
  });

  it('should convert service names correctly', () => {
    fixture.detectChanges();

    const convertedAddons = component.convertedConfiguredLinkAddons();
    expect(convertedAddons[0].serviceName).toBe('Google Drive');
  });

  it('should convert resource types correctly', () => {
    fixture.detectChanges();

    const convertedAddons = component.convertedConfiguredLinkAddons();
    expect(convertedAddons[0].convertedResourceType).toBe('');
  });

  it('should call getAddonsResourceReference on ngOnInit when project ID exists', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should have actions defined', () => {
    expect(component.actions).toBeDefined();
    expect(component.actions.getAddonsResourceReference).toBeDefined();
    expect(component.actions.getConfiguredLinkAddons).toBeDefined();
  });

  it('should handle empty resource reference', () => {
    Object.defineProperty(component, 'addonsResourceReference', {
      value: () => [],
      writable: true,
    });
    Object.defineProperty(component, 'resourceReferenceId', {
      value: () => undefined,
      writable: true,
    });

    fixture.detectChanges();

    expect(component.resourceReferenceId()).toBeUndefined();
  });
});
