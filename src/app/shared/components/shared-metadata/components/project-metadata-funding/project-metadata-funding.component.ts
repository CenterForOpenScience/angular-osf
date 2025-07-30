import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Funder } from '@osf/features/project/metadata/models';

@Component({
  selector: 'osf-project-metadata-funding',
  imports: [Button, Card, TranslatePipe],
  templateUrl: './project-metadata-funding.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMetadataFundingComponent {
  openEditFundingDialog = output<void>();

  funders = input<Funder[]>([]);
  readonly = input<boolean>(false);
}
