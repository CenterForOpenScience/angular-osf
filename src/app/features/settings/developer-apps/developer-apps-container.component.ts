import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { DialogService } from 'primeng/dynamicdialog';
import { CreateDeveloperAppComponent } from '@osf/features/settings/developer-apps/create-developer-app/create-developer-app.component';
import { IS_MEDIUM, IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'osf-developer-apps',
  imports: [RouterOutlet, SubHeaderComponent, TranslateModule],
  templateUrl: './developer-apps-container.component.html',
  styleUrl: './developer-apps-container.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperAppsContainerComponent {
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  isXSmall$ = inject(IS_XSMALL);
  isMedium$ = inject(IS_MEDIUM);
  isXSmall = toSignal(this.isXSmall$);
  isMedium = toSignal(this.isMedium$);

  createDeveloperApp(): void {
    let dialogWidth = '850px';
    if (this.isXSmall()) {
      dialogWidth = '345px';
    } else if (this.isMedium()) {
      dialogWidth = '500px';
    }

    this.dialogService.open(CreateDeveloperAppComponent, {
      width: dialogWidth,
      focusOnShow: false,
      header: this.translateService.instant(
        'settings.developer-apps.form.createTitle',
      ),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }
}
