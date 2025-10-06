import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HelpScoutService } from '@core/services/help-scout.service';

import { SettingsContainerComponent } from './settings-container.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('Component: Settings', () => {
  let fixture: ComponentFixture<SettingsContainerComponent>;
  let helpScoutService: HelpScoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsContainerComponent, OSFTestingModule],
      providers: [
        {
          provide: HelpScoutService,
          useValue: {
            setResourceType: jest.fn(),
            unsetResourceType: jest.fn(),
          },
        },
      ],
    }).compileComponents();

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
