import { provideStore, Store } from '@ngxs/store';

import { EMPTY, of } from 'rxjs';

import { vi } from 'vitest';

import { TestBed } from '@angular/core/testing';

import {
  DiscoverableFilter,
  FilterOperatorOption,
  FilterOption,
} from '@osf/shared/models/search/discoverable-filter.model';
import { GlobalSearchService } from '@osf/shared/services/global-search.service';
import { ResourcesData } from '@shared/models/search/resource.model';

import { provideOSFCore } from '@testing/osf.testing.provider';

import {
  FetchResources,
  LoadFilterOptions,
  LoadFilterOptionsAndSetValues,
  SetDefaultFilterValue,
  SetExtraFilters,
  UpdateSelectedFilterOption,
} from './global-search.actions';
import { GlobalSearchSelectors } from './global-search.selectors';
import { GlobalSearchState } from './global-search.state';

const MOCK_RESOURCES_DATA: ResourcesData = {
  resources: [],
  filters: [],
  count: 0,
  self: '',
  first: null,
  next: null,
  previous: null,
};

const CEDAR_FILTER: DiscoverableFilter = {
  key: 'School Type',
  label: 'School Type',
  operator: FilterOperatorOption.AnyOf,
  cedarPropertyIri: 'uuid-school-type',
  options: [
    { label: 'High School', value: 'High School', cardSearchResultCount: null },
    { label: 'Middle School', value: 'Middle School', cardSearchResultCount: null },
  ],
};

const REGULAR_FILTER: DiscoverableFilter = {
  key: 'subject',
  label: 'Subject',
  operator: FilterOperatorOption.AnyOf,
  resultCount: 10,
};

function setup() {
  const mockGetResources = vi.fn().mockReturnValue(of(MOCK_RESOURCES_DATA));
  const mockGetFilterOptions = vi.fn().mockReturnValue(of({ options: [], nextUrl: undefined }));

  TestBed.configureTestingModule({
    providers: [
      provideOSFCore(),
      provideStore([GlobalSearchState]),
      {
        provide: GlobalSearchService,
        useValue: {
          getResources: mockGetResources,
          getFilterOptions: mockGetFilterOptions,
          getResourcesByLink: vi.fn().mockReturnValue(EMPTY),
          getFilterOptionsFromPaginationUrl: vi.fn().mockReturnValue(EMPTY),
        },
      },
    ],
  });

  return {
    store: TestBed.inject(Store),
    mockGetResources,
    mockGetFilterOptions,
  };
}

describe('GlobalSearchState', () => {
  describe('LoadFilterOptions', () => {
    it('should skip the API call for a CEDAR filter (cedarPropertyIri set)', () => {
      const { store, mockGetFilterOptions } = setup();

      store.dispatch(new SetExtraFilters([CEDAR_FILTER]));
      store.dispatch(new FetchResources());
      store.dispatch(new LoadFilterOptions(CEDAR_FILTER.key));

      expect(mockGetFilterOptions).not.toHaveBeenCalled();
    });

    it('should skip the API call for a CEDAR filter found only in extraFilters (before first fetch)', () => {
      const { store, mockGetFilterOptions } = setup();
      store.dispatch(new SetExtraFilters([CEDAR_FILTER]));
      // Intentionally no FetchResources — state.filters is still empty

      store.dispatch(new LoadFilterOptions(CEDAR_FILTER.key));

      expect(mockGetFilterOptions).not.toHaveBeenCalled();
    });

    it('should set isLoaded to true for a CEDAR filter when short-circuiting', () => {
      const { store } = setup();

      store.dispatch(new SetExtraFilters([CEDAR_FILTER]));
      store.dispatch(new FetchResources());
      store.dispatch(new LoadFilterOptions(CEDAR_FILTER.key));

      const filters = store.selectSnapshot(GlobalSearchSelectors.getFilters);
      const cedarFilterState = filters.find((f) => f.key === CEDAR_FILTER.key);
      expect(cedarFilterState?.isLoaded).toBe(true);
    });

    it('should call the API for a regular filter', () => {
      const { store, mockGetFilterOptions } = setup();

      store.dispatch(new FetchResources());
      store.dispatch(new LoadFilterOptions(REGULAR_FILTER.key));

      expect(mockGetFilterOptions).toHaveBeenCalled();
      const params = mockGetFilterOptions.mock.calls[0][0];
      expect(params['valueSearchPropertyPath']).toBe(REGULAR_FILTER.key);
    });
  });

  describe('LoadFilterOptionsAndSetValues', () => {
    it('should not call the API for CEDAR filter keys', () => {
      const { store, mockGetFilterOptions } = setup();
      store.dispatch(new SetExtraFilters([CEDAR_FILTER]));

      store.dispatch(
        new LoadFilterOptionsAndSetValues({
          [CEDAR_FILTER.key]: [{ label: 'High School', value: 'High School', cardSearchResultCount: null }],
        })
      );

      expect(mockGetFilterOptions).not.toHaveBeenCalled();
    });

    it('should still set selectedFilterOptions for CEDAR keys', () => {
      const { store } = setup();
      store.dispatch(new SetExtraFilters([CEDAR_FILTER]));

      const selectedOption: FilterOption = { label: 'High School', value: 'High School', cardSearchResultCount: null };
      store.dispatch(new LoadFilterOptionsAndSetValues({ [CEDAR_FILTER.key]: [selectedOption] }));

      const selected = store.selectSnapshot(GlobalSearchSelectors.getSelectedOptions);
      expect(selected[CEDAR_FILTER.key]).toEqual([selectedOption]);
    });

    it('should only call the API for non-CEDAR keys in a mixed payload', () => {
      const { store, mockGetFilterOptions } = setup();
      store.dispatch(new SetExtraFilters([CEDAR_FILTER]));

      store.dispatch(
        new LoadFilterOptionsAndSetValues({
          [CEDAR_FILTER.key]: [{ label: 'High School', value: 'High School', cardSearchResultCount: null }],
          [REGULAR_FILTER.key]: [{ label: 'Biology', value: 'biology', cardSearchResultCount: 5 }],
        })
      );

      expect(mockGetFilterOptions).toHaveBeenCalledTimes(1);
      const params = mockGetFilterOptions.mock.calls[0][0];
      expect(params['valueSearchPropertyPath']).toBe(REGULAR_FILTER.key);
    });
  });

  describe('FetchResources (CEDAR filter params)', () => {
    it('should add iriShorthand[cedar] when extraFilters are present', () => {
      const { store, mockGetResources } = setup();
      store.dispatch(new SetExtraFilters([CEDAR_FILTER]));

      store.dispatch(new FetchResources());

      const params = mockGetResources.mock.calls[0][0];
      expect(params['iriShorthand[cedar]']).toBe('https://schema.metadatacenter.org/properties/');
    });

    it('should not add iriShorthand[cedar] when no extraFilters are present', () => {
      const { store, mockGetResources } = setup();

      store.dispatch(new FetchResources());

      const params = mockGetResources.mock.calls[0][0];
      expect(params['iriShorthand[cedar]']).toBeUndefined();
    });

    it('should use cardSearchText for a selected CEDAR filter value', () => {
      const { store, mockGetResources } = setup();
      store.dispatch(new SetExtraFilters([CEDAR_FILTER]));
      store.dispatch(new FetchResources()); // populates state.filters via updateResourcesState
      mockGetResources.mockClear();

      store.dispatch(
        new LoadFilterOptionsAndSetValues({
          [CEDAR_FILTER.key]: [{ label: 'High School', value: 'High School', cardSearchResultCount: null }],
        })
      );
      store.dispatch(new FetchResources());

      const params = mockGetResources.mock.calls[0][0];
      expect(params[`cardSearchText[osf:hasCedarRecord.cedar:${CEDAR_FILTER.cedarPropertyIri}][]`]).toEqual([
        '"High School"',
      ]);
      expect(params[`cardSearchFilter[${CEDAR_FILTER.key}][]`]).toBeUndefined();
    });

    it('should include all selected values for a CEDAR filter', () => {
      const { store, mockGetResources } = setup();
      store.dispatch(new SetExtraFilters([CEDAR_FILTER]));
      store.dispatch(new FetchResources());
      mockGetResources.mockClear();

      store.dispatch(
        new LoadFilterOptionsAndSetValues({
          [CEDAR_FILTER.key]: [
            { label: 'High School', value: 'High School', cardSearchResultCount: null },
            { label: 'Middle School', value: 'Middle School', cardSearchResultCount: null },
          ],
        })
      );
      store.dispatch(new FetchResources());

      const params = mockGetResources.mock.calls[0][0];
      expect(params[`cardSearchText[osf:hasCedarRecord.cedar:${CEDAR_FILTER.cedarPropertyIri}][]`]).toEqual([
        '"High School"',
        '"Middle School"',
      ]);
    });

    it('should use extraFilters as fallback for CEDAR lookup before state.filters is populated', () => {
      const { store, mockGetResources } = setup();
      store.dispatch(new SetExtraFilters([CEDAR_FILTER]));

      store.dispatch(
        new LoadFilterOptionsAndSetValues({
          [CEDAR_FILTER.key]: [{ label: 'High School', value: 'High School', cardSearchResultCount: null }],
        })
      );
      // First FetchResources — state.filters is still empty at this point
      store.dispatch(new FetchResources());

      const params = mockGetResources.mock.calls[0][0];
      expect(params[`cardSearchText[osf:hasCedarRecord.cedar:${CEDAR_FILTER.cedarPropertyIri}][]`]).toEqual([
        '"High School"',
      ]);
    });
  });

  describe('SetDefaultFilterValue', () => {
    it('should include the default filter in the API call', () => {
      const { store, mockGetResources } = setup();

      store.dispatch(new SetDefaultFilterValue('defaultKey', 'default-value'));
      store.dispatch(new FetchResources());

      const params = mockGetResources.mock.calls[0][0];
      expect(params['cardSearchFilter[defaultKey][]']).toBe('default-value');
    });

    it('should not be overridden when a selected filter for the same key is cleared', () => {
      const { store, mockGetResources } = setup();

      store.dispatch(new SetDefaultFilterValue('defaultKey', 'default-value'));
      store.dispatch(new UpdateSelectedFilterOption('defaultKey', []));
      store.dispatch(new FetchResources());

      const params = mockGetResources.mock.calls[0][0];
      expect(params['cardSearchFilter[defaultKey][]']).toBe('default-value');
    });
  });

  describe('updateResourcesState (CEDAR filter key collision)', () => {
    const COLLIDING_API_FILTER: DiscoverableFilter = {
      key: CEDAR_FILTER.key,
      label: 'School Type (from API)',
      operator: FilterOperatorOption.AnyOf,
      resultCount: 5,
    };

    const MOCK_RESOURCES_WITH_COLLIDING_FILTER: ResourcesData = {
      resources: [],
      filters: [COLLIDING_API_FILTER],
      count: 5,
      self: '',
      first: null,
      next: null,
      previous: null,
    };

    it('should preserve cedarPropertyIri when API returns a filter with the same key as an extra filter', () => {
      const { store, mockGetResources } = setup();
      mockGetResources.mockReturnValue(of(MOCK_RESOURCES_WITH_COLLIDING_FILTER));

      store.dispatch(new SetExtraFilters([CEDAR_FILTER]));
      store.dispatch(new FetchResources());

      const filters = store.selectSnapshot(GlobalSearchSelectors.getFilters);
      const filter = filters.find((f) => f.key === CEDAR_FILTER.key);
      expect(filter?.cedarPropertyIri).toBe(CEDAR_FILTER.cedarPropertyIri);
      expect(filter?.options).toEqual(CEDAR_FILTER.options);
    });

    it('should use cardSearchText even when the API returns a filter with the same key', () => {
      const { store, mockGetResources } = setup();
      mockGetResources.mockReturnValue(of(MOCK_RESOURCES_WITH_COLLIDING_FILTER));

      store.dispatch(new SetExtraFilters([CEDAR_FILTER]));
      store.dispatch(new FetchResources());
      mockGetResources.mockClear();
      mockGetResources.mockReturnValue(of(MOCK_RESOURCES_DATA));

      store.dispatch(
        new LoadFilterOptionsAndSetValues({
          [CEDAR_FILTER.key]: [{ label: 'High School', value: 'High School', cardSearchResultCount: null }],
        })
      );
      store.dispatch(new FetchResources());

      const params = mockGetResources.mock.calls[0][0];
      expect(params[`cardSearchText[osf:hasCedarRecord.cedar:${CEDAR_FILTER.cedarPropertyIri}][]`]).toEqual([
        '"High School"',
      ]);
      expect(params[`cardSearchFilter[${CEDAR_FILTER.key}][]`]).toBeUndefined();
    });
  });
});
