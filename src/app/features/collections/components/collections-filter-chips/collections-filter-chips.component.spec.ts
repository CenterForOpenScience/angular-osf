import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsFilterChipsComponent } from './collections-filter-chips.component';

describe('CollectionsFilterChipsComponent', () => {
  let component: CollectionsFilterChipsComponent;
  let fixture: ComponentFixture<CollectionsFilterChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionsFilterChipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsFilterChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
