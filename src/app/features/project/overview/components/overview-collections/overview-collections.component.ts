import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { collectionFilterNames } from '@osf/features/collections/constants';
import { StopPropagationDirective } from '@osf/shared/directives/stop-propagation.directive';
import { CollectionSubmissionReviewState } from '@osf/shared/enums/collection-submission-review-state.enum';
import { CollectionSubmission } from '@osf/shared/models/collections/collections.models';

@Component({
  selector: 'osf-overview-collections',
  imports: [
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    TranslatePipe,
    Skeleton,
    Tag,
    Button,
    StopPropagationDirective,
  ],
  templateUrl: './overview-collections.component.html',
  styleUrl: './overview-collections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewCollectionsComponent {
  private readonly router = inject(Router);

  readonly CollectionSubmissionReviewState = CollectionSubmissionReviewState;

  projectSubmissions = input<CollectionSubmission[] | null>(null);
  isProjectSubmissionsLoading = input<boolean>(false);

  submissionAttributes(submission: CollectionSubmission) {
    return collectionFilterNames
      .map((attribute) => ({
        ...attribute,
        value: submission[attribute.key as keyof CollectionSubmission] as string,
      }))
      .filter((attribute) => attribute.value);
  }

  navigateToCollection(submission: CollectionSubmission) {
    this.router.navigate([`collections/${submission.collectionId}/`]);
  }
}
