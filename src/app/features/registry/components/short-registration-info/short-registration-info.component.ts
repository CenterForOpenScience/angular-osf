import { TranslatePipe } from '@ngx-translate/core';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RegistryOverview } from '../../models';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-short-registration-info',
  imports: [TranslatePipe, DatePipe, RouterLink],
  templateUrl: './short-registration-info.component.html',
  styleUrl: './short-registration-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortRegistrationInfoComponent {
  registration = input.required<RegistryOverview>();

  get associatedProjectUrl(): string {
    return `${environment.webUrl}/${this.registration().associatedProjectId}`;
  }
}
