import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProjectStepComponent } from './select-project-step.component';

describe('SelectProjectStepComponent', () => {
  let component: SelectProjectStepComponent;
  let fixture: ComponentFixture<SelectProjectStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectProjectStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectProjectStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
