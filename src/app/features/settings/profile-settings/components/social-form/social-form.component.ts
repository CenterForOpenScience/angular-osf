import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { InputLimits } from '@osf/shared/constants';

import { socials } from '../../constants/data';

@Component({
  selector: 'osf-social-form',
  imports: [Button, SelectModule, InputGroup, InputGroupAddon, InputText, ReactiveFormsModule, TranslatePipe],
  templateUrl: './social-form.component.html',
  styleUrl: './social-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialFormComponent {
  readonly socials = socials;
  readonly socialMaxLength = InputLimits.name.maxLength;

  group = input.required<FormGroup>();
  index = input.required<number>();
  remove = output<void>();

  get domain(): string {
    return this.group().get('socialOutput')?.value?.address;
  }

  get placeholder(): string {
    return this.group().get('socialOutput')?.value?.placeholder;
  }
}
