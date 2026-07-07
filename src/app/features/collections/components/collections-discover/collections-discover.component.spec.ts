import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { TestBed } from '@angular/core/testing';
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

import { CollectionsDiscoverComponent } from './collections-discover.component';

const MOCK_COLLECTION_IRI = 'http://localhost:8000/v2/collections/collection-1/';

const MOCK_COLLECTION_PROVIDER = {
  ...MOCK_PROVIDER,
  iri: MOCK_COLLECTION_IRI,
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
        properties: {
          '@context': {
            properties: {
              field1: { enum: ['https://schema.metadatacenter.org/properties/test-field-uuid'] },
            },
          },
          field1: {
            '@type': 'https://schema.metadatacenter.org/core/TemplateField',
            _valueConstraints: {
              literals: [{ label: 'Option A' }, { label: 'Option B' }],
            },
          },
        },
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
  provider?: typeof MOCK_COLLECTION_PROVIDER | typeof MOCK_COLLECTION_PROVIDER_WITH_TEMPLATE;
}

function setup(options: SetupOptions = {}) {
  const { provider = MOCK_COLLECTION_PROVIDER } = options;

  const toastServiceMock = ToastServiceMock.simple();
  const mockCustomDialogService = CustomDialogServiceMockBuilder.create().build();
  const mockRoute = ActivatedRouteMockBuilder.create().withParams({ providerId: 'provider-1' }).build();

  TestBed.configureTestingModule({
    imports: [
      CollectionsDiscoverComponent,
      ...MockComponents(SearchInputComponent, GlobalSearchComponent, LoadingSpinnerComponent),
    ],
    providers: [
      provideOSFCore(),
      { provide: ENVIRONMENT, useValue: { apiDomainUrl: 'http://localhost:8000' } },
      MockProvider(ToastService, toastServiceMock),
      MockProvider(CustomDialogService, mockCustomDialogService),
      MockProvider(ActivatedRoute, mockRoute),
      provideMockStore({
        signals: [
          { selector: CollectionsSelectors.getCollectionProvider, value: provider },
          { selector: CollectionsSelectors.getCollectionProviderLoading, value: false },
        ],
      }),
    ],
  });

  const fixture = TestBed.createComponent(CollectionsDiscoverComponent);
  const component = fixture.componentInstance;
  const store = TestBed.inject(Store);
  fixture.detectChanges();

  return { fixture, component, store };
}

describe('CollectionsDiscoverComponent', () => {
  it('should create', () => {
    const { component } = setup();
    expect(component).toBeTruthy();
  });

  it('should initialize default search filters', () => {
    const { component } = setup();
    expect(component.defaultSearchFiltersInitialized()).toBe(true);
  });

  it('should dispatch SetDefaultFilterValue with collection IRI', () => {
    const { store } = setup();
    const dispatched = (store.dispatch as Mock).mock.calls.flat();
    const setDefaultFilter = dispatched.find(
      (c: unknown) => c instanceof SetDefaultFilterValue
    ) as SetDefaultFilterValue;

    expect(setDefaultFilter).toBeDefined();
    expect(setDefaultFilter.filterKey).toBe('isPartOfCollection');
    expect(setDefaultFilter.value).toBe(MOCK_COLLECTION_IRI);
  });

  it('should not dispatch SetExtraFilters when provider has no requiredMetadataTemplate', () => {
    const { store } = setup();
    const dispatched = (store.dispatch as Mock).mock.calls.flat();
    expect(dispatched.some((c: unknown) => c instanceof SetExtraFilters)).toBe(false);
  });

  it('should dispatch SetExtraFilters when provider has a requiredMetadataTemplate', () => {
    const { store } = setup({ provider: MOCK_COLLECTION_PROVIDER_WITH_TEMPLATE });

    const dispatched = (store.dispatch as Mock).mock.calls.flat();
    const setExtraFilters = dispatched.find((c: unknown) => c instanceof SetExtraFilters) as SetExtraFilters;

    expect(setExtraFilters).toBeDefined();
    expect(setExtraFilters.filters).toHaveLength(1);
    expect(setExtraFilters.filters[0].key).toBe('field1');
    expect(setExtraFilters.filters[0].label).toBe('Field One');
    expect(setExtraFilters.filters[0].cedarPropertyIri).toBe('test-field-uuid');
    expect(setExtraFilters.filters[0].options).toHaveLength(2);
  });

  it('should render GlobalSearchComponent when filters are initialized', () => {
    const { fixture } = setup();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('osf-global-search')).toBeTruthy();
  });
});
