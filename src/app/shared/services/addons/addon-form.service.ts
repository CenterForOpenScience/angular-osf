import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { isAuthorizedAddon } from '@osf/shared/helpers';
import { AddonFormControls, AddonType, CredentialsFormat } from '@shared/enums';
import {
  AddonForm,
  AddonModel,
  AuthorizedAccountModel,
  AuthorizedAddonRequestJsonApi,
  ConfiguredAddonModel,
  ConfiguredAddonRequestJsonApi,
} from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class AddonFormService {
  formBuilder: FormBuilder = inject(FormBuilder);

  initializeForm(addon: AddonModel | AuthorizedAccountModel): FormGroup<AddonForm> {
    if (!addon) {
      return new FormGroup({} as AddonForm);
    }

    const formControls: Partial<AddonForm> = {
      [AddonFormControls.AccountName]: this.formBuilder.control<string>(addon.displayName || '', Validators.required),
    };

    switch (addon.credentialsFormat) {
      case CredentialsFormat.ACCESS_SECRET_KEYS:
        formControls[AddonFormControls.AccessKey] = this.formBuilder.control<string>('', Validators.required);
        formControls[AddonFormControls.SecretKey] = this.formBuilder.control<string>('', Validators.required);
        break;
      case CredentialsFormat.DATAVERSE_API_TOKEN:
        formControls[AddonFormControls.HostUrl] = this.formBuilder.control<string>('', Validators.required);
        formControls[AddonFormControls.ApiToken] = this.formBuilder.control<string>('', Validators.required);
        break;
      case CredentialsFormat.USERNAME_PASSWORD:
        formControls[AddonFormControls.HostUrl] = this.formBuilder.control<string>('', Validators.required);
        formControls[AddonFormControls.Username] = this.formBuilder.control<string>('', Validators.required);
        formControls[AddonFormControls.Password] = this.formBuilder.control<string>('', Validators.required);
        break;
      case CredentialsFormat.REPO_TOKEN:
        formControls[AddonFormControls.HostUrl] = this.formBuilder.control<string>('', Validators.required);
        formControls[AddonFormControls.PersonalAccessToken] = this.formBuilder.control<string>('', Validators.required);
        break;
    }
    return this.formBuilder.group(formControls as AddonForm);
  }

  generateAuthorizedAddonPayload(
    formValue: Record<string, unknown>,
    addon: AddonModel | AuthorizedAccountModel,
    userReferenceId: string,
    addonTypeString: string
  ): AuthorizedAddonRequestJsonApi {
    const credentials: Record<string, unknown> = {};
    const initiateOAuth =
      addon.credentialsFormat === CredentialsFormat.OAUTH2 || addon.credentialsFormat === CredentialsFormat.OAUTH;

    switch (addon.credentialsFormat) {
      case CredentialsFormat.ACCESS_SECRET_KEYS:
        credentials['access_key'] = formValue[AddonFormControls.AccessKey];
        credentials['secret_key'] = formValue[AddonFormControls.SecretKey];
        break;
      case CredentialsFormat.DATAVERSE_API_TOKEN:
        credentials['access_token'] = formValue[AddonFormControls.ApiToken];
        break;
      case CredentialsFormat.USERNAME_PASSWORD:
        credentials['username'] = formValue[AddonFormControls.Username];
        credentials['password'] = formValue[AddonFormControls.Password];
        break;
      case CredentialsFormat.REPO_TOKEN:
        credentials['access_token'] = formValue[AddonFormControls.PersonalAccessToken];
        break;
    }

    return {
      data: {
        id: addon.id || '',
        attributes: {
          api_base_url: (formValue[AddonFormControls.HostUrl] as string) || '',
          display_name: (formValue[AddonFormControls.AccountName] as string) || '',
          authorized_capabilities: ['ACCESS', 'UPDATE'],
          credentials,
          initiate_oauth: initiateOAuth,
          auth_url: null,
          credentials_available: ('credentialsAvailable' in addon && addon.credentialsAvailable) || false,
        },
        relationships: {
          account_owner: {
            data: {
              type: 'user-references',
              id: userReferenceId,
            },
          },
          [`external_${addonTypeString}_service`]: {
            data: {
              type: `external-${addonTypeString}-services`,
              id: this.getAddonServiceId(addon),
            },
          },
        },
        type: `authorized-${addonTypeString}-accounts`,
      },
    };
  }

  private getAddonServiceId(addon: AddonModel | AuthorizedAccountModel): string {
    return isAuthorizedAddon(addon)
      ? (addon as AuthorizedAccountModel).externalStorageServiceId
      : (addon as AddonModel).id;
  }

  generateConfiguredAddonCreatePayload(
    addon: AddonModel | AuthorizedAccountModel,
    selectedAccount: AuthorizedAccountModel,
    userReferenceId: string,
    resourceUri: string,
    displayName: string,
    selectedStorageItemId: string,
    addonTypeString: string,
    resourceType?: string,
    selectedStorageItemUrl?: string
  ): ConfiguredAddonRequestJsonApi {
    return {
      data: {
        type: `configured-${addonTypeString}-addons`,
        attributes: {
          authorized_resource_uri: resourceUri,
          display_name: displayName,
          ...(addonTypeString !== AddonType.LINK && { root_folder: selectedStorageItemId }),
          connected_capabilities: ['UPDATE', 'ACCESS'],
          connected_operation_names: ['list_child_items', 'list_root_items', 'get_item_info'],
          external_service_name: addon.externalServiceName,
          ...(resourceType && { resource_type: resourceType }),
          ...(addonTypeString === AddonType.LINK && { target_id: selectedStorageItemId }),
          ...(addonTypeString === AddonType.LINK && { target_url: selectedStorageItemUrl }),
        },
        relationships: {
          account_owner: {
            data: {
              type: 'user-references',
              id: userReferenceId,
            },
          },
          base_account: {
            data: {
              type: `authorized-${addonTypeString}-accounts`,
              id: selectedAccount.id,
            },
          },
          [`external_${addonTypeString}_service`]: {
            data: {
              type: `external-${addonTypeString}-services`,
              id: selectedAccount.externalStorageServiceId,
            },
          },
        },
      },
    };
  }

  generateConfiguredAddonUpdatePayload(
    addon: ConfiguredAddonModel,
    userReferenceId: string,
    resourceUri: string,
    displayName: string,
    selectedStorageItemId: string,
    addonTypeString: string,
    resourceType?: string,
    selectedStorageItemUrl?: string
  ): ConfiguredAddonRequestJsonApi {
    return {
      data: {
        id: addon.id,
        type: `configured-${addonTypeString}-addons`,
        attributes: {
          authorized_resource_uri: resourceUri,
          display_name: displayName,
          connected_capabilities: ['UPDATE', 'ACCESS'],
          connected_operation_names: ['list_child_items', 'list_root_items', 'get_item_info'],
          external_service_name: addon.externalServiceName,
          ...(resourceType && { resource_type: resourceType }),
          ...(addonTypeString !== AddonType.LINK && { root_folder: selectedStorageItemId }),
          ...(addonTypeString === AddonType.LINK && { target_id: selectedStorageItemId }),
          target_url: selectedStorageItemUrl || null,
        },
        relationships: {
          account_owner: {
            data: {
              type: 'user-references',
              id: userReferenceId,
            },
          },
          base_account: {
            data: {
              type: addon.baseAccountType,
              id: addon.baseAccountId,
            },
          },
          [`external_${addonTypeString}_service`]: {
            data: {
              type: `external-${addonTypeString}-services`,
              id: addon.externalServiceName,
            },
          },
        },
      },
    };
  }
}
