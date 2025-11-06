import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PreprintMetrics } from '@osf/features/preprints/models';

@Component({
  selector: 'osf-preprint-metrics-info',
  imports: [Card, TranslatePipe, Skeleton],
  templateUrl: './preprint-metrics-info.component.html',
  styleUrl: './preprint-metrics-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintMetricsInfoComponent {
  metrics = input<PreprintMetrics | null>();
  isLoading = input<boolean>(false);
}
