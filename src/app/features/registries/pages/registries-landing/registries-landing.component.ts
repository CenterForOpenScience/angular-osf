import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { RegistryServicesComponent } from '@osf/features/registries/components';
import { GetRegistries, RegistriesSelectors } from '@osf/features/registries/store';
import {
  LoadingSpinnerComponent,
  ResourceCardComponent,
  SearchInputComponent,
  SubHeaderComponent,
} from '@shared/components';
import { ResourceType } from '@shared/enums';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-registries-landing',
  imports: [
    Button,
    TranslatePipe,
    SearchInputComponent,
    RegistryServicesComponent,
    ResourceCardComponent,
    LoadingSpinnerComponent,
    SubHeaderComponent,
  ],
  templateUrl: './registries-landing.component.html',
  styleUrl: './registries-landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesLandingComponent implements OnInit {
  private router = inject(Router);

  protected searchControl = new FormControl<string>('');

  private readonly actions = createDispatchMap({
    getRegistries: GetRegistries,
  });

  protected registries = select(RegistriesSelectors.getRegistries);
  protected isRegistriesLoading = select(RegistriesSelectors.isRegistriesLoading);

  ngOnInit(): void {
    this.actions.getRegistries();
  }

  redirectToSearchPageWithValue(): void {
    const searchValue = this.searchControl.value;

    this.router.navigate(['/search'], {
      queryParams: { search: searchValue, tab: ResourceType.Registration },
    });
  }

  redirectToSearchPageRegistrations(): void {
    this.router.navigate(['/search'], {
      queryParams: { tab: ResourceType.Registration },
    });
  }

  goToCreateRegistration(): void {
    this.router.navigate([`/registries/${environment.defaultProvider}/new`]);
  }
}
