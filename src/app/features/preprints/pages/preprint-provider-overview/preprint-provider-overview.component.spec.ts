import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { BrandService } from '@osf/shared/services/brand.service';
import { BrowserTabService } from '@osf/shared/services/browser-tab.service';
import { HeaderStyleService } from '@osf/shared/services/header-style.service';

import {
  AdvisoryBoardComponent,
  BrowseBySubjectsComponent,
  PreprintProviderFooterComponent,
  PreprintProviderHeroComponent,
} from '../../components';
import { PreprintProviderDetails } from '../../models';
import {
  GetHighlightedSubjectsByProviderId,
  GetPreprintProviderById,
  PreprintProvidersSelectors,
} from '../../store/preprint-providers';

import { PreprintProviderOverviewComponent } from './preprint-provider-overview.component';

import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { SUBJECTS_MOCK } from '@testing/mocks/subject.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { BrandServiceMock, BrandServiceMockType } from '@testing/providers/brand-service.mock';
import { BrowserTabServiceMock, BrowserTabServiceMockType } from '@testing/providers/browser-tab-service.mock';
import { HeaderStyleServiceMock, HeaderStyleServiceMockType } from '@testing/providers/header-style-service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';

describe('PreprintProviderOverviewComponent', () => {
  let component: PreprintProviderOverviewComponent;
  let fixture: ComponentFixture<PreprintProviderOverviewComponent>;
  let store: Store;
  let routerMock: RouterMockType;
  let routeMock: ReturnType<ActivatedRouteMockBuilder['build']>;
  let brandServiceMock: BrandServiceMockType;
  let headerStyleMock: HeaderStyleServiceMockType;
  let browserTabMock: BrowserTabServiceMockType;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockSubjects = SUBJECTS_MOCK;
  const mockProviderId = 'osf';

  const defaultSignals: SignalOverride[] = [
    { selector: PreprintProvidersSelectors.getPreprintProviderDetails(mockProviderId), value: mockProvider },
    { selector: PreprintProvidersSelectors.isPreprintProviderDetailsLoading, value: false },
    { selector: PreprintProvidersSelectors.getHighlightedSubjectsForProvider, value: mockSubjects },
    { selector: PreprintProvidersSelectors.areSubjectsLoading, value: false },
  ];

  function setup(overrides?: { selectorOverrides?: SignalOverride[] }) {
    const signals = mergeSignalOverrides(defaultSignals, overrides?.selectorOverrides);

    routerMock = RouterMockBuilder.create().withNavigate(jest.fn().mockResolvedValue(true)).build();
    routeMock = ActivatedRouteMockBuilder.create().withParams({ providerId: mockProviderId }).build();
    brandServiceMock = BrandServiceMock.simple();
    headerStyleMock = HeaderStyleServiceMock.simple();
    browserTabMock = BrowserTabServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [
        PreprintProviderOverviewComponent,
        ...MockComponents(
          PreprintProviderHeroComponent,
          PreprintProviderFooterComponent,
          AdvisoryBoardComponent,
          BrowseBySubjectsComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, routeMock),
        MockProvider(BrandService, brandServiceMock),
        MockProvider(HeaderStyleService, headerStyleMock),
        MockProvider(BrowserTabService, browserTabMock),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(PreprintProviderOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  afterEach(() => {
    fixture?.destroy();
    jest.restoreAllMocks();
  });

  it('should dispatch initial actions on creation', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new GetPreprintProviderById(mockProviderId));
    expect(store.dispatch).toHaveBeenCalledWith(new GetHighlightedSubjectsByProviderId(mockProviderId));
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

  it('should reset branding and header styles on destroy', () => {
    setup();

    component.ngOnDestroy();

    expect(headerStyleMock.resetToDefaults).toHaveBeenCalled();
    expect(brandServiceMock.resetBranding).toHaveBeenCalled();
    expect(browserTabMock.resetToDefaults).toHaveBeenCalled();
  });

  it('should navigate to discover page with search value', () => {
    setup();
    const searchValue = 'test search';

    component.redirectToDiscoverPageWithValue(searchValue);

    expect(routerMock.navigate).toHaveBeenCalledWith(['discover'], {
      relativeTo: expect.anything(),
      queryParams: { search: searchValue },
    });
  });

  it('should navigate to discover page with empty search value', () => {
    setup();
    const searchValue = '';

    component.redirectToDiscoverPageWithValue(searchValue);

    expect(routerMock.navigate).toHaveBeenCalledWith(['discover'], {
      relativeTo: expect.anything(),
      queryParams: { search: searchValue },
    });
  });

  it('should expose highlighted subjects from store', () => {
    setup();

    expect(component.highlightedSubjectsByProviderId()).toBe(mockSubjects);
  });
});
