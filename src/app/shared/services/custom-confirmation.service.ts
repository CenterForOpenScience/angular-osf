import { TranslateService } from '@ngx-translate/core';

import { ConfirmationService } from 'primeng/api';

import { inject, Injectable } from '@angular/core';

import {
  AcceptConfirmationOptions,
  ContinueConfirmationOptions,
  DeleteConfirmationOptions,
} from '../models/confirmation-options.model';

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
        severity: options.acceptLabelType || 'danger',
      },
      rejectButtonProps: {
        label: this.translateService.instant('common.buttons.cancel'),
        severity: 'info',
      },
      accept: () => {
        options.onConfirm();
      },
      reject: () => {
        if (options.onReject) {
          options.onReject();
        } else {
          this.confirmationService.close();
        }
      },
    });
  }

  confirmAccept(options: AcceptConfirmationOptions): void {
    this.confirmationService.confirm({
      header: this.translateService.instant(options.headerKey, options.headerParams),
      message: this.translateService.instant(options.messageKey, options.messageParams),
      closable: true,
      closeOnEscape: false,
      acceptButtonProps: {
        label: this.translateService.instant(options.acceptLabelKey || 'common.buttons.move'),
      },
      rejectButtonProps: {
        label: this.translateService.instant(options.rejectLabelKey || 'common.buttons.cancel'),
        severity: 'info',
      },
      accept: () => {
        options.onConfirm();
      },
      reject: () => {
        if (options.onReject) {
          options.onReject();
        } else {
          this.confirmationService.close();
        }
      },
    });
  }

  confirmContinue(options: ContinueConfirmationOptions): void {
    this.confirmationService.confirm({
      header: this.translateService.instant(options.headerKey, options.headerParams),
      message: this.translateService.instant(options.messageKey, options.messageParams),
      closable: true,
      closeOnEscape: false,
      acceptButtonProps: {
        label: this.translateService.instant(options.acceptLabelKey || 'common.buttons.continue'),
        severity: 'danger',
      },
      rejectButtonProps: {
        label: this.translateService.instant('common.buttons.cancel'),
        severity: 'info',
      },
      accept: () => {
        options.onConfirm();
      },
      reject: () => {
        options.onReject();
      },
    });
  }
}
