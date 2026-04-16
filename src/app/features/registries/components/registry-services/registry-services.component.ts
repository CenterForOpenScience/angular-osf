import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RegistryServiceIcons } from '@shared/constants/registry-services-icons.const';

@Component({
  selector: 'osf-registry-services',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './registry-services.component.html',
  styleUrl: './registry-services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryServicesComponent {
  registryServices = RegistryServiceIcons;
}
