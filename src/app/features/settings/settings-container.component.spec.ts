import { MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HelpScoutService } from '@core/services/help-scout.service';
import { IS_WEB } from '@osf/shared/helpers';

import { SettingsContainerComponent } from './settings-container.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('Component: Settings', () => {
  let fixture: ComponentFixture<SettingsContainerComponent>;
  let isWebSubject: BehaviorSubject<boolean>;
  let helpScountService: HelpScoutService;

  beforeEach(async () => {
    isWebSubject = new BehaviorSubject<boolean>(true);

    await TestBed.configureTestingModule({
      imports: [SettingsContainerComponent, OSFTestingModule],
      providers: [
        MockProvider(IS_WEB, isWebSubject),
        {
          provide: HelpScoutService,
          useValue: {
            setResourceType: jest.fn(),
            unsetResourceType: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    helpScountService = TestBed.inject(HelpScoutService);
    fixture = TestBed.createComponent(SettingsContainerComponent);
    fixture.detectChanges();
  });

  it('should render router outlet', () => {
    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });

  it('should called the helpScoutService', () => {
    expect(helpScountService.setResourceType).toHaveBeenCalledWith('user');
  });
});
