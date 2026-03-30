import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { LicenseDisplayComponent } from '@osf/shared/components/license-display/license-display.component';
import { ResourceType } from '@shared/enums/resource-type.enum';
import { FetchSelectedSubjects, SubjectsSelectors } from '@shared/stores/subjects';

import { CitationSectionComponent } from '../citation-section/citation-section.component';

@Component({
  selector: 'osf-preprint-additional-info',
  imports: [Card, Tag, Skeleton, CitationSectionComponent, LicenseDisplayComponent, DatePipe, TranslatePipe],
  templateUrl: './additional-info.component.html',
  styleUrl: './additional-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalInfoComponent {
  private readonly router = inject(Router);
  private readonly actions = createDispatchMap({ fetchSubjects: FetchSelectedSubjects });

  readonly preprintProviderId = input.required<string>();

  readonly preprint = select(PreprintSelectors.getPreprint);
  readonly isPreprintLoading = select(PreprintSelectors.isPreprintLoading);

  readonly subjects = select(SubjectsSelectors.getSelectedSubjects);
  readonly areSelectedSubjectsLoading = select(SubjectsSelectors.areSelectedSubjectsLoading);

  readonly license = computed(() => this.preprint()?.embeddedLicense ?? null);
  readonly licenseOptionsRecord = computed(() => (this.preprint()?.licenseOptions ?? {}) as Record<string, string>);

  readonly skeletonData = new Array(5).fill(null);

  constructor() {
    effect(() => {
      const preprintId = this.preprint()?.id;
      if (!preprintId) return;
      this.actions.fetchSubjects(preprintId, ResourceType.Preprint);
    });
  }

  tagClicked(tag: string) {
    this.router.navigate(['/search'], { queryParams: { search: tag } });
  }
}
