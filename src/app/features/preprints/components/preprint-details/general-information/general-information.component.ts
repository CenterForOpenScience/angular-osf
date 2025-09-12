import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, effect, input, OnDestroy, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApplicabilityStatus, PreregLinkInfo } from '@osf/features/preprints/enums';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { FetchPreprintById, PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { AffiliatedInstitutionsViewComponent, IconComponent, TruncatedTextComponent } from '@osf/shared/components';
import { ResourceType } from '@osf/shared/enums';
import {
  ContributorsSelectors,
  FetchResourceInstitutions,
  GetAllContributors,
  InstitutionsSelectors,
  ResetContributorsState,
} from '@osf/shared/stores';

import { PreprintDoiSectionComponent } from '../preprint-doi-section/preprint-doi-section.component';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-preprint-general-information',
  imports: [
    Card,
    TranslatePipe,
    TruncatedTextComponent,
    Skeleton,
    FormsModule,
    PreprintDoiSectionComponent,
    IconComponent,
    AffiliatedInstitutionsViewComponent,
  ],
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
    fetchResourceInstitutions: FetchResourceInstitutions,
  });
  readonly environment = environment;

  preprintProvider = input.required<PreprintProviderDetails | undefined>();
  preprintVersionSelected = output<string>();

  preprint = select(PreprintSelectors.getPreprint);
  isPreprintLoading = select(PreprintSelectors.isPreprintLoading);

  affiliatedInstitutions = select(InstitutionsSelectors.getResourceInstitutions);

  contributors = select(ContributorsSelectors.getContributors);
  areContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  bibliographicContributors = computed(() => {
    return this.contributors().filter((contributor) => contributor.isBibliographic);
  });

  skeletonData = Array.from({ length: 5 }, () => null);

  nodeLink = computed(() => {
    return `${environment.webUrl}/${this.preprint()?.nodeId}`;
  });

  constructor() {
    effect(() => {
      const preprint = this.preprint();
      if (!preprint) return;

      this.actions.getContributors(this.preprint()!.id, ResourceType.Preprint);
      this.actions.fetchResourceInstitutions(this.preprint()!.id, ResourceType.Preprint);
    });
  }

  ngOnDestroy(): void {
    this.actions.resetContributorsState();
  }
}
