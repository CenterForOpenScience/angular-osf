import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsSearchResultCardComponent } from './collections-search-result-card.component';

describe('CollectionsResultCardComponent', () => {
  let component: CollectionsSearchResultCardComponent;
  let fixture: ComponentFixture<CollectionsSearchResultCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionsSearchResultCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsSearchResultCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
