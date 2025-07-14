import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RegistryStatus } from '@osf/shared/enums';
import { RegistrationCard } from '@osf/shared/models';

@Component({
  selector: 'osf-registration-card',
  imports: [Card, Button, Tag, TranslatePipe, DatePipe, RouterLink],
  templateUrl: './registration-card.component.html',
  styleUrl: './registration-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationCardComponent {
  RegistrationStatus = RegistryStatus;
  readonly registrationData = input.required<RegistrationCard>();
  readonly deleteDraft = output<string>();
}
