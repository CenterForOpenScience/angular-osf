import { createDispatchMap, select } from '@ngxs/store';

import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, effect, HostBinding, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  AdvisoryBoardComponent,
  BrowseBySubjectsComponent,
  PreprintServicesComponent,
} from '@osf/features/preprints/components';
import { BrandService } from '@osf/features/preprints/services';
import {
  GetHighlightedSubjectsByProviderId,
  GetPreprintProviderById,
  GetPreprintProvidersToAdvertise,
  PreprintsSelectors,
} from '@osf/features/preprints/store';
import { SearchInputComponent } from '@shared/components';

@Component({
  selector: 'osf-overview',
  imports: [
    Button,
    SearchInputComponent,
    RouterLink,
    AdvisoryBoardComponent,
    PreprintServicesComponent,
    BrowseBySubjectsComponent,
  ],
  templateUrl: './preprints-landing.component.html',
  styleUrl: './preprints-landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsLandingComponent implements OnInit {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';
  private readonly OSF_PROVIDER_ID = 'osf';
  private readonly actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    getPreprintProvidersToAdvertise: GetPreprintProvidersToAdvertise,
    getHighlightedSubjectsByProviderId: GetHighlightedSubjectsByProviderId,
  });

  osfPreprintProvider = select(PreprintsSelectors.getPreprintProviderDetails);
  preprintProvidersToAdvertise = select(PreprintsSelectors.getPreprintProvidersToAdvertise);
  highlightedSubjectsByProviderId = select(PreprintsSelectors.getHighlightedSubjectsForProvider);
  areSubjectsLoading = select(PreprintsSelectors.areSubjectsLoading);

  addPreprint() {
    // [RNi] TODO: Implement the logic to add a preprint.
  }

  searchValue = signal<string>('');

  constructor() {
    effect(() => {
      const provider = this.osfPreprintProvider();

      if (provider) {
        BrandService.applyBranding(provider.brand);
      }
    });
  }

  ngOnInit(): void {
    this.actions.getPreprintProviderById(this.OSF_PROVIDER_ID);
    this.actions.getPreprintProvidersToAdvertise();
    this.actions.getHighlightedSubjectsByProviderId(this.OSF_PROVIDER_ID);
  }
}
