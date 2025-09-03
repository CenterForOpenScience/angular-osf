import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Funder } from '@osf/features/metadata/models';

@Component({
  selector: 'osf-metadata-funding',
  imports: [Button, Card, TranslatePipe],
  templateUrl: './metadata-funding.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataFundingComponent {
  openEditFundingDialog = output<void>();

  funders = input<Funder[]>();
  readonly = input<boolean>(false);
}
