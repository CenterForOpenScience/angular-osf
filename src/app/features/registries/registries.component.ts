import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HelpScoutService } from '@core/services/help-scout.service';

@Component({
  selector: 'osf-registries',
  imports: [RouterOutlet],
  templateUrl: './registries.component.html',
  styleUrl: './registries.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesComponent implements OnDestroy {
  constructor(private helpScoutService: HelpScoutService) {
    this.helpScoutService.setResourceType('registration');
  }

  ngOnDestroy(): void {
    this.helpScoutService.unsetResourceType();
  }
}
