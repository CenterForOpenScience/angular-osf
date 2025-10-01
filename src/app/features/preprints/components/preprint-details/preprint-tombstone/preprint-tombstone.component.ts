import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnDestroy, output } from '@angular/core';
import { Router } from '@angular/router';

import { ApplicabilityStatus, PreregLinkInfo } from '@osf/features/preprints/enums';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { FetchPreprintById, PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { ContributorsListComponent, TruncatedTextComponent } from '@osf/shared/components';
import { ResourceType } from '@osf/shared/enums';
import { InterpolatePipe } from '@osf/shared/pipes';
import {
  ContributorsSelectors,
  FetchSelectedSubjects,
  GetAllContributors,
  ResetContributorsState,
  SubjectsSelectors,
} from '@osf/shared/stores';

import { PreprintDoiSectionComponent } from '../preprint-doi-section/preprint-doi-section.component';

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
    ContributorsListComponent,
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
  private router = inject(Router);

  preprintVersionSelected = output<string>();

  preprintProvider = input.required<PreprintProviderDetails | undefined>();

  preprint = select(PreprintSelectors.getPreprint);
  isPreprintLoading = select(PreprintSelectors.isPreprintLoading);

  contributors = select(ContributorsSelectors.getContributors);
  areContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  bibliographicContributors = computed(() => this.contributors().filter((contributor) => contributor.isBibliographic));
  subjects = select(SubjectsSelectors.getSelectedSubjects);
  areSelectedSubjectsLoading = select(SubjectsSelectors.areSelectedSubjectsLoading);

  license = computed(() => {
    const preprint = this.preprint();
    if (!preprint) return null;
    return preprint.embeddedLicense;
  });

  licenseOptionsRecord = computed(() => (this.preprint()?.licenseOptions ?? {}) as Record<string, string>);

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

  tagClicked(tag: string) {
    this.router.navigate(['/search'], { queryParams: { search: tag } });
  }
}
