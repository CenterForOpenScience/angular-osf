import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'osf-analytics-kpi',
  imports: [Button, Skeleton, TranslatePipe],
  templateUrl: './analytics-kpi.component.html',
  styleUrl: './analytics-kpi.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsKpiComponent {
  isLoading = input<boolean>(false);
  showButton = input<boolean>(false);
  buttonLabel = input<string>('');
  title = input<string>('');
  value = input<number | undefined>(0);
}
