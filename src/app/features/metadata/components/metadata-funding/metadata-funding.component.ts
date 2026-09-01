import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tooltip } from 'primeng/tooltip';

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Funder } from '../../models';
import { BaseMetadataComponent } from '../base-metadata.component';

@Component({
  selector: 'osf-metadata-funding',
  imports: [NgClass, Button, Card, Tooltip, TranslatePipe],
  templateUrl: './metadata-funding.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataFundingComponent extends BaseMetadataComponent {
  openEditFundingDialog = output<void>();

  funders = input<Funder[]>();
  readonly = input<boolean>(false);
}
