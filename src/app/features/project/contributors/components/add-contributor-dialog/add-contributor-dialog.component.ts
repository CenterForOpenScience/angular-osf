import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { SearchInputComponent } from '@osf/shared';

@Component({
  selector: 'osf-add-contributor-dialog',
  imports: [Button, TranslatePipe, SearchInputComponent],
  templateUrl: './add-contributor-dialog.component.html',
  styleUrl: './add-contributor-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddContributorDialogComponent {
  dialogRef = inject(DynamicDialogRef);
  protected searchValue = signal('');

  addContributor(): void {
    this.dialogRef.close();
  }
}
