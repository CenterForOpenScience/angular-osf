import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsSearchResultsComponent } from './collections-search-results.component';

describe('CollectionsResultsComponent', () => {
  let component: CollectionsSearchResultsComponent;
  let fixture: ComponentFixture<CollectionsSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionsSearchResultsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
