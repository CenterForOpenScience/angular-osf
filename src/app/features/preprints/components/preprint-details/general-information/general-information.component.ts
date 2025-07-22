import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';

import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ApplicabilityStatus, PreregLinkInfo } from '@osf/features/preprints/enums';
import { FetchPreprintById, PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { TruncatedTextComponent } from '@shared/components';
import { ResourceType } from '@shared/enums';
import { Institution } from '@shared/models';
import { ContributorsSelectors, GetAllContributors, ResetContributorsState } from '@shared/stores';

@Component({
  selector: 'osf-preprint-general-information',
  imports: [Card, TranslatePipe, TruncatedTextComponent, Skeleton, Select, FormsModule],
  templateUrl: './general-information.component.html',
  styleUrl: './general-information.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInformationComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  readonly ApplicabilityStatus = ApplicabilityStatus;
  readonly PreregLinkInfo = PreregLinkInfo;

  private actions = createDispatchMap({
    getContributors: GetAllContributors,
    resetContributorsState: ResetContributorsState,
    fetchPreprintById: FetchPreprintById,
  });

  preprint = select(PreprintSelectors.getPreprint);
  isPreprintLoading = select(PreprintSelectors.isPreprintLoading);

  //[RNi] TODO: Implement when institutions available
  affiliatedInstitutions = signal<Institution[]>([]);

  contributors = select(ContributorsSelectors.getContributors);
  areContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  bibliographicContributors = computed(() => {
    return this.contributors().filter((contributor) => contributor.isBibliographic);
  });

  preprintVersionIds = select(PreprintSelectors.getPreprintVersionIds);
  arePreprintVersionIdsLoading = select(PreprintSelectors.arePreprintVersionIdsLoading);

  versionsDropdownOptions = computed(() => {
    const preprintVersionIds = this.preprintVersionIds();
    if (!preprintVersionIds.length) return [];

    return preprintVersionIds.map((versionId, index) => ({
      label: `Version ${preprintVersionIds.length - index}`,
      value: versionId,
    }));
  });

  skeletonData = Array.from({ length: 5 }, () => null);

  constructor() {
    effect(() => {
      const preprint = this.preprint();
      if (!preprint) return;

      this.actions.getContributors(this.preprint()!.id, ResourceType.Preprint);
    });
  }

  ngOnDestroy(): void {
    this.actions.resetContributorsState();
  }

  selectPreprintVersion(versionId: string) {
    if (this.preprint()!.id === versionId) return;

    this.actions.fetchPreprintById(versionId).subscribe({
      complete: () => {
        const currentUrl = this.router.url;
        const newUrl = currentUrl.replace(/[^/]+$/, versionId);

        this.location.replaceState(newUrl);
      },
    });
  }
}
