import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitPreprintStepperComponent } from './submit-preprint-stepper.component';

describe('SubmitPreprintStepperComponent', () => {
  let component: SubmitPreprintStepperComponent;
  let fixture: ComponentFixture<SubmitPreprintStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitPreprintStepperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitPreprintStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
