import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Select } from 'primeng/select';

import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';

@Component({
  selector: 'osf-preprint-doi-section',
  imports: [Select, FormsModule, TranslatePipe],
  templateUrl: './preprint-doi-section.component.html',
  styleUrl: './preprint-doi-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintDoiSectionComponent {
  preprintProvider = input.required<PreprintProviderDetails | undefined>();
  preprint = select(PreprintSelectors.getPreprint);

  preprintVersionSelected = output<string>();

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

    this.preprintVersionSelected.emit(versionId);
  }
}
