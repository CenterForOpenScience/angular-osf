import { Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterChipsComponent } from '@osf/shared/components/filter-chips/filter-chips.component';
import { SearchFiltersComponent } from '@osf/shared/components/search-filters/search-filters.component';
import { DiscoverableFilter, FilterOption } from '@osf/shared/models/search/discaverable-filter.model';
import {
  ClearFilterSearchResults,
  FetchResources,
  GlobalSearchSelectors,
  LoadFilterOptions,
  LoadFilterOptionsWithSearch,
  LoadMoreFilterOptions,
  UpdateSelectedFilterOption,
} from '@shared/stores/global-search';

import { FiltersSectionComponent } from './filters-section.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('FiltersSectionComponent', () => {
  let component: FiltersSectionComponent;
  let fixture: ComponentFixture<FiltersSectionComponent>;
  let store: Store;

  const mockFilters = [{ key: 'filter1', label: 'Filter 1' }] as DiscoverableFilter[];
  const mockSelectedOptions = { filter1: [{ value: 'option1', label: 'Option 1' }] as FilterOption[] };
  const mockFilterSearchCache = { filter1: [] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FiltersSectionComponent,
        OSFTestingModule,
        ...MockComponents(FilterChipsComponent, SearchFiltersComponent),
      ],
      providers: [
        provideMockStore({
          signals: [
            { selector: GlobalSearchSelectors.getFilters, value: mockFilters },
            { selector: GlobalSearchSelectors.getSelectedOptions, value: mockSelectedOptions },
            { selector: GlobalSearchSelectors.getFilterSearchCache, value: mockFilterSearchCache },
            { selector: GlobalSearchSelectors.getResourcesLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersSectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch UpdateSelectedFilterOption and FetchResources when filter options change', () => {
    const filter = mockFilters[0];
    const filterOption = [{ value: 'option2', label: 'Option 2' }] as FilterOption[];

    component.onSelectedFilterOptionsChanged({ filter, filterOption });

    expect(store.dispatch).toHaveBeenCalledWith(new UpdateSelectedFilterOption(filter.key, filterOption));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchResources());
  });

  it('should dispatch LoadFilterOptions when loading filter options', () => {
    const filter = mockFilters[0];

    component.onLoadFilterOptions(filter);

    expect(store.dispatch).toHaveBeenCalledWith(new LoadFilterOptions(filter.key));
  });

  it('should dispatch LoadMoreFilterOptions when loading more filter options', () => {
    const filter = mockFilters[0];

    component.onLoadMoreFilterOptions(filter);

    expect(store.dispatch).toHaveBeenCalledWith(new LoadMoreFilterOptions(filter.key));
  });

  it('should dispatch LoadFilterOptionsWithSearch when searching with text', () => {
    const filter = mockFilters[0];
    const searchText = 'test';

    component.onSearchFilterOptions({ searchText, filter });

    expect(store.dispatch).toHaveBeenCalledWith(new LoadFilterOptionsWithSearch(filter.key, searchText));
  });

  it('should dispatch ClearFilterSearchResults when searching with empty text', () => {
    const filter = mockFilters[0];
    const searchText = '  ';

    component.onSearchFilterOptions({ searchText, filter });

    expect(store.dispatch).toHaveBeenCalledWith(new ClearFilterSearchResults(filter.key));
  });

  it('should dispatch UpdateSelectedFilterOption and FetchResources when filter chip is removed', () => {
    const filterKey = 'filter1';
    const optionRemoved = mockSelectedOptions.filter1[0];

    component.onFilterChipRemoved({ filterKey, optionRemoved });

    expect(store.dispatch).toHaveBeenCalledWith(new UpdateSelectedFilterOption(filterKey, []));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchResources());
  });
});
