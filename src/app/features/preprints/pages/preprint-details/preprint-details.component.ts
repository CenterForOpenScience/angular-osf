import { createDispatchMap, select, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Skeleton } from 'primeng/skeleton';

import { filter, map, of } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  HostBinding,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import {
  AdditionalInfoComponent,
  GeneralInformationComponent,
  PreprintFileSectionComponent,
  ShareAndDownloadComponent,
  StatusBannerComponent,
  WithdrawDialogComponent,
} from '@osf/features/preprints/components';
import { PreprintTombstoneComponent } from '@osf/features/preprints/components/preprint-details/preprint-tombstone/preprint-tombstone.component';
import { PreprintRequestMachineState, ProviderReviewsWorkflow, ReviewsState } from '@osf/features/preprints/enums';
import {
  FetchPreprintById,
  FetchPreprintRequests,
  FetchPreprintReviewActions,
  PreprintSelectors,
  ResetState,
} from '@osf/features/preprints/store/preprint';
import { GetPreprintProviderById, PreprintProvidersSelectors } from '@osf/features/preprints/store/preprint-providers';
import { CreateNewVersion, PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { UserPermissions } from '@shared/enums';
import { ContributorModel } from '@shared/models';
import { ContributorsSelectors } from '@shared/stores';
import { IS_MEDIUM } from '@shared/utils';

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
  ],
  templateUrl: './preprint-details.component.html',
  styleUrl: './preprint-details.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintDetailsComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full';

  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translateService = inject(TranslateService);
  private readonly isMedium = toSignal(inject(IS_MEDIUM));

  private providerId = toSignal(this.route.params.pipe(map((params) => params['providerId'])) ?? of(undefined));
  private preprintId = toSignal(this.route.params.pipe(map((params) => params['id'])) ?? of(undefined));

  private actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    resetState: ResetState,
    fetchPreprintById: FetchPreprintById,
    createNewVersion: CreateNewVersion,
    fetchPreprintRequests: FetchPreprintRequests,
    fetchPreprintReviewActions: FetchPreprintReviewActions,
  });

  currentUser = select(UserSelectors.getCurrentUser);
  preprintProvider = select(PreprintProvidersSelectors.getPreprintProviderDetails(this.providerId()));
  isPreprintProviderLoading = select(PreprintProvidersSelectors.isPreprintProviderDetailsLoading);
  preprint = select(PreprintSelectors.getPreprint);
  isPreprintLoading = select(PreprintSelectors.isPreprintLoading);
  contributors = select(ContributorsSelectors.getContributors);
  areContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  reviewActions = select(PreprintSelectors.getPreprintReviewActions);
  areReviewActionsLoading = select(PreprintSelectors.arePreprintReviewActionsLoading);
  withdrawalRequests = select(PreprintSelectors.getPreprintRequests);
  areWithdrawalRequestsLoading = select(PreprintSelectors.arePreprintRequestsLoading);

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

  private currentUserIsAdmin = computed(() => {
    return this.preprint()?.currentUserPermissions.includes(UserPermissions.Admin) || false;
  });

  private currentUserIsContributor = computed(() => {
    const contributors = this.contributors();
    const preprint = this.preprint()!;
    const currentUser = this.currentUser();

    if (this.currentUserIsAdmin()) {
      return true;
    } else if (contributors.length) {
      const authorIds = [] as string[];
      contributors.forEach((author: ContributorModel) => {
        authorIds.push(author.id);
      });
      const authorId = `${preprint.id}-${currentUser?.id}`;
      return currentUser?.id ? authorIds.includes(authorId) && this.hasReadWriteAccess() : false;
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
    //[RNi] TODO: Implement when request actions available
    //const isPreprintRequestActionModel = this.args.latestAction instanceof PreprintRequestActionModel;
    //         return isPreprintRequestActionModel && this.args.latestAction?.actionTrigger === 'reject';
    return false;
  });

  withdrawalButtonVisible = computed(() => {
    return (
      this.currentUserIsAdmin() &&
      this.preprintWithdrawableState() &&
      !this.isWithdrawalRejected() &&
      !this.isPendingWithdrawal()
    );
  });

  statusBannerVisible = computed(() => {
    const provider = this.preprintProvider();
    const preprint = this.preprint();
    if (!provider || !preprint || this.areWithdrawalRequestsLoading() || this.areReviewActionsLoading()) return false;

    return (
      provider.reviewsWorkflow &&
      preprint.isPublic &&
      this.currentUserIsContributor() &&
      preprint.reviewsState !== ReviewsState.Initial &&
      !preprint.isPreprintOrphan
    );
  });

  ngOnInit() {
    this.fetchPreprint();
    this.actions.getPreprintProviderById(this.providerId());
  }

  ngOnDestroy() {
    this.actions.resetState();
  }

  handleWithdrawClicked() {
    const dialogWidth = this.isMedium() ? '700px' : '340px';

    const dialogRef = this.dialogService.open(WithdrawDialogComponent, {
      header: this.translateService.instant('preprints.details.withdrawDialog.title', {
        preprintWord: this.preprintProvider()!.preprintWord,
      }),
      focusOnShow: false,
      closeOnEscape: true,
      width: dialogWidth,
      modal: true,
      closable: true,
      data: {
        preprint: this.preprint(),
        provider: this.preprintProvider(),
      },
    });

    dialogRef.onClose.pipe(takeUntilDestroyed(this.destroyRef), filter(Boolean)).subscribe({
      next: () => {
        this.fetchPreprint();
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

  private fetchPreprint() {
    this.actions.fetchPreprintById(this.preprintId()).subscribe({
      next: () => {
        if (this.preprint()!.currentUserPermissions.length > 0) {
          this.actions.fetchPreprintRequests();
          this.actions.fetchPreprintReviewActions();
        }
      },
    });
  }

  private hasReadWriteAccess(): boolean {
    return this.preprint()?.currentUserPermissions.includes(UserPermissions.Write) || false;
  }
}
