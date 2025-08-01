import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintSubmissionItemComponent } from './preprint-submission-item.component';

describe('PreprintSubmissionItemComponent', () => {
  let component: PreprintSubmissionItemComponent;
  let fixture: ComponentFixture<PreprintSubmissionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintSubmissionItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintSubmissionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
