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
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { linkValidator } from '@core/helpers/link-validator.helper';

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
  private readonly isXSmall$ = inject(IS_XSMALL);
  protected readonly DeveloperAppFormFormControls =
    DeveloperAppFormFormControls;

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
  clientId = signal('clientid');
  hiddenClientSecret = computed<string>(() =>
    '*'.repeat(this.clientSecret().length),
  );

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
    //TODO confirmation dialog
    //TODO integrate API
  }

  resetClientSecret(): void {
    //TODO integrate API
  }

  clientIdCopiedToClipboard(): void {
    //TODO maybe show message
  }

  clientSecretCopiedToClipboard(): void {
    //TODO maybe show message
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
