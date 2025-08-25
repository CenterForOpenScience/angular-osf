import { TranslatePipe } from '@ngx-translate/core';

import { Message } from 'primeng/message';

// import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IconComponent } from '@shared/components';

@Component({
  selector: 'osf-preprint-warning-banner',
  imports: [TranslatePipe, Message, IconComponent],
  templateUrl: './osf-preprint-warning-banner.component.html',
  styleUrl: './osf-preprint-warning-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsfPreprintWarningBannerComponent {
  //
}
