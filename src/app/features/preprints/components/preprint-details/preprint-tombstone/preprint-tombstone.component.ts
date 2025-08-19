import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, OnDestroy } from '@angular/core';

import { PreprintDoiSectionComponent } from '@osf/features/preprints/components/preprint-details/preprint-doi-section/preprint-doi-section.component';
import { ApplicabilityStatus, PreregLinkInfo } from '@osf/features/preprints/enums';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { FetchPreprintById, PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { TruncatedTextComponent } from '@shared/components';
import { ResourceType } from '@shared/enums';
import { InterpolatePipe } from '@shared/pipes';
import {
  ContributorsSelectors,
  FetchSelectedSubjects,
  GetAllContributors,
  ResetContributorsState,
  SubjectsSelectors,
} from '@shared/stores';

@Component({
  selector: 'osf-preprint-tombstone',
  imports: [
    Card,
    PreprintDoiSectionComponent,
    Skeleton,
    TranslatePipe,
    TruncatedTextComponent,
    Accordion,
    AccordionContent,
    Tag,
    AccordionPanel,
    AccordionHeader,
    InterpolatePipe,
    DatePipe,
  ],
  templateUrl: './preprint-tombstone.component.html',
  styleUrl: './preprint-tombstone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintTombstoneComponent implements OnDestroy {
  readonly ApplicabilityStatus = ApplicabilityStatus;
  readonly PreregLinkInfo = PreregLinkInfo;

  private actions = createDispatchMap({
    getContributors: GetAllContributors,
    resetContributorsState: ResetContributorsState,
    fetchPreprintById: FetchPreprintById,
    fetchSubjects: FetchSelectedSubjects,
  });
  preprintProvider = input.required<PreprintProviderDetails | undefined>();

  preprint = select(PreprintSelectors.getPreprint);
  isPreprintLoading = select(PreprintSelectors.isPreprintLoading);

  contributors = select(ContributorsSelectors.getContributors);
  areContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  bibliographicContributors = computed(() => {
    return this.contributors().filter((contributor) => contributor.isBibliographic);
  });
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

  skeletonData = Array.from({ length: 6 }, () => null);

  constructor() {
    effect(() => {
      const preprint = this.preprint();
      if (!preprint) return;

      this.actions.getContributors(this.preprint()!.id, ResourceType.Preprint);
      this.actions.fetchSubjects(this.preprint()!.id, ResourceType.Preprint);
    });
  }

  ngOnDestroy(): void {
    this.actions.resetContributorsState();
  }
}
