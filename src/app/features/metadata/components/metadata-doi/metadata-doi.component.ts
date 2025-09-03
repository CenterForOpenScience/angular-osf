import { TranslatePipe } from '@ngx-translate/core';

import { ConfirmationService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'osf-metadata-doi',
  imports: [Button, Card, TranslatePipe],
  providers: [ConfirmationService],
  templateUrl: './metadata-doi.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataDoiComponent {
  editDoi = output<void>();

  doi = input.required<string | null>();

  onCreateDoi(): void {
    this.editDoi.emit();
  }

  onEditDoi(): void {
    this.editDoi.emit();
  }
}
