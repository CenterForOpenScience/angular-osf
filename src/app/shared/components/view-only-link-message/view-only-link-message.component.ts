import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Message } from 'primeng/message';

import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'osf-view-only-link-message',
  imports: [Message, TranslatePipe, Button],
  templateUrl: './view-only-link-message.component.html',
  styleUrl: './view-only-link-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewOnlyLinkMessageComponent {
  private platformId = inject(PLATFORM_ID);

  handleLeaveViewOnlyView(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('view_only');

    window.history.pushState(null, '', currentUrl.toString());
    window.location.reload();
  }
}
