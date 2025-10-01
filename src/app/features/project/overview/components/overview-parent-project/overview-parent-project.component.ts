import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ContributorsListComponent, IconComponent, TruncatedTextComponent } from '@osf/shared/components';

@Component({
  selector: 'osf-overview-parent-project',
  imports: [Skeleton, TranslatePipe, IconComponent, TruncatedTextComponent, ContributorsListComponent],
  templateUrl: './overview-parent-project.component.html',
  styleUrl: './overview-parent-project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewParentProjectComponent {
  isLoading = input<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  project = input.required<any>();
}
