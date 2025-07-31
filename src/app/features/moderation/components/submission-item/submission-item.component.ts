import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { collectionFilterNames } from '@osf/features/collections/constants';
import { SubmissionReviewStatus } from '@osf/features/moderation/enums';
import { IconComponent } from '@osf/shared/components';
import { CollectionSubmission } from '@shared/models';
import { TimeAgoPipe } from '@shared/pipes/time-ago.pipe';

import { ReviewStatusIcon } from '../../constants';
import { CollectionsModerationSelectors, SetCurrentReviewAction } from '../../store/collections-moderation';

@Component({
  selector: 'osf-submission-item',
  imports: [TranslatePipe, IconComponent, TimeAgoPipe, Button],
  templateUrl: './submission-item.component.html',
  styleUrl: './submission-item.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmissionItemComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  protected reviewActions = select(CollectionsModerationSelectors.getReviewActions);
  submission = input.required<CollectionSubmission>();

  protected readonly reviewStatusIcon = ReviewStatusIcon;

  protected currentReviewAction = computed(() => {
    const nodeId = this.submission().nodeId;
    const actions = this.reviewActions();

    if (!actions.length || !nodeId) return null;

    return actions.flat().filter((action) => action.targetNodeId === nodeId)[0];
  });

  protected actions = createDispatchMap({
    setCurrentReviewAction: SetCurrentReviewAction,
  });

  protected currentSubmissionAttributes = computed(() => {
    const item = this.submission();
    if (!item) return null;

    return collectionFilterNames
      .map((attribute) => ({
        ...attribute,
        value: item[attribute.key as keyof CollectionSubmission] as string,
      }))
      .filter((attribute) => attribute.value);
  });

  protected handleNavigation() {
    this.actions.setCurrentReviewAction(this.currentReviewAction());

    const currentStatus = this.activatedRoute.snapshot.queryParams['status'];
    const queryParams = currentStatus ? { status: currentStatus } : {};

    this.router.navigate(['../', this.submission().nodeId], {
      relativeTo: this.activatedRoute,
      queryParams,
    });
  }

  protected readonly SubmissionReviewStatus = SubmissionReviewStatus;
}
