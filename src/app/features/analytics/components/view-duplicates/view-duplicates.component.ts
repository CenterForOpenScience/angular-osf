import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { PaginatorState } from 'primeng/paginator';

import { map, of } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  PLATFORM_ID,
  Signal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { ForkProject } from '@osf/features/project/overview/store';
import { DeleteResourceService } from '@osf/features/project/settings/services/delete-resource.service';
import { ForkRegistry } from '@osf/features/registry/store/registry';
import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { NodeMenuAction } from '@osf/shared/enums/node-menu-action.enum';
import { CurrentResourceType, ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ForkDialogService } from '@osf/shared/services/fork-dialog.service';
import { ClearDuplicates, DuplicatesSelectors, GetAllDuplicates } from '@osf/shared/stores/duplicates';

import { DuplicateCardComponent } from '../duplicate-card/duplicate-card.component';

@Component({
  selector: 'osf-view-duplicates',
  imports: [
    SubHeaderComponent,
    LoadingSpinnerComponent,
    CustomPaginatorComponent,
    DuplicateCardComponent,
    TranslatePipe,
  ],
  templateUrl: './view-duplicates.component.html',
  styleUrl: './view-duplicates.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewDuplicatesComponent {
  private readonly forkDialogService = inject(ForkDialogService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly deleteResourceService = inject(DeleteResourceService);

  readonly duplicates = select(DuplicatesSelectors.getDuplicates);
  readonly isDuplicatesLoading = select(DuplicatesSelectors.getDuplicatesLoading);
  readonly totalDuplicates = select(DuplicatesSelectors.getDuplicatesTotalCount);
  readonly isAuthenticated = select(UserSelectors.isAuthenticated);
  readonly preventDuplicateCreation = select(UserSelectors.isProjectCreationDisabled);

  readonly actions = createDispatchMap({
    getDuplicates: GetAllDuplicates,
    clearDuplicates: ClearDuplicates,
    forkProject: ForkProject,
    forkRegistry: ForkRegistry,
  });

  readonly pageSize = 10;
  readonly currentPage = signal<number>(1);
  readonly firstIndex = computed(() => (this.currentPage() - 1) * this.pageSize);

  readonly duplicateButtonLabel = computed(() =>
    this.resourceType() === ResourceType.Registration
      ? 'project.overview.actions.duplicateRegistration'
      : 'project.overview.actions.forkProjectLabel'
  );
  readonly duplicateButtonTooltip = computed(() =>
    this.preventDuplicateCreation() ? 'project.overview.actions.duplicatingProjectsNotAllowed' : ''
  );

  readonly resourceId = toSignal(this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined));
  readonly resourceType: Signal<ResourceType | undefined> = toSignal(
    this.route.data.pipe(map((params) => params['resourceType'])) ?? of(undefined)
  );
  readonly apiResourceType = computed(() =>
    this.resourceType() === ResourceType.Registration ? CurrentResourceType.Registrations : CurrentResourceType.Projects
  );

  constructor() {
    effect(() => {
      const id = this.resourceId();
      const type = this.apiResourceType();
      const page = this.currentPage();

      if (!id || !type) return;

      this.actions.getDuplicates(id, type, page, this.pageSize);
    });

    this.setupCleanup();
  }

  setupCleanup(): void {
    this.destroyRef.onDestroy(() => {
      if (this.isBrowser) {
        this.actions.clearDuplicates();
      }
    });
  }

  handleMenuAction(action: NodeMenuAction, resourceId: string): void {
    switch (action) {
      case NodeMenuAction.ManageContributors:
        this.router.navigate([resourceId, 'contributors']);
        break;
      case NodeMenuAction.Settings:
        this.router.navigate([resourceId, 'settings']);
        break;
      case NodeMenuAction.Delete:
        this.handleDeleteFork(resourceId);
        break;
    }
  }

  handleFork(): void {
    const resourceId = this.resourceId();
    const apiResourceType = this.apiResourceType();

    if (!resourceId) return;

    const isRegistration = apiResourceType === CurrentResourceType.Registrations;

    this.forkDialogService.confirmFork({
      resourceType: apiResourceType,
      destroyRef: this.destroyRef,
      fork: () => (isRegistration ? this.actions.forkRegistry(resourceId) : this.actions.forkProject(resourceId)),
      onSuccess: () => this.actions.getDuplicates(resourceId, apiResourceType, this.currentPage(), this.pageSize),
    });
  }

  onPageChange(event: PaginatorState): void {
    if (event.page !== undefined) {
      const pageNumber = event.page + 1;
      this.currentPage.set(pageNumber);
    }
  }

  private handleDeleteFork(id: string): void {
    this.deleteResourceService.deleteProject({
      rootParentId: id,
      resourceId: id,
      destroyRef: this.destroyRef,
      onSuccess: () => {
        this.actions.getDuplicates(this.resourceId(), this.apiResourceType(), this.currentPage(), this.pageSize);
      },
    });
  }
}
