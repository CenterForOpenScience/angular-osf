import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { RegistryServicesComponent } from '@osf/features/registries/components/registry-services/registry-services.component';
import { GetRegistries } from '@osf/features/registries/store/registries.actions';
import { RegistriesSelectors } from '@osf/features/registries/store/registries.selectors';
import { LoadingSpinnerComponent, ResourceCardComponent, SearchInputComponent } from '@shared/components';
import { ResourceTab } from '@shared/enums';

@Component({
  selector: 'osf-registries-landing',
  imports: [
    Button,
    RouterLink,
    TranslatePipe,
    SearchInputComponent,
    RegistryServicesComponent,
    ResourceCardComponent,
    LoadingSpinnerComponent,
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
      queryParams: { search: searchValue, resourceTab: ResourceTab.Registrations },
    });
  }

  redirectToSearchPageRegistrations(): void {
    this.router.navigate(['/search'], {
      queryParams: { resourceTab: ResourceTab.Registrations },
    });
  }
}
