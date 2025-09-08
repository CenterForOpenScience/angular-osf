import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { languageCodes } from '@shared/constants';
import { ResourceModel } from '@shared/models';

@Component({
  selector: 'osf-project-secondary-metadata',
  imports: [TranslatePipe],
  templateUrl: './project-secondary-metadata.component.html',
  styleUrl: './project-secondary-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSecondaryMetadataComponent {
  resource = input.required<ResourceModel>();

  languageFromCode = computed(() => {
    const resourceLanguage = this.resource().language;
    if (!resourceLanguage) return null;

    return languageCodes.find((lang) => lang.code === resourceLanguage)?.name;
  });
}
