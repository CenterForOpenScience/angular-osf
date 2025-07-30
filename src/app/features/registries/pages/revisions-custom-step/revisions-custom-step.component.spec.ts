import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionsCustomStepComponent } from './revisions-custom-step.component';

describe('RevisionsCustomStepComponent', () => {
  let component: RevisionsCustomStepComponent;
  let fixture: ComponentFixture<RevisionsCustomStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevisionsCustomStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RevisionsCustomStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
