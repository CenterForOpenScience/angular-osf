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

import { Primitive } from '@osf/core/helpers';
import { PreprintSubmissionItemComponent } from '@osf/features/moderation/components';
import { PREPRINT_SORT_OPTIONS, SUBMISSION_REVIEW_OPTIONS } from '@osf/features/moderation/constants';
import { PreprintSubmissionsSort, SubmissionReviewStatus } from '@osf/features/moderation/enums';
import {
  CustomPaginatorComponent,
  IconComponent,
  LoadingSpinnerComponent,
  SelectComponent,
} from '@osf/shared/components';

import { PreprintSubmission } from '../../models';
import { GetPreprintSubmissions, PreprintModerationSelectors } from '../../store/preprint-moderation';

@Component({
  selector: 'osf-preprint-submissions',
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
  templateUrl: './preprint-submissions.component.html',
  styleUrl: './preprint-submissions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintSubmissionsComponent implements OnInit {
  readonly sortOptions = PREPRINT_SORT_OPTIONS;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly providerId = toSignal(
    this.route.parent?.params.pipe(map((params) => params['providerId'])) ?? of(undefined)
  );

  readonly actions = createDispatchMap({ getPreprintSubmissions: GetPreprintSubmissions });

  readonly submissions = select(PreprintModerationSelectors.getPreprintSubmissions);
  readonly isLoading = select(PreprintModerationSelectors.arePreprintSubmissionsLoading);
  readonly counts = createSelectMap({
    [SubmissionReviewStatus.Pending]: PreprintModerationSelectors.getPreprintSubmissionsPendingCount,
    [SubmissionReviewStatus.Accepted]: PreprintModerationSelectors.getPreprintSubmissionsAcceptedCount,
    [SubmissionReviewStatus.Rejected]: PreprintModerationSelectors.getPreprintSubmissionsRejectedCount,
    [SubmissionReviewStatus.Withdrawn]: PreprintModerationSelectors.getPreprintSubmissionsWithdrawnCount,
  });

  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly first = signal(0);
  readonly selectedSortOption = signal(PreprintSubmissionsSort.Newest);
  readonly selectedReviewOption = signal(SUBMISSION_REVIEW_OPTIONS[0].value);

  private readonly countMap: Record<string, () => number> = {
    [SubmissionReviewStatus.Accepted]: () => this.counts[SubmissionReviewStatus.Accepted](),
    [SubmissionReviewStatus.Pending]: () => this.counts[SubmissionReviewStatus.Pending](),
    [SubmissionReviewStatus.Rejected]: () => this.counts[SubmissionReviewStatus.Rejected](),
    [SubmissionReviewStatus.Withdrawn]: () => this.counts[SubmissionReviewStatus.Withdrawn](),
    [SubmissionReviewStatus.Public]: () => this.counts[SubmissionReviewStatus.Accepted](),
  };

  submissionReviewOptions = computed(() =>
    SUBMISSION_REVIEW_OPTIONS.map((option) => ({ ...option, count: this.countMap[option.value]() }))
  );

  totalCount = computed(() => this.countMap[this.selectedReviewOption()]());

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

  navigateToPreprint(item: PreprintSubmission) {
    this.router.navigate(['/preprints/', item.id, 'overview'], { queryParams: { mode: 'moderator' } });
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

    this.actions.getPreprintSubmissions(
      providerId,
      this.selectedReviewOption(),
      this.currentPage(),
      this.selectedSortOption()
    );
  }
}
