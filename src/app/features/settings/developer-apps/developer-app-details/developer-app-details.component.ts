import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  DeveloperApp,
  DeveloperAppFormFormControls,
  DeveloperAppForm,
} from '@osf/features/settings/developer-apps/developer-app.entities';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { linkValidator } from '@core/helpers/link-validator.helper';
import { ConfirmationService } from 'primeng/api';
import { defaultConfirmationConfig } from '@shared/helpers/default-confirmation-config.helper';
import { timer } from 'rxjs';

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
  ],
  templateUrl: './developer-app-details.component.html',
  styleUrl: './developer-app-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperAppDetailsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly isXSmall$ = inject(IS_XSMALL);

  isXSmall = toSignal(this.isXSmall$);
  developerAppId = signal<string | null>(null);
  developerApp = signal<DeveloperApp>({
    id: '1',
    appName: 'Example name',
    projHomePageUrl: 'https://example.com',
    appDescription: 'Example description',
    authorizationCallbackUrl: 'https://example.com/callback',
  });
  isClientSecretVisible = signal(false);
  clientSecret = signal<string>(
    'clientsecretclientsecretclientsecretclientsecret',
  );
  hiddenClientSecret = computed<string>(() =>
    '*'.repeat(this.clientSecret().length),
  );
  clientSecretCopiedNotificationVisible = signal<boolean>(false);

  clientId = signal('clientid');
  clientIdCopiedNotificationVisible = signal<boolean>(false);

  readonly DeveloperAppFormFormControls = DeveloperAppFormFormControls;
  readonly editAppForm: DeveloperAppForm = new FormGroup({
    [DeveloperAppFormFormControls.AppName]: new FormControl(
      this.developerApp().appName,
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),
    [DeveloperAppFormFormControls.ProjectHomePageUrl]: new FormControl(
      this.developerApp().projHomePageUrl,
      {
        nonNullable: true,
        validators: [Validators.required, linkValidator()],
      },
    ),
    [DeveloperAppFormFormControls.AppDescription]: new FormControl(
      this.developerApp().appDescription,
      {
        nonNullable: false,
      },
    ),
    [DeveloperAppFormFormControls.AuthorizationCallbackUrl]: new FormControl(
      this.developerApp().authorizationCallbackUrl,
      {
        nonNullable: true,
        validators: [Validators.required, linkValidator()],
      },
    ),
  });

  ngOnInit(): void {
    this.developerAppId.set(this.activatedRoute.snapshot.params['id']);
  }

  deleteApp(): void {
    this.confirmationService.confirm({
      ...defaultConfirmationConfig,
      message:
        "Are you sure you want to delete this developer app? All users' access tokens will be revoked. This cannot be reversed.",
      header: `Delete App ${this.developerApp().appName}?`,
      acceptButtonProps: {
        ...defaultConfirmationConfig.acceptButtonProps,
        severity: 'danger',
        label: 'Delete',
      },
      accept: () => {
        //TODO integrate API
      },
    });
  }

  resetClientSecret(): void {
    this.confirmationService.confirm({
      ...defaultConfirmationConfig,
      message:
        'Resetting the client secret will render your application unusable until it is updated with the new client secret,' +
        ' and all users must reauthorize access. Previously issued access tokens will no longer work.' +
        '<br><br>Are you sure you want to reset the client secret? This cannot be reversed.',
      header: `Reset Client Secret?`,
      acceptButtonProps: {
        ...defaultConfirmationConfig.acceptButtonProps,
        severity: 'danger',
        label: 'Reset',
      },
      accept: () => {
        //TODO integrate API
      },
    });
  }

  clientIdCopiedToClipboard(): void {
    this.clientIdCopiedNotificationVisible.set(true);

    timer(2500)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.clientIdCopiedNotificationVisible.set(false);
      });
  }

  clientSecretCopiedToClipboard(): void {
    this.clientSecretCopiedNotificationVisible.set(true);

    timer(2500)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.clientSecretCopiedNotificationVisible.set(false);
      });
  }

  submitForm(): void {
    if (!this.editAppForm.valid) {
      this.editAppForm.markAllAsTouched();
      this.editAppForm.get(DeveloperAppFormFormControls.AppName)?.markAsDirty();
      this.editAppForm
        .get(DeveloperAppFormFormControls.ProjectHomePageUrl)
        ?.markAsDirty();
      this.editAppForm
        .get(DeveloperAppFormFormControls.AppDescription)
        ?.markAsDirty();
      this.editAppForm
        .get(DeveloperAppFormFormControls.AuthorizationCallbackUrl)
        ?.markAsDirty();
      return;
    }

    //TODO integrate API
  }
}
