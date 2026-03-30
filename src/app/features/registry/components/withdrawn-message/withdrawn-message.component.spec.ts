import { MockComponents } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';

import { IconComponent } from '@osf/shared/components/icon/icon.component';

import { ShortRegistrationInfoComponent } from '../short-registration-info/short-registration-info.component';

import { WithdrawnMessageComponent } from './withdrawn-message.component';

import { MOCK_REGISTRATION_OVERVIEW_MODEL } from '@testing/mocks/registration-overview-model.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

describe('WithdrawnMessageComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WithdrawnMessageComponent, ...MockComponents(ShortRegistrationInfoComponent, IconComponent)],
      providers: [provideOSFCore()],
    });
  });

  it('should create and receive registration input', () => {
    const fixture = TestBed.createComponent(WithdrawnMessageComponent);
    const mockRegistration = {
      ...MOCK_REGISTRATION_OVERVIEW_MODEL,
      withdrawn: true,
      dateWithdrawn: '2023-06-15T10:30:00Z',
    };
    fixture.componentRef.setInput('registration', mockRegistration);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.registration()).toEqual(mockRegistration);
  });
});
