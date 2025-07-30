import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { tap } from 'rxjs';

import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FetchAllSchemaResponses, RegistriesSelectors } from '@osf/features/registries/store';
import { RegistrationLinksCardComponent } from '@osf/features/registry/components';
import { LinkedNode, LinkedRegistration } from '@osf/features/registry/models';
import { LoadingSpinnerComponent, SubHeaderComponent } from '@shared/components';
import { LoaderService } from '@shared/services';

import {
  GetBibliographicContributors,
  GetBibliographicContributorsForRegistration,
  GetLinkedNodes,
  GetLinkedRegistrations,
  RegistryLinksSelectors,
} from '../../store/registry-links';

@Component({
  selector: 'osf-registry-links',
  imports: [SubHeaderComponent, TranslatePipe, LoadingSpinnerComponent, RegistrationLinksCardComponent],
  templateUrl: './registry-links.component.html',
  styleUrl: './registry-links.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryLinksComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly loaderService = inject(LoaderService);

  private registryId = signal('');

  protected actions = createDispatchMap({
    getLinkedNodes: GetLinkedNodes,
    getLinkedRegistrations: GetLinkedRegistrations,
    getBibliographicContributors: GetBibliographicContributors,
    getBibliographicContributorsForRegistration: GetBibliographicContributorsForRegistration,
    getSchemaResponse: FetchAllSchemaResponses,
  });

  nodes = signal<LinkedNode[]>([]);
  registrations = signal<LinkedRegistration[]>([]);

  protected linkedNodes = select(RegistryLinksSelectors.getLinkedNodes);
  protected linkedNodesLoading = select(RegistryLinksSelectors.getLinkedNodesLoading);

  protected linkedRegistrations = select(RegistryLinksSelectors.getLinkedRegistrations);
  protected linkedRegistrationsLoading = select(RegistryLinksSelectors.getLinkedRegistrationsLoading);

  protected bibliographicContributors = select(RegistryLinksSelectors.getBibliographicContributors);
  protected bibliographicContributorsNodeId = select(RegistryLinksSelectors.getBibliographicContributorsNodeId);

  protected bibliographicContributorsForRegistration = select(
    RegistryLinksSelectors.getBibliographicContributorsForRegistration
  );
  protected bibliographicContributorsForRegistrationId = select(
    RegistryLinksSelectors.getBibliographicContributorsForRegistrationId
  );

  protected schemaResponse = select(RegistriesSelectors.getSchemaResponse);

  constructor() {
    effect(() => {
      const nodes = this.linkedNodes();

      if (nodes) {
        nodes.forEach((node) => {
          this.fetchContributors(node.id);
        });

        this.nodes.set(nodes);
      }
    });

    effect(() => {
      const bibliographicContributors = this.bibliographicContributors();
      const bibliographicContributorsNodeId = this.bibliographicContributorsNodeId();

      if (bibliographicContributors && bibliographicContributorsNodeId) {
        this.nodes.set(
          this.linkedNodes().map((node) => {
            if (node.id === bibliographicContributorsNodeId) {
              return {
                ...node,
                contributors: bibliographicContributors,
              };
            }

            return node;
          })
        );
      }
    });

    effect(() => {
      const registrations = this.linkedRegistrations();

      if (registrations) {
        registrations.forEach((registration) => {
          this.fetchContributorsForRegistration(registration.id);
        });

        this.registrations.set(registrations);
      }
    });

    effect(() => {
      const bibliographicContributorsForRegistration = this.bibliographicContributorsForRegistration();
      const bibliographicContributorsForRegistrationId = this.bibliographicContributorsForRegistrationId();

      if (bibliographicContributorsForRegistration && bibliographicContributorsForRegistrationId) {
        this.registrations.set(
          this.linkedRegistrations().map((registration) => {
            if (registration.id === bibliographicContributorsForRegistrationId) {
              return {
                ...registration,
                contributors: bibliographicContributorsForRegistration,
              };
            }

            return registration;
          })
        );
      }
    });
  }

  ngOnInit(): void {
    this.registryId.set(this.route.parent?.parent?.snapshot.params['id']);

    if (this.registryId()) {
      this.actions.getLinkedNodes(this.registryId());
      this.actions.getLinkedRegistrations(this.registryId());
    }
  }

  navigateToRegistrations(id: string): void {
    this.router.navigate(['/registries', id, 'overview']);
  }

  updateRegistration(id: string): void {
    this.loaderService.show();
    this.actions
      .getSchemaResponse(id)
      .pipe(
        tap(() => {
          this.loaderService.hide();
          this.navigateToJustificationPage();
        })
      )
      .subscribe();
  }

  navigateToNodes(id: string): void {
    this.router.navigate(['/my-projects', id, 'overview']);
  }

  fetchContributors(nodeId: string): void {
    this.actions.getBibliographicContributors(nodeId);
  }

  fetchContributorsForRegistration(registrationId: string): void {
    this.actions.getBibliographicContributorsForRegistration(registrationId);
  }

  private navigateToJustificationPage(): void {
    const revisionId = this.schemaResponse()?.id;
    this.router.navigate([`/registries/revisions/${revisionId}/justification`]);
  }
}
