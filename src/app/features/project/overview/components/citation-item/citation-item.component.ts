import { TranslatePipe } from '@ngx-translate/core';

import { Tooltip } from 'primeng/tooltip';

import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { ToastService } from '@osf/shared/services/toast.service';

@Component({
  selector: 'osf-citation-item',
  imports: [TranslatePipe, IconComponent, Tooltip],
  templateUrl: './citation-item.component.html',
  styleUrl: './citation-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitationItemComponent {
  private readonly clipboard = inject(Clipboard);
  private readonly toastService = inject(ToastService);

  readonly citation = input.required<string>();
  readonly itemUrl = input<string>('');
  readonly level = input<number>(0);

  copyCitation(): void {
    this.clipboard.copy(this.citation());
    this.toastService.showSuccess('settings.developerApps.messages.copied');
  }
}
