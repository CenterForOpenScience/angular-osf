import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { License } from '@shared/models';

@Component({
  selector: 'osf-project-metadata-license',
  imports: [Button, Card, TranslatePipe],
  templateUrl: './project-metadata-license.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMetadataLicenseComponent {
  openEditLicenseDialog = output<void>();
  hideEditLicense = input<boolean>(false);
  license = input<License>({} as License);
}
