import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpScoutService } from '@core/services/help-scout.service';

import { PreprintsComponent } from './preprints.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { HelpScoutServiceMockFactory } from '@testing/providers/help-scout.service.mock';

describe('Component: Preprint', () => {
  let fixture: ComponentFixture<PreprintsComponent>;
  let helpScoutService: HelpScoutService;

  beforeEach(async () => {
    helpScoutService = HelpScoutServiceMockFactory();

    await TestBed.configureTestingModule({
      imports: [PreprintsComponent, OSFTestingModule],
      providers: [{ provide: HelpScoutService, useValue: helpScoutService }],
    }).compileComponents();

    helpScoutService = TestBed.inject(HelpScoutService);
    fixture = TestBed.createComponent(PreprintsComponent);
    fixture.detectChanges();
  });

  it('should called the helpScoutService', () => {
    expect(helpScoutService.setResourceType).toHaveBeenCalledWith('preprint');
  });
});
