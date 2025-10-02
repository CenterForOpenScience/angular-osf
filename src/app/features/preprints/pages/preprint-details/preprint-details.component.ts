import { createDispatchMap, select, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { filter, map, of } from 'rxjs';

import { DatePipe, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { HelpScoutService } from '@core/services/help-scout.service';
import { ClearCurrentProvider } from '@core/store/provider';
import { UserSelectors } from '@core/store/user';
import {
  AdditionalInfoComponent,
  GeneralInformationComponent,
  MakeDecisionComponent,
  ModerationStatusBannerComponent,
  PreprintFileSectionComponent,
  PreprintTombstoneComponent,
  ShareAndDownloadComponent,
  StatusBannerComponent,
  WithdrawDialogComponent,
} from '@osf/features/preprints/components';
import { PreprintRequestMachineState, ProviderReviewsWorkflow, ReviewsState } from '@osf/features/preprints/enums';
import {
  FetchPreprintById,
  FetchPreprintRequestActions,
  FetchPreprintRequests,
  FetchPreprintReviewActions,
  PreprintSelectors,
  ResetState,
} from '@osf/features/preprints/store/preprint';
import { GetPreprintProviderById, PreprintProvidersSelectors } from '@osf/features/preprints/store/preprint-providers';
import { CreateNewVersion, PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { IS_MEDIUM, pathJoin } from '@osf/shared/helpers';
import { ReviewPermissions, UserPermissions } from '@shared/enums';
import { CustomDialogService, MetaTagsService } from '@shared/services';
import { AnalyticsService } from '@shared/services/analytics.service';
import { DataciteService } from '@shared/services/datacite/datacite.service';
import { ContributorsSelectors } from '@shared/stores';

import { PreprintWarningBannerComponent } from '../../components/preprint-details/preprint-warning-banner/preprint-warning-banner.component';

@Component({
  selector: 'osf-preprint-details',
  imports: [
    Skeleton,
    PreprintFileSectionComponent,
    Button,
    ShareAndDownloadComponent,
    GeneralInformationComponent,
    AdditionalInfoComponent,
    StatusBannerComponent,
    TranslatePipe,
    PreprintTombstoneComponent,
    PreprintWarningBannerComponent,
    ModerationStatusBannerComponent,
    MakeDecisionComponent,
    RouterLink,
  ],
  templateUrl: './preprint-details.component.html',
  styleUrl: './preprint-details.component.scss',
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintDetailsComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full';

  private readonly helpScoutService = inject(HelpScoutService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);
  private readonly customDialogService = inject(CustomDialogService);
  private readonly translateService = inject(TranslateService);
  private readonly metaTags = inject(MetaTagsService);
  private readonly datePipe = inject(DatePipe);
  private readonly dataciteService = inject(DataciteService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly isMedium = toSignal(inject(IS_MEDIUM));

  private preprintId = toSignal(this.route.params.pipe(map((params) => params['id'])) ?? of(undefined));

  private actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    resetState: ResetState,
    fetchPreprintById: FetchPreprintById,
    createNewVersion: CreateNewVersion,
    fetchPreprintRequests: FetchPreprintRequests,
    fetchPreprintReviewActions: FetchPreprintReviewActions,
    fetchPreprintRequestActions: FetchPreprintRequestActions,
    clearCurrentProvider: ClearCurrentProvider,
  });
  providerId = toSignal(this.route.params.pipe(map((params) => params['providerId'])) ?? of(undefined));
  currentUser = select(UserSelectors.getCurrentUser);
  preprintProvider = select(PreprintProvidersSelectors.getPreprintProviderDetails(this.providerId()));
  isPreprintProviderLoading = select(PreprintProvidersSelectors.isPreprintProviderDetailsLoading);
  preprint = select(PreprintSelectors.getPreprint);
  preprint$ = toObservable(select(PreprintSelectors.getPreprint));
  isPreprintLoading = select(PreprintSelectors.isPreprintLoading);
  contributors = select(ContributorsSelectors.getContributors);
  areContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  reviewActions = select(PreprintSelectors.getPreprintReviewActions);
  areReviewActionsLoading = select(PreprintSelectors.arePreprintReviewActionsLoading);
  withdrawalRequests = select(PreprintSelectors.getPreprintRequests);
  areWithdrawalRequestsLoading = select(PreprintSelectors.arePreprintRequestsLoading);
  requestActions = select(PreprintSelectors.getPreprintRequestActions);
  areRequestActionsLoading = select(PreprintSelectors.arePreprintRequestActionsLoading);

  isPresentModeratorQueryParam = toSignal(this.route.queryParams.pipe(map((params) => params['mode'] === 'moderator')));
  moderationMode = computed(() => {
    const provider = this.preprintProvider();
    return this.isPresentModeratorQueryParam() && provider?.permissions.includes(ReviewPermissions.ViewSubmissions);
  });

  latestAction = computed(() => {
    const actions = this.reviewActions();

    if (actions.length < 1) return null;

    return actions[0];
  });

  latestWithdrawalRequest = computed(() => {
    const requests = this.withdrawalRequests();

    if (requests.length < 1) return null;

    return requests[0];
  });

  latestRequestAction = computed(() => {
    const actions = this.requestActions();

    if (actions.length < 1) return null;

    return actions[0];
  });

  private readonly analyticsService = inject(AnalyticsService);

  constructor() {
    this.helpScoutService.setResourceType('preprint');
    effect(() => {
      const currentPreprint = this.preprint();
      if (currentPreprint && currentPreprint.isPublic) {
        this.analyticsService.sendCountedUsage(currentPreprint.id, 'preprint.detail').subscribe();
      }
    });
  }

  private currentUserIsAdmin = computed(() => {
    return this.preprint()?.currentUserPermissions.includes(UserPermissions.Admin) || false;
  });

  private currentUserIsContributor = computed(() => {
    const contributors = this.contributors();
    const currentUser = this.currentUser();

    if (this.currentUserIsAdmin()) {
      return true;
    } else if (contributors.length) {
      const authorIds = contributors.map((author) => author.id);
      return currentUser?.id
        ? authorIds.some((id) => id.endsWith(currentUser!.id)) && this.hasReadWriteAccess()
        : false;
    }
    return false;
  });

  private preprintWithdrawableState = computed(() => {
    const preprint = this.preprint();
    if (!preprint) return false;
    return [ReviewsState.Accepted, ReviewsState.Pending].includes(preprint.reviewsState);
  });

  createNewVersionButtonVisible = computed(() => {
    const preprint = this.preprint();
    if (!preprint) return false;

    return this.currentUserIsAdmin() && preprint.datePublished && preprint.isLatestVersion;
  });

  editButtonVisible = computed(() => {
    const provider = this.preprintProvider();
    const preprint = this.preprint();
    if (!provider || !preprint) return false;

    const providerIsPremod = provider.reviewsWorkflow === ProviderReviewsWorkflow.PreModeration;
    const preprintIsRejected = preprint.reviewsState === ReviewsState.Rejected;

    if (!this.currentUserIsContributor()) {
      return false;
    }

    if (preprint.dateWithdrawn) {
      return false;
    }

    if (preprint.isLatestVersion || preprint.reviewsState === ReviewsState.Initial) {
      return true;
    }
    if (providerIsPremod) {
      if (preprint.reviewsState === ReviewsState.Pending) {
        return true;
      }

      if (preprintIsRejected && this.currentUserIsAdmin()) {
        return true;
      }
    }
    return false;
  });

  editButtonLabel = computed(() => {
    const providerIsPremod = this.preprintProvider()?.reviewsWorkflow === ProviderReviewsWorkflow.PreModeration;
    const preprintIsRejected = this.preprint()?.reviewsState === ReviewsState.Rejected;

    return providerIsPremod && preprintIsRejected && this.currentUserIsAdmin()
      ? 'common.buttons.editAndResubmit'
      : 'common.buttons.edit';
  });

  isPendingWithdrawal = computed(() => {
    const latestWithdrawalRequest = this.latestWithdrawalRequest();
    if (!latestWithdrawalRequest) return false;

    return latestWithdrawalRequest.machineState === PreprintRequestMachineState.Pending && !this.isWithdrawalRejected();
  });

  isWithdrawalRejected = computed(() => {
    const latestRequestActions = this.latestRequestAction();
    if (!latestRequestActions) return false;
    return latestRequestActions?.trigger === 'reject';
  });

  withdrawalButtonVisible = computed(() => {
    if (this.areWithdrawalRequestsLoading() || this.areRequestActionsLoading()) return false;
    return (
      this.currentUserIsAdmin() &&
      this.preprintWithdrawableState() &&
      !this.isWithdrawalRejected() &&
      !this.isPendingWithdrawal()
    );
  });

  isOsfPreprint = computed(() => {
    return this.providerId() === 'osf';
  });

  moderationStatusBannerVisible = computed(() => {
    return (
      this.moderationMode() &&
      !(
        this.isPreprintLoading() ||
        this.areReviewActionsLoading() ||
        this.areWithdrawalRequestsLoading() ||
        this.areRequestActionsLoading()
      )
    );
  });

  statusBannerVisible = computed(() => {
    const provider = this.preprintProvider();
    const preprint = this.preprint();
    if (
      !provider ||
      !preprint ||
      this.areWithdrawalRequestsLoading() ||
      this.areReviewActionsLoading() ||
      this.areRequestActionsLoading()
    )
      return false;

    return (
      provider.reviewsWorkflow &&
      preprint.isPublic &&
      this.currentUserIsContributor() &&
      preprint.reviewsState !== ReviewsState.Initial &&
      !preprint.isPreprintOrphan
    );
  });

  ngOnInit() {
    this.actions.getPreprintProviderById(this.providerId()).subscribe({
      next: () => {
        this.fetchPreprint(this.preprintId());
      },
    });
    this.dataciteService.logIdentifiableView(this.preprint$).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  ngOnDestroy() {
    this.actions.resetState();
    this.actions.clearCurrentProvider();
    this.helpScoutService.unsetResourceType();
  }

  handleWithdrawClicked() {
    const dialogWidth = this.isMedium() ? '700px' : '340px';

    this.customDialogService
      .open(WithdrawDialogComponent, {
        header: this.translateService.instant('preprints.details.withdrawDialog.title', {
          preprintWord: this.preprintProvider()!.preprintWord,
        }),
        width: dialogWidth,
        data: {
          preprint: this.preprint(),
          provider: this.preprintProvider(),
        },
      })
      .onClose.pipe(takeUntilDestroyed(this.destroyRef), filter(Boolean))
      .subscribe({
        next: () => {
          this.fetchPreprint(this.preprintId());
        },
      });
  }

  editPreprintClicked() {
    this.router.navigate(['preprints', this.providerId(), 'edit', this.preprintId()]);
  }

  createNewVersionClicked() {
    this.actions.createNewVersion(this.preprintId()).subscribe({
      complete: () => {
        const newVersionPreprint = this.store.selectSnapshot(PreprintStepperSelectors.getPreprint);
        this.router.navigate(['preprints', this.providerId(), 'new-version', newVersionPreprint!.id]);
      },
    });
  }

  fetchPreprint(preprintId: string) {
    this.actions.fetchPreprintById(preprintId).subscribe({
      next: () => {
        this.checkAndSetVersionToTheUrl();
        if (this.preprint()!.currentUserPermissions.length > 0 || this.moderationMode()) {
          this.actions.fetchPreprintReviewActions();
          if (this.preprintWithdrawableState() && (this.currentUserIsAdmin() || this.moderationMode())) {
            this.actions.fetchPreprintRequests().subscribe({
              next: () => {
                const latestWithdrawalRequest = this.latestWithdrawalRequest();
                if (latestWithdrawalRequest) {
                  this.actions.fetchPreprintRequestActions(latestWithdrawalRequest.id);
                }
              },
            });
          }
        }

        this.setMetaTags();
      },
    });
  }

  private setMetaTags() {
    this.metaTags.updateMetaTags(
      {
        osfGuid: this.preprint()?.id,
        title: this.preprint()?.title,
        description: this.preprint()?.description,
        publishedDate: this.datePipe.transform(this.preprint()?.datePublished, 'yyyy-MM-dd'),
        modifiedDate: this.datePipe.transform(this.preprint()?.dateModified, 'yyyy-MM-dd'),
        url: pathJoin(this.environment.webUrl, this.preprint()?.id ?? ''),
        doi: this.preprint()?.doi,
        keywords: this.preprint()?.tags,
        siteName: 'OSF',
        license: this.preprint()?.embeddedLicense?.name,
        contributors: this.contributors().map((contributor) => ({
          fullName: contributor.fullName,
          givenName: contributor.givenName,
          familyName: contributor.familyName,
        })),
      },
      this.destroyRef
    );
  }

  private hasReadWriteAccess(): boolean {
    return this.preprint()?.currentUserPermissions.includes(UserPermissions.Write) || false;
  }

  private checkAndSetVersionToTheUrl() {
    const currentUrl = this.router.url;
    const newPreprintId = this.preprint()!.id;

    const urlSegments = currentUrl.split('/');
    const preprintIdFromUrl = urlSegments[urlSegments.length - 1];

    if (preprintIdFromUrl !== newPreprintId) {
      const newUrl = currentUrl.replace(/[^/]+$/, newPreprintId);

      this.location.replaceState(newUrl);
    }
  }
}
