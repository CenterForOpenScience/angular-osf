import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { BaseMetadataComponent } from '../base-metadata.component';

@Component({
  selector: 'osf-metadata-title',
  imports: [Card, Button, Tooltip, TranslatePipe],
  templateUrl: './metadata-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataTitleComponent extends BaseMetadataComponent {
  title = input.required<string>();
  readonly = input<boolean>(false);
  openEditTitleDialog = output<void>();
}
