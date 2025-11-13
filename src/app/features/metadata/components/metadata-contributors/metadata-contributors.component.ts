import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { ContributorModel } from '@osf/shared/models/contributors/contributor.model';

@Component({
  selector: 'osf-metadata-contributors',
  imports: [Button, Card, TranslatePipe, ContributorsListComponent],
  templateUrl: './metadata-contributors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataContributorsComponent {
  contributors = input<ContributorModel[]>([]);
  isLoading = input(false);
  hasMoreContributors = input(false);
  readonly = input<boolean>(false);

  openEditContributorDialog = output<void>();
  loadMoreContributors = output<void>();
}
