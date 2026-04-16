import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Message } from 'primeng/message';

import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'osf-view-only-link-message',
  imports: [Message, TranslatePipe, Button],
  templateUrl: './view-only-link-message.component.html',
  styleUrl: './view-only-link-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewOnlyLinkMessageComponent {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly router = inject(Router);

  handleLeaveViewOnlyView(): void {
    if (!this.isBrowser) {
      return;
    }

    this.router
      .navigate([], {
        queryParams: { view_only: null },
        queryParamsHandling: 'merge',
      })
      .then(() => window.location.reload());
  }
}
