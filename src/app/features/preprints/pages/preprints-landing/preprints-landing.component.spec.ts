import { Store } from '@ngxs/store';

import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { TitleCasePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { BrandService } from '@osf/shared/services/brand.service';

import { AdvisoryBoardComponent, BrowseBySubjectsComponent, PreprintServicesComponent } from '../../components';
import { PreprintProviderDetails } from '../../models';
import {
  GetHighlightedSubjectsByProviderId,
  GetPreprintProviderById,
  GetPreprintProvidersToAdvertise,
  PreprintProvidersSelectors,
} from '../../store/preprint-providers';

import { PreprintsLandingComponent } from './preprints-landing.component';

import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { PREPRINT_PROVIDER_SHORT_INFO_MOCK } from '@testing/mocks/preprint-provider-short-info.mock';
import { SUBJECTS_MOCK } from '@testing/mocks/subject.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { BrandServiceMock, BrandServiceMockType } from '@testing/providers/brand-service.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';

describe('PreprintsLandingComponent', () => {
  let component: PreprintsLandingComponent;
  let fixture: ComponentFixture<PreprintsLandingComponent>;
  let store: Store;
  let routerMock: RouterMockType;
  let brandServiceMock: BrandServiceMockType;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockProvidersToAdvertise = [PREPRINT_PROVIDER_SHORT_INFO_MOCK];
  const mockHighlightedSubjects = SUBJECTS_MOCK;
  const mockDefaultProvider = 'osf';

  const defaultSignals: SignalOverride[] = [
    { selector: PreprintProvidersSelectors.getPreprintProviderDetails(mockDefaultProvider), value: mockProvider },
    { selector: PreprintProvidersSelectors.isPreprintProviderDetailsLoading, value: false },
    { selector: PreprintProvidersSelectors.getPreprintProvidersToAdvertise, value: mockProvidersToAdvertise },
    { selector: PreprintProvidersSelectors.getHighlightedSubjectsForProvider, value: mockHighlightedSubjects },
    { selector: PreprintProvidersSelectors.areSubjectsLoading, value: false },
  ];

  function setup() {
    routerMock = RouterMockBuilder.create().withNavigate(jest.fn().mockResolvedValue(true)).build();
    brandServiceMock = BrandServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [
        PreprintsLandingComponent,
        ...MockComponents(
          SearchInputComponent,
          AdvisoryBoardComponent,
          PreprintServicesComponent,
          BrowseBySubjectsComponent
        ),
        MockPipe(TitleCasePipe),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(BrandService, brandServiceMock),
        MockProvider(Router, routerMock),
        provideMockStore({ signals: defaultSignals }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(PreprintsLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  afterEach(() => {
    fixture?.destroy();
    jest.restoreAllMocks();
  });

  it('should initialize with correct default values', () => {
    setup();

    expect(component.searchControl.value).toBe('');
    expect(component.supportEmail).toBeDefined();
    expect(component.classes).toBe('flex-1 flex flex-column w-full h-full');
  });

  it('should dispatch initial actions on creation', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new GetPreprintProviderById(mockDefaultProvider));
    expect(store.dispatch).toHaveBeenCalledWith(new GetPreprintProvidersToAdvertise());
    expect(store.dispatch).toHaveBeenCalledWith(new GetHighlightedSubjectsByProviderId(mockDefaultProvider));
  });

  it('should apply branding when provider is available', () => {
    setup();

    expect(brandServiceMock.applyBranding).toHaveBeenCalledWith(mockProvider.brand);
  });

  it('should reset branding on destroy', () => {
    setup();

    component.ngOnDestroy();

    expect(brandServiceMock.resetBranding).toHaveBeenCalled();
  });

  it('should navigate to search page with search value', () => {
    setup();
    component.searchControl.setValue('test search');

    component.submitSearch();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/search'], {
      queryParams: { search: 'test search', tab: ResourceType.Preprint },
    });
  });

  it('should not navigate when search value is empty', () => {
    setup();
    component.searchControl.setValue('');

    component.submitSearch();

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should not navigate when search value is whitespace only', () => {
    setup();
    component.searchControl.setValue('   ');

    component.submitSearch();

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
