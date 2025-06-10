import { MessageService } from 'primeng/api';

import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageService = inject(MessageService);

  showSuccess(summary: string, params?: unknown) {
    this.messageService.add({ severity: 'success', summary, data: { translationParams: params } });
  }

  showWarn(summary: string) {
    this.messageService.add({ severity: 'warn', summary });
  }

  showError(summary: string) {
    this.messageService.add({ severity: 'error', summary });
  }
}
