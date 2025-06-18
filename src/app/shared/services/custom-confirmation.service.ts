import { TranslateService } from '@ngx-translate/core';

import { ConfirmationService } from 'primeng/api';

import { inject, Injectable } from '@angular/core';

import { DeleteConfirmationOptions } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CustomConfirmationService {
  private confirmationService = inject(ConfirmationService);
  private translateService = inject(TranslateService);

  confirmDelete(options: DeleteConfirmationOptions): void {
    this.confirmationService.confirm({
      header: this.translateService.instant(options.headerKey, options.headerParams),
      message: this.translateService.instant(options.messageKey, options.messageParams),
      closable: true,
      closeOnEscape: false,
      acceptButtonProps: {
        label: this.translateService.instant(options.acceptLabelKey || 'common.buttons.delete'),
        severity: 'danger',
      },
      rejectButtonProps: {
        label: this.translateService.instant('common.buttons.cancel'),
        severity: 'info',
      },
      accept: () => {
        options.onConfirm();
      },
    });
  }
}
