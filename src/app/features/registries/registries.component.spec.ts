import { MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpScoutService } from '@core/services/help-scout.service';
import { IS_WEB } from '@osf/shared/helpers';

import { RegistriesComponent } from './registries.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('Component: Registries', () => {
  let fixture: ComponentFixture<RegistriesComponent>;
  let isWebSubject: BehaviorSubject<boolean>;
  let helpScountService: HelpScoutService;

  beforeEach(async () => {
    isWebSubject = new BehaviorSubject<boolean>(true);

    await TestBed.configureTestingModule({
      imports: [RegistriesComponent, OSFTestingModule],
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
    fixture = TestBed.createComponent(RegistriesComponent);
    fixture.detectChanges();
  });

  it('should called the helpScoutService', () => {
    expect(helpScountService.setResourceType).toHaveBeenCalledWith('registration');
  });
});
