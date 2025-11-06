import { ChangeDetectionStrategy, Component, HostBinding, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HelpScoutService } from '@core/services/help-scout.service';

@Component({
  selector: 'osf-project',
  imports: [RouterOutlet],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectComponent implements OnDestroy {
  private readonly helpScoutService = inject(HelpScoutService);
  @HostBinding('class') classes = 'flex flex-1 flex-column w-full';

  constructor() {
    this.helpScoutService.setResourceType('project');
  }

  ngOnDestroy(): void {
    this.helpScoutService.unsetResourceType();
  }
}
