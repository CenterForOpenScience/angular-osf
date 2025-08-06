import { createDispatchMap, select, Store } from '@ngxs/store';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, HostBinding, inject, OnDestroy, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { AdditionalInfoComponent } from '@osf/features/preprints/components/preprint-details/additional-info/additional-info.component';
import { GeneralInformationComponent } from '@osf/features/preprints/components/preprint-details/general-information/general-information.component';
import { PreprintFileSectionComponent } from '@osf/features/preprints/components/preprint-details/preprint-file-section/preprint-file-section.component';
import { ShareAndDownloadComponent } from '@osf/features/preprints/components/preprint-details/share-and-downlaod/share-and-download.component';
import { ProviderReviewsWorkflow, ReviewsState } from '@osf/features/preprints/enums';
import { FetchPreprintById, PreprintSelectors, ResetState } from '@osf/features/preprints/store/preprint';
import { GetPreprintProviderById, PreprintProvidersSelectors } from '@osf/features/preprints/store/preprint-providers';
import { CreateNewVersion, PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { Permission } from '@shared/enums';
import { ContributorModel } from '@shared/models';
import { ContributorsSelectors } from '@shared/stores';

@Component({
  selector: 'osf-preprint-details',
  imports: [
    Skeleton,
    PreprintFileSectionComponent,
    Button,
    ShareAndDownloadComponent,
    GeneralInformationComponent,
    AdditionalInfoComponent,
  ],
  templateUrl: './preprint-details.component.html',
  styleUrl: './preprint-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintDetailsComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full';

  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  private providerId = toSignal(this.route.params.pipe(map((params) => params['providerId'])) ?? of(undefined));
  private preprintId = toSignal(this.route.params.pipe(map((params) => params['preprintId'])) ?? of(undefined));

  private actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    resetState: ResetState,
    fetchPreprintById: FetchPreprintById,
    createNewVersion: CreateNewVersion,
  });

  currentUser = select(UserSelectors.getCurrentUser);
  preprintProvider = select(PreprintProvidersSelectors.getPreprintProviderDetails(this.providerId()));
  isPreprintProviderLoading = select(PreprintProvidersSelectors.isPreprintProviderDetailsLoading);
  preprint = select(PreprintSelectors.getPreprint);
  isPreprintLoading = select(PreprintSelectors.isPreprintLoading);
  contributors = select(ContributorsSelectors.getContributors);
  areContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  reviewActions = select(PreprintSelectors.getPreprintReviewActions);

  latestAction = computed(() => {
    const actions = this.reviewActions();

    if (actions.length < 1) return null;

    return actions[0];
  });

  private currentUserIsAdmin = computed(() => {
    return this.preprint()?.currentUserPermissions.includes(Permission.Admin) || false;
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
      // Edit and resubmit
      if (preprintIsRejected && this.currentUserIsAdmin()) {
        return true;
      }
    }
    return false;
  });

  private hasReadWriteAccess(): boolean {
    // True if the current user has write permissions for the node that contains the preprint
    return this.preprint()?.currentUserPermissions.includes(Permission.Write) || false;
  }

  ngOnInit() {
    this.actions.fetchPreprintById(this.preprintId());
    this.actions.getPreprintProviderById(this.providerId());
  }

  ngOnDestroy() {
    this.actions.resetState();
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
}
