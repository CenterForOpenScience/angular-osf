import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingSpinnerComponent, SubHeaderComponent, ViewOnlyLinkMessageComponent } from '@osf/shared/components';
import { hasViewOnlyParam } from '@osf/shared/helpers';

import { RegistrationLinksCardComponent } from '../../components';
import { GetRegistryComponents, RegistryComponentsSelectors } from '../../store/registry-components';
import { GetRegistryById, RegistryOverviewSelectors } from '../../store/registry-overview';

@Component({
  selector: 'osf-registry-components',
  imports: [
    SubHeaderComponent,
    TranslatePipe,
    LoadingSpinnerComponent,
    RegistrationLinksCardComponent,
    ViewOnlyLinkMessageComponent,
  ],
  templateUrl: './registry-components.component.html',
  styleUrl: './registry-components.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryComponentsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private registryId = signal('');

  actions = createDispatchMap({
    getRegistryComponents: GetRegistryComponents,
    getRegistryById: GetRegistryById,
  });

  hasViewOnly = computed(() => hasViewOnlyParam(this.router));

  registryComponents = select(RegistryComponentsSelectors.getRegistryComponents);
  registryComponentsLoading = select(RegistryComponentsSelectors.getRegistryComponentsLoading);

  registry = select(RegistryOverviewSelectors.getRegistry);

  ngOnInit(): void {
    this.registryId.set(this.route.parent?.parent?.snapshot.params['id']);

    if (this.registryId()) {
      this.actions.getRegistryComponents(this.registryId());
      this.actions.getRegistryById(this.registryId(), true);
    }
  }

  reviewComponentDetails(id: string): void {
    this.router.navigate([id, 'overview']);
  }
}
