import { createDispatchMap, select, Store } from '@ngxs/store';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, HostBinding, inject, OnDestroy, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { AdditionalInfoComponent } from '@osf/features/preprints/components/preprint-details/additional-info/additional-info.component';
import { GeneralInformationComponent } from '@osf/features/preprints/components/preprint-details/general-information/general-information.component';
import { PreprintFileSectionComponent } from '@osf/features/preprints/components/preprint-details/preprint-file-section/preprint-file-section.component';
import { ShareAndDownloadComponent } from '@osf/features/preprints/components/preprint-details/share-and-downlaod/share-and-download.component';
import { FetchPreprintById, PreprintSelectors, ResetState } from '@osf/features/preprints/store/preprint';
import { GetPreprintProviderById, PreprintProvidersSelectors } from '@osf/features/preprints/store/preprint-providers';
import { CreateNewVersion, PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';

@Component({
  selector: 'osf-preprint-details',
  imports: [
    Skeleton,
    PreprintFileSectionComponent,
    Button,
    ShareAndDownloadComponent,
    GeneralInformationComponent,
    AdditionalInfoComponent,
  ],
  templateUrl: './preprint-details.component.html',
  styleUrl: './preprint-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintDetailsComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full';

  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  private providerId = toSignal(this.route.params.pipe(map((params) => params['providerId'])) ?? of(undefined));
  private preprintId = toSignal(this.route.params.pipe(map((params) => params['preprintId'])) ?? of(undefined));

  private actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    resetState: ResetState,
    fetchPreprintById: FetchPreprintById,
    createNewVersion: CreateNewVersion,
  });

  preprintProvider = select(PreprintProvidersSelectors.getPreprintProviderDetails(this.providerId()));
  isPreprintProviderLoading = select(PreprintProvidersSelectors.isPreprintProviderDetailsLoading);
  preprint = select(PreprintSelectors.getPreprint);
  isPreprintLoading = select(PreprintSelectors.isPreprintLoading);

  ngOnInit() {
    this.actions.fetchPreprintById(this.preprintId());
    this.actions.getPreprintProviderById(this.providerId());
  }

  ngOnDestroy() {
    this.actions.resetState();
  }

  editPreprintClicked() {
    this.router.navigate(['preprints', this.providerId(), 'edit', this.preprintId()]);
  }

  createNewVersionClicked() {
    this.actions.createNewVersion(this.preprintId()).subscribe({
      complete: () => {
        const newVersionPreprint = this.store.selectSnapshot(PreprintStepperSelectors.getPreprint);
        this.router.navigate(['preprints', this.providerId(), 'new-version', newVersionPreprint!.id]);
      },
    });
  }
}
