import { MessageService } from 'primeng/api';

import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageService = inject(MessageService);

  showSuccess(summary: string, params?: unknown) {
    this.messageService.add({ severity: 'success', summary, data: { translationParams: params }, key: 'osf' });
  }

  showWarn(summary: string, params?: unknown) {
    this.messageService.add({ severity: 'warn', summary, life: 5000, data: { translationParams: params }, key: 'osf' });
  }

  showError(summary: string, params?: unknown) {
    this.messageService.add({
      severity: 'error',
      summary,
      life: 5000,
      data: { translationParams: params },
      key: 'osf',
    });
  }
}
