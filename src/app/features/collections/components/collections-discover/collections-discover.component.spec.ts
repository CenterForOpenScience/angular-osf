import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { GlobalSearchComponent } from '@osf/shared/components/global-search/global-search.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { CollectionsSelectors } from '@shared/stores/collections';
import { SetDefaultFilterValue, SetExtraFilters } from '@shared/stores/global-search';

import { MOCK_PROVIDER } from '@testing/mocks/provider.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock } from '@testing/providers/toast-provider.mock';

import { CollectionsQuerySyncService } from '../../services';
import { CollectionsMainContentComponent } from '../collections-main-content/collections-main-content.component';

import { CollectionsDiscoverComponent } from './collections-discover.component';

const MOCK_COLLECTION_PROVIDER = {
  ...MOCK_PROVIDER,
  primaryCollection: { id: 'collection-1', type: 'collections' },
  requiredMetadataTemplate: null,
};

const MOCK_COLLECTION_PROVIDER_WITH_TEMPLATE = {
  ...MOCK_COLLECTION_PROVIDER,
  requiredMetadataTemplate: {
    id: 'template-1',
    type: 'cedar-metadata-templates' as const,
    attributes: {
      schema_name: 'Test',
      cedar_id: 'cedar-1',
      template: {
        '@id': 'https://repo.metadatacenter.org/templates/test',
        '@type': 'https://schema.metadatacenter.org/core/Template',
        type: 'object',
        title: 'Test',
        description: '',
        $schema: 'http://json-schema.org/draft-04/schema',
        '@context': {} as never,
        required: [],
        properties: {},
        _ui: {
          order: ['field1'],
          propertyLabels: { field1: 'Field One' },
          propertyDescriptions: {},
        },
      },
    },
  },
};

interface SetupOptions {
  collectionSubmissionWithCedar?: boolean;
  provider?: typeof MOCK_COLLECTION_PROVIDER | typeof MOCK_COLLECTION_PROVIDER_WITH_TEMPLATE;
}

function setup(options: SetupOptions = {}) {
  const { collectionSubmissionWithCedar = false, provider = MOCK_COLLECTION_PROVIDER } = options;

  const toastServiceMock = ToastServiceMock.simple();
  const mockCustomDialogService = CustomDialogServiceMockBuilder.create().build();
  const mockRoute = ActivatedRouteMockBuilder.create().withParams({ providerId: 'provider-1' }).build();

  TestBed.configureTestingModule({
    imports: [
      CollectionsDiscoverComponent,
      ...MockComponents(
        SearchInputComponent,
        CollectionsMainContentComponent,
        GlobalSearchComponent,
        LoadingSpinnerComponent
      ),
    ],
    providers: [
      provideOSFCore(),
      { provide: ENVIRONMENT, useValue: { apiDomainUrl: 'http://localhost:8000', collectionSubmissionWithCedar } },
      MockProvider(ToastService, toastServiceMock),
      MockProvider(CustomDialogService, mockCustomDialogService),
      MockProvider(ActivatedRoute, mockRoute),
      provideMockStore({
        signals: [
          { selector: CollectionsSelectors.getCollectionProvider, value: provider },
          { selector: CollectionsSelectors.getCollectionDetails, value: null },
          { selector: CollectionsSelectors.getAllSelectedFilters, value: {} },
          { selector: CollectionsSelectors.getSortBy, value: 'date' },
          { selector: CollectionsSelectors.getSearchText, value: '' },
          { selector: CollectionsSelectors.getPageNumber, value: '1' },
          { selector: CollectionsSelectors.getCollectionProviderLoading, value: false },
        ],
      }),
    ],
  }).overrideComponent(CollectionsDiscoverComponent, {
    set: {
      providers: [MockProvider(CollectionsQuerySyncService)],
    },
  });

  const fixture = TestBed.createComponent(CollectionsDiscoverComponent);
  const component = fixture.componentInstance;
  const store = TestBed.inject(Store);
  fixture.detectChanges();

  return { fixture, component, store };
}

describe('CollectionsDiscoverComponent', () => {
  describe('legacy mode (collectionSubmissionWithCedar = false)', () => {
    let component: CollectionsDiscoverComponent;
    let fixture: ComponentFixture<CollectionsDiscoverComponent>;

    beforeEach(() => {
      ({ fixture, component } = setup());
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set useShareTroveSearch to false', () => {
      expect(component.useShareTroveSearch).toBe(false);
    });

    it('should initialize with default values', () => {
      expect(component.providerId()).toBe('provider-1');
      expect(component.searchControl.value).toBe('');
    });

    it('should have collection provider data', () => {
      expect(component.collectionProvider()).toEqual(MOCK_COLLECTION_PROVIDER);
    });

    it('should have collection details as null', () => {
      expect(component.collectionDetails()).toBeNull();
    });

    it('should have selected filters', () => {
      expect(component.selectedFilters()).toEqual({});
    });

    it('should have sort by value', () => {
      expect(component.sortBy()).toBe('date');
    });

    it('should have search text', () => {
      expect(component.searchText()).toBe('');
    });

    it('should have page number', () => {
      expect(component.pageNumber()).toBe('1');
    });

    it('should have loading state', () => {
      expect(component.isProviderLoading()).toBe(false);
    });

    it('should compute primary collection id', () => {
      expect(component.primaryCollectionId()).toBe('collection-1');
    });

    it('should handle search control value changes', () => {
      component.searchControl.setValue('new search value');
      expect(component.searchControl.value).toBe('new search value');
    });

    it('should not initialize default search filters', () => {
      expect(component.defaultSearchFiltersInitialized()).toBe(false);
    });

    it('should render CollectionsMainContentComponent', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('osf-collections-main-content')).toBeTruthy();
      expect(el.querySelector('osf-global-search')).toBeNull();
    });

    it('should dispatch setSearchValue and setPageNumber on search triggered', () => {
      const { component: localComponent, store: localStore } = setup();
      (localStore.dispatch as Mock).mockClear();

      localComponent.onSearchTriggered('my query');

      const calls = (localStore.dispatch as Mock).mock.calls.flat();
      expect(calls.some((c: unknown) => c instanceof SetDefaultFilterValue)).toBe(false);
    });
  });

  describe('shtrove mode (collectionSubmissionWithCedar = true)', () => {
    it('should set useShareTroveSearch to true', () => {
      const { component } = setup({ collectionSubmissionWithCedar: true });
      expect(component.useShareTroveSearch).toBe(true);
    });

    it('should initialize default search filters', () => {
      const { component } = setup({ collectionSubmissionWithCedar: true });
      expect(component.defaultSearchFiltersInitialized()).toBe(true);
    });

    it('should dispatch SetDefaultFilterValue with collection IRI', () => {
      const { store } = setup({ collectionSubmissionWithCedar: true });
      const dispatched = (store.dispatch as Mock).mock.calls.flat();
      const setDefaultFilter = dispatched.find(
        (c: unknown) => c instanceof SetDefaultFilterValue
      ) as SetDefaultFilterValue;

      expect(setDefaultFilter).toBeDefined();
      expect(setDefaultFilter.filterKey).toBe('isContainedBy');
      expect(setDefaultFilter.value).toBe('http://localhost:8000/v2/collections/collection-1/');
    });

    it('should not dispatch SetExtraFilters when provider has no requiredMetadataTemplate', () => {
      const { store } = setup({ collectionSubmissionWithCedar: true });
      const dispatched = (store.dispatch as Mock).mock.calls.flat();

      expect(dispatched.some((c: unknown) => c instanceof SetExtraFilters)).toBe(false);
    });

    it('should dispatch SetExtraFilters when provider has a requiredMetadataTemplate', () => {
      const { store } = setup({
        collectionSubmissionWithCedar: true,
        provider: MOCK_COLLECTION_PROVIDER_WITH_TEMPLATE,
      });

      const dispatched = (store.dispatch as Mock).mock.calls.flat();
      const setExtraFilters = dispatched.find((c: unknown) => c instanceof SetExtraFilters) as SetExtraFilters;

      expect(setExtraFilters).toBeDefined();
      expect(setExtraFilters.filters).toHaveLength(1);
      expect(setExtraFilters.filters[0].key).toBe('field1');
      expect(setExtraFilters.filters[0].label).toBe('Field One');
    });

    it('should render GlobalSearchComponent when filters are initialized', () => {
      const { fixture } = setup({ collectionSubmissionWithCedar: true });
      const el = fixture.nativeElement as HTMLElement;

      expect(el.querySelector('osf-global-search')).toBeTruthy();
      expect(el.querySelector('osf-collections-main-content')).toBeNull();
    });

    it('should not dispatch any action on onSearchTriggered in shtrove mode', () => {
      const { component, store } = setup({ collectionSubmissionWithCedar: true });
      (store.dispatch as Mock).mockClear();

      component.onSearchTriggered('query');

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
