import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'osf-notification-settings',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './notification-settings.component.html',
  styleUrl: './notification-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSettingsComponent {}
