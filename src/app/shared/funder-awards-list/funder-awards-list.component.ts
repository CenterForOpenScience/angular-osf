import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Funder } from '@osf/features/metadata/models';

@Component({
  selector: 'osf-funder-awards-list',
  imports: [RouterLink, TranslatePipe, Skeleton],
  templateUrl: './funder-awards-list.component.html',
  styleUrl: './funder-awards-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FunderAwardsListComponent {
  funders = input<Funder[]>([]);
  registryId = input<string | null>(null);
  isLoading = input(false);
}
