import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { finalize } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ReadonlyInputComponent } from '@osf/shared/components/readonly-input/readonly-input.component';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { ExternalIdentity } from '../../models';
import { AccountSettingsSelectors, DeleteExternalIdentity } from '../../store';

@Component({
  selector: 'osf-connected-identities',
  imports: [Card, TranslatePipe, ReadonlyInputComponent],
  templateUrl: './connected-identities.component.html',
  styleUrl: './connected-identities.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectedIdentitiesComponent {
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly loaderService = inject(LoaderService);
  private readonly toastService = inject(ToastService);

  readonly actions = createDispatchMap({ deleteExternalIdentity: DeleteExternalIdentity });
  readonly externalIdentities = select(AccountSettingsSelectors.getExternalIdentities);

  deleteExternalIdentity(identity: ExternalIdentity): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'settings.accountSettings.connectedIdentities.deleteDialog.header',
      messageParams: { name: identity.id },
      messageKey: 'settings.accountSettings.connectedIdentities.deleteDialog.message',
      onConfirm: () => {
        this.loaderService.show();
        this.actions
          .deleteExternalIdentity(identity.id)
          .pipe(finalize(() => this.loaderService.hide()))
          .subscribe({
            next: () => this.toastService.showSuccess('settings.accountSettings.connectedIdentities.successDelete'),
            error: (error: HttpErrorResponse) => this.toastService.showError(this.getDeleteErrorKey(error)),
          });
      },
    });
  }

  private getDeleteErrorKey(error: HttpErrorResponse): string {
    const prefix = 'settings.accountSettings.connectedIdentities.errors';

    switch (error.status) {
      case 503:
        return `${prefix}.retryLater`;
      case 409:
        return `${prefix}.signInViaOrcid`;
      default:
        return `${prefix}.contactSupport`;
    }
  }
}
