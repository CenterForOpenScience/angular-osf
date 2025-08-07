import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IconComponent } from '@osf/shared/components';

import { RegistryOverview } from '../../models';
import { ShortRegistrationInfoComponent } from '../short-registration-info/short-registration-info.component';

@Component({
  selector: 'osf-withdrawn-message',
  imports: [TranslatePipe, Divider, ShortRegistrationInfoComponent, IconComponent, Card, DatePipe],
  templateUrl: './withdrawn-message.component.html',
  styleUrl: './withdrawn-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawnMessageComponent {
  registration = input.required<RegistryOverview>();
}
