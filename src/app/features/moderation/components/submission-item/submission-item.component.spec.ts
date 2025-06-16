import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionItemComponent } from './submission-item.component';

describe('SubmissionItemComponent', () => {
  let component: SubmissionItemComponent;
  let fixture: ComponentFixture<SubmissionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmissionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
