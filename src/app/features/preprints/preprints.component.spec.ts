import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpScoutService } from '@core/services/help-scout.service';

import { PreprintsComponent } from './preprints.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('Component: Preprint', () => {
  let fixture: ComponentFixture<PreprintsComponent>;
  let helpScoutService: HelpScoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintsComponent, OSFTestingModule],
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
    fixture = TestBed.createComponent(PreprintsComponent);
    fixture.detectChanges();
  });

  it('should called the helpScoutService', () => {
    expect(helpScoutService.setResourceType).toHaveBeenCalledWith('preprint');
  });
});
