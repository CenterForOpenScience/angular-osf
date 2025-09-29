import { TranslateService } from '@ngx-translate/core';

import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomDialogService {
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);

  private readonly defaultOptions: Partial<DynamicDialogConfig> = {
    focusOnShow: false,
    closeOnEscape: true,
    modal: true,
    closable: true,
    breakpoints: { '768px': '95vw' },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  open(component: any, config?: Partial<DynamicDialogConfig>): DynamicDialogRef {
    const finalConfig = {
      ...this.defaultOptions,
      ...config,
      header: config?.header ? this.translateService.instant(config.header) : undefined,
    };

    return this.dialogService.open(component, finalConfig);
  }
}
