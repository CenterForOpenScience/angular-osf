import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProjectDetailsModel } from '@osf/features/project/settings/models';
import { ProjectFormControls } from '@shared/enums';
import { NodeData } from '@shared/models';

@Component({
  selector: 'osf-settings-project-form-card',
  imports: [Button, Card, FormsModule, InputText, Textarea, TranslatePipe, ReactiveFormsModule],
  templateUrl: './settings-project-form-card.component.html',
  styleUrl: '../../settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsProjectFormCardComponent {
  projectDetails = input.required<NodeData>();
  formGroup = input.required<FormGroup>();
  submitForm = output<ProjectDetailsModel>();
  deleteProject = output<void>();

  protected readonly ProjectFormControls = ProjectFormControls;

  resetForm(): void {
    this.formGroup().patchValue({ ...this.projectDetails().attributes });
  }

  submit() {
    if (this.formGroup().invalid) {
      return;
    }

    this.submitForm.emit(this.formGroup().value);
  }
}
