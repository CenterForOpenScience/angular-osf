import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RegistrationLinksCardComponent } from '@osf/features/registry/components';
import { RegistryComponentModel } from '@osf/features/registry/models';
import { GetRegistryById, RegistryOverviewSelectors } from '@osf/features/registry/store/registry-overview';
import { LoadingSpinnerComponent, SubHeaderComponent } from '@shared/components';

import { GetRegistryComponents, RegistryComponentsSelectors } from '../../store/registry-components';
import { GetBibliographicContributorsForRegistration, RegistryLinksSelectors } from '../../store/registry-links';

@Component({
  selector: 'osf-registry-components',
  imports: [SubHeaderComponent, TranslatePipe, LoadingSpinnerComponent, RegistrationLinksCardComponent],
  templateUrl: './registry-components.component.html',
  styleUrl: './registry-components.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryComponentsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private registryId = signal('');

  protected actions = createDispatchMap({
    getRegistryComponents: GetRegistryComponents,
    getBibliographicContributorsForRegistration: GetBibliographicContributorsForRegistration,
    getRegistryById: GetRegistryById,
  });

  components = signal<RegistryComponentModel[]>([]);

  protected registryComponents = select(RegistryComponentsSelectors.getRegistryComponents);
  protected registryComponentsLoading = select(RegistryComponentsSelectors.getRegistryComponentsLoading);

  protected bibliographicContributorsForRegistration = select(
    RegistryLinksSelectors.getBibliographicContributorsForRegistration
  );
  protected bibliographicContributorsForRegistrationId = select(
    RegistryLinksSelectors.getBibliographicContributorsForRegistrationId
  );

  protected registry = select(RegistryOverviewSelectors.getRegistry);

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
                registry: this.registry()?.registry,
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
    this.router.navigate(['/registries', id, 'overview']);
  }
}
