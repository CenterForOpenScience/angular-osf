import { ChangeDetectionStrategy, Component, HostBinding, inject, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { HelpScoutService } from '@core/services/help-scout.service';
import { IS_WEB } from '@osf/shared/helpers';

@Component({
  selector: 'osf-preprints',
  imports: [RouterOutlet],
  templateUrl: './preprints.component.html',
  styleUrl: './preprints.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsComponent implements OnDestroy {
  private readonly helpScoutService = inject(HelpScoutService);
  readonly isDesktop = toSignal(inject(IS_WEB));
  @HostBinding('class') classes = 'flex flex-1 flex-column w-full';

  constructor() {
    this.helpScoutService.setResourceType('preprint');
  }

  ngOnDestroy(): void {
    this.helpScoutService.unsetResourceType();
  }
}
