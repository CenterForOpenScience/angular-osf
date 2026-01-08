import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { RegistryStatus } from '@osf/shared/enums/registry-status.enum';

import { RegistrationOverviewModel } from '../../models';
import { ShortRegistrationInfoComponent } from '../short-registration-info/short-registration-info.component';

import { ArchivingMessageComponent } from './archiving-message.component';

import { MOCK_REGISTRATION_OVERVIEW_MODEL } from '@testing/mocks/registration-overview-model.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('ArchivingMessageComponent', () => {
  let component: ArchivingMessageComponent;
  let fixture: ComponentFixture<ArchivingMessageComponent>;
  let environment: any;

  const mockRegistration: RegistrationOverviewModel = MOCK_REGISTRATION_OVERVIEW_MODEL;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ArchivingMessageComponent,
        OSFTestingModule,
        ...MockComponents(IconComponent, ShortRegistrationInfoComponent),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArchivingMessageComponent);
    component = fixture.componentInstance;
    environment = TestBed.inject(ENVIRONMENT);

    fixture.componentRef.setInput('registration', mockRegistration);
    fixture.detectChanges();
  });

  it('should have support email from environment', () => {
    expect(component.supportEmail).toBeDefined();
    expect(typeof component.supportEmail).toBe('string');
    expect(component.supportEmail).toBe(environment.supportEmail);
  });

  it('should receive registration input', () => {
    expect(component.registration()).toEqual(mockRegistration);
  });

  it('should have registration as a required input', () => {
    expect(component.registration()).toBeDefined();
    expect(component.registration()).toEqual(mockRegistration);
  });

  it('should handle different registration statuses', () => {
    const statuses = [
      RegistryStatus.Accepted,
      RegistryStatus.Pending,
      RegistryStatus.Withdrawn,
      RegistryStatus.Embargo,
    ];

    statuses.forEach((status) => {
      const registrationWithStatus = { ...mockRegistration, status };
      fixture.componentRef.setInput('registration', registrationWithStatus);
      fixture.detectChanges();

      expect(component.registration().status).toBe(status);
    });
  });

  it('should be reactive to registration input changes', () => {
    const updatedRegistration = { ...mockRegistration, title: 'Updated Title' };

    fixture.componentRef.setInput('registration', updatedRegistration);
    fixture.detectChanges();

    expect(component.registration().title).toBe('Updated Title');
  });

  it('should update when registration properties change', () => {
    const updatedRegistration = {
      ...mockRegistration,
      title: 'New Title',
      description: 'New Description',
    };

    fixture.componentRef.setInput('registration', updatedRegistration);
    fixture.detectChanges();

    expect(component.registration().title).toBe('New Title');
    expect(component.registration().description).toBe('New Description');
  });

  it('should maintain supportEmail reference when registration changes', () => {
    const initialSupportEmail = component.supportEmail;
    const updatedRegistration = { ...mockRegistration, title: 'Different Title' };

    fixture.componentRef.setInput('registration', updatedRegistration);
    fixture.detectChanges();

    expect(component.supportEmail).toBe(initialSupportEmail);
    expect(component.supportEmail).toBe(environment.supportEmail);
  });
});
