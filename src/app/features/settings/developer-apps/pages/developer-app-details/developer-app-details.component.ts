import { createDispatchMap, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';

import { map, of, switchMap } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CopyButtonComponent, IconComponent } from '@osf/shared/components';
import { CustomConfirmationService } from '@osf/shared/services';
import { IS_XSMALL } from '@osf/shared/utils';

import { DeveloperAppAddEditFormComponent } from '../../components';
import { DeleteDeveloperApp, DeveloperAppsSelectors, GetDeveloperAppDetails, ResetClientSecret } from '../../store';

@Component({
  selector: 'osf-developer-application-details',
  imports: [
    Button,
    Card,
    RouterLink,
    InputText,
    IconField,
    InputIcon,
    DeveloperAppAddEditFormComponent,
    TranslatePipe,
    CopyButtonComponent,
    IconComponent,
  ],
  templateUrl: './developer-app-details.component.html',
  styleUrl: './developer-app-details.component.scss',
  providers: [DialogService, DynamicDialogRef],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperAppDetailsComponent {
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly actions = createDispatchMap({
    getDeveloperAppDetails: GetDeveloperAppDetails,
    deleteDeveloperApp: DeleteDeveloperApp,
    resetClientSecret: ResetClientSecret,
  });

  protected readonly isXSmall = toSignal(inject(IS_XSMALL));

  protected readonly isClientSecretVisible = signal(false);
  protected readonly clientSecret = computed<string>(() => this.developerApp()?.clientSecret ?? '');
  protected readonly hiddenClientSecret = computed<string>(() => '*'.repeat(this.clientSecret().length));

  readonly clientId = toSignal(
    this.activatedRoute.params.pipe(
      map((params) => params['id']),
      switchMap((clientId) => {
        const app = this.store.selectSnapshot(DeveloperAppsSelectors.getDeveloperAppDetails)(clientId);

        if (!app) {
          this.actions.getDeveloperAppDetails(clientId);
        }

        return of(clientId);
      })
    )
  );

  readonly developerApp = computed(() => {
    const id = this.clientId();
    if (!id) return null;
    const app = this.store.selectSignal(DeveloperAppsSelectors.getDeveloperAppDetails)();
    return app(id) ?? null;
  });

  deleteApp(): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'settings.developerApps.confirmation.delete.title',
      headerParams: { name: this.developerApp()?.name },
      messageKey: 'settings.developerApps.confirmation.delete.message',
      onConfirm: () => {
        this.actions.deleteDeveloperApp(this.clientId()).subscribe({
          complete: () => {
            this.router.navigate(['settings/developer-apps']);
          },
        });
      },
    });
  }

  resetClientSecret(): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'settings.developerApps.confirmation.resetSecret.title',
      headerParams: { name: this.developerApp()?.name },
      messageKey: 'settings.developerApps.confirmation.resetSecret.message',
      acceptLabelKey: 'settings.developerApps.details.clientSecret.reset',
      onConfirm: () => this.actions.resetClientSecret(this.clientId()),
    });
  }
}
