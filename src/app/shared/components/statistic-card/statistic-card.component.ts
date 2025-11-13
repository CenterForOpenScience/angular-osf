import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Primitive } from '@osf/shared/helpers/types.helper';

@Component({
  selector: 'osf-statistic-card',
  templateUrl: './statistic-card.component.html',
  styleUrl: './statistic-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticCardComponent {
  value = input<Primitive>();
  label = input<string>('');
}
