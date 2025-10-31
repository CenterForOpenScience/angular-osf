import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnDestroy, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ApplicabilityStatus, PreregLinkInfo } from '@osf/features/preprints/enums';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { FetchPreprintById, PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { AffiliatedInstitutionsViewComponent } from '@osf/shared/components/affiliated-institutions-view/affiliated-institutions-view.component';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import {
  ContributorsSelectors,
  GetBibliographicContributors,
  LoadMoreBibliographicContributors,
  ResetContributorsState,
} from '@osf/shared/stores/contributors';
import { FetchResourceInstitutions, InstitutionsSelectors } from '@osf/shared/stores/institutions';

import { PreprintDoiSectionComponent } from '../preprint-doi-section/preprint-doi-section.component';

@Component({
  selector: 'osf-preprint-general-information',
  imports: [
    Card,
    TranslatePipe,
    Skeleton,
    FormsModule,
    TruncatedTextComponent,
    PreprintDoiSectionComponent,
    IconComponent,
    AffiliatedInstitutionsViewComponent,
    ContributorsListComponent,
  ],
  templateUrl: './general-information.component.html',
  styleUrl: './general-information.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInformationComponent implements OnDestroy {
  private readonly environment = inject(ENVIRONMENT);

  readonly ApplicabilityStatus = ApplicabilityStatus;
  readonly PreregLinkInfo = PreregLinkInfo;

  private actions = createDispatchMap({
    getBibliographicContributors: GetBibliographicContributors,
    resetContributorsState: ResetContributorsState,
    fetchPreprintById: FetchPreprintById,
    fetchResourceInstitutions: FetchResourceInstitutions,
    loadMoreBibliographicContributors: LoadMoreBibliographicContributors,
  });

  preprintProvider = input.required<PreprintProviderDetails | undefined>();
  preprintVersionSelected = output<string>();

  preprint = select(PreprintSelectors.getPreprint);
  isPreprintLoading = select(PreprintSelectors.isPreprintLoading);

  affiliatedInstitutions = select(InstitutionsSelectors.getResourceInstitutions);

  bibliographicContributors = select(ContributorsSelectors.getBibliographicContributors);
  areContributorsLoading = select(ContributorsSelectors.isBibliographicContributorsLoading);
  hasMoreBibliographicContributors = select(ContributorsSelectors.hasMoreBibliographicContributors);

  skeletonData = Array.from({ length: 5 }, () => null);

  nodeLink = computed(() => `${this.environment.webUrl}/${this.preprint()?.nodeId}`);

  constructor() {
    effect(() => {
      const preprint = this.preprint();
      if (!preprint) return;

      this.actions.getBibliographicContributors(this.preprint()!.id, ResourceType.Preprint);
      this.actions.fetchResourceInstitutions(this.preprint()!.id, ResourceType.Preprint);
    });
  }

  ngOnDestroy(): void {
    this.actions.resetContributorsState();
  }

  handleLoadMoreContributors(): void {
    this.actions.loadMoreBibliographicContributors(this.preprint()?.id, ResourceType.Preprint);
  }
}
