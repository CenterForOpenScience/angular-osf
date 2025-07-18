import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Textarea } from 'primeng/textarea';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ProjectOverview } from '@osf/features/project/overview/models';
import { CustomValidators } from '@osf/shared/utils';

@Component({
  selector: 'osf-description-dialog',
  imports: [Button, TranslatePipe, Textarea, ReactiveFormsModule],
  templateUrl: './description-dialog.component.html',
  styleUrl: './description-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionDialogComponent implements OnInit {
  protected dialogRef = inject(DynamicDialogRef);
  protected config = inject(DynamicDialogConfig);

  descriptionControl = new FormControl('', {
    nonNullable: true,
    validators: [CustomValidators.requiredTrimmed],
  });

  get currentProject(): ProjectOverview | null {
    return this.config.data ? this.config.data.currentProject || null : null;
  }

  ngOnInit(): void {
    if (this.currentProject && this.currentProject.description) {
      this.descriptionControl.setValue(this.currentProject.description);
    }
  }

  save(): void {
    if (this.descriptionControl.valid) {
      this.dialogRef.close(this.descriptionControl.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
