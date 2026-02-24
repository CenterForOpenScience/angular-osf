import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { GlobalSearchComponent } from '@osf/shared/components/global-search/global-search.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { BrandService } from '@osf/shared/services/brand.service';
import { BrowserTabService } from '@osf/shared/services/browser-tab.service';
import { HeaderStyleService } from '@osf/shared/services/header-style.service';
import { SetDefaultFilterValue, SetResourceType } from '@osf/shared/stores/global-search';

import { PreprintProviderHeroComponent } from '../../components';
import { PreprintProviderDetails } from '../../models';
import { GetPreprintProviderById, PreprintProvidersSelectors } from '../../store/preprint-providers';

import { PreprintProviderDiscoverComponent } from './preprint-provider-discover.component';

import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { BrandServiceMock, BrandServiceMockType } from '@testing/providers/brand-service.mock';
import { BrowserTabServiceMock, BrowserTabServiceMockType } from '@testing/providers/browser-tab-service.mock';
import { HeaderStyleServiceMock, HeaderStyleServiceMockType } from '@testing/providers/header-style-service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';

describe('PreprintProviderDiscoverComponent', () => {
  let component: PreprintProviderDiscoverComponent;
  let fixture: ComponentFixture<PreprintProviderDiscoverComponent>;
  let store: Store;
  let brandServiceMock: BrandServiceMockType;
  let headerStyleMock: HeaderStyleServiceMockType;
  let browserTabMock: BrowserTabServiceMockType;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockProviderId = 'osf';

  const defaultSignals: SignalOverride[] = [
    { selector: PreprintProvidersSelectors.getPreprintProviderDetails(mockProviderId), value: mockProvider },
    { selector: PreprintProvidersSelectors.isPreprintProviderDetailsLoading, value: false },
  ];

  function setup(overrides?: { selectorOverrides?: SignalOverride[] }) {
    const signals = mergeSignalOverrides(defaultSignals, overrides?.selectorOverrides);
    const routeMock = ActivatedRouteMockBuilder.create().withParams({ providerId: mockProviderId }).build();
    brandServiceMock = BrandServiceMock.simple();
    headerStyleMock = HeaderStyleServiceMock.simple();
    browserTabMock = BrowserTabServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [
        PreprintProviderDiscoverComponent,
        ...MockComponents(PreprintProviderHeroComponent, GlobalSearchComponent),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, routeMock),
        MockProvider(BrandService, brandServiceMock),
        MockProvider(HeaderStyleService, headerStyleMock),
        MockProvider(BrowserTabService, browserTabMock),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(PreprintProviderDiscoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  afterEach(() => {
    fixture?.destroy();
    jest.restoreAllMocks();
  });

  it('should initialize with correct default values', () => {
    setup();

    expect(component.providerId).toBe(mockProviderId);
    expect(component.classes).toBe('flex-1 flex flex-column w-full h-full');
    expect(component.searchControl.value).toBe('');
    expect(component.defaultSearchFiltersInitialized()).toBe(true);
  });

  it('should dispatch provider fetch on creation', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new GetPreprintProviderById(mockProviderId));
  });

  it('should initialize global search filters when provider is available', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new SetDefaultFilterValue('publisher', mockProvider.iri));
    expect(store.dispatch).toHaveBeenCalledWith(new SetResourceType(ResourceType.Preprint));
    expect(component.defaultSearchFiltersInitialized()).toBe(true);
  });

  it('should not initialize global search filters when provider is unavailable', () => {
    setup({
      selectorOverrides: [
        { selector: PreprintProvidersSelectors.getPreprintProviderDetails(mockProviderId), value: null },
      ],
    });

    const dispatchedActions = (store.dispatch as jest.Mock).mock.calls.map(([action]) => action);

    expect(dispatchedActions.some((action) => action instanceof SetDefaultFilterValue)).toBe(false);
    expect(dispatchedActions.some((action) => action instanceof SetResourceType)).toBe(false);
    expect(component.defaultSearchFiltersInitialized()).toBe(false);
  });

  it('should apply branding when provider is available', () => {
    setup();

    expect(brandServiceMock.applyBranding).toHaveBeenCalledWith(mockProvider.brand);
    expect(headerStyleMock.applyHeaderStyles).toHaveBeenCalledWith(
      mockProvider.brand.primaryColor,
      mockProvider.brand.secondaryColor,
      mockProvider.brand.heroBackgroundImageUrl
    );
    expect(browserTabMock.updateTabStyles).toHaveBeenCalledWith(mockProvider.faviconUrl, mockProvider.name);
  });

  it('should reset styles on destroy', () => {
    setup();

    component.ngOnDestroy();

    expect(headerStyleMock.resetToDefaults).toHaveBeenCalled();
    expect(brandServiceMock.resetBranding).toHaveBeenCalled();
    expect(browserTabMock.resetToDefaults).toHaveBeenCalled();
  });
});
