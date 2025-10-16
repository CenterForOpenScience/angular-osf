import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortRegistrationInfoComponent } from '@osf/features/registry/components/short-registration-info/short-registration-info.component';
import { IconComponent } from '@shared/components';

import { RegistryOverview } from '../../models';

import { WithdrawnMessageComponent } from './withdrawn-message.component';

import { MOCK_REGISTRY_OVERVIEW } from '@testing/mocks/registry-overview.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('WithdrawnMessageComponent', () => {
  let component: WithdrawnMessageComponent;
  let fixture: ComponentFixture<WithdrawnMessageComponent>;

  const mockRegistration: RegistryOverview = MOCK_REGISTRY_OVERVIEW;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WithdrawnMessageComponent,
        OSFTestingModule,
        ...MockComponents(ShortRegistrationInfoComponent, IconComponent),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WithdrawnMessageComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('registration', mockRegistration);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive registration input', () => {
    expect(component.registration()).toEqual(mockRegistration);
  });

  it('should handle different registration statuses', () => {
    const statuses = ['withdrawn', 'pending', 'approved', 'rejected'];

    statuses.forEach((status) => {
      const registrationWithStatus = { ...mockRegistration, status };
      fixture.componentRef.setInput('registration', registrationWithStatus);
      fixture.detectChanges();

      expect(component.registration().status).toBe(status);
    });
  });

  it('should handle registration with different properties', () => {
    const complexRegistration: RegistryOverview = {
      ...mockRegistration,
      title: 'Complex Registration Title',
      description: 'A very detailed description of the registration',
      doi: '10.1234/complex-test',
      iaUrl: 'https://example.com/complex-test',
    };

    fixture.componentRef.setInput('registration', complexRegistration);
    fixture.detectChanges();

    expect(component.registration().title).toBe('Complex Registration Title');
    expect(component.registration().description).toBe('A very detailed description of the registration');
    expect(component.registration().doi).toBe('10.1234/complex-test');
    expect(component.registration().iaUrl).toBe('https://example.com/complex-test');
  });

  it('should handle registration with minimal data', () => {
    const minimalRegistration: RegistryOverview = {
      id: 'minimal-id',
      title: 'Minimal Title',
      status: 'withdrawn',
    } as RegistryOverview;

    fixture.componentRef.setInput('registration', minimalRegistration);
    fixture.detectChanges();

    expect(component.registration().id).toBe('minimal-id');
    expect(component.registration().title).toBe('Minimal Title');
    expect(component.registration().status).toBe('withdrawn');
  });

  it('should be reactive to registration input changes', () => {
    const updatedRegistration = { ...mockRegistration, title: 'Updated Title' };

    fixture.componentRef.setInput('registration', updatedRegistration);
    fixture.detectChanges();

    expect(component.registration().title).toBe('Updated Title');
  });
});
