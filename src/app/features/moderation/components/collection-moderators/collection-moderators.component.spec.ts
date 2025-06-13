import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionModeratorsComponent } from './collection-moderators.component';

describe('CollectionModeratorsComponent', () => {
  let component: CollectionModeratorsComponent;
  let fixture: ComponentFixture<CollectionModeratorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionModeratorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionModeratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
