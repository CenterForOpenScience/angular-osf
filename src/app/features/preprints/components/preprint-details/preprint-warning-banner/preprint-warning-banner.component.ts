import { TranslatePipe } from '@ngx-translate/core';

import { Message } from 'primeng/message';

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'osf-preprint-warning-banner',
  imports: [TranslatePipe, Message],
  templateUrl: './preprint-warning-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintWarningBannerComponent {}
