import { MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpScoutService } from '@core/services/help-scout.service';
import { IS_WEB } from '@osf/shared/helpers';

import { PreprintsComponent } from './preprints.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('Component: Preprint', () => {
  let component: PreprintsComponent;
  let fixture: ComponentFixture<PreprintsComponent>;
  let isWebSubject: BehaviorSubject<boolean>;
  let helpScountService: HelpScoutService;

  beforeEach(async () => {
    isWebSubject = new BehaviorSubject<boolean>(true);

    await TestBed.configureTestingModule({
      imports: [PreprintsComponent, OSFTestingModule],
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
    fixture = TestBed.createComponent(PreprintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have a default value', () => {
    expect(component.isDesktop()).toBeTruthy();
  });

  it('should called the helpScoutService', () => {
    expect(helpScountService.setResourceType).toHaveBeenCalledWith('preprint');
  });
});
