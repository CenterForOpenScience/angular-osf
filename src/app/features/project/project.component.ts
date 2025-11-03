import { ChangeDetectionStrategy, Component, DestroyRef, HostBinding, inject, OnDestroy } from '@angular/core';

import { HelpScoutService } from '@core/services/help-scout.service';
import { filter, take } from 'rxjs';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from '@ngxs/store';
import { CurrentResourceSelectors } from '@shared/stores/current-resource';
import { AnalyticsService } from '@shared/services/analytics.service';

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

  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly analyticsService = inject(AnalyticsService);
  currentResource = select(CurrentResourceSelectors.getCurrentResource);

  constructor() {
    this.helpScoutService.setResourceType('project');

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event: NavigationEnd) => {
        this.analyticsService.sendCountedUsageForRegistrationAndProjects(
          event.urlAfterRedirects,
          this.currentResource()
        );
      });
  }

  ngOnDestroy(): void {
    this.helpScoutService.unsetResourceType();
  }
}
