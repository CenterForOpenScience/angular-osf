import { MockComponents } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { DataResourcesComponent } from '@osf/shared/components/data-resources/data-resources.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';

import { createMockLinkedNode } from '@testing/mocks/linked-node.mock';
import { createMockLinkedRegistration } from '@testing/mocks/linked-registration.mock';
import { createMockRegistryComponent } from '@testing/mocks/registry-component.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { RegistrationLinksCardComponent } from './registration-links-card.component';

describe('RegistrationLinksCardComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RegistrationLinksCardComponent,
        ...MockComponents(DataResourcesComponent, IconComponent, ContributorsListComponent, TruncatedTextComponent),
      ],
      providers: [provideOSFCore()],
    });
  });

  it('should identify LinkedRegistration data', () => {
    const fixture = TestBed.createComponent(RegistrationLinksCardComponent);
    fixture.componentRef.setInput('registrationData', createMockLinkedRegistration());
    fixture.detectChanges();

    expect(fixture.componentInstance.isRegistrationData()).toBe(true);
    expect(fixture.componentInstance.registrationDataTyped()).toEqual(createMockLinkedRegistration());
  });

  it('should identify LinkedNode data', () => {
    const fixture = TestBed.createComponent(RegistrationLinksCardComponent);
    fixture.componentRef.setInput('registrationData', createMockLinkedNode());
    fixture.detectChanges();

    expect(fixture.componentInstance.isRegistrationData()).toBe(false);
    expect(fixture.componentInstance.isComponentData()).toBe(false);
    expect(fixture.componentInstance.registrationDataTyped()).toBeNull();
    expect(fixture.componentInstance.componentsDataTyped()).toBeNull();
  });

  it('should identify RegistryComponentModel data', () => {
    const fixture = TestBed.createComponent(RegistrationLinksCardComponent);
    fixture.componentRef.setInput('registrationData', createMockRegistryComponent());
    fixture.detectChanges();

    expect(fixture.componentInstance.isComponentData()).toBe(true);
    expect(fixture.componentInstance.componentsDataTyped()).toEqual(createMockRegistryComponent());
  });

  it('should return true for hasWriteAccess when user has write permission', () => {
    const fixture = TestBed.createComponent(RegistrationLinksCardComponent);
    fixture.componentRef.setInput(
      'registrationData',
      createMockLinkedRegistration({ currentUserPermissions: ['read', 'write'] })
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.hasWriteAccess()).toBe(true);
  });

  it('should return false for hasWriteAccess when user has read-only permission', () => {
    const fixture = TestBed.createComponent(RegistrationLinksCardComponent);
    fixture.componentRef.setInput(
      'registrationData',
      createMockLinkedRegistration({ currentUserPermissions: ['read'] })
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.hasWriteAccess()).toBe(false);
  });

  it('should return false for hasWriteAccess for non-registration data', () => {
    const fixture = TestBed.createComponent(RegistrationLinksCardComponent);
    fixture.componentRef.setInput('registrationData', createMockLinkedNode());
    fixture.detectChanges();

    expect(fixture.componentInstance.hasWriteAccess()).toBe(false);
  });
});
