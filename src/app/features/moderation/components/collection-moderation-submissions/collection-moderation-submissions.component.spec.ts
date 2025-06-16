import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionModerationSubmissionsComponent } from './collection-moderation-submissions.component';

describe('CollectionModerationSubmissionsComponent', () => {
  let component: CollectionModerationSubmissionsComponent;
  let fixture: ComponentFixture<CollectionModerationSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionModerationSubmissionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionModerationSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
