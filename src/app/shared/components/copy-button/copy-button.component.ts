import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { ToastService } from '@osf/shared/services';

@Component({
  selector: 'osf-copy-button',
  imports: [Button, Tooltip, TranslatePipe],
  templateUrl: './copy-button.component.html',
  styleUrl: './copy-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyButtonComponent {
  copyItem = input<string>('');
  tooltip = input<string>('common.buttons.copy');

  private readonly clipboard = inject(Clipboard);
  private readonly toastService = inject(ToastService);

  copy(): void {
    this.clipboard.copy(this.copyItem());
    this.toastService.showSuccess('settings.developerApps.messages.copied');
  }
}
