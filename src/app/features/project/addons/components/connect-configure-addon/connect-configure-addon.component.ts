import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { TableModule } from 'primeng/table';

import { NgClass } from '@angular/common';
import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AddonConfigMap } from '@osf/features/project/addons/utils';
import { SubHeaderComponent } from '@osf/shared/components';
import { ADDON_TERMS as addonTerms } from '@osf/shared/constants';
import { AddonFormControls, CredentialsFormat, ProjectAddonsStepperValue } from '@osf/shared/enums';
import { SettingsAddonsStepperValue } from '@shared/enums/settings-addons-stepper.enum';
import { Addon, AddonForm, AddonRequest, AddonTerm, AuthorizedAddon } from '@shared/models';
import {
  AddonsSelectors,
  CreateAuthorizedAddon,
  GetAuthorizedCitationAddons,
  GetAuthorizedStorageAddons,
  UpdateAuthorizedAddon,
} from '@shared/stores/addons';

@Component({
  selector: 'osf-connect-configure-addon',
  imports: [
    SubHeaderComponent,
    StepPanel,
    StepPanels,
    Stepper,
    Button,
    TableModule,
    RouterLink,
    NgClass,
    Card,
    FormsModule,
    ReactiveFormsModule,
    InputText,
    Password,
    TranslatePipe,
    RadioButtonModule,
  ],
  templateUrl: './connect-configure-addon.component.html',
  providers: [RadioButtonModule],
  styleUrl: './connect-configure-addon.component.scss',
})
export class ConnectConfigureAddonComponent {
  private translateService = inject(TranslateService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  protected stepper = viewChild(Stepper);
  protected AddonStepperValue = ProjectAddonsStepperValue;
  protected credentialsFormat = CredentialsFormat;
  protected formControls = AddonFormControls;
  protected terms = signal<AddonTerm[]>([]);
  protected addon = signal<Addon | AuthorizedAddon | null>(null);
  protected addonAuthUrl = signal<string>('/settings/addons');
  protected currentAuthorizedAddonAccounts = signal<AuthorizedAddon[]>([]);
  protected chosenAccount = '';

  protected addonsUserReference = select(AddonsSelectors.getAddonsUserReference);
  protected createdAddon = select(AddonsSelectors.getCreatedOrUpdatedAuthorizedAddon);
  protected authorizedStorageAddons = select(AddonsSelectors.getAuthorizedStorageAddons);
  protected authorizedCitationAddons = select(AddonsSelectors.getAuthorizedCitationAddons);

  protected isAuthorizedStorageAddonsLoading = select(AddonsSelectors.getAuthorizedStorageAddonsLoading);
  protected isAuthorizedCitationAddonsLoading = select(AddonsSelectors.getAuthorizedCitationAddonsLoading);
  protected isAddonConnecting = select(AddonsSelectors.getCreatedOrUpdatedStorageAddonSubmitting);

  protected actions = createDispatchMap({
    getAuthorizedStorageAddons: GetAuthorizedStorageAddons,
    getAuthorizedCitationAddons: GetAuthorizedCitationAddons,
    createAuthorizedAddon: CreateAuthorizedAddon,
    updateAuthorizedAddon: UpdateAuthorizedAddon,
  });

  protected readonly userReferenceId = computed(() => {
    return this.addonsUserReference()[0]?.id;
  });

  protected loginOrChooseAccountText = computed(() => {
    return this.translateService.instant('settings.addons.connectAddon.loginToOrSelectAccount', {
      addonName: this.addon()?.displayName,
    });
  });

  // protected isAuthorized = computed(() => {
  //   //check if the addon is already authorized
  //   const addon = this.addon();
  //   if (addon) {
  //     return addon.type === 'authorized-storage-accounts' || addon.type === 'authorized-citation-accounts';
  //   }
  //   return false;
  // });

  protected addonTypeString = computed(() => {
    //get the addon type string based on the addon type property
    const addon = this.addon();
    if (addon) {
      return addon.type === 'external-storage-services' || addon.type === 'authorized-storage-accounts'
        ? 'storage'
        : 'citation';
    }
    return '';
  });
  protected addonForm: FormGroup<AddonForm>;

  protected readonly baseUrl = computed(() => {
    const currentUrl = this.router.url;
    return currentUrl.split('/addons')[0];
  });

  constructor() {
    const terms = this.getTerms();
    this.terms.set(terms);
    this.addonForm = this.initializeForm();
  }

  protected handleConnectAddon(): void {
    if (!this.addon() || !this.addonForm.valid) return;

    const request = this.generateRequestPayload();

    this.actions.createAuthorizedAddon(request, this.addonTypeString()).subscribe({
      complete: () => {
        const createdAddon = this.createdAddon();
        if (createdAddon) {
          this.addonAuthUrl.set(createdAddon.attributes.auth_url);
          window.open(createdAddon.attributes.auth_url, '_blank');
          this.stepper()?.value.set(SettingsAddonsStepperValue.AUTH);
        }
      },
    });
  }

  protected handleAuthorizedAccountsPresenceCheck() {
    const addonType = this.addonTypeString();
    const referenceId = this.userReferenceId();
    const currentAddon = this.addon();

    if (!addonType || !referenceId || !currentAddon) return;

    const addonConfig: AddonConfigMap = {
      storage: {
        getAddons: () => this.actions.getAuthorizedStorageAddons(referenceId),
        getAuthorizedAddons: () => this.authorizedStorageAddons(),
      },
      citation: {
        getAddons: () => this.actions.getAuthorizedCitationAddons(referenceId),
        getAuthorizedAddons: () => this.authorizedCitationAddons(),
      },
    };

    const selectedConfig = addonConfig[addonType];
    if (!selectedConfig) return;

    selectedConfig.getAddons().subscribe({
      complete: () => {
        const authorizedAddons = selectedConfig.getAuthorizedAddons();
        const hasMatchingAddon = authorizedAddons.some(
          (addon) => addon.externalServiceName === currentAddon.externalServiceName
        );

        if (hasMatchingAddon && authorizedAddons.length) {
          const addonAccounts = authorizedAddons.filter(
            (addon) => addon.externalServiceName === currentAddon.externalServiceName
          );

          this.currentAuthorizedAddonAccounts.set(addonAccounts);
        }

        const nextStep = hasMatchingAddon
          ? ProjectAddonsStepperValue.CHOOSE_CONNECTION
          : ProjectAddonsStepperValue.SETUP_NEW_ACCOUNT;

        this.stepper()?.value.set(nextStep);
      },
    });
  }

  private initializeForm(): FormGroup<AddonForm> {
    const addon = this.addon();

    if (addon) {
      const formControls: Partial<AddonForm> = {
        [AddonFormControls.AccountName]: this.fb.control<string>(addon.displayName || '', Validators.required),
      };

      switch (addon.credentialsFormat) {
        case CredentialsFormat.ACCESS_SECRET_KEYS:
          formControls[AddonFormControls.AccessKey] = this.fb.control<string>('', Validators.required);
          formControls[AddonFormControls.SecretKey] = this.fb.control<string>('', Validators.required);
          break;
        case CredentialsFormat.DATAVERSE_API_TOKEN:
          formControls[AddonFormControls.HostUrl] = this.fb.control<string>('', Validators.required);
          formControls[AddonFormControls.PersonalAccessToken] = this.fb.control<string>('', Validators.required);
          break;
        case CredentialsFormat.USERNAME_PASSWORD:
          formControls[AddonFormControls.HostUrl] = this.fb.control<string>('', Validators.required);
          formControls[AddonFormControls.Username] = this.fb.control<string>('', Validators.required);
          formControls[AddonFormControls.Password] = this.fb.control<string>('', Validators.required);
          break;
        case CredentialsFormat.REPO_TOKEN:
          formControls[AddonFormControls.AccessKey] = this.fb.control<string>('', Validators.required);
          formControls[AddonFormControls.SecretKey] = this.fb.control<string>('', Validators.required);
          break;
      }
      return this.fb.group(formControls as AddonForm);
    }

    return new FormGroup({} as AddonForm);
  }

  private generateRequestPayload(): AddonRequest {
    const formValue = this.addonForm.value;
    const addon = this.addon()!;
    const credentials: Record<string, unknown> = {};
    const initiateOAuth =
      addon.credentialsFormat === CredentialsFormat.OAUTH2 || addon.credentialsFormat === CredentialsFormat.OAUTH;

    switch (addon.credentialsFormat) {
      case CredentialsFormat.ACCESS_SECRET_KEYS:
        credentials['access_key'] = formValue[AddonFormControls.AccessKey];
        credentials['secret_key'] = formValue[AddonFormControls.SecretKey];
        break;
      case CredentialsFormat.DATAVERSE_API_TOKEN:
        credentials['personal_access_token'] = formValue[AddonFormControls.PersonalAccessToken];
        break;
      case CredentialsFormat.USERNAME_PASSWORD:
        credentials['username'] = formValue[AddonFormControls.Username];
        credentials['password'] = formValue[AddonFormControls.Password];
        break;
      case CredentialsFormat.REPO_TOKEN:
        credentials['access_key'] = formValue[AddonFormControls.AccessKey];
        credentials['secret_key'] = formValue[AddonFormControls.SecretKey];
        break;
    }

    const requestPayload: AddonRequest = {
      data: {
        id: addon.id || '',
        attributes: {
          api_base_url: formValue[AddonFormControls.HostUrl] || '',
          display_name: formValue[AddonFormControls.AccountName] || '',
          authorized_capabilities: ['ACCESS', 'UPDATE'],
          credentials,
          initiate_oauth: initiateOAuth,
          auth_url: null,
          credentials_available: false,
        },
        relationships: {
          account_owner: {
            data: {
              type: 'user-references',
              id: this.addonsUserReference()[0].id || '',
            },
          },
          ...this.getServiceRelationship(addon),
        },
        type: `authorized-${this.addonTypeString()}-accounts`,
      },
    };

    return requestPayload;
  }

  private getServiceRelationship(addon: Addon | AuthorizedAddon) {
    const isAuthorizedAddon =
      addon.type === 'authorized-storage-accounts' || addon.type === 'authorized-citation-accounts';
    const addonId = isAuthorizedAddon ? (addon as AuthorizedAddon).externalStorageServiceId : (addon as Addon).id;
    const addonType = this.addonTypeString();

    return {
      [`external_${addonType}_service`]: {
        data: {
          type: `external-${addonType}-services`,
          id: addonId,
        },
      },
    };
  }

  private getTerms(): AddonTerm[] {
    const addon = this.router.getCurrentNavigation()?.extras.state?.['addon'] as Addon | AuthorizedAddon;
    if (!addon) {
      this.router.navigate([`${this.baseUrl()}/addons`]);
    }

    this.addon.set(addon);
    const supportedFeatures = addon.supportedFeatures;
    const provider = addon.providerName;
    const isCitationService = addon.type === 'external-citation-services';

    const relevantTerms = isCitationService ? addonTerms.filter((term) => term.citation) : addonTerms;

    return relevantTerms.map((term) => {
      const feature = term.supportedFeature;
      const hasFeature = supportedFeatures.includes(feature);
      const hasPartialFeature = supportedFeatures.includes(`${feature}_PARTIAL`);

      let message: string;
      let type: 'warning' | 'info' | 'danger';

      if (isCitationService && term.citation) {
        if (hasPartialFeature && term.citation.partial) {
          message = term.citation.partial;
          type = 'warning';
        } else if (!hasFeature && term.citation.false) {
          message = term.citation.false;
          type = 'danger';
        } else {
          message = term.storage[hasFeature ? 'true' : 'false'];
          type = hasFeature ? 'info' : 'danger';
        }
      } else {
        message = term.storage[hasFeature ? 'true' : 'false'];
        type = hasFeature ? 'info' : hasPartialFeature ? 'warning' : 'danger';
      }

      return {
        function: term.label,
        status: message.replace(/{provider}/g, provider),
        type,
      };
    });
  }
}
