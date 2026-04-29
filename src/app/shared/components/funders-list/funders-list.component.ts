import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Funder } from '@osf/features/metadata/models';

@Component({
  selector: 'osf-funders-list',
  imports: [Skeleton, TranslatePipe],
  templateUrl: './funders-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundersListComponent {
  funders = input<Funder[] | undefined>(undefined);
  isLoading = input<boolean>(false);
}
