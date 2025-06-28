import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';
import { Inplace } from 'primeng/inplace';
import { InputText } from 'primeng/inputtext';
import { RadioButton } from 'primeng/radiobutton';
import { Textarea } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';

import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FieldType } from '../../enums';
import { RegistriesSelectors } from '../../store';

@Component({
  selector: 'osf-custom-step',
  imports: [
    Card,
    Textarea,
    RadioButton,
    FormsModule,
    Checkbox,
    Tooltip,
    InputText,
    NgTemplateOutlet,
    Inplace,
    TranslatePipe,
  ],
  templateUrl: './custom-step.component.html',
  styleUrl: './custom-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomStepComponent {
  private readonly route = inject(ActivatedRoute);
  step = signal(this.route.snapshot.params['step'].split('-')[0]);
  protected readonly pages = select(RegistriesSelectors.getPagesSchema);
  currentPage = computed(() => this.pages()[this.step() - 1]);
  protected readonly FieldType = FieldType;

  radio = null;

  constructor() {
    this.route.params.subscribe((params) => {
      this.step.set(+params['step'].split('-')[0]);
    });
  }
}
