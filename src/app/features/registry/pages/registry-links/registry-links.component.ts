import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { tap } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FetchAllSchemaResponses, RegistriesSelectors } from '@osf/features/registries/store';
import { LoadingSpinnerComponent, SubHeaderComponent } from '@osf/shared/components';
import { LoaderService } from '@osf/shared/services';

import { RegistrationLinksCardComponent } from '../../components';
import { GetLinkedNodes, GetLinkedRegistrations, RegistryLinksSelectors } from '../../store/registry-links';

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

  actions = createDispatchMap({
    getLinkedNodes: GetLinkedNodes,
    getLinkedRegistrations: GetLinkedRegistrations,
    getSchemaResponse: FetchAllSchemaResponses,
  });

  linkedNodes = select(RegistryLinksSelectors.getLinkedNodes);
  linkedNodesLoading = select(RegistryLinksSelectors.getLinkedNodesLoading);

  linkedRegistrations = select(RegistryLinksSelectors.getLinkedRegistrations);
  linkedRegistrationsLoading = select(RegistryLinksSelectors.getLinkedRegistrationsLoading);

  schemaResponse = select(RegistriesSelectors.getSchemaResponse);

  ngOnInit(): void {
    this.registryId.set(this.route.parent?.parent?.snapshot.params['id']);

    if (this.registryId()) {
      this.actions.getLinkedNodes(this.registryId());
      this.actions.getLinkedRegistrations(this.registryId());
    }
  }

  navigateToRegistrations(id: string): void {
    this.router.navigate([id, 'overview']);
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
    this.router.navigate([id, 'overview']);
  }

  private navigateToJustificationPage(): void {
    const revisionId = this.schemaResponse()?.id;
    this.router.navigate([`/registries/revisions/${revisionId}/justification`]);
  }
}
