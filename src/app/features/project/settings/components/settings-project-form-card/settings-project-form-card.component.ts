import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Textarea } from 'primeng/textarea';

import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { InputLimits } from '@osf/shared/constants/input-limits.const';
import { ProjectFormControls } from '@osf/shared/enums/create-project-form-controls.enum';
import { CustomValidators } from '@osf/shared/helpers/custom-form-validators.helper';

import { NodeDetailsModel, ProjectDetailsModel } from '../../models';

@Component({
  selector: 'osf-settings-project-form-card',
  imports: [Button, Card, Textarea, TranslatePipe, ReactiveFormsModule, TextInputComponent],
  templateUrl: './settings-project-form-card.component.html',
  styleUrl: 'settings-project-form-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsProjectFormCardComponent {
  projectDetails = input.required<NodeDetailsModel>();
  submitForm = output<ProjectDetailsModel>();
  deleteProject = output<void>();
  canDelete = input<boolean>(false);

  readonly ProjectFormControls = ProjectFormControls;
  readonly inputLimits = InputLimits;

  projectForm = new FormGroup({
    [ProjectFormControls.Title]: new FormControl('', CustomValidators.requiredTrimmed()),
    [ProjectFormControls.Description]: new FormControl(''),
  });

  deleteLabel = computed(() =>
    this.projectDetails().parentId ? 'myProjects.settings.deleteComponent' : 'myProjects.settings.deleteProject'
  );

  constructor() {
    this.setupFormEffects();
  }

  private setupFormEffects(): void {
    effect(() => {
      const details = this.projectDetails();

      if (details) {
        this.projectForm.patchValue(
          {
            [ProjectFormControls.Title]: details.title,
            [ProjectFormControls.Description]: details.description,
          },
          { emitEvent: false }
        );
      }
    });
  }

  resetForm(): void {
    const details = this.projectDetails();

    this.projectForm.patchValue({
      [ProjectFormControls.Title]: details.title,
      [ProjectFormControls.Description]: details.description,
    });
  }

  submit() {
    if (this.projectForm.invalid) {
      return;
    }

    this.submitForm.emit(this.projectForm.value as ProjectDetailsModel);
  }
}
