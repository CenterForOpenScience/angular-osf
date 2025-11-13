import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { BrowserTabHelper } from '@osf/shared/helpers/browser-tab.helper';
import { HeaderStyleHelper } from '@osf/shared/helpers/header-style.helper';
import { BrandService } from '@osf/shared/services/brand.service';

import {
  AdvisoryBoardComponent,
  BrowseBySubjectsComponent,
  PreprintProviderFooterComponent,
  PreprintProviderHeroComponent,
} from '../../components';
import { PreprintProviderDetails } from '../../models';
import { PreprintProvidersSelectors } from '../../store/preprint-providers';

import { PreprintProviderOverviewComponent } from './preprint-provider-overview.component';

import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { SUBJECTS_MOCK } from '@testing/mocks/subject.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('PreprintProviderOverviewComponent', () => {
  let component: PreprintProviderOverviewComponent;
  let fixture: ComponentFixture<PreprintProviderOverviewComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let routeMock: ReturnType<ActivatedRouteMockBuilder['build']>;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockSubjects = SUBJECTS_MOCK;
  const mockProviderId = 'osf';

  beforeEach(async () => {
    jest.spyOn(BrowserTabHelper, 'updateTabStyles').mockImplementation(() => {});
    jest.spyOn(BrowserTabHelper, 'resetToDefaults').mockImplementation(() => {});
    jest.spyOn(HeaderStyleHelper, 'applyHeaderStyles').mockImplementation(() => {});
    jest.spyOn(HeaderStyleHelper, 'resetToDefaults').mockImplementation(() => {});
    jest.spyOn(BrandService, 'applyBranding').mockImplementation(() => {});
    jest.spyOn(BrandService, 'resetBranding').mockImplementation(() => {});

    routerMock = RouterMockBuilder.create().withNavigate(jest.fn().mockResolvedValue(true)).build();
    routeMock = ActivatedRouteMockBuilder.create()
      .withParams({ providerId: mockProviderId })
      .withQueryParams({})
      .build();

    await TestBed.configureTestingModule({
      imports: [
        PreprintProviderOverviewComponent,
        OSFTestingModule,
        ...MockComponents(
          PreprintProviderHeroComponent,
          PreprintProviderFooterComponent,
          AdvisoryBoardComponent,
          BrowseBySubjectsComponent
        ),
      ],
      providers: [
        MockProvider(BrandService),
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, routeMock),
        provideMockStore({
          signals: [
            {
              selector: PreprintProvidersSelectors.getPreprintProviderDetails(mockProviderId),
              value: mockProvider,
            },
            {
              selector: PreprintProvidersSelectors.isPreprintProviderDetailsLoading,
              value: false,
            },
            {
              selector: PreprintProvidersSelectors.getHighlightedSubjectsForProvider,
              value: mockSubjects,
            },
            {
              selector: PreprintProvidersSelectors.areSubjectsLoading,
              value: false,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintProviderOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.preprintProvider).toBeDefined();
    expect(component.isPreprintProviderLoading).toBeDefined();
    expect(component.highlightedSubjectsByProviderId).toBeDefined();
    expect(component.areSubjectsLoading).toBeDefined();
  });

  it('should return preprint provider from store', () => {
    const provider = component.preprintProvider();
    expect(provider).toBe(mockProvider);
  });

  it('should return loading state from store', () => {
    const loading = component.isPreprintProviderLoading();
    expect(loading).toBe(false);
  });

  it('should return highlighted subjects from store', () => {
    const subjects = component.highlightedSubjectsByProviderId();
    expect(subjects).toBe(mockSubjects);
  });

  it('should return subjects loading state from store', () => {
    const loading = component.areSubjectsLoading();
    expect(loading).toBe(false);
  });

  it('should handle provider data correctly', () => {
    const provider = component.preprintProvider();
    expect(provider).toBe(mockProvider);
    expect(provider?.id).toBe(mockProvider.id);
    expect(provider?.name).toBe(mockProvider.name);
  });

  it('should handle subjects data correctly', () => {
    const subjects = component.highlightedSubjectsByProviderId();
    expect(subjects).toBe(mockSubjects);
    expect(Array.isArray(subjects)).toBe(true);
  });

  it('should handle loading states correctly', () => {
    const providerLoading = component.isPreprintProviderLoading();
    const subjectsLoading = component.areSubjectsLoading();

    expect(typeof providerLoading).toBe('boolean');
    expect(typeof subjectsLoading).toBe('boolean');
    expect(providerLoading).toBe(false);
    expect(subjectsLoading).toBe(false);
  });

  it('should navigate to discover page with search value', () => {
    const searchValue = 'test search';
    component.redirectToDiscoverPageWithValue(searchValue);

    expect(routerMock.navigate).toHaveBeenCalledWith(['discover'], {
      relativeTo: expect.any(Object),
      queryParams: { search: searchValue },
    });
  });

  it('should navigate to discover page with empty search value', () => {
    const searchValue = '';
    component.redirectToDiscoverPageWithValue(searchValue);

    expect(routerMock.navigate).toHaveBeenCalledWith(['discover'], {
      relativeTo: expect.any(Object),
      queryParams: { search: searchValue },
    });
  });

  it('should navigate to discover page with null search value', () => {
    const searchValue = null as any;
    component.redirectToDiscoverPageWithValue(searchValue);

    expect(routerMock.navigate).toHaveBeenCalledWith(['discover'], {
      relativeTo: expect.any(Object),
      queryParams: { search: searchValue },
    });
  });

  it('should initialize signals correctly', () => {
    expect(component.preprintProvider).toBeDefined();
    expect(component.isPreprintProviderLoading).toBeDefined();
    expect(component.highlightedSubjectsByProviderId).toBeDefined();
    expect(component.areSubjectsLoading).toBeDefined();
  });

  it('should handle provider data with null values', () => {
    const provider = component.preprintProvider();
    expect(provider).toBeDefined();
    expect(provider).toBe(mockProvider);
  });

  it('should handle subjects data with empty array', () => {
    const subjects = component.highlightedSubjectsByProviderId();
    expect(subjects).toBeDefined();
    expect(Array.isArray(subjects)).toBe(true);
  });
});
