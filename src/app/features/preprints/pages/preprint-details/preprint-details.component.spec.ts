import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Observable, of, throwError } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideServerRendering } from '@angular/platform-server';
import { ActivatedRoute, Router } from '@angular/router';

import { HelpScoutService } from '@core/services/help-scout.service';
import { PrerenderReadyService } from '@core/services/prerender-ready.service';
import { ClearCurrentProvider } from '@core/store/provider';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';
import { MetaTagsService } from '@osf/shared/services/meta-tags.service';
import { ToastService } from '@osf/shared/services/toast.service';
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
import {
  FetchPreprintDetails,
  FetchPreprintRequestActions,
  FetchPreprintRequests,
  FetchPreprintReviewActions,
  PreprintSelectors,
  ResetPreprintState,
} from '../../store/preprint';
import { GetPreprintProviderById, PreprintProvidersSelectors } from '../../store/preprint-providers';
import { CreateNewVersion } from '../../store/preprint-stepper';

import { PreprintDetailsComponent } from './preprint-details.component';

import { MOCK_CONTRIBUTOR } from '@testing/mocks/contributors.mock';
import { DataciteMockFactory } from '@testing/mocks/datacite.service.mock';
import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { PREPRINT_REQUEST_MOCK } from '@testing/mocks/preprint-request.mock';
import { REVIEW_ACTION_MOCK } from '@testing/mocks/review-action.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { HelpScoutServiceMockFactory } from '@testing/providers/help-scout.service.mock';
import { MetaTagsServiceMockFactory } from '@testing/providers/meta-tags.service.mock';
import { PrerenderReadyServiceMockFactory } from '@testing/providers/prerender-ready.service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

describe('PreprintDetailsComponent', () => {
  let component: PreprintDetailsComponent;
  let fixture: ComponentFixture<PreprintDetailsComponent>;
  let store: Store;
  let routerMock: RouterMockType;
  let helpScoutServiceMock: jest.Mocked<HelpScoutService>;
  let prerenderReadyServiceMock: jest.Mocked<PrerenderReadyService>;
  let dataciteServiceMock: ReturnType<typeof DataciteMockFactory>;
  let metaTagsServiceMock: ReturnType<typeof MetaTagsServiceMockFactory>;
  let customDialogServiceMock: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let toastService: ToastServiceMockType;

  const mockProvider = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockPreprint = PREPRINT_MOCK;
  const mockReviewActions = [REVIEW_ACTION_MOCK];
  const mockRequests = [PREPRINT_REQUEST_MOCK];
  const mockContributors = [MOCK_CONTRIBUTOR];

  const defaultSignals: SignalOverride[] = [
    { selector: PreprintProvidersSelectors.getPreprintProviderDetails('osf'), value: mockProvider },
    { selector: PreprintProvidersSelectors.isPreprintProviderDetailsLoading, value: false },
    { selector: PreprintSelectors.getPreprint, value: mockPreprint },
    { selector: PreprintSelectors.isPreprintLoading, value: false },
    { selector: ContributorsSelectors.getBibliographicContributors, value: mockContributors },
    { selector: ContributorsSelectors.isBibliographicContributorsLoading, value: false },
    { selector: PreprintSelectors.getPreprintReviewActions, value: mockReviewActions },
    { selector: PreprintSelectors.arePreprintReviewActionsLoading, value: false },
    { selector: PreprintSelectors.getPreprintRequests, value: mockRequests },
    { selector: PreprintSelectors.arePreprintRequestsLoading, value: false },
    { selector: PreprintSelectors.getPreprintRequestActions, value: mockReviewActions },
    { selector: PreprintSelectors.arePreprintRequestActionsLoading, value: false },
    { selector: PreprintSelectors.hasAdminAccess, value: false },
    { selector: PreprintSelectors.hasWriteAccess, value: true },
    { selector: PreprintSelectors.getPreprintMetrics, value: null },
    { selector: PreprintSelectors.arePreprintMetricsLoading, value: false },
  ];

  function setup(overrides?: {
    selectorOverrides?: SignalOverride[];
    routeParams?: { providerId: string; id: string };
    queryParams?: Record<string, unknown>;
    routerUrl?: string;
    dialogReturnsCloseValue?: boolean;
  }) {
    const signals = mergeSignalOverrides(defaultSignals, overrides?.selectorOverrides);
    const routeParams = overrides?.routeParams ?? { providerId: 'osf', id: 'preprint-1' };
    const queryParams = overrides?.queryParams ?? { mode: 'moderator' };

    routerMock = RouterMockBuilder.create()
      .withUrl(overrides?.routerUrl ?? '/preprints/osf/preprint-1')
      .withNavigate(jest.fn().mockResolvedValue(true))
      .withNavigateByUrl(jest.fn().mockResolvedValue(true))
      .build();
    const activatedRouteMock = ActivatedRouteMockBuilder.create()
      .withParams(routeParams)
      .withQueryParams(queryParams)
      .build();
    helpScoutServiceMock = HelpScoutServiceMockFactory();
    prerenderReadyServiceMock = PrerenderReadyServiceMockFactory();
    dataciteServiceMock = DataciteMockFactory();
    metaTagsServiceMock = MetaTagsServiceMockFactory();
    toastService = ToastServiceMock.simple();
    customDialogServiceMock =
      overrides?.dialogReturnsCloseValue === false
        ? CustomDialogServiceMockBuilder.create()
            .withOpen(
              jest.fn().mockReturnValue({
                onClose: of(false),
                close: jest.fn(),
              } as any)
            )
            .build()
        : CustomDialogServiceMockBuilder.create()
            .withOpen(
              jest.fn().mockReturnValue({
                onClose: of(true),
                close: jest.fn(),
              } as any)
            )
            .build();

    TestBed.configureTestingModule({
      imports: [
        PreprintDetailsComponent,
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
        provideOSFCore(),
        MockProvider(ToastService, toastService),
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, activatedRouteMock),
        MockProvider(HelpScoutService, helpScoutServiceMock),
        MockProvider(PrerenderReadyService, prerenderReadyServiceMock),
        MockProvider(DataciteService, dataciteServiceMock),
        MockProvider(MetaTagsService, metaTagsServiceMock),
        MockProvider(CustomDialogService, customDialogServiceMock),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(PreprintDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  afterEach(() => {
    fixture?.destroy();
    jest.restoreAllMocks();
  });

  it('should dispatch initial fetch actions on creation', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new GetPreprintProviderById('osf'));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchPreprintDetails('preprint-1'));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchPreprintReviewActions());
    expect(store.dispatch).toHaveBeenCalledWith(new FetchPreprintRequests());
    expect(store.dispatch).toHaveBeenCalledWith(new FetchPreprintRequestActions(PREPRINT_REQUEST_MOCK.id));
  });

  it('should set HelpScout and datacite tracking on initialization', () => {
    setup();

    expect(helpScoutServiceMock.setResourceType).toHaveBeenCalledWith('preprint');
    expect(dataciteServiceMock.logIdentifiableView).toHaveBeenCalledTimes(1);
    expect(prerenderReadyServiceMock.setNotReady).toHaveBeenCalled();
  });

  it('should update meta tags when preprint and contributors are loaded', () => {
    setup();

    expect(metaTagsServiceMock.updateMetaTags).toHaveBeenCalled();
  });

  it('should not fetch moderation actions when not moderator and no permissions', () => {
    setup({
      queryParams: {},
      selectorOverrides: [
        {
          selector: PreprintProvidersSelectors.getPreprintProviderDetails('osf'),
          value: { ...mockProvider, permissions: [] },
        },
      ],
    });

    expect(store.dispatch).not.toHaveBeenCalledWith(new FetchPreprintReviewActions());
    expect(store.dispatch).not.toHaveBeenCalledWith(new FetchPreprintRequests());
  });

  it('should navigate to canonical version id when url id differs', () => {
    setup({ routeParams: { providerId: 'osf', id: 'old-id' }, routerUrl: '/preprints/osf/old-id' });

    expect(routerMock.navigate).toHaveBeenCalledWith(['../', 'preprint-1'], {
      relativeTo: expect.anything(),
      replaceUrl: true,
      queryParamsHandling: 'preserve',
    });
  });

  it('should navigate to edit page when edit is clicked', () => {
    setup();

    component.editPreprintClicked();

    expect(routerMock.navigate).toHaveBeenCalledWith(['preprints', 'osf', 'edit', 'preprint-1']);
  });

  it('should create new version and navigate to new version route', () => {
    setup();
    jest.spyOn(store, 'selectSnapshot').mockReturnValue({ id: 'new-version-id' } as any);

    component.createNewVersionClicked();

    expect(store.dispatch).toHaveBeenCalledWith(new CreateNewVersion('preprint-1'));
    expect(routerMock.navigate).toHaveBeenCalledWith(['preprints', 'osf', 'new-version', 'new-version-id']);
  });

  it('should return early in createNewVersionClicked when preprint id is missing', () => {
    setup({ routeParams: { providerId: 'osf', id: '' } });
    (store.dispatch as jest.Mock).mockClear();

    component.createNewVersionClicked();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(CreateNewVersion));
  });

  it('should show toast error for 409 on create new version', () => {
    setup();
    (store.dispatch as jest.Mock).mockImplementation((action: unknown): Observable<unknown> => {
      if (action instanceof CreateNewVersion) {
        return throwError(
          () =>
            new HttpErrorResponse({
              status: 409,
              error: { errors: [{ detail: 'Version already exists' }] },
            })
        );
      }

      return of(true);
    });

    component.createNewVersionClicked();

    expect(toastService.showError).toHaveBeenCalledWith('Version already exists');
  });

  it('should refetch preprint after successful withdraw dialog close', () => {
    setup();
    const fetchSpy = jest.spyOn(component, 'fetchPreprint');

    component.handleWithdrawClicked();

    expect(customDialogServiceMock.open).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledWith('preprint-1');
  });

  it('should navigate to pending moderation page on matching 403 error', () => {
    setup();
    (store.dispatch as jest.Mock).mockImplementation((action: unknown): Observable<unknown> => {
      if (action instanceof FetchPreprintDetails) {
        return throwError(
          () =>
            new HttpErrorResponse({
              status: 403,
              error: {
                errors: [{ detail: 'This preprint is pending moderation and is not yet publicly available.' }],
              },
            })
        );
      }

      return of(true);
    });

    component.fetchPreprint('preprint-1');

    expect(routerMock.navigate).toHaveBeenCalledWith(['/preprints', 'osf', 'preprint-1', 'pending-moderation']);
  });

  it('should return early in fetchPreprint when preprint id is missing', () => {
    setup();
    const prerenderSpy = prerenderReadyServiceMock.setNotReady as jest.Mock;
    prerenderSpy.mockClear();
    (store.dispatch as jest.Mock).mockClear();

    component.fetchPreprint('');

    expect(prerenderSpy).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchPreprintDetails));
  });

  it('should reset state and provider on destroy in browser', () => {
    setup();
    (store.dispatch as jest.Mock).mockClear();

    component.ngOnDestroy();

    expect(store.dispatch).toHaveBeenCalledWith(new ResetPreprintState());
    expect(store.dispatch).toHaveBeenCalledWith(new ClearCurrentProvider());
    expect(helpScoutServiceMock.unsetResourceType).toHaveBeenCalled();
  });

  it('should expose expected computed values for default mocks', () => {
    setup();

    expect(component.latestAction()).toBe(mockReviewActions[0]);
    expect(component.latestWithdrawalRequest()).toBe(mockRequests[0]);
    expect(component.latestRequestAction()).toBe(mockReviewActions[0]);
    expect(component.isPendingWithdrawal()).toBe(true);
    expect(component.isWithdrawalRejected()).toBe(false);
    expect(component.moderationMode()).toBe(true);
    expect(component.isOsfPreprint()).toBe(true);
  });

  it('should mark preprint withdrawable for pending and accepted states', () => {
    setup();
    jest.spyOn(component, 'preprint').mockReturnValue({ ...mockPreprint, reviewsState: ReviewsState.Pending } as any);
    expect(component['preprintWithdrawableState']()).toBe(true);

    jest.spyOn(component, 'preprint').mockReturnValue({ ...mockPreprint, reviewsState: ReviewsState.Accepted } as any);
    expect(component['preprintWithdrawableState']()).toBe(true);
  });

  it('should hide edit button when preprint is withdrawn', () => {
    setup({
      selectorOverrides: [
        { selector: PreprintSelectors.getPreprint, value: { ...mockPreprint, dateWithdrawn: '2024-01-01' } },
      ],
    });

    expect(component.editButtonVisible()).toBe(false);
  });

  it('should show edit button for latest or initial preprint', () => {
    setup({
      selectorOverrides: [
        {
          selector: PreprintSelectors.getPreprint,
          value: { ...mockPreprint, isLatestVersion: false, reviewsState: ReviewsState.Initial },
        },
      ],
    });

    expect(component.editButtonVisible()).toBe(true);
  });

  it('should show edit button for pending premoderation preprint', () => {
    setup({
      selectorOverrides: [
        {
          selector: PreprintSelectors.getPreprint,
          value: { ...mockPreprint, isLatestVersion: false, reviewsState: ReviewsState.Pending },
        },
      ],
    });

    expect(component.editButtonVisible()).toBe(true);
  });

  it('should show edit-and-resubmit for rejected premoderation preprint with admin access', () => {
    setup({
      selectorOverrides: [
        {
          selector: PreprintSelectors.getPreprint,
          value: { ...mockPreprint, isLatestVersion: false, reviewsState: ReviewsState.Rejected },
        },
        { selector: PreprintSelectors.hasAdminAccess, value: true },
      ],
    });

    expect(component.editButtonVisible()).toBe(true);
  });

  it('should hide edit button when none of edit visibility conditions are met', () => {
    setup({
      selectorOverrides: [
        {
          selector: PreprintSelectors.getPreprint,
          value: { ...mockPreprint, isLatestVersion: false, reviewsState: ReviewsState.Rejected },
        },
      ],
    });

    expect(component.editButtonVisible()).toBe(false);
  });

  it('should return false for statusBannerVisible when provider is missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintProvidersSelectors.getPreprintProviderDetails('osf'), value: null }],
    });

    expect(component.statusBannerVisible()).toBe(false);
  });

  it('should return false for statusBannerVisible when preprint is missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintSelectors.getPreprint, value: null }],
    });

    expect(component.statusBannerVisible()).toBe(false);
  });

  it('should return false for statusBannerVisible when related request data is loading', () => {
    setup({
      selectorOverrides: [{ selector: PreprintSelectors.arePreprintRequestsLoading, value: true }],
    });

    expect(component.statusBannerVisible()).toBe(false);
  });

  it('should return false for isPendingWithdrawal when no withdrawal request exists', () => {
    setup({
      selectorOverrides: [{ selector: PreprintSelectors.getPreprintRequests, value: [] }],
    });

    expect(component.isPendingWithdrawal()).toBe(false);
  });

  it('should return false for isWithdrawalRejected when no request action exists', () => {
    setup({
      selectorOverrides: [{ selector: PreprintSelectors.getPreprintRequestActions, value: [] }],
    });

    expect(component.isWithdrawalRejected()).toBe(false);
  });

  it('should return false for withdrawalButtonVisible while withdrawal data is loading', () => {
    setup({
      selectorOverrides: [{ selector: PreprintSelectors.arePreprintRequestsLoading, value: true }],
    });

    expect(component.withdrawalButtonVisible()).toBe(false);
  });

  it('should return early in editPreprintClicked when route ids are missing', () => {
    setup({ routeParams: { providerId: '', id: '' } });
    (routerMock.navigate as jest.Mock).mockClear();

    component.editPreprintClicked();

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});

describe('PreprintDetailsComponent SSR', () => {
  let component: PreprintDetailsComponent;
  let fixture: ComponentFixture<PreprintDetailsComponent>;
  let store: Store;
  const mockProvider = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockPreprint = PREPRINT_MOCK;
  const mockContributors = [MOCK_CONTRIBUTOR];

  function setup() {
    const routerMock = RouterMockBuilder.create().build();
    const activatedRouteMock = ActivatedRouteMockBuilder.create()
      .withParams({ providerId: 'osf', id: 'preprint-1' })
      .build();

    TestBed.configureTestingModule({
      imports: [
        PreprintDetailsComponent,
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
        provideOSFCore(),
        MockProvider(PLATFORM_ID, 'server'),
        MockProvider(ToastService, ToastServiceMock.simple()),
        MockProvider(ActivatedRoute, activatedRouteMock),
        MockProvider(Router, routerMock),
        MockProvider(CustomDialogService, CustomDialogServiceMockBuilder.create().withDefaultOpen().build()),
        MockProvider(DataciteService, DataciteMockFactory()),
        MockProvider(MetaTagsService, MetaTagsServiceMockFactory()),
        MockProvider(PrerenderReadyService, PrerenderReadyServiceMockFactory()),
        MockProvider(HelpScoutService, HelpScoutServiceMockFactory()),
        provideMockStore({
          signals: [
            { selector: PreprintProvidersSelectors.getPreprintProviderDetails('osf'), value: mockProvider },
            { selector: PreprintProvidersSelectors.isPreprintProviderDetailsLoading, value: false },
            { selector: PreprintSelectors.getPreprint, value: mockPreprint },
            { selector: PreprintSelectors.isPreprintLoading, value: false },
            { selector: ContributorsSelectors.getBibliographicContributors, value: mockContributors },
            { selector: ContributorsSelectors.isBibliographicContributorsLoading, value: false },
            { selector: PreprintSelectors.getPreprintReviewActions, value: [] },
            { selector: PreprintSelectors.arePreprintReviewActionsLoading, value: false },
            { selector: PreprintSelectors.getPreprintRequests, value: [] },
            { selector: PreprintSelectors.arePreprintRequestsLoading, value: false },
            { selector: PreprintSelectors.getPreprintRequestActions, value: [] },
            { selector: PreprintSelectors.arePreprintRequestActionsLoading, value: false },
            { selector: PreprintSelectors.hasAdminAccess, value: false },
            { selector: PreprintSelectors.hasWriteAccess, value: false },
            { selector: PreprintSelectors.getPreprintMetrics, value: null },
            { selector: PreprintSelectors.arePreprintMetricsLoading, value: false },
          ],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(PreprintDetailsComponent);
    component = fixture.componentInstance;
  }

  afterEach(() => {
    fixture?.destroy();
    jest.restoreAllMocks();
  });

  it('should render without browser-only errors in SSR', () => {
    setup();

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(component).toBeTruthy();
  });

  it('should skip reset dispatches in ngOnDestroy on SSR', () => {
    setup();
    fixture.detectChanges();
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    dispatchSpy.mockClear();

    component.ngOnDestroy();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
