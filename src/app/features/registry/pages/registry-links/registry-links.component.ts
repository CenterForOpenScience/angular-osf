import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { finalize, map, of, tap } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { FetchAllSchemaResponses, RegistriesSelectors } from '@osf/features/registries/store';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { LoaderService } from '@osf/shared/services/loader.service';

import { RegistrationLinksCardComponent } from '../../components/registration-links-card/registration-links-card.component';
import { GetLinkedNodes, GetLinkedRegistrations, RegistryLinksSelectors } from '../../store/registry-links';

@Component({
  selector: 'osf-registry-links',
  imports: [SubHeaderComponent, LoadingSpinnerComponent, RegistrationLinksCardComponent, TranslatePipe],
  templateUrl: './registry-links.component.html',
  styleUrl: './registry-links.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryLinksComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly loaderService = inject(LoaderService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly registryId = toSignal<string | undefined>(
    this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined)
  );

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

  constructor() {
    effect(() => {
      const registryId = this.registryId();

      if (registryId) {
        this.actions.getLinkedNodes(registryId);
        this.actions.getLinkedRegistrations(registryId);
      }
    });
  }

  navigateToOverview(id: string): void {
    this.router.navigate([id, 'overview']);
  }

  updateRegistration(id: string): void {
    this.loaderService.show();
    this.actions
      .getSchemaResponse(id)
      .pipe(
        tap(() => this.navigateToJustificationPage()),
        finalize(() => this.loaderService.hide()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private navigateToJustificationPage(): void {
    const revisionId = this.schemaResponse()?.id;

    if (revisionId) {
      this.router.navigate([`/registries/revisions/${revisionId}/justification`]);
    }
  }
}
