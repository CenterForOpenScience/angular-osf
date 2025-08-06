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

import { Primitive } from '@osf/core/helpers';
import { PENDING_SUBMISSION_REVIEW_OPTIONS, REGISTRY_SORT_OPTIONS } from '@osf/features/moderation/constants';
import { RegistrySort, SubmissionReviewStatus } from '@osf/features/moderation/enums';
import {
  GetRegistrySubmissions,
  RegistryModerationSelectors,
} from '@osf/features/moderation/store/registry-moderation';
import {
  CustomPaginatorComponent,
  IconComponent,
  LoadingSpinnerComponent,
  SelectComponent,
} from '@osf/shared/components';

import { RegistrySubmissionItemComponent } from '..';

@Component({
  selector: 'osf-registry-pending-submissions',
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
  templateUrl: './registry-pending-submissions.component.html',
  styleUrl: './registry-pending-submissions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryPendingSubmissionsComponent implements OnInit {
  readonly submissionReviewOptions = PENDING_SUBMISSION_REVIEW_OPTIONS;
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
