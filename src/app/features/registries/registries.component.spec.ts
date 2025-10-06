import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpScoutService } from '@core/services/help-scout.service';

import { RegistriesComponent } from './registries.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('Component: Registries', () => {
  let fixture: ComponentFixture<RegistriesComponent>;
  let helpScoutService: HelpScoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistriesComponent, OSFTestingModule],
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
    fixture = TestBed.createComponent(RegistriesComponent);
    fixture.detectChanges();
  });

  it('should called the helpScoutService', () => {
    expect(helpScoutService.setResourceType).toHaveBeenCalledWith('registration');
  });
});
