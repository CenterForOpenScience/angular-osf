import { select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Select } from 'primeng/select';

import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
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
  private readonly translateService = inject(TranslateService);

  readonly preprintProvider = input.required<PreprintProviderDetails | undefined>();

  readonly preprintVersionSelected = output<string>();

  readonly preprint = select(PreprintSelectors.getPreprint);
  readonly preprintVersionIds = select(PreprintSelectors.getPreprintVersionIds);
  readonly arePreprintVersionIdsLoading = select(PreprintSelectors.arePreprintVersionIdsLoading);

  versionsDropdownOptions = computed(() => {
    const preprintVersionIds = this.preprintVersionIds() ?? [];
    if (!preprintVersionIds.length) return [];

    return preprintVersionIds.map((versionId, index) => ({
      label: this.translateService.instant('preprints.details.file.version', {
        version: preprintVersionIds.length - index,
      }),
      value: versionId,
    }));
  });

  selectPreprintVersion(versionId: string) {
    const currentPreprintId = this.preprint()?.id;

    if (!currentPreprintId || currentPreprintId === versionId) return;

    this.preprintVersionSelected.emit(versionId);
  }
}
