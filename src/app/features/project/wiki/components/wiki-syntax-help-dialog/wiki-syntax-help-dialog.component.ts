import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'osf-wiki-syntax-help-dialog',
  imports: [Button, TranslatePipe],
  templateUrl: './wiki-syntax-help-dialog.component.html',
  styleUrl: './wiki-syntax-help-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WikiSyntaxHelpDialogComponent {
  protected readonly dialogRef = inject(DynamicDialogRef);
}
