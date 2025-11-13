import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterChipsComponent } from '@osf/shared/components/filter-chips/filter-chips.component';
import { SearchFiltersComponent } from '@osf/shared/components/search-filters/search-filters.component';

import { FiltersSectionComponent } from './filters-section.component';

describe.skip('FiltersSectionComponent', () => {
  let component: FiltersSectionComponent;
  let fixture: ComponentFixture<FiltersSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltersSectionComponent, ...MockComponents(FilterChipsComponent, SearchFiltersComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
