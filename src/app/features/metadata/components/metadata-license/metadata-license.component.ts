import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { LicenseModel } from '@osf/shared/models/license/license.model';

import { BaseMetadataComponent } from '../base-metadata.component';

@Component({
  selector: 'osf-metadata-license',
  imports: [Button, Card, Tooltip, TranslatePipe],
  templateUrl: './metadata-license.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataLicenseComponent extends BaseMetadataComponent {
  openEditLicenseDialog = output<void>();
  readonly = input<boolean>(false);
  license = input<LicenseModel | null>(null);
}
