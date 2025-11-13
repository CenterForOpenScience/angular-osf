import { TranslatePipe } from '@ngx-translate/core';

import { map } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';

import { DeveloperAppAddEditFormComponent } from './components';

@Component({
  selector: 'osf-developer-apps',
  imports: [RouterOutlet, SubHeaderComponent, TranslatePipe],
  templateUrl: './developer-apps-container.component.html',
  styleUrl: './developer-apps-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperAppsContainerComponent {
  private readonly customDialogService = inject(CustomDialogService);
  private readonly router = inject(Router);

  readonly isBaseRoute = toSignal(this.router.events.pipe(map(() => this.router.url === '/settings/developer-apps')), {
    initialValue: this.router.url === '/settings/developer-apps',
  });

  createDeveloperApp(): void {
    this.customDialogService.open(DeveloperAppAddEditFormComponent, {
      header: 'settings.developerApps.form.createTitle',
      width: '500px',
    });
  }
}
