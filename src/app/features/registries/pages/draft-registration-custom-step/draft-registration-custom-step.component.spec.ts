import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftRegistrationCustomStepComponent } from './draft-registration-custom-step.component';

describe('DraftRegistrationCustomStepComponent', () => {
  let component: DraftRegistrationCustomStepComponent;
  let fixture: ComponentFixture<DraftRegistrationCustomStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftRegistrationCustomStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DraftRegistrationCustomStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
