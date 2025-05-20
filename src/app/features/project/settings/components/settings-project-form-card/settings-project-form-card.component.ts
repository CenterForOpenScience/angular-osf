import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProjectFormControls } from '@shared/entities/create-project-form-controls.enum';

@Component({
  selector: 'osf-settings-project-form-card',
  imports: [Button, Card, FormsModule, InputText, Textarea, TranslatePipe, ReactiveFormsModule],
  templateUrl: './settings-project-form-card.component.html',
  styleUrl: '../../settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsProjectFormCardComponent {
  formGroup = input.required<FormGroup>();
  submitForm = output<void>();
  resetForm = output<void>();

  protected readonly ProjectFormControls = ProjectFormControls;
}
