import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HelpScoutService } from '@core/services/help-scout.service';

@Component({
  selector: 'osf-settings-container',
  imports: [RouterOutlet],
  templateUrl: './settings-container.component.html',
  styleUrl: './settings-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsContainerComponent implements OnDestroy {
  constructor(private helpScoutService: HelpScoutService) {
    this.helpScoutService.setResourceType('user');
  }

  ngOnDestroy(): void {
    this.helpScoutService.unsetResourceType();
  }
}
