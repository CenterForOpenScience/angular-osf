import { createDispatchMap, select } from '@ngxs/store';

import { catchError, EMPTY, filter, finalize, switchMap, take, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { CurrentResourceSelectors, GetResourceWithChildren } from '@osf/shared/stores/current-resource';

import { DeleteResourceDialogComponent } from '../components/delete-resource-dialog/delete-resource-dialog.component';
import { DeleteResourceBaseOptions, DeleteResourceRunConfig } from '../models/delete-resource-options.model';
import { DeleteProject } from '../store/settings.actions';

@Injectable({ providedIn: 'root' })
export class DeleteResourceService {
  private readonly customDialogService = inject(CustomDialogService);
  private readonly loaderService = inject(LoaderService);
  private readonly toastService = inject(ToastService);

  private readonly resourcesToDelete = select(CurrentResourceSelectors.getResourceWithChildren);

  private readonly actions = createDispatchMap({
    getResourceWithChildren: GetResourceWithChildren,
    deleteProject: DeleteProject,
  });

  deleteComponent(options: DeleteResourceBaseOptions): void {
    this.run({
      ...options,
      dialogHeader: 'project.overview.dialog.deleteComponent.header',
      toastKey: 'project.overview.dialog.toast.deleteComponent.success',
      dialogData: {
        listMessageKey: 'project.overview.dialog.deleteComponent.listMessage',
        warningMessageKey: 'project.overview.dialog.deleteComponent.warningMessage',
        confirmationKey: 'project.overview.dialog.deleteComponent.confirmation',
        noPermissionsMessageKey: 'project.overview.dialog.deleteComponent.noPermissionsMessage',
        singleMessageKey: 'project.overview.dialog.deleteComponent.message',
      },
    });
  }

  deleteProject(options: DeleteResourceBaseOptions): void {
    this.run({
      ...options,
      dialogHeader: 'project.deleteProject.dialog.deleteProject',
      toastKey: 'project.deleteProject.success',
      dialogData: {
        listMessageKey: 'project.deleteProject.dialog.listMessage',
        warningMessageKey: 'project.deleteProject.dialog.warningMessage',
        confirmationKey: 'project.deleteProject.dialog.confirmation',
        noPermissionsMessageKey: 'project.deleteProject.dialog.noPermissionsMessage',
      },
    });
  }

  private run(config: DeleteResourceRunConfig): void {
    const { rootParentId, resourceId, destroyRef, onSuccess, dialogHeader, toastKey, dialogData } = config;

    this.actions
      .getResourceWithChildren(rootParentId, resourceId, ResourceType.Project)
      .pipe(
        tap({ subscribe: () => this.loaderService.show() }),
        finalize(() => this.loaderService.hide()),
        switchMap(() =>
          this.customDialogService
            .open(DeleteResourceDialogComponent, { header: dialogHeader, width: '500px', data: dialogData })
            .onClose.pipe(
              take(1),
              filter((confirmed: boolean) => !!confirmed)
            )
        ),
        tap(() => this.loaderService.show()),
        switchMap(() =>
          this.actions.deleteProject(this.resourcesToDelete()).pipe(finalize(() => this.loaderService.hide()))
        ),
        catchError(() => EMPTY),
        takeUntilDestroyed(destroyRef)
      )
      .subscribe(() => {
        this.toastService.showSuccess(toastKey);
        onSuccess();
      });
  }
}
