import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ContributorsListComponent } from '@osf/shared/components';
import { ContributorModel } from '@osf/shared/models';

@Component({
  selector: 'osf-metadata-contributors',
  imports: [Button, Card, TranslatePipe, ContributorsListComponent],
  templateUrl: './metadata-contributors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataContributorsComponent {
  openEditContributorDialog = output<void>();
  contributors = input<ContributorModel[]>([]);
  readonly = input<boolean>(false);
}
