import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from '@osf/shared/components/icon/icon.component';

import { RegistrationOverviewModel } from '../../models';
import { ShortRegistrationInfoComponent } from '../short-registration-info/short-registration-info.component';

import { WithdrawnMessageComponent } from './withdrawn-message.component';

import { MOCK_REGISTRATION_OVERVIEW_MODEL } from '@testing/mocks/registration-overview-model.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('WithdrawnMessageComponent', () => {
  let component: WithdrawnMessageComponent;
  let fixture: ComponentFixture<WithdrawnMessageComponent>;

  const mockRegistration: RegistrationOverviewModel = {
    ...MOCK_REGISTRATION_OVERVIEW_MODEL,
    dateWithdrawn: '2023-06-15T10:30:00Z',
    withdrawalJustification: 'Test withdrawal justification',
    withdrawn: true,
  };

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

  it('should be reactive to registration input changes', () => {
    const updatedRegistration: RegistrationOverviewModel = {
      ...mockRegistration,
      dateWithdrawn: '2024-01-20T12:00:00Z',
      withdrawalJustification: 'Updated justification',
    };

    fixture.componentRef.setInput('registration', updatedRegistration);
    fixture.detectChanges();

    expect(component.registration().dateWithdrawn).toBe('2024-01-20T12:00:00Z');
    expect(component.registration().withdrawalJustification).toBe('Updated justification');
  });

  it('should handle registration with null withdrawal date', () => {
    const registrationWithNullDate: RegistrationOverviewModel = {
      ...mockRegistration,
      dateWithdrawn: null,
    };

    fixture.componentRef.setInput('registration', registrationWithNullDate);
    fixture.detectChanges();

    expect(component.registration().dateWithdrawn).toBeNull();
  });

  it('should handle different withdrawal dates', () => {
    const dates = ['2023-01-01T00:00:00Z', '2023-12-31T23:59:59Z', '2024-06-15T10:30:00Z'];

    dates.forEach((date) => {
      const registrationWithDate: RegistrationOverviewModel = {
        ...mockRegistration,
        dateWithdrawn: date,
      };

      fixture.componentRef.setInput('registration', registrationWithDate);
      fixture.detectChanges();

      expect(component.registration().dateWithdrawn).toBe(date);
    });
  });

  it('should handle different withdrawal justifications', () => {
    const justifications = [
      'Short justification',
      'Very long justification that contains multiple sentences and provides detailed explanation of why the registration was withdrawn.',
      '',
    ];

    justifications.forEach((justification) => {
      const registrationWithJustification: RegistrationOverviewModel = {
        ...mockRegistration,
        withdrawalJustification: justification,
      };

      fixture.componentRef.setInput('registration', registrationWithJustification);
      fixture.detectChanges();

      expect(component.registration().withdrawalJustification).toBe(justification);
    });
  });
});
