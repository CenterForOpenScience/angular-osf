import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContributorModel } from '@osf/shared/models/contributors/contributor.model';

@Component({
  selector: 'osf-contributors-list',
  imports: [RouterLink, TranslatePipe, Skeleton, Button],
  templateUrl: './contributors-list.component.html',
  styleUrl: './contributors-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributorsListComponent {
  contributors = input.required<ContributorModel[] | Partial<ContributorModel>[]>();
  isLoading = input(false);
  hasLoadMore = input(false);
  readonly = input<boolean>(false);
  anonymous = input<boolean>(false);

  loadMoreContributors = output<void>();
}
