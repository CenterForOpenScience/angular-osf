import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { FixSpecialCharPipe } from '@shared/pipes';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'osf-metadata-description',
  imports: [Card, Button, FixSpecialCharPipe, TranslatePipe],
  templateUrl: './metadata-description.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataDescriptionComponent {
  openEditDescriptionDialog = output<void>();
  description = input.required<string>();
  readonly = input<boolean>(false);
}
