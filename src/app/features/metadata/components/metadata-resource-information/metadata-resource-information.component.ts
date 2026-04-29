import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CustomItemMetadataRecord } from '@osf/features/metadata/models';
import { LanguageLabelPipe } from '@osf/shared/pipes/language-label.pipe';
import { ResourceTypeGeneralLabelPipe } from '@osf/shared/pipes/resource-type-general-label.pipe';

@Component({
  selector: 'osf-metadata-resource-information',
  imports: [Button, Card, TranslatePipe, LanguageLabelPipe, ResourceTypeGeneralLabelPipe],
  templateUrl: './metadata-resource-information.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataResourceInformationComponent {
  openEditResourceInformationDialog = output<void>();

  customItemMetadata = input.required<CustomItemMetadataRecord | null>();
  readonly = input<boolean>(false);
  showResourceInfo = output<void>();
}
