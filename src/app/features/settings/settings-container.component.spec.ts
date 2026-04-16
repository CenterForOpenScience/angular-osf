import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HelpScoutService } from '@core/services/help-scout.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { HelpScoutServiceMockFactory } from '@testing/providers/help-scout.service.mock';

import { SettingsContainerComponent } from './settings-container.component';

describe('Component: Settings', () => {
  let fixture: ComponentFixture<SettingsContainerComponent>;
  let helpScoutService: HelpScoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SettingsContainerComponent],
      providers: [provideOSFCore(), MockProvider(HelpScoutService, HelpScoutServiceMockFactory())],
    });

    helpScoutService = TestBed.inject(HelpScoutService);
    fixture = TestBed.createComponent(SettingsContainerComponent);
    fixture.detectChanges();
  });

  it('should render router outlet', () => {
    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });

  it('should called the helpScoutService', () => {
    expect(helpScoutService.setResourceType).toHaveBeenCalledWith('user');
  });
});
