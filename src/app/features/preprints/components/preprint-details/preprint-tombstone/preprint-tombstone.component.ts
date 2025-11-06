import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnDestroy, output } from '@angular/core';
import { Router } from '@angular/router';

import { ApplicabilityStatus, PreregLinkInfo } from '@osf/features/preprints/enums';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { FetchPreprintById, PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { LicenseDisplayComponent } from '@osf/shared/components/license-display/license-display.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import {
  ContributorsSelectors,
  GetBibliographicContributors,
  LoadMoreBibliographicContributors,
  ResetContributorsState,
} from '@osf/shared/stores/contributors';
import { FetchSelectedSubjects, SubjectsSelectors } from '@osf/shared/stores/subjects';

import { PreprintDoiSectionComponent } from '../preprint-doi-section/preprint-doi-section.component';

@Component({
  selector: 'osf-preprint-tombstone',
  imports: [
    Card,
    PreprintDoiSectionComponent,
    Skeleton,
    TranslatePipe,
    TruncatedTextComponent,
    Tag,
    DatePipe,
    ContributorsListComponent,
    LicenseDisplayComponent,
  ],
  templateUrl: './preprint-tombstone.component.html',
  styleUrl: './preprint-tombstone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintTombstoneComponent implements OnDestroy {
  readonly ApplicabilityStatus = ApplicabilityStatus;
  readonly PreregLinkInfo = PreregLinkInfo;

  private actions = createDispatchMap({
    getBibliographicContributors: GetBibliographicContributors,
    resetContributorsState: ResetContributorsState,
    fetchPreprintById: FetchPreprintById,
    fetchSubjects: FetchSelectedSubjects,
    loadMoreBibliographicContributors: LoadMoreBibliographicContributors,
  });
  private router = inject(Router);

  preprintVersionSelected = output<string>();

  preprintProvider = input.required<PreprintProviderDetails | undefined>();

  preprint = select(PreprintSelectors.getPreprint);
  isPreprintLoading = select(PreprintSelectors.isPreprintLoading);

  bibliographicContributors = select(ContributorsSelectors.getBibliographicContributors);
  areContributorsLoading = select(ContributorsSelectors.isBibliographicContributorsLoading);
  hasMoreBibliographicContributors = select(ContributorsSelectors.hasMoreBibliographicContributors);
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

      this.actions.getBibliographicContributors(this.preprint()?.id, ResourceType.Preprint);
      this.actions.fetchSubjects(this.preprint()!.id, ResourceType.Preprint);
    });
  }

  ngOnDestroy(): void {
    this.actions.resetContributorsState();
  }

  tagClicked(tag: string) {
    this.router.navigate(['/search'], { queryParams: { search: tag } });
  }

  loadMoreContributors(): void {
    this.actions.loadMoreBibliographicContributors(this.preprint()?.id, ResourceType.Preprint);
  }
}
