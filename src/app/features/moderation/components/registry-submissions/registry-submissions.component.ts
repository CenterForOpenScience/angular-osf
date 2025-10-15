import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { PaginatorState } from 'primeng/paginator';
import { SelectButton } from 'primeng/selectbutton';

import { map, of } from 'rxjs';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  CustomPaginatorComponent,
  IconComponent,
  LoadingSpinnerComponent,
  SelectComponent,
} from '@osf/shared/components';
import { RegistrationReviewStates, RevisionReviewStates } from '@osf/shared/enums';
import { Primitive } from '@osf/shared/helpers';

import { REGISTRY_SORT_OPTIONS, SUBMITTED_SUBMISSION_REVIEW_OPTIONS } from '../../constants';
import { RegistrySort, SubmissionReviewStatus } from '../../enums';
import { RegistryModeration } from '../../models';
import { GetRegistrySubmissions, RegistryModerationSelectors } from '../../store/registry-moderation';
import { RegistrySubmissionItemComponent } from '..';

@Component({
  selector: 'osf-registry-submissions',
  imports: [
    SelectButton,
    TranslatePipe,
    FormsModule,
    SelectComponent,
    IconComponent,
    TitleCasePipe,
    LoadingSpinnerComponent,
    RegistrySubmissionItemComponent,
    CustomPaginatorComponent,
  ],
  templateUrl: './registry-submissions.component.html',
  styleUrl: './registry-submissions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrySubmissionsComponent implements OnInit {
  readonly submissionReviewOptions = SUBMITTED_SUBMISSION_REVIEW_OPTIONS;
  readonly sortOptions = REGISTRY_SORT_OPTIONS;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly providerId = toSignal(
    this.route.parent?.params.pipe(map((params) => params['providerId'])) ?? of(undefined)
  );

  readonly actions = createDispatchMap({ getRegistrySubmissions: GetRegistrySubmissions });

  readonly submissions = select(RegistryModerationSelectors.getRegistrySubmissions);
  readonly isLoading = select(RegistryModerationSelectors.areRegistrySubmissionLoading);
  readonly totalCount = select(RegistryModerationSelectors.getRegistrySubmissionTotalCount);

  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly first = signal(0);
  readonly selectedSortOption = signal(RegistrySort.RegisteredNewest);
  readonly selectedReviewOption = signal(this.submissionReviewOptions[0].value);

  ngOnInit(): void {
    this.getStatusFromQueryParams();
    this.fetchSubmissions();
  }

  changeReviewStatus(value: SubmissionReviewStatus): void {
    this.selectedReviewOption.set(value);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { status: value },
      queryParamsHandling: 'merge',
    });

    this.resetPagination();
    this.fetchSubmissions();
  }

  changeSort(value: Primitive): void {
    this.selectedSortOption.set(value as RegistrySort);
    this.fetchSubmissions();
  }

  onPageChange(event: PaginatorState): void {
    this.currentPage.set(event.page ? event.page + 1 : 1);
    this.first.set(event.first ?? 0);
    this.fetchSubmissions();
  }

  navigateToRegistration(item: RegistryModeration) {
    const isPendingModeration = item.revisionStatus === RevisionReviewStates.RevisionPendingModeration;
    const isPending =
      item.reviewsState === RegistrationReviewStates.Pending ||
      item.reviewsState === RegistrationReviewStates.PendingWithdraw;

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/', item.id, 'overview'], {
        queryParams: {
          mode: 'moderator',
          revisionId: isPendingModeration && !isPending ? item.revisionId : null,
        },
      })
    );

    window.open(url, '_blank');
  }

  private getStatusFromQueryParams() {
    const queryParams = this.route.snapshot.queryParams;
    const statusValues = Object.values(SubmissionReviewStatus);

    const statusParam = queryParams['status'];

    if (statusParam && statusValues.includes(statusParam)) {
      this.selectedReviewOption.set(statusParam);
    }
  }

  private resetPagination(): void {
    this.currentPage.set(1);
    this.first.set(0);
  }

  private fetchSubmissions(): void {
    const providerId = this.providerId();

    if (!providerId) return;

    this.actions.getRegistrySubmissions(
      providerId,
      this.selectedReviewOption(),
      this.currentPage(),
      this.selectedSortOption()
    );
  }
}
