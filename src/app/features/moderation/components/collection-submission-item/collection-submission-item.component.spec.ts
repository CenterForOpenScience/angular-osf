import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionSubmissionItemComponent } from './collection-submission-item.component';

describe('SubmissionItemComponent', () => {
  let component: CollectionSubmissionItemComponent;
  let fixture: ComponentFixture<CollectionSubmissionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionSubmissionItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionSubmissionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
