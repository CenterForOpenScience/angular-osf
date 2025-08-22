import { createDispatchMap, createSelectMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { PaginatorState } from 'primeng/paginator';
import { SelectButton } from 'primeng/selectbutton';

import { map, of } from 'rxjs';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PREPRINT_SORT_OPTIONS, WITHDRAWAL_SUBMISSION_REVIEW_OPTIONS } from '@osf/features/moderation/constants';
import { PreprintSubmissionsSort, SubmissionReviewStatus } from '@osf/features/moderation/enums';
import {
  CustomPaginatorComponent,
  IconComponent,
  LoadingSpinnerComponent,
  SelectComponent,
} from '@osf/shared/components';
import { Primitive } from '@osf/shared/helpers';

import { PreprintWithdrawalSubmission } from '../../models';
import { GetPreprintWithdrawalSubmissions, PreprintModerationSelectors } from '../../store/preprint-moderation';
import { PreprintSubmissionItemComponent } from '../preprint-submission-item/preprint-submission-item.component';

@Component({
  selector: 'osf-preprint-withdrawal-submissions',
  imports: [
    SelectButton,
    TranslatePipe,
    FormsModule,
    SelectComponent,
    IconComponent,
    TitleCasePipe,
    LoadingSpinnerComponent,
    PreprintSubmissionItemComponent,
    CustomPaginatorComponent,
  ],
  templateUrl: './preprint-withdrawal-submissions.component.html',
  styleUrl: './preprint-withdrawal-submissions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintWithdrawalSubmissionsComponent implements OnInit {
  readonly sortOptions = PREPRINT_SORT_OPTIONS;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly providerId = toSignal(
    this.route.parent?.params.pipe(map((params) => params['providerId'])) ?? of(undefined)
  );

  readonly actions = createDispatchMap({ getPreprintWithdrawalSubmissions: GetPreprintWithdrawalSubmissions });

  readonly submissions = select(PreprintModerationSelectors.getPreprintWithdrawalSubmissions);
  readonly isLoading = select(PreprintModerationSelectors.arePreprintWithdrawalSubmissionsLoading);
  readonly counts = createSelectMap({
    [SubmissionReviewStatus.Pending]: PreprintModerationSelectors.getPreprintWithdrawalSubmissionsPendingCount,
    [SubmissionReviewStatus.Accepted]: PreprintModerationSelectors.getPreprintWithdrawalSubmissionsAcceptedCount,
    [SubmissionReviewStatus.Rejected]: PreprintModerationSelectors.getPreprintWithdrawalSubmissionsRejectedCount,
  });

  private readonly countMap: Record<string, () => number> = {
    [SubmissionReviewStatus.Accepted]: () => this.counts[SubmissionReviewStatus.Accepted](),
    [SubmissionReviewStatus.Pending]: () => this.counts[SubmissionReviewStatus.Pending](),
    [SubmissionReviewStatus.Rejected]: () => this.counts[SubmissionReviewStatus.Rejected](),
  };

  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly first = signal(0);
  readonly selectedSortOption = signal(PreprintSubmissionsSort.Newest);
  readonly selectedReviewOption = signal(WITHDRAWAL_SUBMISSION_REVIEW_OPTIONS[0].value);

  readonly totalCount = computed(() => this.countMap[this.selectedReviewOption()]() ?? 0);

  submissionReviewOptions = computed(() =>
    WITHDRAWAL_SUBMISSION_REVIEW_OPTIONS.map((option) => ({ ...option, count: this.countMap[option.value]() }))
  );

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
    this.selectedSortOption.set(value as PreprintSubmissionsSort);
    this.fetchSubmissions();
  }

  onPageChange(event: PaginatorState): void {
    this.currentPage.set(event.page ? event.page + 1 : 1);
    this.first.set(event.first ?? 0);
    this.fetchSubmissions();
  }

  navigateToPreprint(item: PreprintWithdrawalSubmission) {
    this.router.navigate(['/preprints/', this.providerId(), item.preprintId], { queryParams: { mode: 'moderator' } });
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

    this.actions.getPreprintWithdrawalSubmissions(
      providerId,
      this.selectedReviewOption(),
      this.currentPage(),
      this.selectedSortOption()
    );
  }
}
