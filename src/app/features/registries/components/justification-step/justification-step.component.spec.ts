import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificationStepComponent } from './justification-step.component';

describe('JustificationStepComponent', () => {
  let component: JustificationStepComponent;
  let fixture: ComponentFixture<JustificationStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JustificationStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JustificationStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
