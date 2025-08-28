import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { RESOURCE_TYPE_OPTIONS } from '@osf/features/metadata/constants';
import { CustomItemMetadataRecord } from '@osf/features/metadata/models';
import { languageCodes } from '@osf/shared/constants';
import { LanguageCodeModel } from '@osf/shared/models';

@Component({
  selector: 'osf-metadata-resource-information',
  imports: [Button, Card, TranslatePipe],
  templateUrl: './metadata-resource-information.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataResourceInformationComponent {
  openEditResourceInformationDialog = output<void>();

  customItemMetadata = input.required<CustomItemMetadataRecord | null>();
  readonly = input<boolean>(false);
  showResourceInfo = output<void>();
  readonly languageCodes = languageCodes;
  readonly resourceTypes = RESOURCE_TYPE_OPTIONS;

  getLanguageName(languageCode: string): string {
    const language = this.languageCodes.find((lang: LanguageCodeModel) => lang.code === languageCode);
    return language ? language.name : languageCode;
  }

  getResourceTypeName(resourceType: string): string {
    const resource = this.resourceTypes.find((res) => res.value === resourceType);
    return resource ? resource.label : resourceType;
  }
}
