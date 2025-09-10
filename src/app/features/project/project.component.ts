import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HelpScoutService } from '@core/services/help-scout.service';

@Component({
  selector: 'osf-project',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectComponent implements OnDestroy {
  @HostBinding('class') classes = 'flex flex-1 flex-column w-full';

  constructor(private helpScoutService: HelpScoutService) {
    this.helpScoutService.setResourceType('project');
  }

  ngOnDestroy(): void {
    this.helpScoutService.unsetResourceType();
  }
}
