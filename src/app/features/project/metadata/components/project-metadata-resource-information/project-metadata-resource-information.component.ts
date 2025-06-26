import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CustomItemMetadataRecord } from '@osf/features/project/metadata/models';
import { languageCodes } from '@shared/constants/language.const';
import { LanguageCodeModel } from '@shared/models';

@Component({
  selector: 'osf-project-metadata-resource-information',
  imports: [Button, Card, TranslatePipe, TitleCasePipe],
  templateUrl: './project-metadata-resource-information.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMetadataResourceInformationComponent {
  openEditResourceInformationDialog = output<void>();

  customItemMetadata = input.required<CustomItemMetadataRecord | null>();
  protected readonly languageCodes = languageCodes;

  getLanguageName(languageCode: string): string {
    const language = this.languageCodes.find((lang: LanguageCodeModel) => lang.code === languageCode);
    return language ? language.name : languageCode;
  }
}
