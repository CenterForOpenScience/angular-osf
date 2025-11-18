import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { DataResourcesComponent } from '@osf/shared/components/data-resources/data-resources.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';

import { LinkedNode, LinkedRegistration, RegistryComponentModel } from '../../models';

import { RegistrationLinksCardComponent } from './registration-links-card.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('RegistrationLinksCardComponent', () => {
  let component: RegistrationLinksCardComponent;
  let fixture: ComponentFixture<RegistrationLinksCardComponent>;

  const mockLinkedRegistration: LinkedRegistration = {
    id: 'registration-123',
    title: 'Test Registration',
    description: 'Test description',
    category: 'project',
    dateCreated: '2024-01-01T00:00:00Z',
    dateModified: '2024-01-02T00:00:00Z',
    tags: ['tag1', 'tag2'],
    isPublic: true,
    reviewsState: RegistrationReviewStates.Accepted,
    contributors: [],
    currentUserPermissions: ['read', 'write'],
    hasData: true,
    hasAnalyticCode: false,
    hasMaterials: true,
    hasPapers: false,
    hasSupplements: true,
    registrationSupplement: 'supplement-123',
  };

  const mockLinkedNode: LinkedNode = {
    id: 'node-123',
    title: 'Test Node',
    description: 'Test node description',
    category: 'project',
    dateCreated: '2024-01-01T00:00:00Z',
    dateModified: '2024-01-02T00:00:00Z',
    tags: ['tag1'],
    isPublic: false,
    contributors: [],
    htmlUrl: 'https://example.com/node',
    apiUrl: 'https://api.example.com/node',
  };

  const mockRegistryComponent: RegistryComponentModel = {
    id: 'component-123',
    title: 'Test Component',
    description: 'Test component description',
    category: 'project',
    dateCreated: '2024-01-01T00:00:00Z',
    dateModified: '2024-01-02T00:00:00Z',
    dateRegistered: '2024-01-03T00:00:00Z',
    registrationSupplement: 'supplement-456',
    tags: ['tag1', 'tag2'],
    isPublic: true,
    contributors: [],
    registry: 'test-registry',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegistrationLinksCardComponent,
        OSFTestingModule,
        ...MockComponents(DataResourcesComponent, IconComponent, ContributorsListComponent),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationLinksCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('registrationData', mockLinkedRegistration);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set registrationData input correctly with LinkedRegistration', () => {
    fixture.componentRef.setInput('registrationData', mockLinkedRegistration);
    fixture.detectChanges();

    expect(component.registrationData()).toEqual(mockLinkedRegistration);
  });

  it('should set registrationData input correctly with LinkedNode', () => {
    fixture.componentRef.setInput('registrationData', mockLinkedNode);
    fixture.detectChanges();

    expect(component.registrationData()).toEqual(mockLinkedNode);
  });

  it('should set registrationData input correctly with RegistryComponentModel', () => {
    fixture.componentRef.setInput('registrationData', mockRegistryComponent);
    fixture.detectChanges();

    expect(component.registrationData()).toEqual(mockRegistryComponent);
  });

  it('should return true when data has reviewsState property', () => {
    fixture.componentRef.setInput('registrationData', mockLinkedRegistration);
    fixture.detectChanges();

    expect(component.isRegistrationData()).toBe(true);
  });

  it('should return false when data does not have reviewsState property', () => {
    fixture.componentRef.setInput('registrationData', mockLinkedNode);
    fixture.detectChanges();

    expect(component.isRegistrationData()).toBe(false);
  });

  it('should return true when data has registrationSupplement property', () => {
    fixture.componentRef.setInput('registrationData', mockRegistryComponent);
    fixture.detectChanges();

    expect(component.isComponentData()).toBe(true);
  });

  it('should return true for LinkedRegistration with registrationSupplement', () => {
    fixture.componentRef.setInput('registrationData', mockLinkedRegistration);
    fixture.detectChanges();

    expect(component.isComponentData()).toBe(true);
  });

  it('should return false when data does not have registrationSupplement property', () => {
    fixture.componentRef.setInput('registrationData', mockLinkedNode);
    fixture.detectChanges();

    expect(component.isComponentData()).toBe(false);
  });

  it('should return LinkedRegistration when data has reviewsState', () => {
    fixture.componentRef.setInput('registrationData', mockLinkedRegistration);
    fixture.detectChanges();

    expect(component.registrationDataTyped()).toEqual(mockLinkedRegistration);
  });

  it('should return null when data does not have reviewsState', () => {
    fixture.componentRef.setInput('registrationData', mockLinkedNode);
    fixture.detectChanges();

    expect(component.registrationDataTyped()).toBeNull();
  });

  it('should return RegistryComponentModel when data has registrationSupplement', () => {
    fixture.componentRef.setInput('registrationData', mockRegistryComponent);
    fixture.detectChanges();

    expect(component.componentsDataTyped()).toEqual(mockRegistryComponent);
  });
});
