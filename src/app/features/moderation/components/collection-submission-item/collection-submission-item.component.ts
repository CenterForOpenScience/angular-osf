import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { collectionFilterNames } from '@osf/features/collections/constants';
import { SubmissionReviewStatus } from '@osf/features/moderation/enums';
import { IconComponent } from '@osf/shared/components';
import { DateAgoPipe } from '@osf/shared/pipes';
import { CollectionSubmissionWithGuid } from '@shared/models';
import { CollectionsSelectors } from '@shared/stores';

import { ReviewStatusIcon } from '../../constants';

@Component({
  selector: 'osf-submission-item',
  imports: [TranslatePipe, IconComponent, DateAgoPipe, Button],
  templateUrl: './collection-submission-item.component.html',
  styleUrl: './collection-submission-item.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionSubmissionItemComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  submission = input.required<CollectionSubmissionWithGuid>();
  collectionProvider = select(CollectionsSelectors.getCollectionProvider);

  protected readonly reviewStatusIcon = ReviewStatusIcon;

  protected currentReviewAction = computed(() => {
    const actions = this.submission().actions;

    if (!actions || !actions.length) return null;

    return actions[0];
  });

  protected currentSubmissionAttributes = computed(() => {
    const item = this.submission();
    if (!item) return null;

    return collectionFilterNames
      .map((attribute) => ({
        ...attribute,
        value: item[attribute.key as keyof CollectionSubmissionWithGuid] as string,
      }))
      .filter((attribute) => attribute.value);
  });

  protected handleNavigation() {
    const currentStatus = this.activatedRoute.snapshot.queryParams['status'];
    const queryParams = currentStatus ? { status: currentStatus, mode: 'moderation' } : {};

    this.router.navigate(['../', this.submission().nodeId], {
      relativeTo: this.activatedRoute,
      queryParams,
    });
  }

  protected readonly SubmissionReviewStatus = SubmissionReviewStatus;
}
