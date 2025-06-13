import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionModeratorsListComponent } from './collection-moderators-list.component';

describe('CollectionModeratorsListComponent', () => {
  let component: CollectionModeratorsListComponent;
  let fixture: ComponentFixture<CollectionModeratorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionModeratorsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionModeratorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
