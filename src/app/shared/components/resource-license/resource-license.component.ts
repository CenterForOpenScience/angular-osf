import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { LicenseModel } from '@osf/shared/models/license/license.model';

@Component({
  selector: 'osf-resource-license',
  imports: [Skeleton, TranslatePipe],
  templateUrl: './resource-license.component.html',
  styleUrl: './resource-license.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceLicenseComponent {
  license = input<LicenseModel | null | undefined>();
  isLoading = input<boolean>(false);
}
