import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RegistryServiceIcons } from '@shared/constants/registry-services-icons.const';

@Component({
  selector: 'osf-registry-services',
  imports: [TranslatePipe, RouterLink, Button],
  templateUrl: './registry-services.component.html',
  styleUrl: './registry-services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryServicesComponent {
  registryServices = RegistryServiceIcons;

  openEmail() {
    window.location.href = 'mailto:contact@osf.io';
  }
}
