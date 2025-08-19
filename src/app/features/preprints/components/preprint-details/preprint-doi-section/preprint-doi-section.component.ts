import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Select } from 'primeng/select';

import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { FetchPreprintById, PreprintSelectors } from '@osf/features/preprints/store/preprint';

@Component({
  selector: 'osf-preprint-doi-section',
  imports: [Select, FormsModule, TranslatePipe],
  templateUrl: './preprint-doi-section.component.html',
  styleUrl: './preprint-doi-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintDoiSectionComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  private actions = createDispatchMap({
    fetchPreprintById: FetchPreprintById,
  });

  preprintProvider = input.required<PreprintProviderDetails | undefined>();
  preprint = select(PreprintSelectors.getPreprint);

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
