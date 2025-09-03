import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RegistrationLinksCardComponent } from '@osf/features/registry/components';
import { RegistryComponentModel } from '@osf/features/registry/models';
import { GetRegistryById, RegistryOverviewSelectors } from '@osf/features/registry/store/registry-overview';
import { LoadingSpinnerComponent, SubHeaderComponent } from '@shared/components';
import { ViewOnlyLinkMessageComponent } from '@shared/components/view-only-link-message/view-only-link-message.component';
import { hasViewOnlyParam } from '@shared/helpers';

import { GetRegistryComponents, RegistryComponentsSelectors } from '../../store/registry-components';
import { GetBibliographicContributorsForRegistration, RegistryLinksSelectors } from '../../store/registry-links';

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
    getBibliographicContributorsForRegistration: GetBibliographicContributorsForRegistration,
    getRegistryById: GetRegistryById,
  });

  hasViewOnly = computed(() => {
    return hasViewOnlyParam(this.router);
  });

  components = signal<RegistryComponentModel[]>([]);

  registryComponents = select(RegistryComponentsSelectors.getRegistryComponents);
  registryComponentsLoading = select(RegistryComponentsSelectors.getRegistryComponentsLoading);

  bibliographicContributorsForRegistration = select(RegistryLinksSelectors.getBibliographicContributorsForRegistration);
  bibliographicContributorsForRegistrationId = select(
    RegistryLinksSelectors.getBibliographicContributorsForRegistrationId
  );

  registry = select(RegistryOverviewSelectors.getRegistry);

  constructor() {
    effect(() => {
      const components = this.registryComponents();

      if (components.length > 0) {
        components.forEach((component) => {
          this.fetchContributorsForComponent(component.id);
        });

        this.components.set(components);
      }
    });

    effect(() => {
      const bibliographicContributorsForRegistration = this.bibliographicContributorsForRegistration();
      const bibliographicContributorsForRegistrationId = this.bibliographicContributorsForRegistrationId();

      if (bibliographicContributorsForRegistration && bibliographicContributorsForRegistrationId) {
        this.components.set(
          this.registryComponents().map((component) => {
            if (component.id === bibliographicContributorsForRegistrationId) {
              return {
                ...component,
                registry: this.registry()?.provider?.name,
                contributors: bibliographicContributorsForRegistration,
              };
            }

            return component;
          })
        );
      }
    });
  }

  ngOnInit(): void {
    this.registryId.set(this.route.parent?.parent?.snapshot.params['id']);

    if (this.registryId()) {
      this.actions.getRegistryComponents(this.registryId());
      this.actions.getRegistryById(this.registryId(), true);
    }
  }

  fetchContributorsForComponent(componentId: string): void {
    this.actions.getBibliographicContributorsForRegistration(componentId);
  }

  reviewComponentDetails(id: string): void {
    this.router.navigate([id, 'overview']);
  }
}
