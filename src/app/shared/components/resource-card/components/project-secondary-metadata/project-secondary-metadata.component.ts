import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { LANGUAGE_CODES } from '@osf/shared/constants/language.const';
import { ResourceModel } from '@shared/models/search/resource.model';

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

    return LANGUAGE_CODES.find((lang) => lang.code === resourceLanguage)?.name;
  });
}
