import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  output,
  PLATFORM_ID,
} from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
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

import { PreprintAuthorAssertionsComponent } from '../preprint-author-assertions/preprint-author-assertions.component';
import { PreprintDoiSectionComponent } from '../preprint-doi-section/preprint-doi-section.component';

@Component({
  selector: 'osf-preprint-general-information',
  imports: [
    Card,
    Skeleton,
    AffiliatedInstitutionsViewComponent,
    ContributorsListComponent,
    IconComponent,
    PreprintDoiSectionComponent,
    PreprintAuthorAssertionsComponent,
    TruncatedTextComponent,
    TranslatePipe,
  ],
  templateUrl: './general-information.component.html',
  styleUrl: './general-information.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInformationComponent implements OnDestroy {
  private readonly environment = inject(ENVIRONMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly preprintProvider = input.required<PreprintProviderDetails | undefined>();
  readonly preprintVersionSelected = output<string>();

  private readonly actions = createDispatchMap({
    getBibliographicContributors: GetBibliographicContributors,
    fetchResourceInstitutions: FetchResourceInstitutions,
    loadMoreBibliographicContributors: LoadMoreBibliographicContributors,
    resetContributorsState: ResetContributorsState,
  });

  readonly preprint = select(PreprintSelectors.getPreprint);
  readonly isPreprintLoading = select(PreprintSelectors.isPreprintLoading);

  readonly affiliatedInstitutions = select(InstitutionsSelectors.getResourceInstitutions);

  readonly bibliographicContributors = select(ContributorsSelectors.getBibliographicContributors);
  readonly areContributorsLoading = select(ContributorsSelectors.isBibliographicContributorsLoading);
  readonly hasMoreBibliographicContributors = select(ContributorsSelectors.hasMoreBibliographicContributors);

  readonly skeletonData = new Array(5).fill(null);

  readonly nodeLink = computed(() => `${this.environment.webUrl}/${this.preprint()?.nodeId}`);

  constructor() {
    effect(() => {
      const preprintId = this.preprint()?.id;
      if (!preprintId) return;

      this.actions.getBibliographicContributors(preprintId, ResourceType.Preprint);
      this.actions.fetchResourceInstitutions(preprintId, ResourceType.Preprint);
    });
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.actions.resetContributorsState();
    }
  }

  handleLoadMoreContributors(): void {
    this.actions.loadMoreBibliographicContributors(this.preprint()?.id, ResourceType.Preprint);
  }
}
