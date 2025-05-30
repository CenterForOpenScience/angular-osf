import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RegistrationModel, RegistrationStatus } from '../../models';

@Component({
  selector: 'osf-registration-card',
  imports: [Card, Button, Tag, TranslatePipe],
  templateUrl: './registration-card.component.html',
  styleUrl: './registration-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationCardComponent {
  readonly RegistrationStatus = RegistrationStatus;
  readonly registrationData = input.required<RegistrationModel>();
}
