import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionModerationSettingsComponent } from './collection-moderation-settings.component';

describe('CollectionModerationSettingsComponent', () => {
  let component: CollectionModerationSettingsComponent;
  let fixture: ComponentFixture<CollectionModerationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionModerationSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionModerationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
