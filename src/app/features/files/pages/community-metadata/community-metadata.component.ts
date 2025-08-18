import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SubHeaderComponent } from '@shared/components';

@Component({
  selector: 'osf-community-metadata',
  imports: [SubHeaderComponent],
  templateUrl: './community-metadata.component.html',
  styleUrl: './community-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityMetadataComponent {}
