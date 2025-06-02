import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsFiltersComponent } from './collections-filters.component';

describe('CollectionsFiltersComponent', () => {
  let component: CollectionsFiltersComponent;
  let fixture: ComponentFixture<CollectionsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionsFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
