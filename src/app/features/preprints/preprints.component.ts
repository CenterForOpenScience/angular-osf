import { ChangeDetectionStrategy, Component, HostBinding, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HelpScoutService } from '@core/services/help-scout.service';

@Component({
  selector: 'osf-preprints',
  imports: [RouterOutlet],
  templateUrl: './preprints.component.html',
  styleUrl: './preprints.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsComponent implements OnDestroy {
  @HostBinding('class') classes = 'flex flex-1 flex-column w-full';

  private readonly helpScoutService = inject(HelpScoutService);

  constructor() {
    this.helpScoutService.setResourceType('preprint');
  }

  ngOnDestroy(): void {
    this.helpScoutService.unsetResourceType();
  }
}
