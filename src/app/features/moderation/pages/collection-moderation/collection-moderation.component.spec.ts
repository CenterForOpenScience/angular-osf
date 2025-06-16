import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionModerationComponent } from './collection-moderation.component';

describe('CollectionModerationComponent', () => {
  let component: CollectionModerationComponent;
  let fixture: ComponentFixture<CollectionModerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionModerationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
