import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { PaginatorState } from 'primeng/paginator';
import { SelectButton } from 'primeng/selectbutton';

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  CollectionsModerationSelectors,
  GetCollectionSubmissions,
  GetSubmissionsReviewActions,
} from '@osf/features/moderation/store/collections-moderation';
import {
  CustomPaginatorComponent,
  IconComponent,
  LoadingSpinnerComponent,
  SelectComponent,
} from '@osf/shared/components';
import { COLLECTION_SUBMISSIONS_SORT_OPTIONS } from '@osf/shared/constants';
import { Primitive } from '@osf/shared/helpers';
import {
  ClearCollections,
  ClearCollectionSubmissions,
  CollectionsSelectors,
  GetCollectionDetails,
  GetCollectionProvider,
  SearchCollectionSubmissions,
  SetPageNumber,
} from '@shared/stores';

import { COLLECTIONS_SUBMISSIONS_REVIEW_OPTIONS } from '../../constants';
import { SubmissionReviewStatus } from '../../enums';
import { CollectionSubmissionsListComponent } from '../collection-submissions-list/collection-submissions-list.component';

@Component({
  selector: 'osf-collection-moderation-submissions',
  imports: [
    SelectButton,
    TranslatePipe,
    FormsModule,
    SelectComponent,
    CollectionSubmissionsListComponent,
    IconComponent,
    CustomPaginatorComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './collection-moderation-submissions.component.html',
  styleUrl: './collection-moderation-submissions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionModerationSubmissionsComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  readonly submissionReviewOptions = COLLECTIONS_SUBMISSIONS_REVIEW_OPTIONS;

  collectionProvider = select(CollectionsSelectors.getCollectionProvider);
  isCollectionProviderLoading = select(CollectionsSelectors.getCollectionProviderLoading);
  isSubmissionsLoading = select(CollectionsModerationSelectors.getCollectionSubmissionsLoading);
  collectionSubmissions = select(CollectionsModerationSelectors.getCollectionSubmissions);
  totalSubmissions = select(CollectionsModerationSelectors.getCollectionSubmissionsTotalCount);
  providerId = signal<string>('');
  primaryCollectionId = computed(() => this.collectionProvider()?.primaryCollection?.id);
  reviewStatus = signal<SubmissionReviewStatus>(SubmissionReviewStatus.Pending);
  currentPage = signal<string>('1');
  pageSize = 10;

  isLoading = computed(() => {
    return this.isCollectionProviderLoading() || this.isSubmissionsLoading();
  });

  sortOptions = COLLECTION_SUBMISSIONS_SORT_OPTIONS;
  selectedSortOption = signal<string>(this.sortOptions[0].value);

  firstIndex = computed(() => (parseInt(this.currentPage()) - 1) * 10);

  actions = createDispatchMap({
    getCollectionProvider: GetCollectionProvider,
    getCollectionDetails: GetCollectionDetails,
    searchCollectionSubmissions: SearchCollectionSubmissions,
    getCollectionSubmissions: GetCollectionSubmissions,
    setPageNumber: SetPageNumber,
    clearCollections: ClearCollections,
    clearCollectionsSubmissions: ClearCollectionSubmissions,
    getSubmissionsReviewActions: GetSubmissionsReviewActions,
  });

  private setupEffects(): void {
    effect(() => {
      const collectionId = this.primaryCollectionId();
      if (collectionId) {
        this.actions.getCollectionDetails(collectionId);
      }
    });

    effect(() => {
      const provider = this.collectionProvider();
      const status = this.reviewStatus();
      const sortBy = this.selectedSortOption() || this.sortOptions[0].value;
      const page = this.currentPage();

      if (status && provider) {
        this.actions.getCollectionSubmissions(provider.primaryCollection.id, status, page, sortBy);
      }
    });

    effect(() => {
      const status = this.reviewStatus();
      const sortBy = this.selectedSortOption();
      const page = this.currentPage();

      this.updateUrlParams(status, sortBy, page);
    });

    effect(() => {
      const submissions = this.collectionSubmissions();
      const collectionId = this.primaryCollectionId();

      if (submissions.length && collectionId) {
        submissions.forEach((submission) => {
          this.actions.getSubmissionsReviewActions(submission.id, collectionId);
        });
      }
    });
  }

  constructor() {
    this.initializeFromQueryParams();
    this.initializeCollectionProvider();
    this.setupEffects();
  }

  changeReviewStatus(value: SubmissionReviewStatus) {
    this.reviewStatus.set(value);
    this.currentPage.set('1');
  }

  changeSort(value: Primitive) {
    this.selectedSortOption.set(value as string);
    this.currentPage.set('1');
  }

  onPageChange(event: PaginatorState): void {
    if (event.page !== undefined) {
      const pageNumber = (event.page + 1).toString();
      this.currentPage.set(pageNumber);
    }
  }

  private initializeFromQueryParams(): void {
    const queryParams = this.route.snapshot.queryParams;
    const statusValues = Object.values(SubmissionReviewStatus);

    const statusParam = queryParams['status'];
    if (statusParam && statusValues.includes(statusParam)) {
      this.reviewStatus.set(statusParam);
    } else {
      this.reviewStatus.set(SubmissionReviewStatus.Pending);
    }

    const sortByParam = queryParams['sortBy'];
    if (sortByParam) {
      this.selectedSortOption.set(sortByParam);
    }

    const pageParam = queryParams['page'];
    if (pageParam && !isNaN(parseInt(pageParam)) && parseInt(pageParam)) {
      this.currentPage.set(pageParam);
    } else {
      this.currentPage.set('1');
    }
  }

  private updateUrlParams(status: SubmissionReviewStatus, sortBy: string, page: string): void {
    const queryParams: Record<string, string | null> = { status };

    if (sortBy) {
      queryParams['sortBy'] = sortBy;
    }

    if (page !== '1') {
      queryParams['page'] = page;
    } else {
      queryParams['page'] = null;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  private initializeCollectionProvider(): void {
    const id = this.route.parent?.snapshot.paramMap.get('providerId');

    if (!id) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.providerId.set(id);
    this.actions.getCollectionProvider(id);
  }
}
