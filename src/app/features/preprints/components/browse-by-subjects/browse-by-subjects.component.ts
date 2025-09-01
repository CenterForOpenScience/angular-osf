import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ResourceType } from '@shared/enums';
import { SubjectModel } from '@shared/models';

@Component({
  selector: 'osf-browse-by-subjects',
  imports: [RouterLink, Skeleton, TranslatePipe, Button],
  templateUrl: './browse-by-subjects.component.html',
  styleUrl: './browse-by-subjects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseBySubjectsComponent {
  subjects = input.required<SubjectModel[]>();
  linksToSearchPageForSubject = computed(() => {
    return this.subjects().map((subject) => ({
      tab: ResourceType.Preprint,
      filter_subject: subject.iri,
    }));
  });
  areSubjectsLoading = input.required<boolean>();
  isProviderLoading = input.required<boolean>();
  isLandingPage = input<boolean>(false);
  skeletonArray = Array.from({ length: 6 }, (_, i) => i + 1);
}
