import { TranslatePipe } from '@ngx-translate/core';

import { Message } from 'primeng/message';

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'osf-preprint-warning-banner',
  imports: [Message, TranslatePipe],
  templateUrl: './preprint-warning-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintWarningBannerComponent {}
