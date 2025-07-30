import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionSubmissionOverviewComponent } from './collection-submission-overview.component';

describe('CollectionSubmissionOverviewComponent', () => {
  let component: CollectionSubmissionOverviewComponent;
  let fixture: ComponentFixture<CollectionSubmissionOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionSubmissionOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionSubmissionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
