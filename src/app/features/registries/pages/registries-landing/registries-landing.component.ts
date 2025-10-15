import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { ScheduledBannerComponent } from '@core/components/osf-banners/scheduled-banner/scheduled-banner.component';
import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ClearCurrentProvider } from '@core/store/provider';
import {
  LoadingSpinnerComponent,
  ResourceCardComponent,
  SearchInputComponent,
  SubHeaderComponent,
} from '@osf/shared/components';
import { ResourceType } from '@osf/shared/enums';
import {
  ClearRegistryProvider,
  GetRegistryProvider,
  RegistrationProviderSelectors,
} from '@osf/shared/stores/registration-provider';
import { normalizeQuotes } from '@shared/helpers';

import { RegistryServicesComponent } from '../../components';
import { GetRegistries, RegistriesSelectors } from '../../store';

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
    ScheduledBannerComponent,
  ],
  templateUrl: './registries-landing.component.html',
  styleUrl: './registries-landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesLandingComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private readonly environment = inject(ENVIRONMENT);

  private actions = createDispatchMap({
    getRegistries: GetRegistries,
    getProvider: GetRegistryProvider,
    clearCurrentProvider: ClearCurrentProvider,
    clearRegistryProvider: ClearRegistryProvider,
  });

  provider = select(RegistrationProviderSelectors.getBrandedProvider);
  isProviderLoading = select(RegistrationProviderSelectors.isBrandedProviderLoading);
  registries = select(RegistriesSelectors.getRegistries);
  isRegistriesLoading = select(RegistriesSelectors.isRegistriesLoading);

  searchControl = new FormControl<string>('');
  defaultProvider = this.environment.defaultProvider;

  ngOnInit(): void {
    this.actions.getRegistries();
    this.actions.getProvider(this.defaultProvider);
  }

  ngOnDestroy(): void {
    this.actions.clearCurrentProvider();
    this.actions.clearRegistryProvider();
  }

  redirectToSearchPageWithValue(): void {
    const searchValue = normalizeQuotes(this.searchControl.value);

    this.router.navigate(['/search'], { queryParams: { search: searchValue, tab: ResourceType.Registration } });
  }

  redirectToSearchPageRegistrations(): void {
    this.router.navigate(['/search'], { queryParams: { tab: ResourceType.Registration } });
  }

  goToCreateRegistration(): void {
    this.router.navigate([`/registries/${this.defaultProvider}/new`]);
  }
}
