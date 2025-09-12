import { TranslatePipe } from '@ngx-translate/core';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RegistryOverview } from '../../models';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-short-registration-info',
  imports: [TranslatePipe, DatePipe],
  templateUrl: './short-registration-info.component.html',
  styleUrl: './short-registration-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortRegistrationInfoComponent {
  registration = input.required<RegistryOverview>();

  readonly environment = environment;

  get associatedProjectUrl(): string {
    return `${this.environment.webUrl}/${this.registration().associatedProjectId}`;
  }
}
