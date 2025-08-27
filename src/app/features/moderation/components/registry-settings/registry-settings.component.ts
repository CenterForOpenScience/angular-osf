import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'osf-registry-settings',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './registry-settings.component.html',
  styleUrl: './registry-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrySettingsComponent {}
