import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { TableModule } from 'primeng/table';

import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { LoadingSpinnerComponent, SubHeaderComponent } from '@shared/components';
import { AddonServiceNames } from '@shared/enums';
import { convertCamelCaseToNormal } from '@shared/helpers';
import { AddonsSelectors, GetAddonsResourceReference, GetConfiguredLinkAddons } from '@shared/stores';

@Component({
  selector: 'osf-linked-services',
  imports: [SubHeaderComponent, TranslatePipe, TableModule, LoadingSpinnerComponent, RouterLink],
  templateUrl: './linked-services.component.html',
  styleUrl: './linked-services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedServicesComponent implements OnInit {
  private route = inject(ActivatedRoute);

  currentUser = select(UserSelectors.getCurrentUser);
  addonsResourceReference = select(AddonsSelectors.getAddonsResourceReference);
  configuredLinkAddons = select(AddonsSelectors.getConfiguredLinkAddons);
  isResourceReferenceLoading = select(AddonsSelectors.getAddonsResourceReferenceLoading);
  isConfiguredLinkAddonsLoading = select(AddonsSelectors.getConfiguredLinkAddonsLoading);
  isCurrentUserLoading = select(UserSelectors.getCurrentUserLoading);

  isLoading = computed(() => {
    return this.isConfiguredLinkAddonsLoading() || this.isResourceReferenceLoading() || this.isCurrentUserLoading();
  });

  resourceReferenceId = computed(() => this.addonsResourceReference()[0]?.id);

  convertedConfiguredLinkAddons = computed(() => {
    return this.configuredLinkAddons().map((item) => ({
      ...item,
      serviceName:
        AddonServiceNames[item.externalServiceName as keyof typeof AddonServiceNames] || item.externalServiceName,
      convertedResourceType: convertCamelCaseToNormal(item.resourceType || ''),
    }));
  });

  actions = createDispatchMap({
    getConfiguredLinkAddons: GetConfiguredLinkAddons,
    getAddonsResourceReference: GetAddonsResourceReference,
  });

  constructor() {
    effect(() => {
      const resourceReferenceId = this.resourceReferenceId();
      if (resourceReferenceId) {
        this.actions.getConfiguredLinkAddons(resourceReferenceId);
      }
    });
  }

  ngOnInit(): void {
    const projectId = this.route.parent?.parent?.snapshot.params['id'];

    if (projectId && !this.addonsResourceReference().length) {
      this.actions.getAddonsResourceReference(projectId);
    }
  }
}
