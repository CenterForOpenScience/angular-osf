import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { DialogService } from 'primeng/dynamicdialog';
import { IS_MEDIUM, IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DeveloperAppAddEditFormComponent } from '@osf/features/settings/developer-apps/developer-app-add-edit-form/developer-app-add-edit-form.component';

@Component({
  selector: 'osf-developer-apps',
  imports: [RouterOutlet, SubHeaderComponent],
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
      header: 'Create Developer App',
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }
}
