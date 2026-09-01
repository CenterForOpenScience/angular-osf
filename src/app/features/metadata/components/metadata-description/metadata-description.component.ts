import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { BaseMetadataComponent } from '../base-metadata.component';
@Component({
  selector: 'osf-metadata-description',
  imports: [Card, Button, Tooltip, TranslatePipe],
  templateUrl: './metadata-description.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataDescriptionComponent extends BaseMetadataComponent {
  openEditDescriptionDialog = output<void>();
  description = input.required<string>();
  readonly = input<boolean>(false);
}
