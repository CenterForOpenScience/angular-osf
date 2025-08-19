import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect } from '@angular/core';

import { CitationSectionComponent } from '@osf/features/preprints/components/preprint-details/citation-section/citation-section.component';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { ResourceType } from '@shared/enums';
import { InterpolatePipe } from '@shared/pipes';
import { FetchSelectedSubjects, SubjectsSelectors } from '@shared/stores';

@Component({
  selector: 'osf-preprint-additional-info',
  imports: [
    Card,
    TranslatePipe,
    Tag,
    Skeleton,
    DatePipe,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    InterpolatePipe,
    CitationSectionComponent,
  ],
  templateUrl: './additional-info.component.html',
  styleUrl: './additional-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalInfoComponent {
  private actions = createDispatchMap({
    fetchSubjects: FetchSelectedSubjects,
  });

  preprint = select(PreprintSelectors.getPreprint);
  isPreprintLoading = select(PreprintSelectors.isPreprintLoading);

  subjects = select(SubjectsSelectors.getSelectedSubjects);
  areSelectedSubjectsLoading = select(SubjectsSelectors.areSelectedSubjectsLoading);

  license = computed(() => {
    const preprint = this.preprint();
    if (!preprint) return null;
    return preprint.embeddedLicense;
  });
  licenseOptionsRecord = computed(() => {
    return (this.preprint()?.licenseOptions ?? {}) as Record<string, string>;
  });

  skeletonData = Array.from({ length: 5 }, () => null);

  constructor() {
    effect(() => {
      const preprint = this.preprint();
      if (!preprint) return;

      this.actions.fetchSubjects(this.preprint()!.id, ResourceType.Preprint);
    });
  }
}
