import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';
import { Inplace } from 'primeng/inplace';
import { InputText } from 'primeng/inputtext';
import { RadioButton } from 'primeng/radiobutton';
import { Textarea } from 'primeng/textarea';

import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { InfoIconComponent } from '@osf/shared/components';

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

    InputText,
    NgTemplateOutlet,
    Inplace,
    TranslatePipe,
    InfoIconComponent,
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
    this.route.params.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.step.set(+params['step'].split('-')[0]);
    });
  }
}
