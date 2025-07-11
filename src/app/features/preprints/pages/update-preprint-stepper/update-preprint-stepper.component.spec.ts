import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePreprintStepperComponent } from './update-preprint-stepper.component';

describe('UpdatePreprintStepperComponent', () => {
  let component: UpdatePreprintStepperComponent;
  let fixture: ComponentFixture<UpdatePreprintStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePreprintStepperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePreprintStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
