import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { collectionFilterNames } from '@osf/features/collections/constants';
import { StopPropagationDirective } from '@osf/shared/directives/stop-propagation.directive';
import { CollectionSubmission } from '@osf/shared/models/collections/collections.models';
import { KeyValueModel } from '@osf/shared/models/common/key-value.model';
import { CollectionStatusSeverityPipe } from '@osf/shared/pipes/collection-status-severity.pipe';

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
    RouterLink,
    CollectionStatusSeverityPipe,
  ],
  templateUrl: './overview-collections.component.html',
  styleUrl: './overview-collections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewCollectionsComponent {
  projectSubmissions = input<CollectionSubmission[] | null>(null);
  isProjectSubmissionsLoading = input<boolean>(false);

  getSubmissionAttributes(submission: CollectionSubmission): KeyValueModel[] {
    const attributes: KeyValueModel[] = [];

    for (const filter of collectionFilterNames) {
      const value = submission[filter.key as keyof CollectionSubmission];

      if (value) {
        attributes.push({
          key: filter.key,
          label: filter.label,
          value: String(value),
        });
      }
    }

    return attributes;
  }
}
