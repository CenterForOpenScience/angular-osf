import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ScientistsNames } from '@osf/shared/constants/scientists.const';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';

import { DeleteResourceDialogData } from '../../models/delete-resource-options.model';

@Component({
  selector: 'osf-delete-resource-dialog',
  imports: [TranslatePipe, Button, InputText, FormsModule],
  templateUrl: './delete-resource-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteResourceDialogComponent {
  readonly dialogRef = inject(DynamicDialogRef);
  readonly dialogData: DeleteResourceDialogData = inject(DynamicDialogConfig<DeleteResourceDialogData>).data;

  readonly resources = select(CurrentResourceSelectors.getResourceWithChildren);
  readonly hasAdminAccessForAllComponents = select(CurrentResourceSelectors.allResourceChildrenHaveAdminAccess);

  readonly userInput = signal('');

  readonly selectedScientist = ScientistsNames[Math.floor(Math.random() * ScientistsNames.length)];

  readonly isInputValid = computed(() => this.userInput() === this.selectedScientist);
  readonly hasMultipleResources = computed(() => (this.resources()?.length ?? 0) > 1);
  readonly showList = computed(() => !this.dialogData.singleMessageKey || this.hasMultipleResources());

  handleDelete(): void {
    this.dialogRef.close(true);
  }
}
