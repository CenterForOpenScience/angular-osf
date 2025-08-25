import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CustomItemMetadataRecord } from '@osf/features/metadata/models';
import { languageCodes } from '@osf/shared/constants';
import { LanguageCodeModel } from '@osf/shared/models';

@Component({
  selector: 'osf-metadata-resource-information',
  imports: [Button, Card, TranslatePipe, TitleCasePipe],
  templateUrl: './metadata-resource-information.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataResourceInformationComponent {
  openEditResourceInformationDialog = output<void>();

  customItemMetadata = input.required<CustomItemMetadataRecord | null>();
  readonly = input<boolean>(false);
  protected readonly languageCodes = languageCodes;

  getLanguageName(languageCode: string): string {
    const language = this.languageCodes.find((lang: LanguageCodeModel) => lang.code === languageCode);
    return language ? language.name : languageCode;
  }
}
