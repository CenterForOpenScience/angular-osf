import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';

import { MyReviewingNavigationComponent, PreprintRecentActivityListComponent } from '../../components';
import {
  GetPreprintProviders,
  GetPreprintReviewActions,
  PreprintModerationSelectors,
} from '../../store/preprint-moderation';

@Component({
  selector: 'osf-my-preprint-reviewing',
  imports: [
    SubHeaderComponent,
    Card,
    Skeleton,
    TranslatePipe,
    PreprintRecentActivityListComponent,
    MyReviewingNavigationComponent,
  ],
  templateUrl: './my-preprint-reviewing.component.html',
  styleUrl: './my-preprint-reviewing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyPreprintReviewingComponent implements OnInit {
  preprintProviders = select(PreprintModerationSelectors.getPreprintProviders);
  isPreprintProvidersLoading = select(PreprintModerationSelectors.arePreprintProviderLoading);

  preprintReviews = select(PreprintModerationSelectors.getPreprintReviews);
  isReviewsLoading = select(PreprintModerationSelectors.arePreprintReviewsLoading);
  preprintReviewsTotalCount = select(PreprintModerationSelectors.getPreprintReviewsTotalCount);

  private readonly actions = createDispatchMap({
    getPreprintProviders: GetPreprintProviders,
    getPreprintReviewActions: GetPreprintReviewActions,
  });

  ngOnInit(): void {
    this.actions.getPreprintProviders();
    this.actions.getPreprintReviewActions();
  }

  pageChanged(page: number) {
    this.actions.getPreprintReviewActions(page);
  }
}
