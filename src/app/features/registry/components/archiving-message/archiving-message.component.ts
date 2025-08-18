import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IconComponent } from '@osf/shared/components';

import { RegistryOverview } from '../../models';
import { ShortRegistrationInfoComponent } from '../short-registration-info/short-registration-info.component';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-archiving-message',
  imports: [TranslatePipe, Card, IconComponent, Divider, ShortRegistrationInfoComponent],
  templateUrl: './archiving-message.component.html',
  styleUrl: './archiving-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchivingMessageComponent {
  registration = input.required<RegistryOverview>();

  readonly supportEmail = environment.supportEmail;
}
