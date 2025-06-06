import { TranslateModule } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Subject } from '@osf/features/preprints/models';
import { ResourceTab } from '@shared/enums';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-browse-by-subjects',
  imports: [RouterLink, Skeleton, TranslateModule, Button],
  templateUrl: './browse-by-subjects.component.html',
  styleUrl: './browse-by-subjects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseBySubjectsComponent {
  subjects = input.required<Subject[]>();
  linksToSearchPageForSubject = computed(() => {
    return this.subjects().map((subject) => ({
      resourceTab: ResourceTab.Preprints,
      activeFilters: JSON.stringify([
        {
          filterName: 'Subject',
          label: subject.text,
          value: `${environment.apiUrl}/subjects/` + subject.id,
        },
      ]),
    }));
  });
  areSubjectsLoading = input.required<boolean>();
  isProviderLoading = input.required<boolean>();
  skeletonArray = Array.from({ length: 6 }, (_, i) => i + 1);
}
