import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContributorModel } from '@osf/shared/models';

@Component({
  selector: 'osf-metadata-contributors',
  imports: [Button, Card, TranslatePipe, RouterLink],
  templateUrl: './metadata-contributors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataContributorsComponent {
  openEditContributorDialog = output<void>();
  contributors = input<ContributorModel[]>([]);
  readonly = input<boolean>(false);
}
