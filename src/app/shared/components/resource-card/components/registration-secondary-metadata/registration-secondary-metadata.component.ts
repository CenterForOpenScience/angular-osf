import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ResourceModel } from '@shared/models';

@Component({
  selector: 'osf-registration-secondary-metadata',
  imports: [TranslatePipe],
  templateUrl: './registration-secondary-metadata.component.html',
  styleUrl: './registration-secondary-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationSecondaryMetadataComponent {
  resource = input.required<ResourceModel>();
}
