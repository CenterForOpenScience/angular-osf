import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';

import { Component, computed, inject, input, output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AddonFormControls } from '@osf/shared/enums/addon-form-controls.enum';
import { CredentialsFormat } from '@osf/shared/enums/addons-credentials-format.enum';
import { AddonModel } from '@shared/models/addons/addon.model';
import { AuthorizedAddonRequestJsonApi } from '@shared/models/addons/addon-json-api.models';
import { AddonForm } from '@shared/models/addons/addon-utils.models';
import { AuthorizedAccountModel } from '@shared/models/addons/authorized-account.model';
import { AddonFormService } from '@shared/services/addons/addon-form.service';

@Component({
  selector: 'osf-addon-setup-account-form',
  imports: [Card, FormsModule, ReactiveFormsModule, InputText, Password, TranslatePipe, Button, RouterLink],
  templateUrl: './addon-setup-account-form.component.html',
  styleUrl: './addon-setup-account-form.component.scss',
})
export class AddonSetupAccountFormComponent {
  private addonFormService = inject(AddonFormService);

  addon = input.required<AddonModel | AuthorizedAccountModel>();
  userReferenceId = input.required<string>();
  addonTypeString = input.required<string>();
  isSubmitting = input<boolean>(false);
  isAuthorized = input<boolean>(false);

  readonly formSubmit = output<AuthorizedAddonRequestJsonApi>();
  readonly backClick = output<void>();

  readonly formControls = AddonFormControls;

  get isFormValid() {
    return this.addonForm().valid;
  }

  readonly addonForm = computed<FormGroup<AddonForm>>(() => {
    return this.addonFormService.initializeForm(this.addon());
  });

  readonly isAccessSecretKeysFormat = computed(() => {
    return this.addon().credentialsFormat === CredentialsFormat.ACCESS_SECRET_KEYS;
  });

  readonly isDataverseApiTokenFormat = computed(() => {
    return this.addon().credentialsFormat === CredentialsFormat.DATAVERSE_API_TOKEN;
  });

  readonly isUsernamePasswordFormat = computed(() => {
    return this.addon().credentialsFormat === CredentialsFormat.USERNAME_PASSWORD;
  });

  readonly isRepoTokenFormat = computed(() => {
    return this.addon().credentialsFormat === CredentialsFormat.REPO_TOKEN;
  });

  readonly isOAuthFormat = computed(() => {
    const format = this.addon().credentialsFormat;
    return format === CredentialsFormat.OAUTH2 || format === CredentialsFormat.OAUTH;
  });

  readonly hasConfigurableApiRoot = computed(() => !!this.addon().configurableApiRoot);

  handleSubmit(): void {
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

  handleBack(): void {
    this.backClick.emit();
  }
}
