import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  CollectionsFilterChipsComponent,
  CollectionsFiltersComponent,
  CollectionsSearchResultsComponent,
} from '@osf/features/collections/components';
import { CollectionsSelectors } from '@shared/stores/collections';

import { CollectionsMainContentComponent } from './collections-main-content.component';

import { MOCK_COLLECTIONS_SELECTED_FILTERS } from '@testing/mocks/collections-filters.mock';
import { MOCK_COLLECTION_SUBMISSIONS } from '@testing/mocks/collections-submissions.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('CollectionsMainContentComponent', () => {
  let component: CollectionsMainContentComponent;
  let fixture: ComponentFixture<CollectionsMainContentComponent>;

  const mockCollectionSubmissions = MOCK_COLLECTION_SUBMISSIONS;
  const mockSelectedFilters = MOCK_COLLECTIONS_SELECTED_FILTERS;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CollectionsMainContentComponent,
        ...MockComponents(
          CollectionsFilterChipsComponent,
          CollectionsFiltersComponent,
          CollectionsSearchResultsComponent
        ),
        OSFTestingModule,
      ],
      providers: [
        provideMockStore({
          signals: [
            { selector: CollectionsSelectors.getSortBy, value: 'date' },
            { selector: CollectionsSelectors.getCollectionSubmissionsSearchResult, value: mockCollectionSubmissions },
            { selector: CollectionsSelectors.getCollectionSubmissionsLoading, value: false },
            { selector: CollectionsSelectors.getAllSelectedFilters, value: mockSelectedFilters },
            { selector: CollectionsSelectors.getCollectionProviderLoading, value: false },
            { selector: CollectionsSelectors.getCollectionDetailsLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsMainContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle open filters', () => {
    expect(component.isFiltersOpen()).toBe(false);
    expect(component.isSortingOpen()).toBe(false);

    component.openFilters();

    expect(component.isFiltersOpen()).toBe(true);
    expect(component.isSortingOpen()).toBe(false);
  });

  it('should toggle filters when already open', () => {
    component.openFilters();
    expect(component.isFiltersOpen()).toBe(true);

    component.openFilters();
    expect(component.isFiltersOpen()).toBe(false);
  });

  it('should handle open sorting', () => {
    expect(component.isSortingOpen()).toBe(false);
    expect(component.isFiltersOpen()).toBe(false);

    component.openSorting();

    expect(component.isSortingOpen()).toBe(true);
    expect(component.isFiltersOpen()).toBe(false);
  });

  it('should toggle sorting when already open', () => {
    component.openSorting();
    expect(component.isSortingOpen()).toBe(true);

    component.openSorting();
    expect(component.isSortingOpen()).toBe(false);
  });

  it('should handle sort by selection', () => {
    const newSortValue = 'title';

    component.handleSortBy(newSortValue);

    expect(component.isSortingOpen()).toBe(false);
  });

  it('should close sorting when sort is selected', () => {
    component.openSorting();
    expect(component.isSortingOpen()).toBe(true);

    component.handleSortBy('title');

    expect(component.isSortingOpen()).toBe(false);
  });

  it('should have actions defined', () => {
    expect(component.actions).toBeDefined();
    expect(component.actions.setSortBy).toBeDefined();
  });

  it('should handle filters and sorting mutual exclusivity', () => {
    component.openFilters();
    expect(component.isFiltersOpen()).toBe(true);
    expect(component.isSortingOpen()).toBe(false);

    component.openSorting();
    expect(component.isFiltersOpen()).toBe(false);
    expect(component.isSortingOpen()).toBe(true);

    component.openFilters();
    expect(component.isFiltersOpen()).toBe(true);
    expect(component.isSortingOpen()).toBe(false);
  });

  it('should handle partial selected filters', () => {
    expect(component.hasAnySelectedFilters()).toBe(true);
  });
});
