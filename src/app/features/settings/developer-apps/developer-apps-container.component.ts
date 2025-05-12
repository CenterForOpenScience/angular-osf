import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';

import { map } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';

import { DeveloperAppAddEditFormComponent } from '@osf/features/settings/developer-apps/developer-app-add-edit-form/developer-app-add-edit-form.component';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { IS_MEDIUM, IS_XSMALL } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-developer-apps',
  imports: [RouterOutlet, SubHeaderComponent, TranslateModule],
  templateUrl: './developer-apps-container.component.html',
  styleUrl: './developer-apps-container.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperAppsContainerComponent {
  #dialogService = inject(DialogService);
  #router = inject(Router);
  #isXSmall = toSignal(inject(IS_XSMALL));
  #isMedium = toSignal(inject(IS_MEDIUM));
  #translateService = inject(TranslateService);

  protected readonly isBaseRoute = toSignal(
    this.#router.events.pipe(
      map(() => this.#router.url === '/settings/developer-apps'),
    ),
    { initialValue: this.#router.url === '/settings/developer-apps' },
  );

  createDeveloperApp(): void {
    let dialogWidth = '850px';
    if (this.#isXSmall()) {
      dialogWidth = '345px';
    } else if (this.#isMedium()) {
      dialogWidth = '500px';
    }

    this.#dialogService.open(DeveloperAppAddEditFormComponent, {
      width: dialogWidth,
      focusOnShow: false,
      header: this.#translateService.instant(
        'settings.developerApps.form.createTitle',
      ),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }
}
