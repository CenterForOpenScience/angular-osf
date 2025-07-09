import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';

import { map } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components';
import { IS_MEDIUM } from '@osf/shared/utils';

import { DeveloperAppAddEditFormComponent } from './components';

@Component({
  selector: 'osf-developer-apps',
  imports: [RouterOutlet, SubHeaderComponent, TranslatePipe],
  templateUrl: './developer-apps-container.component.html',
  styleUrl: './developer-apps-container.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperAppsContainerComponent {
  private readonly dialogService = inject(DialogService);
  private readonly router = inject(Router);
  private readonly isMedium = toSignal(inject(IS_MEDIUM));
  private readonly translateService = inject(TranslateService);

  protected readonly isBaseRoute = toSignal(
    this.router.events.pipe(map(() => this.router.url === '/settings/developer-apps')),
    { initialValue: this.router.url === '/settings/developer-apps' }
  );

  createDeveloperApp(): void {
    const dialogWidth = this.isMedium() ? '500px' : '340px';

    this.dialogService.open(DeveloperAppAddEditFormComponent, {
      width: dialogWidth,
      focusOnShow: false,
      header: this.translateService.instant('settings.developerApps.form.createTitle'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }
}
