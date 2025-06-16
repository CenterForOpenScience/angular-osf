import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { TableModule } from 'primeng/table';

import { NgClass } from '@angular/common';
import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ConfirmAccountConnectionModalComponent } from '@osf/features/project/addons/components';
import { AddonConfigMap } from '@osf/features/project/addons/utils';
import { SubHeaderComponent } from '@osf/shared/components';
import { ADDON_TERMS as addonTerms } from '@osf/shared/constants';
import { AddonFormControls, CredentialsFormat, ProjectAddonsStepperValue } from '@osf/shared/enums';
import {
  Addon,
  AddonForm,
  AddonTerm,
  AuthorizedAddon,
  AuthorizedAddonRequestJsonApi,
  ConfiguredAddonRequestJsonApi,
} from '@shared/models';
import {
  AddonsSelectors,
  CreateAuthorizedAddon,
  CreateConfiguredAddon,
  GetAuthorizedCitationAddons,
  GetAuthorizedStorageAddons,
  UpdateAuthorizedAddon,
  UpdateConfiguredAddon,
} from '@shared/stores/addons';

@Component({
  selector: 'osf-connect-configured-addon',
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
  templateUrl: './connect-configured-addon.component.html',
  providers: [RadioButtonModule, DialogService],
  styleUrl: './connect-configured-addon.component.scss',
})
export class ConnectConfiguredAddonComponent {
  private translateService = inject(TranslateService);
  private dialogService = inject(DialogService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  protected stepper = viewChild(Stepper);
  protected AddonStepperValue = ProjectAddonsStepperValue;
  protected credentialsFormat = CredentialsFormat;
  protected formControls = AddonFormControls;
  protected terms = signal<AddonTerm[]>([]);
  protected addon = signal<Addon | AuthorizedAddon | null>(null);
  protected addonAuthUrl = signal<string>('/settings/addons');
  protected currentAuthorizedAddonAccounts = signal<AuthorizedAddon[]>([]);
  protected chosenAccountId = signal('');
  protected chosenAccountName = signal('');
  protected chosenRootFolderId = signal('');

  protected addonsUserReference = select(AddonsSelectors.getAddonsUserReference);
  protected createdAuthorizedAddon = select(AddonsSelectors.getCreatedOrUpdatedAuthorizedAddon);
  protected createdConfiguredAddon = select(AddonsSelectors.getCreatedOrUpdatedConfiguredAddon);
  protected authorizedStorageAddons = select(AddonsSelectors.getAuthorizedStorageAddons);
  protected authorizedCitationAddons = select(AddonsSelectors.getAuthorizedCitationAddons);
  protected operationInvocation = select(AddonsSelectors.getOperationInvocation);

  protected isAuthorizedStorageAddonsLoading = select(AddonsSelectors.getAuthorizedStorageAddonsLoading);
  protected isAuthorizedCitationAddonsLoading = select(AddonsSelectors.getAuthorizedCitationAddonsLoading);
  protected isAddonConnecting = select(AddonsSelectors.getCreatedOrUpdatedConfiguredAddonSubmitting);

  protected actions = createDispatchMap({
    getAuthorizedStorageAddons: GetAuthorizedStorageAddons,
    getAuthorizedCitationAddons: GetAuthorizedCitationAddons,
    createAuthorizedAddon: CreateAuthorizedAddon,
    createConfiguredAddon: CreateConfiguredAddon,
    updateConfiguredAddon: UpdateConfiguredAddon,
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

  protected resourceUri = computed(() => {
    const id = this.route.parent?.parent?.snapshot.params['id'];

    return `https://staging4.osf.io/${id}`;
  });

  protected addonTypeString = computed(() => {
    const addon = this.addon();

    if (addon) {
      return addon.type === 'external-storage-services' ||
        addon.type === 'authorized-storage-accounts' ||
        addon.type === 'configured-storage-addons'
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
    const terms = this.getAddonTerms();
    this.terms.set(terms);
    this.addonForm = this.initializeForm();
  }

  protected handleCreateConfiguredAddon() {
    if (!this.addon()) return;

    const payload = this.generateConfiguredAddonRequestPayload();

    this.actions.createConfiguredAddon(payload, this.addonTypeString()).subscribe({
      complete: () => {
        const createdAddon = this.createdConfiguredAddon();
        if (createdAddon) {
          this.router.navigate([`${this.baseUrl()}/addons`]);
        }
      },
    });
  }

  protected handleCreateAuthorizedAddon(): void {
    if (!this.addon() || !this.addonForm.valid) return;

    const payload = this.generateAuthorizedAddonRequestPayload();

    this.actions.createAuthorizedAddon(payload, this.addonTypeString()).subscribe({
      complete: () => {
        const createdAddon = this.createdAuthorizedAddon();
        if (createdAddon) {
          this.addonAuthUrl.set(createdAddon.attributes.auth_url);
          window.open(createdAddon.attributes.auth_url, '_blank');
          this.stepper()?.value.set(ProjectAddonsStepperValue.AUTH);
        }
      },
    });
  }

  protected handleConfirmAccountConnection(): void {
    const selectedAccount = this.currentAuthorizedAddonAccounts().find(
      (account) => account.id === this.chosenAccountId()
    );

    if (!selectedAccount) return;

    const dialogRef = this.dialogService.open(ConfirmAccountConnectionModalComponent, {
      focusOnShow: false,
      header: this.translateService.instant('settings.addons.connectAddon.confirmAccount'),
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: {
        message: this.translateService.instant('settings.addons.connectAddon.connectAccount', {
          accountName: selectedAccount.displayName,
        }),
        selectedAccount,
      },
    });

    dialogRef.onClose.subscribe((result) => {
      if (result?.success) {
        this.stepper()?.value.set(ProjectAddonsStepperValue.CONFIGURE_ROOT_FOLDER);
        this.chosenAccountName.set(selectedAccount.displayName);
      }
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
    const currentAddon = this.addon();

    if (currentAddon) {
      const formControls: Partial<AddonForm> = {
        [AddonFormControls.AccountName]: this.fb.control<string>(currentAddon.displayName || '', Validators.required),
      };

      switch (currentAddon.credentialsFormat) {
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

  private generateAuthorizedAddonRequestPayload(): AuthorizedAddonRequestJsonApi {
    const formValue = this.addonForm.value;
    const currentAddon = this.addon()!;
    const credentials: Record<string, unknown> = {};
    const initiateOAuth =
      currentAddon.credentialsFormat === CredentialsFormat.OAUTH2 ||
      currentAddon.credentialsFormat === CredentialsFormat.OAUTH;

    switch (currentAddon.credentialsFormat) {
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

    const requestPayload: AuthorizedAddonRequestJsonApi = {
      data: {
        id: currentAddon.id || '',
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
          ...this.getServiceRelationship(currentAddon),
        },
        type: `authorized-${this.addonTypeString()}-accounts`,
      },
    };

    return requestPayload;
  }

  private generateConfiguredAddonRequestPayload(): ConfiguredAddonRequestJsonApi {
    const currentAddon = this.addon()!;
    const selectedAccount = this.currentAuthorizedAddonAccounts().find(
      (account) => account.id === this.chosenAccountId()
    );

    const requestPayload: ConfiguredAddonRequestJsonApi = {
      data: {
        type: `configured-${this.addonTypeString()}-addons`,
        attributes: {
          authorized_resource_uri: this.resourceUri(),
          display_name: selectedAccount!.displayName,
          root_folder: this.chosenRootFolderId(),
          connected_capabilities: ['UPDATE', 'ACCESS'],
          connected_operation_names: ['list_child_items', 'list_root_items', 'get_item_info'],
          external_service_name: currentAddon.externalServiceName,
        },
        relationships: {
          account_owner: {
            data: {
              type: 'user-references',
              id: this.addonsUserReference()[0].id || '',
            },
          },
          base_account: {
            data: {
              type: 'authorized-storage-accounts',
              id: selectedAccount!.id,
            },
          },
          ...this.getServiceRelationship(currentAddon),
        },
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

  private getAddonTerms(): AddonTerm[] {
    const addon = this.router.getCurrentNavigation()?.extras.state?.['addon'] as Addon | AuthorizedAddon;
    if (!addon) {
      this.router.navigate([`${this.baseUrl()}/addons`]);
      return [];
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
