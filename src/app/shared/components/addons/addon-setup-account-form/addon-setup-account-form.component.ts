import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';

import { Component, computed, inject, input, output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AddonFormControls, CredentialsFormat } from '@shared/enums';
import { AddonForm, AddonModel, AuthorizedAddon, AuthorizedAddonRequestJsonApi } from '@shared/models';
import { AddonFormService } from '@shared/services/addons/addon-form.service';

@Component({
  selector: 'osf-addon-setup-account-form',
  imports: [Card, FormsModule, ReactiveFormsModule, InputText, Password, TranslatePipe, Button, RouterLink],
  templateUrl: './addon-setup-account-form.component.html',
  styleUrl: './addon-setup-account-form.component.scss',
})
export class AddonSetupAccountFormComponent {
  private addonFormService = inject(AddonFormService);

  addon = input.required<AddonModel | AuthorizedAddon>();
  userReferenceId = input.required<string>();
  addonTypeString = input.required<string>();
  isSubmitting = input<boolean>(false);
  isAuthorized = input<boolean>(false);

  readonly formSubmit = output<AuthorizedAddonRequestJsonApi>();
  readonly backClick = output<void>();

  protected readonly formControls = AddonFormControls;

  get isFormValid() {
    return this.addonForm().valid;
  }

  protected readonly addonForm = computed<FormGroup<AddonForm>>(() => {
    return this.addonFormService.initializeForm(this.addon());
  });

  protected readonly isAccessSecretKeysFormat = computed(() => {
    return this.addon().credentialsFormat === CredentialsFormat.ACCESS_SECRET_KEYS;
  });

  protected readonly isDataverseApiTokenFormat = computed(() => {
    return this.addon().credentialsFormat === CredentialsFormat.DATAVERSE_API_TOKEN;
  });

  protected readonly isUsernamePasswordFormat = computed(() => {
    return this.addon().credentialsFormat === CredentialsFormat.USERNAME_PASSWORD;
  });

  protected readonly isRepoTokenFormat = computed(() => {
    return this.addon().credentialsFormat === CredentialsFormat.REPO_TOKEN;
  });

  protected readonly isOAuthFormat = computed(() => {
    const format = this.addon().credentialsFormat;
    return format === CredentialsFormat.OAUTH2 || format === CredentialsFormat.OAUTH;
  });

  protected handleSubmit(): void {
    if (!this.isFormValid) return;

    const formValue = this.addonForm().value;
    const payload = this.addonFormService.generateAuthorizedAddonPayload(
      formValue,
      this.addon(),
      this.userReferenceId(),
      this.addonTypeString()
    );

    this.formSubmit.emit(payload);
  }

  protected handleBack(): void {
    this.backClick.emit();
  }
}
