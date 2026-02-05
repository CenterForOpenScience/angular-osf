import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideServerRendering } from '@angular/platform-server';
import { ActivatedRoute, Router } from '@angular/router';

import { HelpScoutService } from '@core/services/help-scout.service';
import { PrerenderReadyService } from '@core/services/prerender-ready.service';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';
import { MetaTagsService } from '@osf/shared/services/meta-tags.service';
import { ContributorsSelectors } from '@osf/shared/stores/contributors';

import {
  AdditionalInfoComponent,
  GeneralInformationComponent,
  ModerationStatusBannerComponent,
  PreprintFileSectionComponent,
  PreprintMakeDecisionComponent,
  PreprintMetricsInfoComponent,
  PreprintTombstoneComponent,
  PreprintWarningBannerComponent,
  ShareAndDownloadComponent,
  StatusBannerComponent,
} from '../../components';
import { ReviewsState } from '../../enums';
import { PreprintSelectors } from '../../store/preprint';
import { PreprintProvidersSelectors } from '../../store/preprint-providers';

import { PreprintDetailsComponent } from './preprint-details.component';

import { MOCK_CONTRIBUTOR } from '@testing/mocks/contributors.mock';
import { DataciteMockFactory } from '@testing/mocks/datacite.service.mock';
import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { PREPRINT_REQUEST_MOCK } from '@testing/mocks/preprint-request.mock';
import { REVIEW_ACTION_MOCK } from '@testing/mocks/review-action.mock';
import { ToastServiceMock } from '@testing/mocks/toast.service.mock';
import { TranslationServiceMock } from '@testing/mocks/translation.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { HelpScoutServiceMockFactory } from '@testing/providers/help-scout.service.mock';
import { MetaTagsServiceMockFactory } from '@testing/providers/meta-tags.service.mock';
import { PrerenderReadyServiceMockFactory } from '@testing/providers/prerender-ready.service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('PreprintDetailsComponent', () => {
  let component: PreprintDetailsComponent;
  let fixture: ComponentFixture<PreprintDetailsComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;
  let dataciteService: jest.Mocked<DataciteService>;
  let metaTagsService: jest.Mocked<MetaTagsService>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;

  const mockPreprint = PREPRINT_MOCK;
  const mockProvider = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockReviewActions = [REVIEW_ACTION_MOCK];
  const mockWithdrawalRequests = [PREPRINT_REQUEST_MOCK];
  const mockRequestActions = [REVIEW_ACTION_MOCK];
  const mockContributors = [MOCK_CONTRIBUTOR];

  beforeEach(async () => {
    routerMock = RouterMockBuilder.create()
      .withNavigate(jest.fn().mockResolvedValue(true))
      .withNavigateByUrl(jest.fn().mockResolvedValue(true))
      .build();

    activatedRouteMock = ActivatedRouteMockBuilder.create()
      .withParams({ providerId: 'osf', id: 'preprint-1' })
      .withQueryParams({ mode: 'moderator' })
      .build();

    mockCustomDialogService = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();

    dataciteService = {
      logIdentifiableView: jest.fn().mockReturnValue(of(void 0)),
      logIdentifiableDownload: jest.fn().mockReturnValue(of(void 0)),
    } as any;

    metaTagsService = {
      updateMetaTags: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        PreprintDetailsComponent,
        OSFTestingModule,
        ...MockComponents(
          PreprintFileSectionComponent,
          ShareAndDownloadComponent,
          GeneralInformationComponent,
          AdditionalInfoComponent,
          StatusBannerComponent,
          PreprintTombstoneComponent,
          PreprintWarningBannerComponent,
          ModerationStatusBannerComponent,
          PreprintMakeDecisionComponent,
          PreprintMetricsInfoComponent
        ),
      ],
      providers: [
        TranslationServiceMock,
        ToastServiceMock,
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, activatedRouteMock),
        MockProvider(DataciteService, dataciteService),
        MockProvider(MetaTagsService, metaTagsService),
        MockProvider(CustomDialogService, mockCustomDialogService),
        provideMockStore({
          signals: [
            {
              selector: PreprintProvidersSelectors.getPreprintProviderDetails('osf'),
              value: mockProvider,
            },
            {
              selector: PreprintProvidersSelectors.isPreprintProviderDetailsLoading,
              value: false,
            },
            {
              selector: PreprintSelectors.getPreprint,
              value: mockPreprint,
            },
            {
              selector: PreprintSelectors.isPreprintLoading,
              value: false,
            },
            {
              selector: ContributorsSelectors.getBibliographicContributors,
              value: mockContributors,
            },
            {
              selector: ContributorsSelectors.isBibliographicContributorsLoading,
              value: false,
            },
            {
              selector: PreprintSelectors.getPreprintReviewActions,
              value: mockReviewActions,
            },
            {
              selector: PreprintSelectors.arePreprintReviewActionsLoading,
              value: false,
            },
            {
              selector: PreprintSelectors.getPreprintRequests,
              value: mockWithdrawalRequests,
            },
            {
              selector: PreprintSelectors.arePreprintRequestsLoading,
              value: false,
            },
            {
              selector: PreprintSelectors.getPreprintRequestActions,
              value: mockRequestActions,
            },
            {
              selector: PreprintSelectors.arePreprintRequestActionsLoading,
              value: false,
            },
            {
              selector: PreprintSelectors.hasAdminAccess,
              value: false,
            },
            {
              selector: PreprintSelectors.hasWriteAccess,
              value: false,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return preprint from store', () => {
    const preprint = component.preprint();
    expect(preprint).toBe(mockPreprint);
  });

  it('should return preprint provider from store', () => {
    const provider = component.preprintProvider();
    expect(provider).toBe(mockProvider);
  });

  it('should return loading states from store', () => {
    expect(component.isPreprintLoading()).toBe(false);
    expect(component.isPreprintProviderLoading()).toBe(false);
    expect(component.areReviewActionsLoading()).toBe(false);
    expect(component.areWithdrawalRequestsLoading()).toBe(false);
    expect(component.areRequestActionsLoading()).toBe(false);
  });

  it('should return review actions from store', () => {
    const actions = component.reviewActions();
    expect(actions).toBe(mockReviewActions);
  });

  it('should return withdrawal requests from store', () => {
    const requests = component.withdrawalRequests();
    expect(requests).toBe(mockWithdrawalRequests);
  });

  it('should return request actions from store', () => {
    const actions = component.requestActions();
    expect(actions).toBe(mockRequestActions);
  });

  it('should return contributors from store', () => {
    const contributors = component.contributors();
    expect(contributors).toBe(mockContributors);
  });

  it('should return contributors loading state from store', () => {
    const loading = component.areContributorsLoading();
    expect(loading).toBe(false);
  });

  it('should compute latest action correctly', () => {
    const latestAction = component.latestAction();
    expect(latestAction).toBe(mockReviewActions[0]);
  });

  it('should compute latest withdrawal request correctly', () => {
    const latestRequest = component.latestWithdrawalRequest();
    expect(latestRequest).toBe(mockWithdrawalRequests[0]);
  });

  it('should compute latest request action correctly', () => {
    const latestAction = component.latestRequestAction();
    expect(latestAction).toBe(mockRequestActions[0]);
  });

  it('should compute isOsfPreprint correctly', () => {
    const isOsf = component.isOsfPreprint();
    expect(isOsf).toBe(true);
  });

  it('should compute moderation mode correctly', () => {
    const moderationMode = component.moderationMode();
    expect(moderationMode).toBe(true);
  });

  it('should compute create new version button visibility', () => {
    const visible = component.createNewVersionButtonVisible();
    expect(typeof visible).toBe('boolean');
  });

  it('should compute edit button visibility', () => {
    const visible = component.editButtonVisible();
    expect(typeof visible).toBe('boolean');
  });

  it('should compute edit button label', () => {
    const label = component.editButtonLabel();
    expect(typeof label).toBe('string');
  });

  it('should compute withdrawal button visibility', () => {
    const visible = component.withdrawalButtonVisible();
    expect(typeof visible).toBe('boolean');
  });

  it('should compute is pending withdrawal', () => {
    const pending = component.isPendingWithdrawal();
    expect(typeof pending).toBe('boolean');
  });

  it('should compute is withdrawal rejected', () => {
    const rejected = component.isWithdrawalRejected();
    expect(typeof rejected).toBe('boolean');
  });

  it('should compute moderation status banner visibility', () => {
    const visible = component.moderationStatusBannerVisible();
    expect(typeof visible).toBe('boolean');
  });

  it('should compute status banner visibility', () => {
    const visible = component.statusBannerVisible();
    expect(typeof visible).toBe('boolean');
  });

  it('should navigate to edit page when editPreprintClicked is called', () => {
    component.editPreprintClicked();

    expect(routerMock.navigate).toHaveBeenCalledWith(['preprints', 'osf', 'edit', 'preprint-1']);
  });

  it('should handle create new version clicked', () => {
    expect(() => component.createNewVersionClicked()).not.toThrow();
  });

  it('should handle preprint with different states', () => {
    const acceptedPreprint = { ...mockPreprint, reviewsState: ReviewsState.Accepted };
    jest.spyOn(component, 'preprint').mockReturnValue(acceptedPreprint);

    const withdrawable = component['preprintWithdrawableState']();
    expect(typeof withdrawable).toBe('boolean');
  });

  it('should handle preprint with pending state', () => {
    const pendingPreprint = { ...mockPreprint, reviewsState: ReviewsState.Pending };
    jest.spyOn(component, 'preprint').mockReturnValue(pendingPreprint);

    const withdrawable = component['preprintWithdrawableState']();
    expect(withdrawable).toBe(true);
  });

  it('should handle preprint with accepted state', () => {
    const acceptedPreprint = { ...mockPreprint, reviewsState: ReviewsState.Accepted };
    jest.spyOn(component, 'preprint').mockReturnValue(acceptedPreprint);

    const withdrawable = component['preprintWithdrawableState']();
    expect(withdrawable).toBe(true);
  });

  it('should handle preprint with pending state', () => {
    const pendingPreprint = { ...mockPreprint, reviewsState: ReviewsState.Pending };
    jest.spyOn(component, 'preprint').mockReturnValue(pendingPreprint);

    const withdrawable = component['preprintWithdrawableState']();
    expect(withdrawable).toBe(true);
  });

  it('should handle preprint without write permissions', () => {
    const preprintWithoutWrite = {
      ...mockPreprint,
      currentUserPermissions: [UserPermissions.Read],
    };
    jest.spyOn(component, 'preprint').mockReturnValue(preprintWithoutWrite);

    const hasAccess = component['hasWriteAccess']();
    expect(hasAccess).toBe(false);
  });
});

describe('PreprintDetailsComponent SSR Tests', () => {
  let component: PreprintDetailsComponent;
  let fixture: ComponentFixture<PreprintDetailsComponent>;
  let httpMock: HttpTestingController;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let store: Store;

  const mockPreprint = PREPRINT_MOCK;
  const mockProvider = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockContributors = [MOCK_CONTRIBUTOR];

  beforeEach(async () => {
    mockRouter = RouterMockBuilder.create().build();
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ providerId: 'osf', id: 'preprint-1' }).build();

    await TestBed.configureTestingModule({
      imports: [
        PreprintDetailsComponent,
        OSFTestingModule,
        ...MockComponents(
          PreprintFileSectionComponent,
          ShareAndDownloadComponent,
          GeneralInformationComponent,
          AdditionalInfoComponent,
          StatusBannerComponent,
          PreprintTombstoneComponent,
          PreprintWarningBannerComponent,
          ModerationStatusBannerComponent,
          PreprintMakeDecisionComponent,
          PreprintMetricsInfoComponent
        ),
      ],
      providers: [
        provideServerRendering(),
        { provide: PLATFORM_ID, useValue: 'server' },
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        MockProvider(CustomDialogService, CustomDialogServiceMockBuilder.create().build()),
        MockProvider(DataciteService, DataciteMockFactory()),
        MockProvider(MetaTagsService, MetaTagsServiceMockFactory()),
        MockProvider(PrerenderReadyService, PrerenderReadyServiceMockFactory()),
        MockProvider(HelpScoutService, HelpScoutServiceMockFactory()),
        TranslationServiceMock,
        ToastServiceMock,
        provideMockStore({
          signals: [
            {
              selector: PreprintProvidersSelectors.getPreprintProviderDetails('osf'),
              value: mockProvider,
            },
            {
              selector: PreprintProvidersSelectors.isPreprintProviderDetailsLoading,
              value: false,
            },
            {
              selector: PreprintSelectors.getPreprint,
              value: mockPreprint,
            },
            {
              selector: PreprintSelectors.isPreprintLoading,
              value: false,
            },
            {
              selector: ContributorsSelectors.getBibliographicContributors,
              value: mockContributors,
            },
            {
              selector: ContributorsSelectors.isBibliographicContributorsLoading,
              value: false,
            },
            {
              selector: PreprintSelectors.getPreprintReviewActions,
              value: [],
            },
            {
              selector: PreprintSelectors.arePreprintReviewActionsLoading,
              value: false,
            },
            {
              selector: PreprintSelectors.getPreprintRequests,
              value: [],
            },
            {
              selector: PreprintSelectors.arePreprintRequestsLoading,
              value: false,
            },
            {
              selector: PreprintSelectors.getPreprintRequestActions,
              value: [],
            },
            {
              selector: PreprintSelectors.arePreprintRequestActionsLoading,
              value: false,
            },
            {
              selector: PreprintSelectors.hasAdminAccess,
              value: false,
            },
            {
              selector: PreprintSelectors.hasWriteAccess,
              value: false,
            },
            {
              selector: PreprintSelectors.getPreprintMetrics,
              value: null,
            },
            {
              selector: PreprintSelectors.arePreprintMetricsLoading,
              value: false,
            },
          ],
        }),
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(PreprintDetailsComponent);
    component = fixture.componentInstance;
    document.head.innerHTML = '';
  });

  it('should render PreprintDetailsComponent server-side without errors', () => {
    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
    expect(component).toBeTruthy();
  });

  it('should add signposting tags during SSR', () => {
    fixture.detectChanges();

    const linkTags = Array.from(document.head.querySelectorAll('link[rel="linkset"]'));
    expect(linkTags.length).toBe(2);
    expect(linkTags[0].getAttribute('href')).toBe('http://localhost:4200/metadata/preprint-1/?format=linkset');
    expect(linkTags[0].getAttribute('type')).toBe('application/linkset');
    expect(linkTags[1].getAttribute('href')).toBe('http://localhost:4200/metadata/preprint-1/?format=linkset%2Bjson');
    expect(linkTags[1].getAttribute('type')).toBe('application/linkset+json');
  });

  it('should not access browser-only APIs during SSR', () => {
    const platformId = TestBed.inject(PLATFORM_ID);
    expect(platformId).toBe('server');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not call browser-only actions in ngOnDestroy during SSR', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
    dispatchSpy.mockClear();
    component.ngOnDestroy();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
