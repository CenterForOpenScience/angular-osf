import { TranslatePipe } from '@ngx-translate/core';

import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { InputLimits } from '@osf/shared/constants';

@Component({
  selector: 'osf-social-form',
  imports: [SelectModule, InputGroup, InputGroupAddon, InputText, ReactiveFormsModule, TranslatePipe],
  templateUrl: './social-form.component.html',
  styleUrl: './social-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialFormComponent {
  readonly socialMaxLength = InputLimits.name.maxLength;

  group = input.required<FormGroup>();
  index = input.required<number>();

  readonly socialOutput = computed(() => this.group().get('socialOutput')?.value);

  readonly label = computed(() => this.socialOutput()?.label);
  readonly domain = computed(() => this.socialOutput()?.address);
  readonly placeholder = computed(() => this.socialOutput()?.placeholder);

  readonly hasLinkedField = computed(() => !!this.socialOutput()?.linkedField);
  readonly linkedLabel = computed(() => this.socialOutput()?.linkedField?.label);
  readonly linkedPlaceholder = computed(() => this.socialOutput()?.linkedField?.placeholder);
}
