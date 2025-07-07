import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplementsStepComponent } from './supplements-step.component';

describe('SupplementsStepComponent', () => {
  let component: SupplementsStepComponent;
  let fixture: ComponentFixture<SupplementsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplementsStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SupplementsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
