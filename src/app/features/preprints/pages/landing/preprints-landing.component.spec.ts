import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { TitleCasePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import {
  AdvisoryBoardComponent,
  BrowseBySubjectsComponent,
  PreprintServicesComponent,
} from '@osf/features/preprints/components';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintProvidersSelectors } from '@osf/features/preprints/store/preprint-providers';
import { SearchInputComponent } from '@shared/components';
import { ResourceType } from '@shared/enums';
import { BrandService } from '@shared/services';

import { PreprintsLandingComponent } from './preprints-landing.component';

import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { PREPRINT_PROVIDER_SHORT_INFO_MOCK } from '@testing/mocks/preprint-provider-short-info.mock';
import { SUBJECTS_MOCK } from '@testing/mocks/subject.mock';
import { TranslationServiceMock } from '@testing/mocks/translation.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('PreprintsLandingComponent', () => {
  let component: PreprintsLandingComponent;
  let fixture: ComponentFixture<PreprintsLandingComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockProvidersToAdvertise = [PREPRINT_PROVIDER_SHORT_INFO_MOCK];
  const mockHighlightedSubjects = SUBJECTS_MOCK;
  const mockDefaultProvider = 'osf';

  beforeEach(async () => {
    routerMock = RouterMockBuilder.create().withNavigate(jest.fn().mockResolvedValue(true)).build();

    await TestBed.configureTestingModule({
      imports: [
        PreprintsLandingComponent,
        OSFTestingModule,
        ...MockComponents(
          SearchInputComponent,
          AdvisoryBoardComponent,
          PreprintServicesComponent,
          BrowseBySubjectsComponent
        ),
        MockPipe(TitleCasePipe),
      ],
      providers: [
        TranslationServiceMock,
        MockProvider(ENVIRONMENT, {
          defaultProvider: mockDefaultProvider,
          supportEmail: 'support@osf.io',
        }),
        MockProvider(BrandService),
        MockProvider(Router, routerMock),
        provideMockStore({
          signals: [
            {
              selector: PreprintProvidersSelectors.getPreprintProviderDetails(mockDefaultProvider),
              value: mockProvider,
            },
            {
              selector: PreprintProvidersSelectors.isPreprintProviderDetailsLoading,
              value: false,
            },
            {
              selector: PreprintProvidersSelectors.getPreprintProvidersToAdvertise,
              value: mockProvidersToAdvertise,
            },
            {
              selector: PreprintProvidersSelectors.getHighlightedSubjectsForProvider,
              value: mockHighlightedSubjects,
            },
            {
              selector: PreprintProvidersSelectors.areSubjectsLoading,
              value: false,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.searchControl.value).toBe('');
    expect(component.supportEmail).toBeDefined();
  });

  it('should return preprint provider from store', () => {
    const provider = component.osfPreprintProvider();
    expect(provider).toBe(mockProvider);
  });

  it('should return loading state from store', () => {
    const loading = component.isPreprintProviderLoading();
    expect(loading).toBe(false);
  });

  it('should return providers to advertise from store', () => {
    const providers = component.preprintProvidersToAdvertise();
    expect(providers).toBe(mockProvidersToAdvertise);
  });

  it('should return highlighted subjects from store', () => {
    const subjects = component.highlightedSubjectsByProviderId();
    expect(subjects).toBe(mockHighlightedSubjects);
  });

  it('should return subjects loading state from store', () => {
    const loading = component.areSubjectsLoading();
    expect(loading).toBe(false);
  });

  it('should have correct CSS classes', () => {
    expect(component.classes).toBe('flex-1 flex flex-column w-full h-full');
  });

  it('should navigate to search page with search value', () => {
    component.searchControl.setValue('test search');

    component.redirectToSearchPageWithValue();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/search'], {
      queryParams: { search: 'test search', resourceTab: ResourceType.Preprint },
    });
  });

  it('should navigate to search page with empty search value', () => {
    component.searchControl.setValue('');

    component.redirectToSearchPageWithValue();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/search'], {
      queryParams: { search: '', resourceTab: ResourceType.Preprint },
    });
  });

  it('should navigate to search page with null search value', () => {
    component.searchControl.setValue(null);

    component.redirectToSearchPageWithValue();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/search'], {
      queryParams: { search: null, resourceTab: ResourceType.Preprint },
    });
  });

  it('should handle search control value changes', () => {
    const testValue = 'new search term';
    component.searchControl.setValue(testValue);
    expect(component.searchControl.value).toBe(testValue);
  });

  it('should have readonly properties', () => {
    expect(component.supportEmail).toBeDefined();
    expect(typeof component.supportEmail).toBe('string');
  });

  it('should initialize form control correctly', () => {
    expect(component.searchControl).toBeDefined();
    expect(component.searchControl.value).toBe('');
  });
});
