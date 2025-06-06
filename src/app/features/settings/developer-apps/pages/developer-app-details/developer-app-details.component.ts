import { Store } from '@ngxs/store';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ConfirmationService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';

import { map, of, switchMap, timer } from 'rxjs';

import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { defaultConfirmationConfig, IS_XSMALL } from '@osf/shared/utils';

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
    CdkCopyToClipboard,
    FormsModule,
    ReactiveFormsModule,
    DeveloperAppAddEditFormComponent,
    TranslateModule,
  ],
  templateUrl: './developer-app-details.component.html',
  styleUrl: './developer-app-details.component.scss',
  providers: [DialogService, DynamicDialogRef],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperAppDetailsComponent {
  #destroyRef = inject(DestroyRef);
  #confirmationService = inject(ConfirmationService);
  #activatedRoute = inject(ActivatedRoute);
  #router = inject(Router);
  #store = inject(Store);
  #translateService = inject(TranslateService);

  protected readonly isXSmall = toSignal(inject(IS_XSMALL));

  readonly clientId = toSignal(
    this.#activatedRoute.params.pipe(
      map((params) => params['id']),
      switchMap((clientId) => {
        const app = this.#store.selectSnapshot(DeveloperAppsSelectors.getDeveloperAppDetails)(clientId);
        if (!app) {
          this.#store.dispatch(new GetDeveloperAppDetails(clientId));
        }
        return of(clientId);
      })
    )
  );

  readonly developerApp = computed(() => {
    const id = this.clientId();
    if (!id) return null;
    const app = this.#store.selectSignal(DeveloperAppsSelectors.getDeveloperAppDetails)();
    return app(id) ?? null;
  });

  protected readonly isClientSecretVisible = signal(false);
  protected readonly clientSecret = computed<string>(() => this.developerApp()?.clientSecret ?? '');
  protected readonly hiddenClientSecret = computed<string>(() => '*'.repeat(this.clientSecret().length));
  protected readonly clientSecretCopiedNotificationVisible = signal<boolean>(false);
  protected readonly clientIdCopiedNotificationVisible = signal<boolean>(false);

  deleteApp(): void {
    this.#confirmationService.confirm({
      ...defaultConfirmationConfig,
      message: this.#translateService.instant('settings.developerApps.confirmation.delete.message'),
      header: this.#translateService.instant('settings.developerApps.confirmation.delete.title', {
        name: this.developerApp()?.name,
      }),
      acceptButtonProps: {
        ...defaultConfirmationConfig.acceptButtonProps,
        severity: 'danger',
        label: this.#translateService.instant('settings.developerApps.list.deleteButton'),
      },
      accept: () => {
        this.#store.dispatch(new DeleteDeveloperApp(this.clientId())).subscribe({
          complete: () => {
            this.#router.navigate(['settings/developer-apps']);
          },
        });
      },
    });
  }

  resetClientSecret(): void {
    this.#confirmationService.confirm({
      ...defaultConfirmationConfig,
      message: this.#translateService.instant('settings.developerApps.confirmation.resetSecret.message'),
      header: this.#translateService.instant('settings.developerApps.confirmation.resetSecret.title'),
      acceptButtonProps: {
        ...defaultConfirmationConfig.acceptButtonProps,
        severity: 'danger',
        label: this.#translateService.instant('settings.developerApps.details.clientSecret.reset'),
      },
      accept: () => {
        this.#store.dispatch(new ResetClientSecret(this.clientId()));
      },
    });
  }

  clientIdCopiedToClipboard(): void {
    this.clientIdCopiedNotificationVisible.set(true);

    timer(2500)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.clientIdCopiedNotificationVisible.set(false);
      });
  }

  clientSecretCopiedToClipboard(): void {
    this.clientSecretCopiedNotificationVisible.set(true);

    timer(2500)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.clientSecretCopiedNotificationVisible.set(false);
      });
  }
}
