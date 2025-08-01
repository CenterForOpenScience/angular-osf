import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { collectionFilterNames } from '@osf/features/collections/constants';
import { SubmissionReviewStatus } from '@osf/features/moderation/enums';
import { CollectionSubmission, ResourceOverview } from '@shared/models';
import { CollectionsSelectors, GetProjectSubmissions } from '@shared/stores';

@Component({
  selector: 'osf-overview-collections',
  imports: [Accordion, AccordionPanel, AccordionHeader, AccordionContent, TranslatePipe, Skeleton, Tag, Button],
  templateUrl: './overview-collections.component.html',
  styleUrl: './overview-collections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewCollectionsComponent {
  private readonly router = inject(Router);
  protected readonly SubmissionReviewStatus = SubmissionReviewStatus;
  currentProject = input.required<ResourceOverview | null>();
  projectSubmissions = select(CollectionsSelectors.getCurrentProjectSubmissions);
  isProjectSubmissionsLoading = select(CollectionsSelectors.getCurrentProjectSubmissionsLoading);

  protected projectId = computed(() => {
    const resource = this.currentProject();
    return resource ? resource.id : null;
  });

  protected actions = createDispatchMap({
    getProjectSubmissions: GetProjectSubmissions,
  });

  constructor() {
    effect(() => {
      const projectId = this.projectId();

      if (projectId) {
        this.actions.getProjectSubmissions(projectId);
      }
    });
  }

  protected get submissionAttributes() {
    return (submission: CollectionSubmission) => {
      if (!submission) return [];

      return collectionFilterNames
        .map((attribute) => ({
          ...attribute,
          value: submission[attribute.key as keyof CollectionSubmission] as string,
        }))
        .filter((attribute) => attribute.value);
    };
  }

  navigateToCollection($event: Event, submission: CollectionSubmission) {
    $event.stopPropagation();
    this.router.navigate([`collections/${submission.collectionId}/`]);
  }
}
