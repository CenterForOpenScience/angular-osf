import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TextInputComponent } from '@osf/shared/components';
import { InputLimits } from '@osf/shared/constants';
import { ViewOnlyLinkNodeModel } from '@osf/shared/models';
import { CustomValidators } from '@osf/shared/utils';

@Component({
  selector: 'osf-create-view-link-dialog',
  imports: [Button, TranslatePipe, ReactiveFormsModule, FormsModule, Checkbox, TextInputComponent],
  templateUrl: './create-view-link-dialog.component.html',
  styleUrl: './create-view-link-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateViewLinkDialogComponent implements OnInit {
  linkName = new FormControl('', { nonNullable: true, validators: [CustomValidators.requiredTrimmed()] });

  readonly dialogRef = inject(DynamicDialogRef);
  protected readonly config = inject(DynamicDialogConfig);
  inputLimits = InputLimits;

  anonymous = signal(true);
  protected selectedComponents = signal<Record<string, boolean>>({});
  readonly projectId = signal('');

  ngOnInit(): void {
    const data = (this.config.data?.['sharedComponents'] as ViewOnlyLinkNodeModel[]) || [];
    this.projectId.set(this.config.data?.projectId);
    const initialState = data.reduce(
      (acc, curr) => {
        if (curr.id) {
          acc[curr.id] = true;
        }
        return acc;
      },
      {} as Record<string, boolean>
    );
    this.selectedComponents.set(initialState);
  }

  isCurrentProject(item: ViewOnlyLinkNodeModel): boolean {
    return item.category === 'project' && item.id === this.projectId();
  }

  addLink(): void {
    if (!this.linkName.value) return;

    const components = (this.config.data?.['sharedComponents'] as ViewOnlyLinkNodeModel[]) || [];
    const selectedIds = Object.entries(this.selectedComponents()).filter(([component, checked]) => checked);

    const selected = components
      .filter((comp: ViewOnlyLinkNodeModel) =>
        selectedIds.find(([id, checked]: [string, boolean]) => id === comp.id && checked)
      )
      .map((comp) => ({
        id: comp.id,
        type: 'nodes',
      }));

    const data = {
      attributes: {
        name: this.linkName.value,
        anonymous: this.anonymous(),
      },
      nodes: selected,
    };

    this.dialogRef.close(data);
  }

  onCheckboxToggle(id: string, checked: boolean): void {
    this.selectedComponents.update((prev) => ({ ...prev, [id]: checked }));
  }
}
