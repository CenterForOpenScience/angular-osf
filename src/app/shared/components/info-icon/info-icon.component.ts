import { TranslatePipe } from '@ngx-translate/core';

import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TooltipPosition } from '@osf/shared/models';

@Component({
  selector: 'osf-info-icon',
  imports: [Tooltip, TranslatePipe],
  templateUrl: './info-icon.component.html',
  styleUrl: './info-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoIconComponent {
  tooltipText = input('');
  tooltipPosition = input<TooltipPosition>('right');
}
