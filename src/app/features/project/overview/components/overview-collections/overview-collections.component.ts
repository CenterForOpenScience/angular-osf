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
import { StopPropagationDirective } from '@osf/shared/directives';
import { CollectionSubmission, ResourceOverview } from '@osf/shared/models';
import { CollectionsSelectors, GetProjectSubmissions } from '@osf/shared/stores';

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
  readonly SubmissionReviewStatus = SubmissionReviewStatus;

  currentProject = input.required<ResourceOverview | null>();
  projectSubmissions = select(CollectionsSelectors.getCurrentProjectSubmissions);
  isProjectSubmissionsLoading = select(CollectionsSelectors.getCurrentProjectSubmissionsLoading);

  projectId = computed(() => {
    const resource = this.currentProject();
    return resource ? resource.id : null;
  });

  actions = createDispatchMap({ getProjectSubmissions: GetProjectSubmissions });

  constructor() {
    effect(() => {
      const projectId = this.projectId();

      if (projectId) {
        this.actions.getProjectSubmissions(projectId);
      }
    });
  }

  get submissionAttributes() {
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

  navigateToCollection(submission: CollectionSubmission) {
    this.router.navigate([`collections/${submission.collectionId}/`]);
  }
}
