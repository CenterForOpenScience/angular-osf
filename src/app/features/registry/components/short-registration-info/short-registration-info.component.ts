import { TranslatePipe } from '@ngx-translate/core';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ContributorsListComponent } from '@osf/shared/components';

import { RegistryOverview } from '../../models';

@Component({
  selector: 'osf-short-registration-info',
  imports: [TranslatePipe, DatePipe, RouterLink, ContributorsListComponent],
  templateUrl: './short-registration-info.component.html',
  styleUrl: './short-registration-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortRegistrationInfoComponent {
  private readonly environment = inject(ENVIRONMENT);

  registration = input.required<RegistryOverview>();

  get associatedProjectUrl(): string {
    return `${this.environment.webUrl}/${this.registration().associatedProjectId}`;
  }
}
