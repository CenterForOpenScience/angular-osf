import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { SubjectModel } from '@osf/shared/models/subject/subject.model';

@Component({
  selector: 'osf-browse-by-subjects',
  imports: [Button, Skeleton, RouterLink, TranslatePipe],
  templateUrl: './browse-by-subjects.component.html',
  styleUrl: './browse-by-subjects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseBySubjectsComponent {
  readonly subjects = input.required<SubjectModel[]>();
  readonly areSubjectsLoading = input.required<boolean>();
  readonly isProviderLoading = input.required<boolean>();
  readonly isLandingPage = input<boolean>(false);

  readonly skeletonArray = new Array(6);

  readonly subjectRoute = computed(() => (this.isLandingPage() ? '/search' : 'discover'));

  getQueryParamsForSubject(subject: SubjectModel) {
    return {
      tab: ResourceType.Preprint,
      filter_subject: JSON.stringify([
        {
          label: subject.name,
          value: subject.iri,
        },
      ]),
    };
  }
}
