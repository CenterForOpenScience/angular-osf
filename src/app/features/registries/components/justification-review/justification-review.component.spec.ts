import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificationReviewComponent } from './justification-review.component';

describe('JustificationReviewComponent', () => {
  let component: JustificationReviewComponent;
  let fixture: ComponentFixture<JustificationReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JustificationReviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JustificationReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
