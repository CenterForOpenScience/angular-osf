import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { License } from '@shared/models';

@Component({
  selector: 'osf-metadata-license',
  imports: [Button, Card, TranslatePipe],
  templateUrl: './metadata-license.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataLicenseComponent {
  openEditLicenseDialog = output<void>();
  hideEditLicense = input<boolean>(false);
  license = input<License | null>(null);
}
