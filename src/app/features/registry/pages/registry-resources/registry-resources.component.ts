import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';

import { filter, finalize, map, of, switchMap } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants/default-table-params.constants';
import { RegistryResourceType } from '@osf/shared/enums/registry-resource.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { AddResourceDialogComponent } from '../../components/add-resource-dialog/add-resource-dialog.component';
import { EditResourceDialogComponent } from '../../components/edit-resource-dialog/edit-resource-dialog.component';
import { resourceTypeOptions } from '../../constants';
import { RegistryResource } from '../../models';
import { RegistrySelectors } from '../../store/registry';
import {
  AddRegistryResource,
  DeleteResource,
  GetRegistryResources,
  RegistryResourcesSelectors,
} from '../../store/registry-resources';

@Component({
  selector: 'osf-registry-resources',
  imports: [
    Button,
    SubHeaderComponent,
    LoadingSpinnerComponent,
    IconComponent,
    TranslatePipe,
    CustomPaginatorComponent,
  ],
  templateUrl: './registry-resources.component.html',
  styleUrl: './registry-resources.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryResourcesComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';

  private readonly route = inject(ActivatedRoute);
  private readonly customDialogService = inject(CustomDialogService);
  private readonly toastService = inject(ToastService);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly resources = select(RegistryResourcesSelectors.getResources);
  readonly resourcesTotalCount = select(RegistryResourcesSelectors.getResourcesTotalCount);
  readonly isResourcesLoading = select(RegistryResourcesSelectors.isResourcesLoading);
  readonly currentResource = select(RegistryResourcesSelectors.getCurrentResource);
  readonly registry = select(RegistrySelectors.getRegistry);
  readonly identifiers = select(RegistrySelectors.getIdentifiers);
  readonly canEdit = select(RegistrySelectors.hasWriteAccess);

  private readonly registryId = toSignal<string | undefined>(
    this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined)
  );

  isAddingResource = signal(false);
  doiDomain = 'https://doi.org/';
  first = signal(0);
  rows = signal(DEFAULT_TABLE_PARAMS.rows);

  private readonly actions = createDispatchMap({
    getResources: GetRegistryResources,
    addResource: AddRegistryResource,
    deleteResource: DeleteResource,
  });

  readonly RegistryResourceType = RegistryResourceType;

  addButtonVisible = computed(() => !!this.identifiers().length && this.canEdit());

  getResourceTypeTranslationKey(type: string): string {
    return resourceTypeOptions.find((opt) => opt.value === type)?.label ?? '';
  }

  constructor() {
    effect(() => {
      const registryId = this.registryId();

      if (registryId) {
        this.resetPagination();
        this.actions.getResources(registryId);
      }
    });
  }

  addResource() {
    const registryId = this.registryId();
    if (!registryId) return;

    this.isAddingResource.set(true);

    this.actions
      .addResource(registryId)
      .pipe(
        switchMap(() => this.openAddResourceDialog(registryId)),
        filter((res) => !!res),
        finalize(() => this.isAddingResource.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.resetPagination();
          this.toastService.showSuccess('resources.toastMessages.addResourceSuccess');
        },
        error: () => this.toastService.showError('resources.toastMessages.addResourceError'),
      });
  }

  updateResource(resource: RegistryResource) {
    const registryId = this.registryId();
    if (!registryId) return;

    this.customDialogService
      .open(EditResourceDialogComponent, {
        header: 'resources.edit',
        width: '500px',
        data: { id: registryId, resource },
      })
      .onClose.pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((res) => !!res)
      )
      .subscribe({
        next: () => this.toastService.showSuccess('resources.toastMessages.updatedResourceSuccess'),
        error: () => this.toastService.showError('resources.toastMessages.updateResourceError'),
      });
  }

  deleteResource(id: string) {
    const registryId = this.registryId();
    if (!registryId) return;

    this.customConfirmationService.confirmDelete({
      headerKey: 'resources.delete',
      messageKey: 'resources.deleteText',
      acceptLabelKey: 'common.buttons.remove',
      onConfirm: () => {
        this.actions
          .deleteResource(id, registryId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.resetPagination();
            this.toastService.showSuccess('resources.toastMessages.deletedResourceSuccess');
          });
      },
    });
  }

  onPageChange(event: PaginatorState) {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? this.rows());

    if (event.page === undefined) {
      return;
    }

    const registryId = this.registryId();
    if (!registryId) return;

    this.actions.getResources(registryId, event.page + 1);
  }

  private resetPagination() {
    this.first.set(0);
  }

  private openAddResourceDialog(registryId: string) {
    return this.customDialogService.open(AddResourceDialogComponent, {
      header: 'resources.add',
      width: '500px',
      data: { id: registryId },
    }).onClose;
  }
}
