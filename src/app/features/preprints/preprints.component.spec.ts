import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpScoutService } from '@core/services/help-scout.service';

import { PreprintsComponent } from './preprints.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { HelpScoutServiceMockFactory } from '@testing/providers/help-scout.service.mock';

describe('Component: Preprint', () => {
  let fixture: ComponentFixture<PreprintsComponent>;
  let helpScoutService: HelpScoutService;

  beforeEach(() => {
    helpScoutService = HelpScoutServiceMockFactory();

    TestBed.configureTestingModule({
      imports: [PreprintsComponent],
      providers: [provideOSFCore(), MockProvider(HelpScoutService, helpScoutService)],
    });

    helpScoutService = TestBed.inject(HelpScoutService);
    fixture = TestBed.createComponent(PreprintsComponent);
    fixture.detectChanges();
  });

  it('should called the helpScoutService', () => {
    expect(helpScoutService.setResourceType).toHaveBeenCalledWith('preprint');
  });
});
