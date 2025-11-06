import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from '@osf/shared/components/icon/icon.component';

import { RegistryOverview } from '../../models';
import { ShortRegistrationInfoComponent } from '../short-registration-info/short-registration-info.component';

import { ArchivingMessageComponent } from './archiving-message.component';

import { MOCK_REGISTRY_OVERVIEW } from '@testing/mocks/registry-overview.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('ArchivingMessageComponent', () => {
  let component: ArchivingMessageComponent;
  let fixture: ComponentFixture<ArchivingMessageComponent>;

  const mockRegistration: RegistryOverview = MOCK_REGISTRY_OVERVIEW;

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

    fixture.componentRef.setInput('registration', mockRegistration);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have support email from environment', () => {
    expect(component.supportEmail).toBeDefined();
    expect(typeof component.supportEmail).toBe('string');
  });

  it('should receive registration input', () => {
    expect(component.registration()).toEqual(mockRegistration);
  });

  it('should handle different registration statuses', () => {
    const statuses = ['archived', 'pending', 'approved', 'rejected'];

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
});
