import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, effect, input, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PreprintDoiSectionComponent } from '@osf/features/preprints/components/preprint-details/preprint-doi-section/preprint-doi-section.component';
import { ApplicabilityStatus, PreregLinkInfo } from '@osf/features/preprints/enums';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { FetchPreprintById, PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { TruncatedTextComponent } from '@shared/components';
import { ResourceType } from '@shared/enums';
import { Institution } from '@shared/models';
import { ContributorsSelectors, GetAllContributors, ResetContributorsState } from '@shared/stores';

@Component({
  selector: 'osf-preprint-general-information',
  imports: [Card, TranslatePipe, TruncatedTextComponent, Skeleton, FormsModule, PreprintDoiSectionComponent],
  templateUrl: './general-information.component.html',
  styleUrl: './general-information.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInformationComponent implements OnDestroy {
  readonly ApplicabilityStatus = ApplicabilityStatus;
  readonly PreregLinkInfo = PreregLinkInfo;

  private actions = createDispatchMap({
    getContributors: GetAllContributors,
    resetContributorsState: ResetContributorsState,
    fetchPreprintById: FetchPreprintById,
  });
  preprintProvider = input.required<PreprintProviderDetails | undefined>();

  preprint = select(PreprintSelectors.getPreprint);
  isPreprintLoading = select(PreprintSelectors.isPreprintLoading);

  //[RNi] TODO: Implement when institutions available
  affiliatedInstitutions = signal<Institution[]>([]);

  contributors = select(ContributorsSelectors.getContributors);
  areContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  bibliographicContributors = computed(() => {
    return this.contributors().filter((contributor) => contributor.isBibliographic);
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
}
