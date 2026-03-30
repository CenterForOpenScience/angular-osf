import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { DatePipe, isPlatformBrowser } from '@angular/common';
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
import { Router } from '@angular/router';

import { ApplicabilityStatus, PreregLinkInfo } from '@osf/features/preprints/enums';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { FetchPreprintDetails, PreprintSelectors } from '@osf/features/preprints/store/preprint';
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
    Tag,
    Skeleton,
    ContributorsListComponent,
    LicenseDisplayComponent,
    PreprintDoiSectionComponent,
    TruncatedTextComponent,
    DatePipe,
    TranslatePipe,
  ],
  templateUrl: './preprint-tombstone.component.html',
  styleUrl: './preprint-tombstone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintTombstoneComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly preprintProvider = input.required<PreprintProviderDetails | undefined>();
  readonly preprintVersionSelected = output<string>();

  private readonly actions = createDispatchMap({
    getBibliographicContributors: GetBibliographicContributors,
    resetContributorsState: ResetContributorsState,
    fetchPreprintById: FetchPreprintDetails,
    fetchSubjects: FetchSelectedSubjects,
    loadMoreBibliographicContributors: LoadMoreBibliographicContributors,
  });

  readonly preprint = select(PreprintSelectors.getPreprint);
  readonly isPreprintLoading = select(PreprintSelectors.isPreprintLoading);
  readonly bibliographicContributors = select(ContributorsSelectors.getBibliographicContributors);
  readonly areContributorsLoading = select(ContributorsSelectors.isBibliographicContributorsLoading);
  readonly hasMoreBibliographicContributors = select(ContributorsSelectors.hasMoreBibliographicContributors);
  readonly subjects = select(SubjectsSelectors.getSelectedSubjects);
  readonly areSelectedSubjectsLoading = select(SubjectsSelectors.areSelectedSubjectsLoading);

  readonly ApplicabilityStatus = ApplicabilityStatus;
  readonly PreregLinkInfo = PreregLinkInfo;

  readonly license = computed(() => this.preprint()?.embeddedLicense ?? null);
  readonly licenseOptionsRecord = computed(() => (this.preprint()?.licenseOptions ?? {}) as Record<string, string>);

  readonly skeletonData = new Array(6).fill(null);

  constructor() {
    effect(() => {
      const preprintId = this.preprint()?.id;
      if (!preprintId) return;

      this.actions.getBibliographicContributors(preprintId, ResourceType.Preprint);
      this.actions.fetchSubjects(preprintId, ResourceType.Preprint);
    });
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.actions.resetContributorsState();
    }
  }

  tagClicked(tag: string) {
    this.router.navigate(['/search'], { queryParams: { search: tag } });
  }

  loadMoreContributors(): void {
    this.actions.loadMoreBibliographicContributors(this.preprint()?.id, ResourceType.Preprint);
  }
}
