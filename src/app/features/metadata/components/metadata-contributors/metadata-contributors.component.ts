import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { ContributorModel } from '@osf/shared/models/contributors/contributor.model';

import { BaseMetadataComponent } from '../base-metadata.component';

@Component({
  selector: 'osf-metadata-contributors',
  imports: [Button, Card, Tooltip, TranslatePipe, ContributorsListComponent],
  templateUrl: './metadata-contributors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataContributorsComponent extends BaseMetadataComponent {
  contributors = input<ContributorModel[]>([]);
  isLoading = input(false);
  hasMoreContributors = input(false);
  readonly = input<boolean>(false);

  openEditContributorDialog = output<void>();
  loadMoreContributors = output<void>();
}
