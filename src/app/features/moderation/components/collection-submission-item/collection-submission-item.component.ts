import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { collectionFilterNames } from '@osf/features/collections/constants';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { CollectionSubmissionWithGuid } from '@osf/shared/models/collections/collections.model';
import { DateAgoPipe } from '@osf/shared/pipes/date-ago.pipe';
import { CollectionsSelectors } from '@osf/shared/stores/collections';

import { ReviewStatusIcon } from '../../constants';
import { SubmissionReviewStatus } from '../../enums';

@Component({
  selector: 'osf-submission-item',
  imports: [
    TranslatePipe,
    IconComponent,
    DateAgoPipe,
    Button,
    TruncatedTextComponent,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    ContributorsListComponent,
  ],
  templateUrl: './collection-submission-item.component.html',
  styleUrl: './collection-submission-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionSubmissionItemComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  submission = input.required<CollectionSubmissionWithGuid>();
  loadContributors = output<void>();
  loadMoreContributors = output<void>();
  collectionProvider = select(CollectionsSelectors.getCollectionProvider);

  readonly reviewStatusIcon = ReviewStatusIcon;
  readonly SubmissionReviewStatus = SubmissionReviewStatus;

  currentReviewAction = computed(() => {
    const actions = this.submission().actions;

    if (!actions || !actions.length) return null;

    return actions[0];
  });

  currentSubmissionAttributes = computed(() => {
    const item = this.submission();
    if (!item) return null;

    return collectionFilterNames
      .map((attribute) => ({
        ...attribute,
        value: item[attribute.key as keyof CollectionSubmissionWithGuid] as string,
      }))
      .filter((attribute) => attribute.value);
  });

  hasMoreContributors = computed(() => {
    const submission = this.submission();
    if (submission.contributors && submission.totalContributors) {
      return submission.contributors.length < submission.totalContributors;
    }

    return false;
  });

  handleNavigation() {
    const currentStatus = this.activatedRoute.snapshot.queryParams['status'];
    const queryParams = currentStatus ? { status: currentStatus, mode: 'moderation' } : {};

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['../', this.submission().nodeId], {
        relativeTo: this.activatedRoute,
        queryParams,
      })
    );

    window.open(url, '_blank');
  }

  handleOpen() {
    this.loadContributors.emit();
  }
}
