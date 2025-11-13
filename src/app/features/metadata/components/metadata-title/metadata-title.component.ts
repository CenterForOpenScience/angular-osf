import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { FixSpecialCharPipe } from '@osf/shared/pipes/fix-special-char.pipe';

@Component({
  selector: 'osf-metadata-title',
  imports: [Card, Button, FixSpecialCharPipe, TranslatePipe],
  templateUrl: './metadata-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataTitleComponent {
  title = input.required<string>();
  readonly = input<boolean>(false);
  openEditTitleDialog = output<void>();
}
