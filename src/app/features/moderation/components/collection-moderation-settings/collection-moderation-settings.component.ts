import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'osf-collection-moderation-settings',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './collection-moderation-settings.component.html',
  styleUrl: './collection-moderation-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionModerationSettingsComponent {}
