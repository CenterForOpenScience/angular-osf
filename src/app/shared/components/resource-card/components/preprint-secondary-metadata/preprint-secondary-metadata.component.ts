import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ResourceModel } from '@osf/shared/models/search/resource.model';

@Component({
  selector: 'osf-preprint-secondary-metadata',
  imports: [TranslatePipe],
  templateUrl: './preprint-secondary-metadata.component.html',
  styleUrl: './preprint-secondary-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintSecondaryMetadataComponent {
  resource = input.required<ResourceModel>();
}
