import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionSubmissionsListComponent } from './collection-submissions-list.component';

describe('SubmissionsListComponent', () => {
  let component: CollectionSubmissionsListComponent;
  let fixture: ComponentFixture<CollectionSubmissionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionSubmissionsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionSubmissionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
