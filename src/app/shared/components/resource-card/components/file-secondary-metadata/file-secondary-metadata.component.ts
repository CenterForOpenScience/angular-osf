import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ResourceModel } from '@shared/models';

@Component({
  selector: 'osf-file-secondary-metadata',
  imports: [TranslatePipe],
  templateUrl: './file-secondary-metadata.component.html',
  styleUrl: './file-secondary-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileSecondaryMetadataComponent {
  resource = input.required<ResourceModel>();
}
