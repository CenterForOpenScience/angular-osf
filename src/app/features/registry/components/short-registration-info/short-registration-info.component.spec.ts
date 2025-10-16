import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsListComponent } from '@shared/components';
import { RegistryStatus } from '@shared/enums';

import { RegistryOverview } from '../../models';

import { ShortRegistrationInfoComponent } from './short-registration-info.component';

import { MOCK_REGISTRY_OVERVIEW } from '@testing/mocks/registry-overview.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('ShortRegistrationInfoComponent', () => {
  let component: ShortRegistrationInfoComponent;
  let fixture: ComponentFixture<ShortRegistrationInfoComponent>;

  const mockRegistration: RegistryOverview = MOCK_REGISTRY_OVERVIEW;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortRegistrationInfoComponent, OSFTestingModule, MockComponent(ContributorsListComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(ShortRegistrationInfoComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('registration', mockRegistration);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle different registration data', () => {
    const differentRegistration: RegistryOverview = {
      ...mockRegistration,
      title: 'Different Title',
      status: RegistryStatus.Pending,
      associatedProjectId: 'different-project-id',
    };

    fixture.componentRef.setInput('registration', differentRegistration);
    fixture.detectChanges();

    expect(component.registration().title).toBe('Different Title');
    expect(component.registration().status).toBe('pending');
    expect(component.associatedProjectUrl).toContain('different-project-id');
  });

  it('should handle registration with minimal data', () => {
    const minimalRegistration: RegistryOverview = {
      id: 'minimal-id',
      title: 'Minimal Title',
      status: 'pending',
      associatedProjectId: 'minimal-project-id',
    } as RegistryOverview;

    fixture.componentRef.setInput('registration', minimalRegistration);
    fixture.detectChanges();

    expect(component.registration().id).toBe('minimal-id');
    expect(component.registration().title).toBe('Minimal Title');
    expect(component.associatedProjectUrl).toContain('minimal-project-id');
  });

  it('should be reactive to registration input changes', () => {
    const updatedRegistration = {
      ...mockRegistration,
      title: 'Updated Title',
      associatedProjectId: 'updated-project-id',
    };

    fixture.componentRef.setInput('registration', updatedRegistration);
    fixture.detectChanges();

    expect(component.registration().title).toBe('Updated Title');
    expect(component.associatedProjectUrl).toContain('updated-project-id');
  });
});
