import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { SelectButton } from 'primeng/selectbutton';

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Primitive } from '@osf/core/helpers';
import { IconComponent, SelectComponent } from '@osf/shared/components';
import { ALL_SORT_OPTIONS } from '@osf/shared/constants';
import {
  ClearCollections,
  ClearCollectionSubmissions,
  CollectionsSelectors,
  GetCollectionDetails,
  GetCollectionProvider,
  SearchCollectionSubmissions,
  SetPageNumber,
} from '@shared/stores';

import { SUBMISSION_REVIEW_OPTIONS } from '../../constants';
import { SubmissionReviewStatus } from '../../enums';
import { SubmissionsListComponent } from '../submissions-list/submissions-list.component';
import { pendingReviews } from '../test-data';

@Component({
  selector: 'osf-collection-moderation-submissions',
  imports: [SelectButton, TranslatePipe, FormsModule, SelectComponent, SubmissionsListComponent, IconComponent],
  templateUrl: './collection-moderation-submissions.component.html',
  styleUrl: './collection-moderation-submissions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionModerationSubmissionsComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  readonly submissionReviewOptions = SUBMISSION_REVIEW_OPTIONS; //

  protected collectionProvider = select(CollectionsSelectors.getCollectionProvider);
  protected collectionDetails = select(CollectionsSelectors.getCollectionDetails);
  protected providerId = signal<string>('');
  protected primaryCollectionId = computed(() => this.collectionProvider()?.primaryCollection?.id);

  sortOptions = ALL_SORT_OPTIONS; //
  selectedSortOption = signal(null); //
  selectedReviewOption = this.submissionReviewOptions[0].value; //

  protected actions = createDispatchMap({
    getCollectionProvider: GetCollectionProvider,
    getCollectionDetails: GetCollectionDetails,
    searchCollectionSubmissions: SearchCollectionSubmissions,
    setPageNumber: SetPageNumber,
    clearCollections: ClearCollections,
    clearCollectionsSubmissions: ClearCollectionSubmissions,
  });

  private setupEffects(): void {
    effect(() => {
      const collectionId = this.primaryCollectionId();
      if (collectionId) {
        this.actions.getCollectionDetails(collectionId);
      }
    });
  }

  totalCount = 5; //

  submissions = pendingReviews; //

  constructor() {
    this.initializeCollectionProvider();
    this.setupEffects();
  }

  changeReviewStatus(value: SubmissionReviewStatus) {
    console.log(value);
  }

  changeSort(value: Primitive) {
    console.log(value);
  }

  private initializeCollectionProvider(): void {
    const id = this.route.parent?.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.providerId.set(id);
    this.actions.getCollectionProvider(id);
  }
}
