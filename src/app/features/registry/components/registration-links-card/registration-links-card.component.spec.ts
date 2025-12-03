import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { DataResourcesComponent } from '@osf/shared/components/data-resources/data-resources.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';

import { RegistrationLinksCardComponent } from './registration-links-card.component';

import { createMockLinkedNode } from '@testing/mocks/linked-node.mock';
import { createMockLinkedRegistration } from '@testing/mocks/linked-registration.mock';
import { createMockRegistryComponent } from '@testing/mocks/registry-component.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('RegistrationLinksCardComponent', () => {
  let component: RegistrationLinksCardComponent;
  let fixture: ComponentFixture<RegistrationLinksCardComponent>;

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
    fixture.componentRef.setInput('registrationData', createMockLinkedRegistration());
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set registrationData input correctly with LinkedRegistration', () => {
    const mockLinkedRegistration = createMockLinkedRegistration();
    fixture.componentRef.setInput('registrationData', mockLinkedRegistration);
    fixture.detectChanges();

    expect(component.registrationData()).toEqual(mockLinkedRegistration);
  });

  it('should set registrationData input correctly with LinkedNode', () => {
    const mockLinkedNode = createMockLinkedNode();
    fixture.componentRef.setInput('registrationData', mockLinkedNode);
    fixture.detectChanges();

    expect(component.registrationData()).toEqual(mockLinkedNode);
  });

  it('should set registrationData input correctly with RegistryComponentModel', () => {
    const mockRegistryComponent = createMockRegistryComponent();
    fixture.componentRef.setInput('registrationData', mockRegistryComponent);
    fixture.detectChanges();

    expect(component.registrationData()).toEqual(mockRegistryComponent);
  });

  it('should return true when data has reviewsState property', () => {
    fixture.componentRef.setInput('registrationData', createMockLinkedRegistration());
    fixture.detectChanges();

    expect(component.isRegistrationData()).toBe(true);
  });

  it('should return false when data does not have reviewsState property', () => {
    fixture.componentRef.setInput('registrationData', createMockLinkedNode());
    fixture.detectChanges();

    expect(component.isRegistrationData()).toBe(false);
  });

  it('should return true when data has registrationSupplement property', () => {
    fixture.componentRef.setInput('registrationData', createMockRegistryComponent());
    fixture.detectChanges();

    expect(component.isComponentData()).toBe(true);
  });

  it('should return true for LinkedRegistration with registrationSupplement', () => {
    fixture.componentRef.setInput('registrationData', createMockLinkedRegistration());
    fixture.detectChanges();

    expect(component.isComponentData()).toBe(true);
  });

  it('should return false when data does not have registrationSupplement property', () => {
    fixture.componentRef.setInput('registrationData', createMockLinkedNode());
    fixture.detectChanges();

    expect(component.isComponentData()).toBe(false);
  });

  it('should return LinkedRegistration when data has reviewsState', () => {
    const mockLinkedRegistration = createMockLinkedRegistration();
    fixture.componentRef.setInput('registrationData', mockLinkedRegistration);
    fixture.detectChanges();

    expect(component.registrationDataTyped()).toEqual(mockLinkedRegistration);
  });

  it('should return null when data does not have reviewsState', () => {
    fixture.componentRef.setInput('registrationData', createMockLinkedNode());
    fixture.detectChanges();

    expect(component.registrationDataTyped()).toBeNull();
  });

  it('should return RegistryComponentModel when data has registrationSupplement', () => {
    const mockRegistryComponent = createMockRegistryComponent();
    fixture.componentRef.setInput('registrationData', mockRegistryComponent);
    fixture.detectChanges();

    expect(component.componentsDataTyped()).toEqual(mockRegistryComponent);
  });
});
