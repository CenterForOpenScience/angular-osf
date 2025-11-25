import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NodePreprintModel } from '@osf/shared/models/nodes/node-preprint.model';

@Component({
  selector: 'osf-overview-supplements',
  imports: [Skeleton, TranslatePipe, DatePipe],
  templateUrl: './overview-supplements.component.html',
  styleUrl: './overview-supplements.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewSupplementsComponent {
  supplements = input.required<NodePreprintModel[]>();
  isLoading = input<boolean>(false);

  readonly dateFormat = 'MMMM d, y';
}
