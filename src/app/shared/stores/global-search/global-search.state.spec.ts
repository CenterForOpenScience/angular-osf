import { provideStore, Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { EMPTY, of } from 'rxjs';

import { Mock, vi } from 'vitest';

import { TestBed } from '@angular/core/testing';

import { FilterOption } from '@osf/shared/models/search/discoverable-filter.model';
import { GlobalSearchService } from '@osf/shared/services/global-search.service';

import {
  MOCK_CEDAR_FILTER,
  MOCK_REGULAR_FILTER,
  MOCK_RESOURCES_DATA,
} from '@testing/data/global-search/global-search.data';
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

describe('State: GlobalSearch', () => {
  let store: Store;
  let mockGetResources: Mock;
  let mockGetFilterOptions: Mock;

  beforeEach(() => {
    mockGetResources = vi.fn().mockReturnValue(of(MOCK_RESOURCES_DATA));
    mockGetFilterOptions = vi.fn().mockReturnValue(of({ options: [], nextUrl: undefined }));

    TestBed.configureTestingModule({
      providers: [
        provideOSFCore(),
        provideStore([GlobalSearchState]),
        MockProvider(GlobalSearchService, {
          getResources: mockGetResources,
          getFilterOptions: mockGetFilterOptions,
          getResourcesByLink: vi.fn().mockReturnValue(EMPTY),
          getFilterOptionsFromPaginationUrl: vi.fn().mockReturnValue(EMPTY),
        }),
      ],
    });

    store = TestBed.inject(Store);
  });

  describe('LoadFilterOptions', () => {
    it('should skip the API call for a CEDAR filter (cedarPropertyIri set)', () => {
      store.dispatch(new SetExtraFilters([MOCK_CEDAR_FILTER]));
      store.dispatch(new FetchResources());
      store.dispatch(new LoadFilterOptions(MOCK_CEDAR_FILTER.key));

      expect(mockGetFilterOptions).not.toHaveBeenCalled();
    });

    it('should set isLoaded to true for a CEDAR filter when short-circuiting', () => {
      store.dispatch(new SetExtraFilters([MOCK_CEDAR_FILTER]));
      store.dispatch(new FetchResources());
      store.dispatch(new LoadFilterOptions(MOCK_CEDAR_FILTER.key));

      const filters = store.selectSnapshot(GlobalSearchSelectors.getFilters);
      const cedarFilterState = filters.find((f) => f.key === MOCK_CEDAR_FILTER.key);
      expect(cedarFilterState?.isLoaded).toBe(true);
    });

    it('should call the API for a regular filter', () => {
      store.dispatch(new FetchResources());
      store.dispatch(new LoadFilterOptions(MOCK_REGULAR_FILTER.key));

      expect(mockGetFilterOptions).toHaveBeenCalled();
      const params = mockGetFilterOptions.mock.calls[0][0];
      expect(params['valueSearchPropertyPath']).toBe(MOCK_REGULAR_FILTER.key);
    });
  });

  describe('LoadFilterOptionsAndSetValues', () => {
    it('should not call the API for CEDAR filter keys', () => {
      store.dispatch(new SetExtraFilters([MOCK_CEDAR_FILTER]));

      store.dispatch(
        new LoadFilterOptionsAndSetValues({
          [MOCK_CEDAR_FILTER.key]: [{ label: 'High School', value: 'High School', cardSearchResultCount: null }],
        })
      );

      expect(mockGetFilterOptions).not.toHaveBeenCalled();
    });

    it('should still set selectedFilterOptions for CEDAR keys', () => {
      store.dispatch(new SetExtraFilters([MOCK_CEDAR_FILTER]));

      const selectedOption: FilterOption = { label: 'High School', value: 'High School', cardSearchResultCount: null };
      store.dispatch(new LoadFilterOptionsAndSetValues({ [MOCK_CEDAR_FILTER.key]: [selectedOption] }));

      const selected = store.selectSnapshot(GlobalSearchSelectors.getSelectedOptions);
      expect(selected[MOCK_CEDAR_FILTER.key]).toEqual([selectedOption]);
    });

    it('should only call the API for non-CEDAR keys in a mixed payload', () => {
      store.dispatch(new SetExtraFilters([MOCK_CEDAR_FILTER]));

      store.dispatch(
        new LoadFilterOptionsAndSetValues({
          [MOCK_CEDAR_FILTER.key]: [{ label: 'High School', value: 'High School', cardSearchResultCount: null }],
          [MOCK_REGULAR_FILTER.key]: [{ label: 'Biology', value: 'biology', cardSearchResultCount: 5 }],
        })
      );

      expect(mockGetFilterOptions).toHaveBeenCalledTimes(1);
      const params = mockGetFilterOptions.mock.calls[0][0];
      expect(params['valueSearchPropertyPath']).toBe(MOCK_REGULAR_FILTER.key);
    });
  });

  describe('FetchResources (CEDAR filter params)', () => {
    it('should add iriShorthand[cedar] when extraFilters are present', () => {
      store.dispatch(new SetExtraFilters([MOCK_CEDAR_FILTER]));
      store.dispatch(new FetchResources());

      const params = mockGetResources.mock.calls[0][0];
      expect(params['iriShorthand[cedar]']).toBe('https://schema.metadatacenter.org/properties/');
    });

    it('should not add iriShorthand[cedar] when no extraFilters are present', () => {
      store.dispatch(new FetchResources());

      const params = mockGetResources.mock.calls[0][0];
      expect(params['iriShorthand[cedar]']).toBeUndefined();
    });

    it('should use cardSearchText for a selected CEDAR filter value', () => {
      store.dispatch(new SetExtraFilters([MOCK_CEDAR_FILTER]));
      store.dispatch(new FetchResources());
      mockGetResources.mockClear();

      store.dispatch(
        new LoadFilterOptionsAndSetValues({
          [MOCK_CEDAR_FILTER.key]: [{ label: 'High School', value: 'High School', cardSearchResultCount: null }],
        })
      );
      store.dispatch(new FetchResources());

      const params = mockGetResources.mock.calls[0][0];
      expect(params[`cardSearchText[osf:hasCedarRecord.cedar:${MOCK_CEDAR_FILTER.cedarPropertyIri}][]`]).toEqual([
        '"High School"',
      ]);
      expect(params[`cardSearchFilter[${MOCK_CEDAR_FILTER.key}][]`]).toBeUndefined();
    });

    it('should include all selected values for a CEDAR filter', () => {
      store.dispatch(new SetExtraFilters([MOCK_CEDAR_FILTER]));
      store.dispatch(new FetchResources());
      mockGetResources.mockClear();

      store.dispatch(
        new LoadFilterOptionsAndSetValues({
          [MOCK_CEDAR_FILTER.key]: [
            { label: 'High School', value: 'High School', cardSearchResultCount: null },
            { label: 'Middle School', value: 'Middle School', cardSearchResultCount: null },
          ],
        })
      );
      store.dispatch(new FetchResources());

      const params = mockGetResources.mock.calls[0][0];
      expect(params[`cardSearchText[osf:hasCedarRecord.cedar:${MOCK_CEDAR_FILTER.cedarPropertyIri}][]`]).toEqual([
        '"High School"',
        '"Middle School"',
      ]);
    });

    it('should use extraFilters as fallback for CEDAR lookup before state.filters is populated', () => {
      store.dispatch(new SetExtraFilters([MOCK_CEDAR_FILTER]));

      store.dispatch(
        new LoadFilterOptionsAndSetValues({
          [MOCK_CEDAR_FILTER.key]: [{ label: 'High School', value: 'High School', cardSearchResultCount: null }],
        })
      );
      store.dispatch(new FetchResources());

      const params = mockGetResources.mock.calls[0][0];
      expect(params[`cardSearchText[osf:hasCedarRecord.cedar:${MOCK_CEDAR_FILTER.cedarPropertyIri}][]`]).toEqual([
        '"High School"',
      ]);
    });
  });

  describe('SetDefaultFilterValue', () => {
    it('should include the default filter in the API call', () => {
      store.dispatch(new SetDefaultFilterValue('defaultKey', 'default-value'));
      store.dispatch(new FetchResources());

      const params = mockGetResources.mock.calls[0][0];
      expect(params['cardSearchFilter[defaultKey][]']).toBe('default-value');
    });

    it('should not be overridden when a selected filter for the same key is cleared', () => {
      store.dispatch(new SetDefaultFilterValue('defaultKey', 'default-value'));
      store.dispatch(new UpdateSelectedFilterOption('defaultKey', []));
      store.dispatch(new FetchResources());

      const params = mockGetResources.mock.calls[0][0];
      expect(params['cardSearchFilter[defaultKey][]']).toBe('default-value');
      expect(params['cardSearchFilter[defaultKey][any-of]']).toBeUndefined();
    });

    it('should AND the default value with an any-of clause for an explicitly selected value', () => {
      store.dispatch(new SetDefaultFilterValue('defaultKey', 'default-value'));
      store.dispatch(
        new UpdateSelectedFilterOption('defaultKey', [
          { label: 'A', value: 'selected-value', cardSearchResultCount: null },
        ])
      );
      store.dispatch(new FetchResources());

      const params = mockGetResources.mock.calls[0][0];
      expect(params['cardSearchFilter[defaultKey][]']).toBe('default-value');
      expect(params['cardSearchFilter[defaultKey][any-of]']).toBe('selected-value');
    });

    it('should OR multiple selected values together via a single any-of clause', () => {
      store.dispatch(new SetDefaultFilterValue('defaultKey', 'default-value'));
      store.dispatch(
        new UpdateSelectedFilterOption('defaultKey', [
          { label: 'A', value: 'selected-value-1', cardSearchResultCount: null },
          { label: 'B', value: 'selected-value-2', cardSearchResultCount: null },
        ])
      );
      store.dispatch(new FetchResources());

      const params = mockGetResources.mock.calls[0][0];
      expect(params['cardSearchFilter[defaultKey][]']).toBe('default-value');
      expect(params['cardSearchFilter[defaultKey][any-of]']).toBe('selected-value-1,selected-value-2');
    });
  });
});
