import { EMPTY } from 'rxjs';
import { catchError, filter, finalize, switchMap } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ForkDialogComponent } from '@osf/shared/components/fork-dialog/fork-dialog.component';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { ConfirmForkOptions } from '../models/confirm-fork-options.model';

@Injectable({
  providedIn: 'root',
})
export class ForkDialogService {
  private readonly customDialogService = inject(CustomDialogService);
  private readonly loaderService = inject(LoaderService);
  private readonly toastService = inject(ToastService);

  confirmFork(options: ConfirmForkOptions): void {
    const isRegistration = options.resourceType === CurrentResourceType.Registrations;

    this.customDialogService
      .open(ForkDialogComponent, {
        header: isRegistration
          ? 'project.overview.dialog.fork.headerRegistration'
          : 'project.overview.dialog.fork.headerProject',
        width: '450px',
        data: { resourceType: options.resourceType },
      })
      .onClose.pipe(
        filter((confirmed: boolean) => !!confirmed),
        switchMap(() => {
          this.loaderService.show();
          return options.fork().pipe(
            catchError(() => EMPTY),
            finalize(() => this.loaderService.hide())
          );
        }),
        takeUntilDestroyed(options.destroyRef)
      )
      .subscribe(() => {
        this.toastService.showSuccess(
          isRegistration
            ? 'project.overview.dialog.toast.fork.successRegistration'
            : 'project.overview.dialog.toast.fork.success'
        );
        options.onSuccess?.();
      });
  }
}
