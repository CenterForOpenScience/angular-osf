import { MockComponents } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { ShortRegistrationInfoComponent } from '../short-registration-info/short-registration-info.component';

import { ArchivingMessageComponent } from './archiving-message.component';

import { MOCK_REGISTRATION_OVERVIEW_MODEL } from '@testing/mocks/registration-overview-model.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

describe('ArchivingMessageComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ArchivingMessageComponent, ...MockComponents(ShortRegistrationInfoComponent)],
      providers: [provideOSFCore()],
    });
  });

  it('should create and receive registration input', () => {
    const fixture = TestBed.createComponent(ArchivingMessageComponent);
    fixture.componentRef.setInput('registration', MOCK_REGISTRATION_OVERVIEW_MODEL);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.registration()).toEqual(MOCK_REGISTRATION_OVERVIEW_MODEL);
  });

  it('should have supportEmail from environment', () => {
    const fixture = TestBed.createComponent(ArchivingMessageComponent);
    fixture.componentRef.setInput('registration', MOCK_REGISTRATION_OVERVIEW_MODEL);
    fixture.detectChanges();

    expect(fixture.componentInstance.supportEmail).toBe(TestBed.inject(ENVIRONMENT).supportEmail);
  });
});
